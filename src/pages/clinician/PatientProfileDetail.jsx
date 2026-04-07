import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { 
  Loader2, 
  ChevronLeft,
  Moon,
  ChevronDown
} from "lucide-react"
import { 
  getPatientProfileById, 
  updatePatientTreatment, 
  getPatientAppointments, 
  clinicianAddSchedule, 
  cancelAppointment,
  rescheduleAppointment
} from "@/api"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function PatientProfileDetail({ user }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Form State
  const [stage, setStage] = useState("")
  const [status, setStatus] = useState("")
  const [notes, setNotes] = useState("")
  
  // Appointment state
  const [appointments, setAppointments] = useState([])
  const [loadingAppts, setLoadingAppts] = useState(false)
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
  const [scheduling, setScheduling] = useState(false)
  
  // Cancel Appointment State
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [cancelApptId, setCancelApptId] = useState(null)
  const [cancelling, setCancelling] = useState(false)
  
  // New Appointment Form State
  const [newAppt, setNewAppt] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5), // Current HH:mm (24h)
    type: "Regular Session",
    notes: ""
  })

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await getPatientProfileById(id)
        const data = res.data
        setPatient(data)
        setStage(data.treatment_stage || "Initial Consultation")
        setStatus(data.status?.toLowerCase() || "on track")
        setNotes(data.notes || "")
      } catch (err) {
        toast.error("Failed to load patient profile")
        navigate("/dashboard/clinician/patients")
      } finally {
        setLoading(false)
      }
    }
    fetchPatient()
    fetchAppointments()
  }, [id, navigate])

  const fetchAppointments = async () => {
    setLoadingAppts(true)
    try {
      const res = await getPatientAppointments(id)
      const today = new Date().toISOString().split('T')[0];
      
      const upcoming = res.data
        .filter(a => (a.status?.toLowerCase() === 'scheduled' || a.status?.toLowerCase() === 'rescheduled') && a.appointment_date >= today)
        .sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date))
      
      setAppointments(upcoming.slice(0, 1))
    } catch (err) {
      console.error("Failed to fetch appointments:", err)
    } finally {
      setLoadingAppts(false)
    }
  }

  const handleScheduleConfirm = async () => {
    const requestedDateTime = new Date(`${newAppt.date}T${newAppt.time}`);
    const now = new Date();
    now.setSeconds(0, 0); // Ignore seconds/milliseconds for "current min" support
    
    if (requestedDateTime < now) {
      toast.error("Invalid time: You have selected a time in the past");
      return;
    }

    setScheduling(true)
    try {
      await clinicianAddSchedule({
        patient_id: id,
        clinician_id: user.clinician_id || user.user_id,
        appointment_date: newAppt.date,
        appointment_time: newAppt.time,
        appointment_type: newAppt.type,
        notes: newAppt.notes,
        status: "scheduled"
      })
      toast.success("Session planned successfully")
      setIsScheduleModalOpen(false)
      fetchAppointments()
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to plan treatment session")
    } finally {
      setScheduling(false)
    }
  }

  const handleCancelClick = (apptId) => {
    setCancelApptId(apptId)
    setIsCancelModalOpen(true)
  }

  const handleCancelConfirm = async () => {
    if (!cancelApptId) return
    setCancelling(true)
    
    try {
      await cancelAppointment(cancelApptId)
      toast.success("Session cancelled successfully")
      fetchAppointments()
      setIsCancelModalOpen(false)
    } catch (err) {
      toast.error("Failed to cancel session")
    } finally {
      setCancelling(false)
      setCancelApptId(null)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updatePatientTreatment({
        patient_id: id,
        stage,
        status,
        notes,
        clinician_id: user.clinician_id || user.user_id
      })
      toast.success("Patient profile updated successfully")
      navigate("/dashboard/clinician/patients")
    } catch (err) {
      toast.error("Failed to save changes")
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-gray-400 font-medium">Loading clinical profile...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans">
      {/* Modern Clean Header */}
      <div className="bg-[#F8FAFC] px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate("/dashboard/clinician/patients")}
            className="p-1 hover:bg-gray-200/50 rounded-full text-gray-900 transition-colors"
          >
            <ChevronLeft size={22} className="stroke-[2.5]" />
          </button>
          <h1 className="text-[18px] font-bold text-gray-900">Patient Profile</h1>
        </div>
        <button className="p-2.5 bg-white rounded-full shadow-sm border border-gray-100/80 hover:bg-gray-50 text-slate-600">
          <Moon size={18} className="fill-slate-600" />
        </button>
      </div>
      
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Top Profile Card */}
        <div className="bg-white rounded-[24px] p-8 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-[84px] h-[84px] rounded-full bg-[#EBF4FF] text-[#2563EB] flex items-center justify-center text-2xl font-bold mb-4">
            {patient?.name?.split(' ').map((n, i) => i < 2 ? n[0] : '').join('').toUpperCase() || 'SK'}
          </div>
          <h2 className="text-[22px] font-bold text-gray-900 tracking-tight">{patient?.name || 'Swarna Koushik'}</h2>
          <p className="text-[14px] font-medium text-gray-400 mt-1 uppercase tracking-wide">ID: {patient?.patient_id || 'PAT192211311'}</p>
        </div>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
          
          {/* Column 1 */}
          <div className="space-y-8">
            {/* Treatment Overview */}
            <div className="space-y-3">
              <h3 className="text-[11px] font-[800] text-slate-500 uppercase tracking-widest ml-1">Treatment Overview</h3>
              <div className="bg-white rounded-[20px] p-6 border border-gray-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] space-y-7">
                <div className="space-y-2">
                  <label className="text-[13px] font-semibold text-slate-600 ml-1">Stage</label>
                  <div className="relative group">
                    <select
                      value={stage}
                      onChange={(e) => setStage(e.target.value)}
                      className="w-full px-4 py-3 bg-[#F8FAFC] border border-gray-100 rounded-[12px] text-[15px] font-medium text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
                    >
                      <option value="Initial Consultation">Initial Consultation</option>
                      <option value="Bonding/ First Trays">Bonding/ First Trays</option>
                      <option value="Alignment Phase">Alignment Phase</option>
                      <option value="Bite Correction">Bite Correction</option>
                      <option value="Finishing & Detailing">Finishing & Detailing</option>
                      <option value="Debonding & Retention">Debonding & Retention</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <ChevronDown size={18} strokeWidth={2.5} />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-semibold text-slate-600 ml-1">Status</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "on track", label: "On Track" },
                      { id: "attention", label: "Attention" },
                      { id: "critical", label: "Critical" }
                    ].map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setStatus(s.id)}
                        className={`py-2.5 px-0 w-full text-center rounded-[10px] text-[13px] font-semibold transition-colors border ${
                          status === s.id && s.id === 'attention'
                            ? 'bg-[#FFF9F2] border-[#F9C38B] text-[#EA580C]'
                            : status === s.id && s.id === 'critical'
                            ? 'bg-[#FEF2F2] border-[#FCA5A5] text-[#DC2626]'
                            : status === s.id && s.id === 'on track'
                            ? 'bg-[#F0FDF4] border-[#86EFAC] text-[#16A34A]'
                            : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Clinician Notes */}
            <div className="space-y-3">
              <h3 className="text-[11px] font-[800] text-slate-500 uppercase tracking-widest ml-1">Clinician Notes</h3>
              <div className="bg-white rounded-[20px] p-6 border border-gray-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] h-[240px]">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add some notes for this patient..."
                  className="w-full h-full resize-none border-none outline-none text-[15px] placeholder:text-gray-400 font-medium text-gray-700 bg-transparent"
                />
              </div>
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-8">
            {/* Attachments & Media */}
            <div className="space-y-3">
              <h3 className="text-[11px] font-[800] text-slate-500 uppercase tracking-widest ml-1">Attachments & Media</h3>
              <div className="bg-white rounded-[20px] border border-gray-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
                {patient?.reports?.length > 0 ? (
                  patient.reports.slice(0, 1).map((report) => (
                    <div key={report.id}>
                      {report.photo_url ? (
                        <div className="w-full h-[180px] bg-gray-100">
                          <img 
                            src={report.photo_url.startsWith('http') || report.photo_url.startsWith('data:') ? report.photo_url : `data:image/jpeg;base64,${report.photo_url}`} 
                            alt="Media" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-[180px] bg-gray-50 flex items-center justify-center">
                          <span className="text-gray-300 font-medium">No Image</span>
                        </div>
                      )}
                      <div className="p-6">
                        <h4 className="font-bold text-gray-900 text-[15px] mb-1">{report.issue_type}</h4>
                        <p className="text-[13px] text-slate-500 mb-5">{report.description || "NA"}</p>
                        <p className="text-[11px] font-medium text-gray-400">Reported on {report.created_at}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-400 text-sm">No attachments available</div>
                )}
              </div>
            </div>

            {/* Treatment Sessions */}
            <div className="space-y-3">
              <h3 className="text-[11px] font-[800] text-slate-500 uppercase tracking-widest ml-1">Treatment Sessions</h3>
              <div className="bg-white rounded-[20px] border border-gray-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] p-6">
                {appointments.length > 0 ? (
                  appointments.map((appt) => (
                    <div key={appt.id}>
                      <div className="flex justify-between items-start mb-1.5">
                        <h4 className="font-bold text-gray-900 text-[16px]">{appt.appointment_type}</h4>
                        <span className={`text-[9px] font-[800] uppercase px-2.5 py-1 rounded-[6px] select-none ${appt.status?.toLowerCase() === 'scheduled' ? 'bg-[#EAF7ED] text-[#1D9A6C]' : 'bg-gray-100 text-gray-600'}`}>
                          {appt.status?.toLowerCase() === 'scheduled' ? 'CONFIRMED' : appt.status?.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[13px] text-slate-500 mb-6 font-medium">
                        {appt.appointment_date} • {appt.appointment_time}
                      </p>
                      
                      <div className="flex gap-3">
                        <button 
                          onClick={() => {
                            setNewAppt({
                              date: appt.appointment_date,
                              time: appt.appointment_time,
                              type: appt.appointment_type,
                              notes: appt.notes || ""
                            });
                            setIsScheduleModalOpen(true);
                          }}
                          className="flex-1 py-3 bg-[#EFF6FF] text-[#2563EB] hover:bg-blue-100/70 rounded-[12px] text-[13px] font-semibold transition-colors"
                        >
                          Reschedule
                        </button>
                        <button 
                          onClick={() => handleCancelClick(appt.id)}
                          className="flex-1 py-3 bg-[#FEF2F2] text-[#DC2626] hover:bg-red-50 focus:bg-red-100 rounded-[12px] text-[13px] font-semibold transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                    <div className="flex flex-col items-center py-2">
                        <p className="text-slate-400 text-sm mb-4 font-medium">No treatment session scheduled</p>
                        <Button onClick={() => setIsScheduleModalOpen(true)} className="bg-[#EFF6FF] text-[#2563EB] hover:bg-blue-100/70 rounded-[12px] font-semibold shadow-none w-full h-[44px]">Plan Session</Button>
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Save Button Container */}
        <div className="pt-4 pb-12 w-full">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-semibold py-4 rounded-[12px] text-[16px] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 className="animate-spin" size={20} /> : null}
            Save Changes
          </button>
        </div>

      </div>

      {/* Plan Session Modal */}
      <Dialog open={isScheduleModalOpen} onOpenChange={setIsScheduleModalOpen}>
        <DialogContent className="max-w-md bg-white rounded-[24px] border-none shadow-2xl p-0 overflow-hidden">
          <DialogHeader className="p-8 pb-4">
            <DialogTitle className="text-xl font-bold text-gray-900">Plan Session</DialogTitle>
          </DialogHeader>
          
          <div className="p-8 pt-0 space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Date *</label>
              <Input 
                type="date" 
                value={newAppt.date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setNewAppt({...newAppt, date: e.target.value})}
                placeholder="Select Date"
                className="bg-gray-50 border border-gray-100 rounded-[16px] p-6 font-semibold text-sm focus:ring-2 focus:ring-blue-100"
              />
            </div>
            
            <div className="space-y-4">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Time *</label>
              <div className="flex gap-3">
                <Select 
                  value={(() => {
                    const [h] = newAppt.time.split(':');
                    const hour = parseInt(h);
                    if (hour === 0) return "12";
                    if (hour > 12) return (hour - 12).toString().padStart(2, '0');
                    return hour.toString().padStart(2, '0');
                  })()}
                  onValueChange={(h) => {
                    const [, m] = newAppt.time.split(':');
                    const isPM = parseInt(newAppt.time.split(':')[0]) >= 12;
                    let newH = parseInt(h);
                    if (isPM && newH < 12) newH += 12;
                    if (!isPM && newH === 12) newH = 0;
                    setNewAppt({...newAppt, time: `${newH.toString().padStart(2, '0')}:${m}`});
                  }}
                >
                  <SelectTrigger className="flex-1 bg-gray-50 border border-gray-100 rounded-[16px] h-[56px] px-6 font-semibold text-sm focus:ring-2 focus:ring-blue-100">
                    <SelectValue placeholder="Hour" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border text-gray-900 border-gray-100 rounded-[16px] shadow-lg max-h-[300px]">
                    {Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0')).map(h => (
                      <SelectItem key={h} value={h}>{h}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select 
                  value={newAppt.time.split(':')[1]}
                  onValueChange={(m) => {
                    const [h] = newAppt.time.split(':');
                    setNewAppt({...newAppt, time: `${h}:${m}`});
                  }}
                >
                  <SelectTrigger className="flex-1 bg-gray-50 border border-gray-100 rounded-[16px] h-[56px] px-6 font-semibold text-sm focus:ring-2 focus:ring-blue-100">
                    <SelectValue placeholder="Min" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border text-gray-900 border-gray-100 rounded-[16px] shadow-lg max-h-[300px]">
                    {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')).map(m => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select 
                  value={parseInt(newAppt.time.split(':')[0]) >= 12 ? "PM" : "AM"}
                  onValueChange={(p) => {
                    const [h, m] = newAppt.time.split(':');
                    let newH = parseInt(h);
                    if (p === "PM" && newH < 12) newH += 12;
                    if (p === "AM" && newH >= 12) newH -= 12;
                    setNewAppt({...newAppt, time: `${newH.toString().padStart(2, '0')}:${m}`});
                  }}
                >
                  <SelectTrigger className="w-[100px] bg-gray-50 border border-gray-100 rounded-[16px] h-[56px] px-4 font-bold text-sm focus:ring-2 focus:ring-blue-100">
                    <SelectValue placeholder="AM/PM" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border text-gray-900 border-gray-100 rounded-[16px] shadow-lg">
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Session Type</label>
              <Select 
                value={newAppt.type}
                onValueChange={(val) => setNewAppt({...newAppt, type: val})}
              >
                <SelectTrigger className="bg-gray-50 border border-gray-100 rounded-[16px] px-6 py-4 font-semibold text-sm h-[56px] focus:ring-2 focus:ring-blue-100">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-white border text-gray-900 border-gray-100 rounded-[16px] shadow-lg">
                  <SelectItem value="Regular Session">Regular Session</SelectItem>
                  <SelectItem value="Emergency Fix">Emergency Fix</SelectItem>
                  <SelectItem value="Bonding">Bonding</SelectItem>
                  <SelectItem value="Retention">Retention</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Notes (Optional)</label>
              <Textarea 
                placeholder="Add any special notes..."
                value={newAppt.notes}
                onChange={(e) => setNewAppt({...newAppt, notes: e.target.value})}
                className="bg-gray-50 border border-gray-100 rounded-[16px] p-6 font-medium text-sm min-h-[100px] resize-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
          
          <div className="p-8 pt-4">
            <Button 
              onClick={handleScheduleConfirm}
              disabled={scheduling}
              className="w-full bg-[#16A34A] hover:bg-green-600 text-white font-bold py-6 h-14 rounded-[16px] text-[13px] tracking-wide shadow-lg shadow-green-500/20 active:scale-[0.98] transition-all"
            >
              {scheduling ? <Loader2 className="animate-spin" size={20} /> : "Confirm Session"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Modal */}
      <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
        <DialogContent className="max-w-sm bg-white rounded-[24px] border-none shadow-2xl p-8 pt-10 text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Cancel Session?</h2>
          <p className="text-[14px] text-gray-500 mb-8 leading-relaxed">
            Are you sure you want to cancel this treatment session? This action cannot be undone, and the patient will be notified.
          </p>
          <div className="flex gap-3">
            <button 
              onClick={() => setIsCancelModalOpen(false)}
              className="flex-1 py-3.5 bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-[12px] font-semibold text-[13px] transition-colors"
            >
              Keep It
            </button>
            <button 
              onClick={handleCancelConfirm}
              disabled={cancelling}
              className="flex-1 py-3.5 bg-[#DC2626] text-white hover:bg-red-700 rounded-[12px] font-semibold text-[13px] transition-colors shadow-lg shadow-red-500/20 active:scale-95 flex items-center justify-center gap-2"
            >
              {cancelling ? <Loader2 className="animate-spin" size={16} /> : null}
              Cancel It
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
