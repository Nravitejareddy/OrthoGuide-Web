import { Calendar, MessageSquare, Clock, Loader2, ChevronRight, Sparkles, AlertTriangle, Info } from "lucide-react"
import { Link } from "react-router-dom"
import { usePatientData } from "../../hooks/usePatientData"
import CircularProgress from "../../components/CircularProgress"

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function PatientDashboard({ user }) {
  const { dashboardData, appointments, loading, error } = usePatientData(user?.user_id || user?.id);

  if (!user) return null;

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-green-500" />
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
        <p className="text-gray-500 font-medium text-lg">Failed to load health overview.</p>
        <button className="text-green-500 hover:underline font-semibold" onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  const nextAppt = dashboardData.next_appointment;
  const apptDate = nextAppt?.date ? new Date(nextAppt.date) : null;
  const month = apptDate ? apptDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase() : null;
  const day = apptDate ? apptDate.getDate() : null;

  return (
    <div className="animate-fade-up space-y-8 max-w-[1240px] mx-auto pb-10">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
           <p className="text-sm font-bold text-gray-400">{getGreeting()},</p>
           <h1 className="text-3xl font-black text-gray-900 tracking-tight">{dashboardData.name || user.name}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 units) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Main Progress Card */}
          <div className="relative group">
            <CircularProgress 
              percent={dashboardData.progress_percent || 0} 
              stage="Current Stage" 
              subtitle={dashboardData.current_stage_display} 
              variant="hero"
            />
            <div className="absolute top-8 right-8">
               <span className="bg-green-50 text-green-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100/50">
                  Treatment in Progress
               </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
             {/* Next Appointment */}
             <div className="space-y-4 flex flex-col">
               <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-1">Next Appointment</h3>
               <Link to="/dashboard/patient/appointments" className="bg-white border border-gray-100 rounded-[2rem] p-6 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group block cursor-pointer">
                  <div className="flex bg-orange-500 text-white rounded-2xl flex-col items-center justify-center w-20 h-20 shrink-0 shadow-lg shadow-orange-500/20 z-10 transition-transform group-hover:scale-105">
                    <span className="text-[10px] font-black tracking-widest mb-0.5">{month || 'OCT'}</span>
                    <span className="text-3xl font-black leading-none">{day || '24'}</span>
                  </div>
                  <div className="z-10">
                    <h4 className="text-xl font-black text-gray-900 tracking-tight">
                      {nextAppt?.type || (nextAppt?.date ? "Regular Checkup" : "No Regular")}
                    </h4>
                    <p className="text-sm text-gray-400 font-bold">
                      {nextAppt?.date ? `${nextAppt.time || ''} • ${dashboardData.doctor_name?.startsWith('Dr.') ? dashboardData.doctor_name : `Dr. ${dashboardData.doctor_name || 'Assigned'}`}` : "No appointments scheduled"}
                    </p>
                  </div>
                  <ChevronRight className="ml-auto text-gray-300 group-hover:translate-x-1 transition-all group-hover:text-orange-500" />
               </Link>
             </div>

             {/* Daily Tip */}
             <div className="bg-green-50 border border-green-100 rounded-[2rem] p-6 flex items-center gap-5">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-green-500 shadow-sm shrink-0">
                   <Sparkles size={24} />
                </div>
                <div className="space-y-0.5">
                   <h4 className="text-[10px] font-black text-green-700 uppercase tracking-widest">Daily Tip</h4>
                   <p className="text-sm text-green-800 font-bold leading-relaxed opacity-80">
                      {dashboardData.daily_tip || "Great work! We are now focused on making sure your upper and lower teeth meet perfectly. Remember to clean your aligners after every meal."}
                   </p>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column (4 units) */}
        <div className="lg:col-span-4 space-y-8">
           {/* Quick Actions */}
           <div className="space-y-4">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-1">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                 <ActionCard to="/dashboard/patient/ai-assistant" icon={<MessageSquare size={24} />} label="AI Assistant" color="green" />
                 <ActionCard to="/dashboard/patient/reminders" icon={<Clock size={24} />} label="Reminders" color="purple" />
                 <ActionCard to="/dashboard/patient/care-guide" icon={<Info size={24} />} label="Care Guide" color="blue" />
                 <ActionCard to="/dashboard/patient/report-issue" icon={<AlertTriangle size={24} />} label="Report Issue" color="red" />
              </div>
           </div>

           {/* Treatment History */}
           <div className="bg-[#0B0E14] rounded-[2.5rem] p-8 space-y-6 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <h3 className="text-sm font-black tracking-tight flex items-center gap-3">
                 <div className="w-1.5 h-6 bg-green-500 rounded-full" />
                 Treatment History
              </h3>
              
              <div className="space-y-6 relative">
                 <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-gray-800" />
                 
                 <div className="relative pl-8 space-y-1">
                    <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
                    <p className="text-sm font-bold text-gray-100">{dashboardData.current_stage_display} phase started</p>
                 </div>

                 <div className="relative pl-8 space-y-1">
                    <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-gray-700" />
                    <p className="text-sm font-bold text-gray-300">Initial Consultation complete</p>
                 </div>
              </div>

              <Link to="/dashboard/patient/progress" className="block w-full py-4 bg-white/5 hover:bg-white/10 transition-colors border border-white/10 rounded-2xl text-center text-sm font-black tracking-tight text-white mt-4">
                 View Timeline
              </Link>
           </div>
        </div>
      </div>
    </div>
  )
}

function ActionCard({ to, icon, label, color }) {
  const colors = {
    green: "bg-[#10B981] shadow-green-500/20",
    purple: "bg-[#A855F7] shadow-purple-500/20",
    blue: "bg-[#3B82F6] shadow-blue-500/20",
    red: "bg-[#EF4444] shadow-red-500/20"
  }

  return (
    <Link to={to} className="bg-white border border-gray-100 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group aspect-square">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 text-white ${colors[color]}`}>
        {icon}
      </div>
      <span className="text-[11px] font-black text-gray-800 tracking-tight leading-tight">{label}</span>
    </Link>
  );
}
