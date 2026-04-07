import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Activity, 
  UserPlus, 
  Loader2, 
  Search, 
  Info, 
  CheckCircle,
  ChevronRight
} from "lucide-react"
import { 
  clinicianAddPatient, 
  getPatientProfileById, 
  updatePatientTreatment 
} from "@/api"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function AddPatient({ user }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const clinicianId = user?.clinician_id || user?.user_id;

  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(isEditMode);
  
  const [form, setForm] = useState({
    patient_id: "",
    name: "",
    email: "",
    phone_number: "",
    treatment_stage: "Initial Consultation"
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchPatientData = async () => {
        try {
          const response = await getPatientProfileById(id);
          const data = response.data;
          setForm({
            patient_id: data.patient_id || id,
            name: data.name,
            email: data.email || "",
            phone_number: data.phone_number || "",
            treatment_stage: data.treatment_stage || "Initial Consultation"
          });
        } catch (err) {
          toast.error("Failed to load patient details");
          navigate("/dashboard/clinician/patients");
        } finally {
          setIsPageLoading(false);
        }
      };
      fetchPatientData();
    }
  }, [id, isEditMode, navigate]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!form.patient_id || !form.name) {
      toast.error("Patient ID and Name are required");
      return;
    }

    setIsActionLoading(true);
    try {
      if (isEditMode) {
        await updatePatientTreatment({
          patient_id: form.patient_id,
          stage: form.treatment_stage,
          notes: "Updated via clinician dashboard",
          clinician_id: clinicianId
        });
        toast.success("Patient phase updated successfully");
      } else {
        await clinicianAddPatient({ 
          clinician_id: clinicianId, 
          ...form, 
          creator_name: user?.name || "Your Clinician" 
        });
        toast.success("Patient account registered successfully");
      }
      navigate("/dashboard/clinician/patients");
    } catch (err) {
      toast.error(err.response?.data?.error || `Failed to ${isEditMode ? 'update' : 'register'} patient`);
    } finally {
      setIsActionLoading(false);
    }
  };

  if (!user) return null;

  if (isPageLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-gray-500 font-medium">Loading patient details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-up pb-20 pt-4">
      {/* Header & Back Navigation */}
      <div className="flex items-center gap-4 px-2">
        <button 
          onClick={() => navigate("/dashboard/clinician/patients")}
          className="p-3 hover:bg-white rounded-2xl transition-all text-gray-400 hover:text-blue-600 shadow-sm border border-transparent hover:border-blue-100"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            {isEditMode ? "Update Patient Phase" : "Register New Patient"}
          </h1>
          <p className="text-gray-400 text-sm font-medium mt-1">
            {isEditMode ? `Modifying clinical status for ${form.name}` : "Create a new high-fidelity patient profile."}
          </p>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-2xl shadow-blue-500/5 relative overflow-hidden">
        <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
            {/* Identity Group */}
            <div className="space-y-2">
              <Label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">Patient ID *</Label>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                <Input
                  placeholder="e.g. 100982100"
                  value={form.patient_id}
                  onChange={(e) => setForm({ ...form, patient_id: e.target.value })}
                  disabled={isEditMode}
                  className="pl-12 rounded-2xl border-gray-100 h-14 focus:ring-blue-500/10 focus:border-blue-200 font-medium text-base shadow-sm disabled:bg-gray-50 disabled:text-gray-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">Full Name *</Label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                <Input
                  placeholder="Sarah Anderson"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="pl-12 rounded-2xl border-gray-100 h-14 focus:ring-blue-500/10 focus:border-blue-200 font-medium text-base shadow-sm"
                />
              </div>
            </div>

            {/* Contact Group */}
            <div className="space-y-2">
              <Label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">Email Address</Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                <Input
                  type="email"
                  placeholder="sarah.anderson@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="pl-12 rounded-2xl border-gray-100 h-14 focus:ring-blue-500/10 focus:border-blue-200 font-medium text-base shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">Phone Number</Label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                <Input
                  placeholder="+91 98765 43210"
                  value={form.phone_number}
                  onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                  className="pl-12 rounded-2xl border-gray-100 h-14 focus:ring-blue-500/10 focus:border-blue-200 font-medium text-base shadow-sm"
                />
              </div>
            </div>

            {/* Treatment Settings */}
            <div className="space-y-2 md:col-span-2">
              <Label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">Current Treatment Stage</Label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 z-10 pointer-events-none">
                  <Activity size={18} />
                </div>
                <Select
                  value={form.treatment_stage}
                  onValueChange={(val) => setForm({ ...form, treatment_stage: val })}
                >
                  <SelectTrigger className="pl-12 h-14 rounded-2xl border-gray-100 focus:ring-blue-500/10 focus:border-blue-200 font-medium bg-white text-base shadow-sm text-left">
                    <SelectValue placeholder="Select patient stage" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-gray-50 shadow-2xl overflow-hidden p-2">
                    <SelectItem value="Initial Consultation" className="rounded-xl py-3">Initial Consultation</SelectItem>
                    <SelectItem value="Bonding/ First Trays" className="rounded-xl py-3">Bonding/ First Trays</SelectItem>
                    <SelectItem value="Alignment Phase" className="rounded-xl py-3">Alignment Phase</SelectItem>
                    <SelectItem value="Bite Correction" className="rounded-xl py-3">Bite Correction</SelectItem>
                    <SelectItem value="Finishing & Detailing" className="rounded-xl py-3">Finishing & Detailing</SelectItem>
                    <SelectItem value="Debonding & Retention" className="rounded-xl py-3">Debonding & Retention</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Registration Info Alert Box */}
          <div className="bg-blue-50/50 rounded-[1.5rem] p-6 border border-blue-100/50 flex gap-5">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-blue-50">
              {isEditMode ? <CheckCircle size={22} className="text-blue-600" /> : <Info size={22} className="text-blue-600" />}
            </div>
            <div className="space-y-1">
              <p className="text-sm text-blue-900 font-black uppercase tracking-widest leading-none mb-1">
                {isEditMode ? "Profile Update Ready" : "Registration Information"}
              </p>
              <p className="text-xs text-blue-600/80 font-semibold leading-relaxed">
                {isEditMode 
                  ? "Changes to patient records are logged and reflected across the clinician and patient portals immediately."
                  : <span>The initial password will be <span className="font-extrabold text-blue-700 underline underline-offset-4 decoration-2">ortho@</span> followed by the last 4 digits of the mobile number.</span>}
              </p>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-50">
            <Button 
              type="button"
              variant="outline" 
              onClick={() => navigate("/dashboard/clinician/patients")} 
              className="rounded-2xl font-black h-14 px-10 border-gray-100 text-gray-400 hover:bg-gray-50 hover:text-gray-900 transition-all uppercase tracking-widest text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl h-14 px-12 grow shadow-xl shadow-blue-500/20 active:scale-95 transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-3"
              disabled={isActionLoading}
            >
              {isActionLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  {isEditMode ? <CheckCircle size={20} /> : <UserPlus size={20} />}
                  {isEditMode ? "Update Clinical Record" : "Register Patient Account"}
                </>
              )}
            </Button>
          </div>
        </form>
        
        {/* Decorative Background Element */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-blue-50/20 rounded-full blur-[100px] pointer-events-none" />
      </div>
    </div>
  )
}
