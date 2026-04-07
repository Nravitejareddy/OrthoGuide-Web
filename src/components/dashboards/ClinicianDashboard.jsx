import { Users, Calendar, AlertTriangle, MessageSquare, Plus, ChevronRight, Clock, Loader2, Heart, Shield, MoreHorizontal, Briefcase } from "lucide-react"
import { useState, useEffect } from "react"
import { getClinicianDashboard } from "@/api"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function ClinicianDashboard({ user }) {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getClinicianDashboard(user.user_id)
        setData(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (user) {
      fetchDashboard();
      const interval = setInterval(fetchDashboard, 30000);
      return () => clearInterval(interval);
    }
  }, [user])

  if (!user) return null;

  if (loading) {
    return <div className="min-h-[400px] flex items-center justify-center"><Loader2 className="animate-spin text-gray-800" size={32} /></div>
  }

  const { 
    total_patients = 0, 
    appointments_today = 0, 
    need_attention = 0, 
    recent_patients = [], 
    today_schedule = [] 
  } = (data || {})

  return (
    <div className="space-y-8 animate-fade-up pb-10">
      {/* Page Header */}

      {/* Welcome Section */}
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            {getGreeting()}, Dr. <span className="font-bold">{user.name}</span>
          </h1>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-gray-400 text-sm font-medium">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
            <span className="text-gray-200">|</span>
            <span className="text-xs font-bold text-blue-500/80 tracking-tight uppercase">{data?.clinic_name || "OrthoGuide Clinic"}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid - 3 Card Aesthetic */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          label="TOTAL PATIENTS" 
          value={total_patients} 
          icon={<Users size={18} />} 
          variant="light-blue"
        />
        <StatCard 
          label="SCHEDULED TODAY" 
          value={appointments_today} 
          icon={<Calendar size={18} />} 
          variant="dark-blue"
        />
        <StatCard 
          label="PRIORITY ACTIONS" 
          value={need_attention} 
          icon={<AlertTriangle size={18} />} 
          variant="light-red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Priority Patients Section */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-gray-900">Priority Patients</h3>
            <Link to="/dashboard/clinician/patients" className="text-xs text-[#3b82f6] font-bold hover:underline transition-all">
              View All Records
            </Link>
          </div>

          <div className="space-y-4">
            {recent_patients.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center text-gray-400 font-medium text-sm">
                No priority patients found.
              </div>
            ) : (
              recent_patients.map((p, i) => {
                const isCritical = p.status?.toLowerCase() === "critical";
                const isAttention = p.status?.toLowerCase() === "attention";
                
                return (
                  <div 
                    key={i} 
                    onClick={() => navigate(`/dashboard/clinician/patients/profile/${p.patient_id}`)}
                    className="bg-white rounded-[20px] p-5 flex items-center justify-between shadow-sm border border-gray-50 hover:shadow-md transition-all cursor-pointer group active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#dbeafe] flex items-center justify-center font-bold text-[#3b82f6] shrink-0">
                        {p.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <h4 className="text-base font-bold text-gray-900 leading-tight">{p.name}</h4>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">ID: {p.patient_id}</p>
                        <div className="mt-1.5 flex items-center">
                            <span className="px-2.5 py-1 bg-gray-100 text-gray-500 rounded-lg text-[10px] font-bold tracking-tight uppercase">
                                {p.treatment_stage || "Regular Follow-up"}
                            </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isCritical ? "bg-[#fee2e2] text-[#ef4444]" : "bg-[#dbeafe] text-[#3b82f6]"
                    }`}>
                      {p.status || (isCritical ? "CRITICAL" : "ATTENTION")}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Today's Schedule Section */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-gray-900">Today's Schedule</h3>
            <button className="text-gray-400 hover:text-gray-600">
               <MoreHorizontal size={20} />
            </button>
          </div>

          <div className="relative pl-6 space-y-6">
            {/* Timeline Line */}
            <div className="absolute left-[3px] top-2 bottom-2 w-[1px] bg-[#dbeafe]" />
            
            {today_schedule.length === 0 ? (
              <div className="text-gray-400 text-sm font-medium">No scheduled visits today.</div>
            ) : (
              today_schedule.map((apt, i) => (
                <div key={i} className="relative">
                  {/* Dot */}
                  <div className="absolute -left-[27px] top-2 w-2.5 h-2.5 rounded-full bg-[#3b82f6] border-2 border-white" />
                  
                  <div className="bg-[#f8fafc] rounded-2xl p-4 border border-gray-50">
                    <p className="text-xs text-[#3b82f6] font-bold mb-1">{apt.appointment_time || "09:46 AM"}</p>
                    <h4 className="text-sm font-bold text-gray-900 mb-1">{apt.patient_name}</h4>
                    <div className="flex items-center gap-1.5 text-gray-400">
                       <Briefcase size={14} className="shrink-0" />
                       <span className="text-xs font-medium">{apt.appointment_type || "Regular Session"}</span>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Next Slot Placeholder */}
            <div className="relative">
               <div className="absolute -left-[27px] top-6 w-2.5 h-2.5 rounded-full bg-gray-100 border-2 border-white" title="Next slot available" />
               <div className="border border-dashed border-gray-200 rounded-2xl p-5 flex items-center justify-center text-gray-300 transform scale-95 origin-left">
                  <span className="text-xs font-medium">Next Session Available</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, variant }) {
  const styles = {
    "light-blue": "bg-[#eff6ff] text-[#1e40af] icon-bg-[#dbeafe] icon-text-[#3b82f6]",
    "dark-blue": "bg-[#1d4ed8] text-white icon-bg-[#3b82f6] icon-text-white",
    "light-red": "bg-[#fff1f2] text-[#991b1b] icon-bg-[#fee2e2] icon-text-[#ef4444]"
  }

  const isDark = variant === "dark-blue"
  const baseStyle = styles[variant]

  return (
    <div className={`rounded-3xl p-6 flex items-start justify-between shadow-sm transition-all hover:shadow-md cursor-default ${isDark ? 'bg-[#1d4ed8] text-white' : (variant === 'light-blue' ? 'bg-[#eff6ff]' : 'bg-[#fff1f2]')}`}>
      <div className="flex flex-col gap-4">
        <span className={`text-[10px] font-bold tracking-wider ${isDark ? 'text-blue-100' : 'text-gray-500'}`}>{label}</span>
        <span className={`text-4xl font-bold ${isDark ? 'text-white' : (variant === 'light-blue' ? 'text-[#1e40af]' : 'text-[#ef4444]')}`}>{value}</span>
      </div>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
        isDark ? 'bg-[#3b82f6]' : (variant === 'light-blue' ? 'bg-[#dbeafe]' : 'bg-[#fee2e2]')
      } ${
        isDark ? 'text-white' : (variant === 'light-blue' ? 'text-[#3b82f6]' : 'text-[#ef4444]')
      }`}>
        {icon}
      </div>
    </div>
  )
}

