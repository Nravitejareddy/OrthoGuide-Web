import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, User, Mail, Phone, Shield, UserPlus, Key, Loader2, Search, CheckCircle } from "lucide-react"
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

export default function AddClinician({ user }) {
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
    role: "clinician",
    role_type: "Assistant"
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchUserData = async () => {
        try {
          const response = await adminGetUser("clinician", id);
          const data = response.data;
          setNewUserForm({
            id: data.id,
            name: data.name,
            email: data.email,
            phone_number: data.phone_number || "",
            role: "clinician",
            role_type: data.role_type || "Assistant"
          });
        } catch (err) {
          toast.error("Failed to load clinician details");
          navigate("/dashboard/admin/clinicians");
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
        toast.success("Clinician account updated successfully");
      } else {
        await adminCreateUser({ ...newUserForm, phone_number: cleanPhone, creator_name: user?.name || "System Admin" });
        toast.success("Clinician account created successfully");
      }
      navigate("/dashboard/admin/clinicians");
    } catch (err) {
      toast.error(err.response?.data?.error || `Failed to ${isEditMode ? 'update' : 'create'} clinician`);
    } finally {
      setIsActionLoading(false);
    }
  };

  if (!user) return null;

  if (isPageLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-purple-600" size={40} />
        <p className="text-gray-500 font-medium">Loading clinician details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-up pb-20">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate("/dashboard/admin/clinicians")}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            {isEditMode ? "Update Clinician Account" : "Create Clinician Account"}
          </h1>
          <p className="text-gray-400 text-sm font-medium">
            {isEditMode ? `Modifying details for ${newUserForm.name}` : "Register a new clinician to your team."}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-purple-500/5 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
          {/* Clinician ID & Full Name */}
          <div className="space-y-2">
            <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Clinician ID</Label>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-purple-500 transition-colors" size={18} />
              <Input
                placeholder="e.g. DOC192210667"
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
                placeholder="Dr. Jane Doe"
                value={newUserForm.name}
                onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                className="pl-12 rounded-2xl border-gray-100 h-14 focus:ring-purple-500/10 focus:border-purple-200 font-medium text-base shadow-sm"
              />
            </div>
          </div>

          {/* Email & Phone Number */}
          <div className="space-y-2">
            <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Email Address</Label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-purple-500 transition-colors" size={18} />
              <Input
                type="email"
                placeholder="dr.jane@gmail.com"
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

          {/* Role - Full Width */}
          <div className="space-y-2 md:col-span-2">
            <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Clinical Specialization</Label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 z-10 pointer-events-none">
                <Shield size={18} />
              </div>
              <Select
                value={newUserForm.role_type}
                onValueChange={(val) => setNewUserForm({ ...newUserForm, role_type: val })}
              >
                <SelectTrigger className="pl-12 h-14 rounded-2xl border-gray-100 focus:ring-purple-500/10 focus:border-purple-200 font-medium bg-white text-base shadow-sm text-left">
                  <SelectValue placeholder="Select clinical role" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-gray-50 shadow-xl">
                  <SelectItem value="Orthodontist" className="rounded-lg">Orthodontist</SelectItem>
                  <SelectItem value="Dentist" className="rounded-lg">Dentist</SelectItem>
                  <SelectItem value="Assistant" className="rounded-lg">Assistant</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="bg-purple-50/50 rounded-2xl p-5 border border-purple-100/50 flex gap-4">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm">
            {isEditMode ? <CheckCircle size={18} className="text-purple-600" /> : <Shield size={18} className="text-purple-600" />}
          </div>
          <div className="space-y-1">
            <p className="text-sm text-purple-900 font-bold">{isEditMode ? "Account Ready for Update" : "Administrative Note"}</p>
            <p className="text-xs text-purple-600 font-medium leading-relaxed">
              {isEditMode 
                ? "Review the information carefully before saving. Updates will take effect immediately upon saving."
                : "Additional profile details like qualifications and experience can be updated by the clinician upon their first login."}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button 
            variant="outline" 
            onClick={() => navigate("/dashboard/admin/clinicians")} 
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
            {isEditMode ? "Update Clinician Account" : "Create Clinician Account"}
          </Button>
        </div>
      </div>
    </div>
  )
}
