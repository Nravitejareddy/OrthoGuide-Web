import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, User, Mail, Phone, Activity, UserPlus, Key, Loader2, Search, AlertTriangle, CheckCircle } from "lucide-react"
import { adminCreateUser, adminUpdateUser, adminGetUser } from "@/api"
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
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(isEditMode);
  const [newUserForm, setNewUserForm] = useState({
    id: "",
    name: "",
    email: "",
    phone_number: "",
    role: "patient",
    treatment_stage: "Initial Consultation"
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchUserData = async () => {
        try {
          const response = await adminGetUser("patient", id);
          const data = response.data;
          setNewUserForm({
            id: data.id,
            name: data.name,
            email: data.email,
            phone_number: data.phone_number || "",
            role: "patient",
            treatment_stage: data.treatment_stage || "Initial Consultation"
          });
        } catch (err) {
          toast.error("Failed to load patient details");
          navigate("/dashboard/admin/patients");
        } finally {
          setIsPageLoading(false);
        }
      };
      fetchUserData();
    }
  }, [id, isEditMode, navigate]);

  const handleSubmit = async () => {
    if (!newUserForm.id || !newUserForm.name || !newUserForm.email || !newUserForm.phone_number) {
      toast.error("All fields including phone number are required");
      return;
    }

    // Strict Validation
    const nameRegex = /^[A-Za-z\s]{3,}$/;
    if (!nameRegex.test(newUserForm.name)) {
      toast.error("Name must be at least 3 letters and contain no numbers or symbols");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(newUserForm.email)) {
      toast.error("Only @gmail.com email addresses are allowed for account registration");
      return;
    }

    const phoneRegex = /^\d{10}$/;
    const cleanPhone = newUserForm.phone_number.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    setIsActionLoading(true);
    try {
      if (isEditMode) {
        await adminUpdateUser({ ...newUserForm, phone_number: cleanPhone });
        toast.success("Patient record updated successfully");
      } else {
        await adminCreateUser({ ...newUserForm, phone_number: cleanPhone, creator_name: user?.name || "System Admin" });
        toast.success("Patient account registered successfully");
      }
      navigate("/dashboard/admin/patients");
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
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-up pb-20">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate("/dashboard/admin/patients")}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            {isEditMode ? "Update Patient Account" : "Register New Patient"}
          </h1>
          <p className="text-gray-400 text-sm font-medium">
            {isEditMode ? `Modifying profile for ${newUserForm.name}` : "Add a new patient to the system."}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-purple-500/5 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
          {/* Patient ID & Full Name */}
          <div className="space-y-2">
            <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Patient ID</Label>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-purple-500 transition-colors" size={18} />
              <Input
                placeholder="e.g. PAT192210667"
                value={newUserForm.id}
                onChange={(e) => setNewUserForm({ ...newUserForm, id: e.target.value })}
                disabled={isEditMode}
                className="pl-12 rounded-2xl border-gray-100 h-14 focus:ring-purple-500/10 focus:border-purple-200 font-medium text-base shadow-sm disabled:bg-gray-50 disabled:text-gray-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Full Name</Label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-purple-500 transition-colors" size={18} />
              <Input
                placeholder="Sarah Anderson"
                value={newUserForm.name}
                onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                className="pl-12 rounded-2xl border-gray-100 h-14 focus:ring-purple-500/10 focus:border-purple-200 font-medium text-base shadow-sm"
              />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="space-y-2">
            <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Email Address</Label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-purple-500 transition-colors" size={18} />
              <Input
                type="email"
                placeholder="sarah.anderson@gmail.com"
                value={newUserForm.email}
                onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                className="pl-12 rounded-2xl border-gray-100 h-14 focus:ring-purple-500/10 focus:border-purple-200 font-medium text-base shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Phone Number</Label>
            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-purple-500 transition-colors" size={18} />
              <Input
                placeholder="+91 98765 43210"
                value={newUserForm.phone_number}
                onChange={(e) => setNewUserForm({ ...newUserForm, phone_number: e.target.value })}
                className="pl-12 rounded-2xl border-gray-100 h-14 focus:ring-purple-500/10 focus:border-purple-200 font-medium text-base shadow-sm"
              />
            </div>
          </div>

          {/* Treatment Stage - Full Width */}
          <div className="space-y-2 md:col-span-2">
            <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Current Treatment Stage</Label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 z-10 pointer-events-none">
                <Activity size={18} />
              </div>
              <Select
                value={newUserForm.treatment_stage}
                onValueChange={(val) => setNewUserForm({ ...newUserForm, treatment_stage: val })}
              >
                <SelectTrigger className="pl-12 h-14 rounded-2xl border-gray-100 focus:ring-purple-500/10 focus:border-purple-200 font-medium bg-white text-base shadow-sm text-left">
                  <SelectValue placeholder="Select patient stage" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-gray-50 shadow-xl overflow-hidden">
                  <SelectItem value="Initial Consultation" className="rounded-lg">Initial Consultation</SelectItem>
                  <SelectItem value="Bonding / First Trays" className="rounded-lg">Bonding / First Trays</SelectItem>
                  <SelectItem value="Alignment Phase" className="rounded-lg">Alignment Phase</SelectItem>
                  <SelectItem value="Bite Correction" className="rounded-lg">Bite Correction</SelectItem>
                  <SelectItem value="Finishing & Detailing" className="rounded-lg">Finishing & Detailing</SelectItem>
                  <SelectItem value="Debonding & Retention" className="rounded-lg">Debonding & Retention</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="bg-purple-50/50 rounded-2xl p-5 border border-purple-100/50 flex gap-4">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm">
            {isEditMode ? <CheckCircle size={18} className="text-purple-600" /> : <AlertTriangle size={18} className="text-purple-600" />}
          </div>
          <div className="space-y-1">
            <p className="text-sm text-purple-900 font-bold">{isEditMode ? "Profile Update Ready" : "Registration Information"}</p>
            <p className="text-xs text-purple-600 font-medium leading-relaxed">
              {isEditMode 
                ? "Changes to patient records are logged and reflected across the clinician and patient portals immediately."
                : "A secure digital profile and unique Patient ID will be generated. The patient will be able to access their records once the portal is active."}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button 
            variant="outline" 
            onClick={() => navigate("/dashboard/admin/patients")} 
            className="rounded-2xl font-bold h-14 px-8 border-gray-200 text-gray-500 hover:bg-gray-50 flex-grow sm:flex-none"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl h-14 px-12 grow shadow-lg shadow-purple-200"
            disabled={isActionLoading}
          >
            {isActionLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : (isEditMode ? <CheckCircle className="mr-2" size={20} /> : <UserPlus className="mr-2" size={20} />)}
            {isEditMode ? "Update Patient Record" : "Register Patient Account"}
          </Button>
        </div>
      </div>
    </div>
  )
}
