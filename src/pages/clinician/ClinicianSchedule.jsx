import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  X, 
  Loader2, 
  Video, 
  Edit, 
  CheckCircle2,
  ChevronLeft, 
  ChevronRight, 
  Trash2,
  CalendarDays,
  AlertTriangle
} from "lucide-react"
import { useClinicianData } from "@/hooks/useDashboardData"
import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { clinicianAddSchedule, rescheduleAppointment, cancelAppointment, completeAppointment } from "@/api"

export default function ClinicianSchedule({ user }) {
  const navigate = useNavigate();
  const clinicianId = user?.clinician_id || user?.user_id;
  const { schedule, patients, loading, refresh } = useClinicianData(clinicianId);
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  
  const [rescheduleData, setRescheduleData] = useState({
    date: "",
    time: ""
  })

  const [isDeleting, setIsDeleting] = useState(null) // ID of appointment being deleted
  const [isCompleting, setIsCompleting] = useState(null) // ID of appointment being completed
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [aptForAction, setAptForAction] = useState(null)

  const formattedSelectedDate = useMemo(() => {
    const d = new Date(selectedDate);
    return {
      weekday: d.toLocaleDateString('en-US', { weekday: 'long' }),
      full: d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    };
  }, [selectedDate]);

  const changeDate = (days) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const filteredSchedule = useMemo(() => {
    if (!schedule || !Array.isArray(schedule)) return [];
    
    // Normalize selectedDate for comparison
    const targetDate = String(selectedDate || "").trim();
    
    return schedule.filter(apt => {
        // Robust date extraction and normalization
        const rawDate = apt.appointment_date || apt.date;
        if (!rawDate) return false;
        
        const aptDate = String(rawDate).trim();
        return aptDate === targetDate;
    });
  }, [schedule, selectedDate]);

  // Removed handleAddSchedule handled in PatientProfileDetail

  const handleRescheduleClick = (apt) => {
    // Ensure only one modal is open
    setShowCancelConfirm(false);
    setShowCompleteConfirm(false);
    
    setSelectedAppointment(apt);
    setRescheduleData({
      date: apt.appointment_date || selectedDate,
      time: apt.appointment_time || ""
    });
    setShowRescheduleModal(true);
  }

  const handleReschedule = async (e) => {
    e.preventDefault();
    if (!selectedAppointment) return;

    const requestedDateTime = new Date(`${rescheduleData.date}T${rescheduleData.time}`);
    if (requestedDateTime < new Date()) {
      toast.error("Invalid time: You have selected a time in the past");
      return;
    }

    setIsSubmitting(true);
    try {
      await rescheduleAppointment({
        appointment_id: selectedAppointment.id || selectedAppointment.appointment_id,
        date: rescheduleData.date,
        time: rescheduleData.time
      });
      toast.success("Session rescheduled!");
      setShowRescheduleModal(false);
      setSelectedAppointment(null);
      if (refresh) refresh();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to reschedule");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleCancelClick = (apt) => {
    // Ensure only one modal is open
    setShowRescheduleModal(false);
    setShowCompleteConfirm(false);
    
    setAptForAction(apt);
    setShowCancelConfirm(true);
  };

  const handleCompleteClick = (apt) => {
    // Ensure only one modal is open
    setShowRescheduleModal(false);
    setShowCancelConfirm(false);
    
    setAptForAction(apt);
    setShowCompleteConfirm(true);
  };

  const confirmCancel = async () => {
    if (!aptForAction) return;
    const aptId = aptForAction.id;
    
    setIsDeleting(aptId);
    setShowCancelConfirm(false);
    try {
      await cancelAppointment(aptId);
      toast.success("Session cancelled successfully");
      if (refresh) refresh();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to cancel appointment");
    } finally {
      setIsDeleting(null);
      setAptForAction(null);
    }
  };

  const confirmComplete = async () => {
    if (!aptForAction) return;
    const aptId = aptForAction.id;
    
    setIsCompleting(aptId);
    setShowCompleteConfirm(false);
    try {
      await completeAppointment(aptId);
      toast.success("Visit marked as completed");
      if (refresh) refresh();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to complete session");
    } finally {
      setIsCompleting(null);
      setAptForAction(null);
    }
  };

  const handlePatientClick = (patientId) => {
    navigate(`/dashboard/clinician/patients/profile/${patientId}`);
  };

  if (!user) return null

  if (loading && schedule.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Synchronizing Schedule...</p>
      </div>
    )
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 pb-12 animate-fade-up">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Schedule</h1>
        <button 
          onClick={() => refresh?.()}
          className="p-2.5 bg-white hover:bg-gray-50 text-gray-400 hover:text-blue-600 rounded-2xl border border-gray-100 transition-all active:scale-95 flex items-center gap-2 group shadow-sm"
        >
          <Loader2 size={16} className={`${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Refresh</span>
        </button>
      </div>

      {/* Date Navigation Pill */}
      <div className="flex justify-center">
        <div className="bg-[#1d4ed8] text-white py-3 px-6 rounded-[2.5rem] flex items-center gap-8 shadow-2xl shadow-blue-500/20 min-w-[360px] justify-between border border-white/10">
          <button 
            onClick={() => changeDate(-1)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-90"
          >
            <ChevronLeft size={24} />
          </button>
          
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70 mb-1">{formattedSelectedDate.weekday}</p>
            <p className="text-lg font-bold tracking-tight">{formattedSelectedDate.full}</p>
          </div>

          <button 
            onClick={() => changeDate(1)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-90"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Appointments List */}
      <div className="max-w-4xl mx-auto space-y-8">
        {filteredSchedule.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-100 rounded-[2.5rem] p-20 text-center shadow-sm">
            <div className="w-24 h-24 bg-gray-50 text-gray-300 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
              <CalendarDays size={48} />
            </div>
            <h3 className="text-gray-900 font-bold text-xl tracking-tight mb-2 uppercase">No Sessions Today</h3>
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em]">Patient visits will appear here once planned</p>
          </div>
        ) : (
          <div className="space-y-8 relative before:absolute before:left-[112px] before:top-4 before:bottom-4 before:w-0.5 before:bg-gray-100">
            {filteredSchedule.map((apt, i) => {
              const [time, period] = apt.appointment_time.split(' ');
              const isAttention = apt.status?.toLowerCase() === "attention";
              
              return (
                <div key={i} className="flex items-start gap-12 group relative">
                  {/* Time Column */}
                  <div className="pt-2 min-w-[80px] text-right shrink-0">
                    <p className="text-2xl font-bold text-gray-900 leading-none tracking-tighter">{time}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">{period || "AM"}</p>
                  </div>

                  {/* Dot on Timeline - Absolutely Positioned */}
                  <div className="absolute left-[106px] top-[1.35rem] w-3 h-3 rounded-full bg-[#1d4ed8] border-2 border-white shadow-sm z-20 shrink-0" />

                  {/* Card Section */}
                  <div className="flex-1 bg-white rounded-[2rem] border border-gray-50 p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group-hover:border-blue-100 flex items-center justify-between">
                      <div className="flex flex-col">
                        <div 
                          className="cursor-pointer group/name inline-flex items-center gap-2 mb-1"
                          onClick={() => handlePatientClick(apt.patient_id)}
                        >
                          <h4 className="text-xl font-bold text-gray-900 group-hover/name:text-[#1d4ed8] transition-colors tracking-tight">
                            {apt.patient_name}
                          </h4>
                          <ChevronRight size={18} className="opacity-0 -translate-x-2 group-hover/name:opacity-100 group-hover/name:translate-x-0 transition-all text-[#1d4ed8]" />
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-4">
                          ID: {apt.patient_id?.startsWith('PAT') ? apt.patient_id : `PAT${apt.patient_id || apt.id}`}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                         <div className="flex flex-wrap items-center gap-3">
                           <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-lg text-[9px] font-bold uppercase tracking-widest">
                             {apt.patient_stage || apt.treatment_stage || "Initial Consultation"}
                           </span>
                           
                           <div className="w-1 h-1 rounded-full bg-gray-200" />
                           
                           <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                             {apt.appointment_type || "Regular Session"}
                           </span>

                           {apt.patient_status?.toLowerCase() === "critical" && (
                             <>
                               <div className="w-1 h-1 rounded-full bg-gray-200" />
                               <span className="px-3 py-1 bg-[#fee2e2] text-[#ef4444] rounded-lg text-[9px] font-bold uppercase tracking-widest">
                                 CRITICAL
                               </span>
                             </>
                           )}

                           {(apt.patient_status?.toLowerCase() === "attention" || (!apt.patient_status && apt.status?.toLowerCase() === "attention")) && (
                             <>
                               <div className="w-1 h-1 rounded-full bg-gray-200" />
                               <span className="px-3 py-1 bg-[#dbeafe] text-[#3b82f6] rounded-lg text-[9px] font-bold uppercase tracking-widest">
                                 ATTENTION
                               </span>
                             </>
                           )}

                           {(apt.patient_status?.toLowerCase() === "on track" || apt.patient_status?.toLowerCase() === "active" || apt.patient_status?.toLowerCase() === "on_track") && (
                             <>
                               <div className="w-1 h-1 rounded-full bg-gray-200" />
                               <span className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[9px] font-bold uppercase tracking-widest">
                                 ON TRACK
                               </span>
                             </>
                           )}
                         </div>
                   </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleCompleteClick(apt)}
                          disabled={isCompleting === apt.id}
                          className="p-3 bg-gray-50 text-gray-400 hover:text-[#1d4ed8] hover:bg-blue-50 rounded-2xl transition-all active:scale-90 disabled:opacity-50"
                          title="Mark as Completed"
                        >
                          {isCompleting === apt.id ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                        </button>
                        <button 
                          onClick={() => handleCancelClick(apt)}
                          disabled={isDeleting === apt.id}
                          className="p-3 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all active:scale-90 disabled:opacity-50"
                          title="Cancel Appointment"
                        >
                          {isDeleting === apt.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          <div className="bg-white border-2 border-gray-100 rounded-[2rem] w-full max-w-[340px] shadow-[0_15px_40px_rgba(0,0,0,0.12)] p-8 relative overflow-hidden text-center animate-in zoom-in-95 duration-200 pointer-events-auto" onClick={e => e.stopPropagation()}>
            <div className="relative z-10 text-center">
              <div className="mx-auto w-16 h-16 bg-blue-50 text-blue-600 rounded-[1.25rem] flex items-center justify-center mb-6 border-4 border-blue-50/50">
                <Edit size={28} strokeWidth={2.5} />
              </div>
              <h3 className="text-lg font-black text-gray-900 tracking-tight mb-2">Reschedule Session</h3>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-8">{selectedAppointment?.patient_name}</p>

              <form onSubmit={handleReschedule} className="space-y-5 text-left">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">New Date</label>
                    <input
                      type="date"
                      required
                      value={rescheduleData.date}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setRescheduleData({ ...rescheduleData, date: e.target.value })}
                      className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">New Time</label>
                    <input
                      type="time"
                      required
                      value={rescheduleData.time}
                      onChange={(e) => setRescheduleData({ ...rescheduleData, time: e.target.value })}
                      className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <button 
                    type="button" 
                    onClick={() => setShowRescheduleModal(false)} 
                    className="flex-1 py-4 bg-gray-50 text-gray-400 hover:text-gray-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="flex-1 py-4 bg-[#1d4ed8] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Confirm"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Complete Confirmation Modal */}
      {showCompleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          <div className="bg-white border-2 border-gray-100 rounded-[2rem] w-full max-w-[340px] shadow-[0_15px_40px_rgba(0,0,0,0.12)] p-8 relative overflow-hidden text-center animate-in zoom-in-95 duration-300 pointer-events-auto" onClick={e => e.stopPropagation()}>
            <div className="mx-auto w-16 h-16 bg-blue-50 text-[#1d4ed8] rounded-full flex items-center justify-center mb-6 border-4 border-blue-50/50">
              <CheckCircle2 size={28} strokeWidth={2.5} />
            </div>
            
              <h3 className="text-lg font-black text-gray-900 tracking-tight mb-4">Complete Session</h3>
              <p className="text-gray-500 font-medium mb-8 leading-relaxed text-[13px]">
                Are you sure you want to mark the clinician visit for <span className="font-bold text-gray-900">{aptForAction?.patient_name}</span> as completed?
              </p>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowCompleteConfirm(false)}
                className="flex-1 py-4 bg-gray-50 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95"
              >
                Not Yet
              </button>
              <button 
                onClick={confirmComplete}
                className="flex-1 py-4 bg-[#1d4ed8] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
              >
                Complete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          <div className="bg-white border-2 border-gray-100 rounded-[2rem] w-full max-w-[340px] shadow-[0_15px_40px_rgba(0,0,0,0.12)] p-8 relative overflow-hidden text-center animate-in zoom-in-95 duration-300 pointer-events-auto" onClick={e => e.stopPropagation()}>
            <div className="mx-auto w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6 border-4 border-red-50">
              <AlertTriangle size={28} strokeWidth={2.5} />
            </div>
            
            <h3 className="text-lg font-black text-gray-900 tracking-tight mb-4">Cancel Session</h3>
            <p className="text-gray-500 font-medium mb-8 leading-relaxed text-[13px]">
              Are you sure you want to cancel the session for <span className="font-bold text-gray-900">{aptForAction?.patient_name}</span>? This action cannot be undone.
            </p>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 py-4 bg-gray-50 text-gray-400 hover:text-gray-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95"
              >
                Keep It
              </button>
              <button 
                onClick={confirmCancel}
                className="flex-1 py-4 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-700 transition-all shadow-lg shadow-red-500/25 active:scale-95"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
