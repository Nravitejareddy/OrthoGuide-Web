import { 
  Search, 
  MoreVertical, 
  UserPlus, 
  Loader2, 
  X, 
  Eye, 
  Edit, 
  Trash2, 
  MessageSquare, 
  User, 
  Send, 
  AlertTriangle,
  ChevronRight,
  Plus,
  ArrowLeft,
  Calendar,
  Clock,
  Briefcase,
  Bell,
  HelpCircle
} from "lucide-react"
import { useClinicianData } from "@/hooks/useDashboardData"
import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import {
  clinicianDeactivatePatient,
  sendMessageToPatient
} from "@/api"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { useNavigate } from "react-router-dom"

export default function PatientsList({ user }) {
  const navigate = useNavigate();
  const clinicianId = user?.clinician_id || user?.user_id;
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [openPopover, setOpenPopover] = useState(null)
  
  const [deactivatingPatient, setDeactivatingPatient] = useState(null)
  const [showDeactivateModal, setShowDeactivateModal] = useState(false)
  const [isDeactivating, setIsDeactivating] = useState(false)

  const { patients, loading, refresh } = useClinicianData(clinicianId);

  const filters = [
    { id: "all", label: "ALL" },
    { id: "critical", label: "CRITICAL" },
    { id: "attention", label: "ATTENTION" },
    { id: "on track", label: "ON TRACK" },
    { id: "unscheduled", label: "UNSCHEDULED" },
  ];

  const getInitials = (name) => {
    if (!name) return "P";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 1).toUpperCase();
  };

  const filteredPatients = useMemo(() => {
    return (patients || []).filter(p => {
      const matchesSearch =
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.patient_id?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "unscheduled" && !p.has_appointment) ||
        (p.status?.toLowerCase() === statusFilter) ||
        (statusFilter === "on track" && p.status?.toLowerCase() === "active");

      return matchesSearch && matchesStatus;
    });
  }, [patients, searchTerm, statusFilter]);

  if (!user) return null

  const handleViewProfile = (patient) => {
    navigate(`/dashboard/clinician/patients/profile/${patient.patient_id}`);
    setOpenPopover(null);
  };

  const handleEditClick = (patient) => {
    navigate(`/dashboard/clinician/patients/${patient.patient_id}`);
    setOpenPopover(null);
  };

  const handleDeactivateClick = (patient) => {
    setDeactivatingPatient(patient);
    setShowDeactivateModal(true);
    setOpenPopover(null);
  };

  const handleConfirmDeactivate = async () => {
    if (!deactivatingPatient) return;
    setIsDeactivating(true);
    try {
      await clinicianDeactivatePatient({
        patient_id: deactivatingPatient.patient_id
      });
      toast.success("Patient deactivated successfully!");
      setShowDeactivateModal(false);
      setDeactivatingPatient(null);
      if (refresh) refresh();
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to deactivate patient";
      toast.error(msg);
    } finally {
      setIsDeactivating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-blue-600 w-8 h-8" />
      </div>
    )
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12 animate-fade-up">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Patients</h1>
        
        <div className="flex items-center gap-6 flex-1 max-w-xl">
           <div className="relative group w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200/80 rounded-2xl text-sm font-medium placeholder:text-gray-400 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/40 transition-all shadow-sm shadow-black/5"
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </div>

        <div className="w-10 h-10"></div> {/* Spacer to maintain symmetry with the profile pic on the far right */}
      </div>

      {/* Filter Tabs & New Button */}
      <div className="flex items-center justify-between px-4 bg-white/30 p-2 rounded-[2rem]">
         <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide py-1">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setStatusFilter(filter.id)}
                className={`px-5 py-2 rounded-full text-[10px] font-bold tracking-widest whitespace-nowrap transition-all ${
                  statusFilter === filter.id
                    ? "bg-[#1d4ed8] text-white shadow-lg shadow-blue-500/20"
                    : "bg-[#f1f5f9] text-gray-500 hover:bg-gray-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
         </div>

         <button
            onClick={() => navigate("/dashboard/clinician/patients/new")}
            className="bg-[#1d4ed8] hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2 shadow-lg shadow-blue-500/10 active:scale-95"
         >
            <Plus size={18} /> New
         </button>
      </div>

      {/* Patients List Rows */}
      {filteredPatients.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-100 rounded-[2.5rem] p-20 text-center">
          <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search size={40} />
          </div>
          <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">No records found</p>
          <button
            onClick={() => { setSearchTerm(""); setStatusFilter("all") }}
            className="mt-6 text-blue-600 text-[10px] font-bold uppercase tracking-widest hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="space-y-3 px-2">
          {filteredPatients.map((p, i) => {
            const isCritical = p.status?.toLowerCase() === "critical";
            const isAttention = p.status?.toLowerCase() === "attention";
            const isOnTrack = p.status?.toLowerCase() === "on track" || p.status?.toLowerCase() === "active";
            
            return (
              <div 
                key={p.patient_id || i} 
                onClick={() => handleViewProfile(p)}
                className="bg-white rounded-[2rem] p-5 grid grid-cols-[240px_180px_280px_140px_40px] items-center gap-4 shadow-sm border border-gray-50 hover:shadow-md transition-all cursor-pointer group active:scale-[0.99] overflow-hidden"
              >
                {/* Identity Column */}
                <div className="flex items-center gap-4 min-w-0 flex-shrink-0">
                  <div className="w-11 h-11 rounded-full bg-[#dbeafe] flex items-center justify-center font-bold text-[#1e40af] text-sm flex-shrink-0">
                    {getInitials(p.name)}
                  </div>
                  <div className="flex flex-col min-w-0 overflow-hidden">
                    <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight truncate">{p.name || "Unknown"}</h4>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider truncate">
                      {p.patient_id?.startsWith('PAT') ? p.patient_id : `PAT${p.patient_id || p.id}`}
                    </p>
                  </div>
                </div>

                {/* Treatment Column */}
                <div className="flex flex-col min-w-0 flex-shrink-0">
                   <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">TREATMENT</p>
                   <div className="flex items-center">
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-bold tracking-tight uppercase truncate max-w-full">
                         {p.treatment_stage || "Regular Follow-up"}
                      </span>
                   </div>
                </div>

                {/* Appointment Status */}
                <div className="flex items-center min-w-0 flex-shrink-0">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all ${
                     !p.has_appointment ? 'bg-red-50 text-[#ef4444]' : p.is_my_appointment ? 'bg-green-50 text-[#10b981]' : 'bg-blue-50 text-[#3b82f6]'
                  }`}>
                     {p.has_appointment ? (
                        p.is_my_appointment ? (
                           <Calendar size={13} strokeWidth={2.5} className="shrink-0" />
                        ) : (
                           <Briefcase size={14} className="shrink-0" strokeWidth={2.5} />
                        )
                     ) : (
                        <Calendar size={13} strokeWidth={2.5} className="shrink-0" />
                     )}
                     <span className="text-[10px] font-bold uppercase tracking-wider whitespace-nowrap overflow-hidden text-ellipsis">
                        {!p.has_appointment 
                          ? 'NO SESSION SCHEDULED' 
                          : p.is_my_appointment 
                            ? `SESSION: ${new Date(p.next_appointment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}`
                            : `OTHER DOCTOR: ${new Date(p.next_appointment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}`}
                     </span>
                  </div>
                </div>

                {/* Status Column */}
                <div className="flex justify-start flex-shrink-0">
                   <div className={`px-4 py-1.5 rounded text-[9px] font-bold uppercase tracking-widest whitespace-nowrap inline-flex items-center justify-center ${
                      isCritical ? "bg-[#fee2e2] text-[#ef4444]" : 
                      isOnTrack ? "bg-green-100 text-green-700 shadow-sm" :
                      "bg-[#dbeafe] text-[#3b82f6]"
                   }`}>
                      {p.status?.toLowerCase() === "active" ? "ON TRACK" : p.status || (isCritical ? "CRITICAL" : "ATTENTION")}
                   </div>
                </div>

                {/* Actions Column */}
                <div className="flex justify-end flex-shrink-0">
                   <Popover open={openPopover === p.patient_id} onOpenChange={(open) => setOpenPopover(open ? p.patient_id : null)}>
                      <PopoverTrigger asChild>
                        <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-300 hover:text-gray-900 transition-all" onClick={(e) => e.stopPropagation()}>
                          <MoreVertical size={18} />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-48 p-2 rounded-2xl shadow-2xl border-none ring-1 ring-black/5" align="end">
                        <button onClick={() => handleViewProfile(p)} className="w-full px-4 py-2 text-left text-xs font-bold text-gray-600 hover:bg-gray-50 rounded-xl flex items-center gap-3">
                          <Eye size={16} className="text-blue-500" /> View Profile
                        </button>
                        <button onClick={() => handleEditClick(p)} className="w-full px-4 py-2 text-left text-xs font-bold text-gray-600 hover:bg-gray-50 rounded-xl flex items-center gap-3">
                          <Edit size={16} className="text-gray-400" /> Update Phase
                        </button>
                        <button onClick={() => handleDeactivateClick(p)} className="w-full px-4 py-2 text-left text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-3">
                          <Trash2 size={16} /> Deactivate
                        </button>
                      </PopoverContent>
                   </Popover>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Deactivate Modal */}
      <Dialog open={showDeactivateModal} onOpenChange={setShowDeactivateModal}>
        <DialogContent className="sm:max-w-md rounded-[2.5rem] border-none shadow-2xl p-10">
          <div className="text-center">
            <div className="mx-auto w-20 h-20 bg-red-50 text-red-600 rounded-[2rem] flex items-center justify-center mb-6">
              <AlertTriangle size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-2">Deactivate Patient?</h3>
            <p className="text-sm font-medium text-gray-500 leading-relaxed max-w-[240px] mx-auto">
              Are you sure you want to remove <span className="text-gray-900 font-bold">{deactivatingPatient?.name}</span>?
            </p>
          </div>

          <div className="flex flex-col gap-3 mt-10">
            <button
              onClick={handleConfirmDeactivate}
              disabled={isDeactivating}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-2xl text-xs transition-all shadow-lg active:scale-95 disabled:opacity-50 uppercase tracking-widest flex items-center justify-center gap-2"
            >
              {isDeactivating ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
              Confirm Deactivation
            </button>
            <button onClick={() => setShowDeactivateModal(false)} className="w-full bg-gray-50 hover:bg-gray-100 text-gray-500 font-bold py-4 rounded-2xl text-xs transition-all uppercase tracking-widest">
              Cancel
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
