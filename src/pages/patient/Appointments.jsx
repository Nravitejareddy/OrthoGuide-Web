import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Calendar, 
  Clock, 
  User, 
  Search, 
  Bell, 
  Settings, 
  ChevronRight, 
  Info, 
  Loader2,
  AlertCircle,
  ArrowLeft
} from "lucide-react"
import { Link } from "react-router-dom"
import { getPatientAppointments } from "@/api"
import { useAuth } from "@/hooks/useAuth"

export default function Appointments() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (user) {
      const fetchAppointments = async () => {
        try {
          const res = await getPatientAppointments(user.user_id || user.id)
          setAppointments(res.data)
        } catch (err) {
          console.error("Error fetching appointments:", err)
        } finally {
          setLoading(false)
        }
      }
      fetchAppointments()
    }
  }, [user])

  const todayObj = new Date()
  // Use en-CA locale to get YYYY-MM-DD format in LOCAL time
  const today = todayObj.toLocaleDateString('en-CA')
  
  const getRelativeDate = (dateStr) => {
    const date = new Date(dateStr)
    const diffTime = date.setHours(0,0,0,0) - todayObj.setHours(0,0,0,0)
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return " (Today)"
    if (diffDays === -1) return " (Yesterday)"
    if (diffDays === 1) return " (Tomorrow)"
    return ""
  }

  const processedAppointments = appointments.map(a => {
    const isPast = a.appointment_date < today
    let currentStatus = a.status.toLowerCase().trim()
    
    // Auto-detect MISSED status: past date and still in 'upcoming-eligible' status
    if (isPast && ['scheduled', 'rescheduled', 'confirmed'].includes(currentStatus)) {
      currentStatus = 'missed'
    }
    
    return { ...a, displayStatus: currentStatus }
  })

  // Upcoming: scheduled, rescheduled, confirmed (and date is today or future)
  const upcomingAppointments = processedAppointments
    .filter(a => ['scheduled', 'rescheduled', 'confirmed'].includes(a.displayStatus) && a.appointment_date >= today)
    .sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date))

  const upcomingAppointment = upcomingAppointments.length > 0 ? upcomingAppointments[0] : null
  
  // Past: missed, cancelled, completed (or past ones)
  const pastAppointments = processedAppointments.filter(a => 
    ['cancelled', 'completed', 'missed'].includes(a.displayStatus) || 
    (a.appointment_date < today && !upcomingAppointments.includes(a))
  ).sort((a, b) => {
    const dateDiff = new Date(b.appointment_date) - new Date(a.appointment_date)
    if (dateDiff !== 0) return dateDiff
    
    // Helper to compare AM/PM times
    const toMinutes = (timeStr) => {
      if (!timeStr) return 0
      const [time, period] = timeStr.trim().split(' ')
      let [hours, minutes] = time.split(':').map(Number)
      if (period?.toUpperCase() === 'PM' && hours < 12) hours += 12
      if (period?.toUpperCase() === 'AM' && hours === 12) hours = 0
      return hours * 60 + minutes
    }
    
    return toMinutes(b.appointment_time) - toMinutes(a.appointment_time)
  })

  const getStatusConfig = (status, isUpcoming) => {
    const s = status.toLowerCase()
    if (s === 'missed') return { color: "bg-slate-400", badge: "bg-slate-50 text-slate-500 border-slate-100", icon: "text-slate-400", secondary: "bg-slate-50", isFaded: true };
    if (isUpcoming) return { color: "bg-purple-500", badge: "bg-purple-50 text-purple-600 border-purple-100", icon: "text-purple-600", secondary: "bg-purple-50", isFaded: false };
    if (s === 'completed') return { color: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-600 border-emerald-100", icon: "text-emerald-600", secondary: "bg-emerald-50", isFaded: false };
    if (s === 'cancelled') return { color: "bg-red-500", badge: "bg-red-50 text-red-600 border-red-100", icon: "text-red-600", secondary: "bg-red-50", isFaded: false };
    return { color: "bg-slate-400", badge: "bg-slate-50 text-slate-500 border-slate-100", icon: "text-slate-400", secondary: "bg-slate-50", isFaded: false };
  }

  const AppointmentCard = ({ visit, isUpcoming }) => {
    const config = getStatusConfig(visit.displayStatus, isUpcoming);
    
    return (
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`bg-white border ${config.isFaded ? 'border-gray-50 opacity-70 grayscale-[0.2]' : 'border-gray-100'} rounded-[1.5rem] p-6 shadow-xl shadow-slate-200/30 relative overflow-hidden group hover:border-gray-200 transition-all mb-4`}
      >
        <div className={`absolute top-0 left-0 w-1.5 h-full ${config.color}`}></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="md:w-1/4">
                <h3 className="text-sm font-black text-gray-900 tracking-tight leading-tight mb-0.5">{visit.appointment_type}</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                  {visit.clinician_name?.startsWith('Dr.') ? visit.clinician_name : `Dr. ${visit.clinician_name || 'Raviteja'}`}
                </p>
            </div>
            
            <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 items-center">
                <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 ${config.secondary} rounded-xl flex items-center justify-center ${config.icon} shadow-sm shrink-0`}>
                        <Calendar size={16} />
                    </div>
                    <div className="flex flex-col">
                        <p className="text-[7px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none mb-1">Date</p>
                        <div className="text-[12px] font-black text-gray-900 whitespace-nowrap">
                          {new Date(visit.appointment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          <span className={`${config.isFaded ? 'text-gray-400' : 'text-emerald-500'} font-bold text-[9px] ml-1.5`}>{getRelativeDate(visit.appointment_date)}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 ${config.secondary} rounded-xl flex items-center justify-center ${config.icon} shadow-sm shrink-0`}>
                        <Clock size={16} />
                    </div>
                    <div className="flex flex-col">
                        <p className="text-[7px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none mb-1">Time</p>
                        <p className="text-[12px] font-black text-gray-900 whitespace-nowrap">{visit.appointment_time}</p>
                    </div>
                </div>
            </div>

            <div className="md:w-28 flex justify-end">
                <span className={`px-4 py-1.5 ${config.badge} text-[8px] font-black uppercase rounded-lg tracking-[0.15em] border shadow-sm`}>
                    {visit.displayStatus === 'scheduled' && isUpcoming ? 'UPCOMING' : visit.displayStatus.toUpperCase()}
                </span>
            </div>
        </div>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="animate-fade-in pb-10">
      {/* Standard Header */}
      <header className="flex items-center gap-4 py-4 px-2 border-b border-gray-100/50 backdrop-blur-sm shrink-0 z-30 mb-6 sticky top-0 bg-white/80">
        <Link to="/dashboard" className="p-2.5 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-green-600 hover:bg-green-50 transition-all shadow-sm active:scale-95">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-grow">
          <h1 className="text-sm font-black text-gray-900 tracking-tight flex items-center gap-2 uppercase">
            Treatment Appointments
            <Calendar size={14} className="text-green-500" />
          </h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Manage your schedule & appointments</p>
        </div>
      </header>

      {/* Upcoming Visit Section */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-0">
             <h2 className="text-[11px] font-black uppercase tracking-[0.2em] bg-gradient-to-r from-gray-500 to-gray-300 bg-clip-text text-transparent">UPCOMING</h2>
          </div>
        </div>

        {upcomingAppointment ? (
          <AppointmentCard visit={upcomingAppointment} isUpcoming={true} />
        ) : (
          <div className="bg-white/50 border-2 border-dashed border-gray-100 rounded-[1.5rem] p-10 text-center">
             <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertCircle size={24} className="text-gray-300" />
             </div>
             <h3 className="text-sm font-black text-gray-900 uppercase">No Upcoming Sessions</h3>
             <p className="text-[10px] font-bold text-gray-400 mt-0.5 uppercase tracking-tight">Your schedule is currently clear</p>
          </div>
        )}
      </section>

      {/* Past Visits Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-0">
             <h2 className="text-[11px] font-black uppercase tracking-[0.2em] bg-gradient-to-r from-gray-500 to-gray-300 bg-clip-text text-transparent">PAST VISITS</h2>
          </div>
        </div>

        <div className="space-y-0">
          {pastAppointments.length > 0 ? (
            pastAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} visit={appointment} isUpcoming={false} />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No appointment history found</p>
            </div>
          )}
        </div>
      </section>

    </div>
  )
}
