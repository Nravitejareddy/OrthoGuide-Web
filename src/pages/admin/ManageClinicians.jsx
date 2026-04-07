import { Search, Loader2, Download, UserPlus, Shield, Key, Trash2, UserCheck } from "lucide-react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { useAdminData } from "@/hooks/useDashboardData"
import { useState, useEffect } from "react"
import { adminDeleteUser, adminResetPassword, adminUpdateUser } from "@/api"
import { toast } from "sonner"
import UserCard from "@/components/admin/UserCard"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export default function ManageClinicians({ user }) {
  const navigate = useNavigate();
  const { users: usersList, loading, refresh } = useAdminData();
  const [searchTerm, setSearchTerm] = useState("");
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUpdatePasswordDialogOpen, setIsUpdatePasswordDialogOpen] = useState(false);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [isReactivateDialogOpen, setIsReactivateDialogOpen] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const search = searchParams.get('search');
    if (search) {
      setSearchTerm(search);
    }
  }, [searchParams]);

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-600" size={32} />
      </div>
    );
  }

  const clinicians = (Array.isArray(usersList) ? usersList : []).filter(u => 
    u.role?.toLowerCase() === 'clinician' && 
    (!searchTerm || 
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.id?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleResetPassword = async () => {
    setIsActionLoading(true);
    try {
      const res = await adminResetPassword({
        id: selectedUser.id,
        role: selectedUser.role
        // No new_password provided, backend defaults to ortho@last4
      });
      toast.success(res.data.message);
      setIsUpdatePasswordDialogOpen(false);
    } catch (err) {
      toast.error("Failed to reset password");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeactivateConfirm = async () => {
    setIsActionLoading(true);
    try {
      await adminDeleteUser(selectedUser.role, selectedUser.id);
      toast.success(`${selectedUser.name} deactivated successfully`);
      setIsDeactivateDialogOpen(false);
      refresh();
    } catch (err) {
      toast.error("Failed to deactivate account");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleReactivateConfirm = async () => {
    setIsActionLoading(true);
    try {
      await adminUpdateUser({
        id: selectedUser.id,
        role: selectedUser.role,
        status: "Active"
      });
      toast.success(`${selectedUser.name} reactivated successfully`);
      setIsReactivateDialogOpen(false);
      refresh();
    } catch (err) {
      toast.error("Failed to reactivate account");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleExport = () => {
    try {
      const headers = ["ID", "Name", "Email", "Role", "Status"];
      const rows = clinicians.map(u => [u.id, u.name, u.email, u.role_type || 'N/A', u.is_active ? 'ACTIVE' : 'INACTIVE']);
      const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `clinicians_list_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Clinician list exported successfully");
    } catch (err) {
      toast.error("Failed to export CSV");
    }
  };

  return (
    <div className="space-y-8 animate-fade-up max-w-7xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none">Manage Clinicians</h1>
          <p className="text-gray-400 font-medium text-sm mt-2">{clinicians.length} Staff Members registered</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleExport}
            className="flex-grow sm:flex-none bg-white border border-gray-100 hover:bg-gray-50 text-gray-700 font-bold px-6 py-3 rounded-2xl text-sm transition-all shadow-sm flex items-center gap-2 justify-center hover:-translate-y-0.5"
          >
            <Download size={18} /> Export
          </button>
          <button
            onClick={() => navigate("/dashboard/admin/clinicians/new")}
            className="flex-grow sm:flex-none bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-2xl text-sm transition-all shadow-lg flex items-center gap-2 justify-center hover:-translate-y-0.5"
          >
            <UserPlus size={18} /> + New
          </button>
        </div>
      </div>

      <div className="relative group mx-2">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-purple-500 transition-colors" size={20} />
        <input
          type="text"
          placeholder="Search by name, ID, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-200 transition-all shadow-sm placeholder:text-gray-300"
        />
      </div>

      <div className="flex flex-col gap-3 px-2">
        {clinicians.map((u) => (
          <UserCard 
            key={u.id}
            user={u}
            onEdit={(user) => navigate(`/dashboard/admin/clinicians/${user.id}`)}
            onResetPassword={(user) => { setSelectedUser(user); setIsUpdatePasswordDialogOpen(true); }}
            onDelete={(user) => { setSelectedUser(user); setIsDeactivateDialogOpen(true); }}
            onReactivate={(user) => { setSelectedUser(user); setIsReactivateDialogOpen(true); }}
          />
        ))}
        {clinicians.length === 0 && (
          <div className="py-20 text-center bg-white border border-dashed border-gray-100 rounded-3xl">
            <Shield size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400 font-bold tracking-tight">No clinicians found matching your search.</p>
          </div>
        )}
      </div>

      {/* Password Reset Dialog */}
      <Dialog open={isUpdatePasswordDialogOpen} onOpenChange={setIsUpdatePasswordDialogOpen}>
        <DialogContent className="sm:w-[400px] sm:h-[400px] bg-white rounded-[2rem] p-8 border-none shadow-2xl flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 border-2 border-white shadow-lg shrink-0">
            <Key size={32} />
          </div>
          <DialogHeader className="sm:text-center items-center mb-6">
            <DialogTitle className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Reset Password</DialogTitle>
            <DialogDescription className="text-gray-400 font-medium text-sm leading-relaxed max-w-[280px]">
              Are you sure you want to reset the password for <strong>{selectedUser?.name}</strong>? It will be set to ortho@ followed by the last 4 digits of their phone number.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="w-full flex-col sm:flex-col gap-2 mt-2">
            <Button 
                onClick={handleResetPassword} 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl py-6 text-sm shadow-lg shadow-purple-200"
                disabled={isActionLoading}
            >
              {isActionLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
              Reset Password
            </Button>
            <Button 
                variant="outline" 
                onClick={() => setIsUpdatePasswordDialogOpen(false)} 
                className="w-full border-gray-100 text-gray-400 font-bold rounded-xl py-6 text-sm hover:bg-gray-50"
            >
                Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deactivate AlertDialog */}
      <AlertDialog open={isDeactivateDialogOpen} onOpenChange={setIsDeactivateDialogOpen}>
        <AlertDialogContent className="sm:w-[400px] sm:h-[400px] bg-white rounded-[2rem] p-8 border-none shadow-2xl flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 border-2 border-white shadow-lg shrink-0">
              <Shield size={32} className="text-purple-500" />
          </div>
          <AlertDialogHeader className="sm:text-center items-center mb-6">
            <AlertDialogTitle className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Deactivate Account</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400 font-medium text-sm leading-relaxed max-w-[280px]">
                Are you sure you want to deactivate <strong>{selectedUser?.name}</strong>'s account?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="w-full flex-col sm:flex-col gap-2 mt-2">
            <AlertDialogAction
              onClick={(e) => { e.preventDefault(); handleDeactivateConfirm(); }}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl py-6 text-sm shadow-lg shadow-purple-200"
              disabled={isActionLoading}
            >
              {isActionLoading ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
              Deactivate
            </AlertDialogAction>
            <AlertDialogCancel 
                className="w-full border-gray-100 text-gray-400 font-bold rounded-xl py-6 text-sm hover:bg-gray-50 m-0"
            >
                Keep It
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reactivate AlertDialog */}
      <AlertDialog open={isReactivateDialogOpen} onOpenChange={setIsReactivateDialogOpen}>
        <AlertDialogContent className="sm:w-[400px] sm:h-[400px] bg-white rounded-[2rem] p-8 border-none shadow-2xl flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 border-2 border-white shadow-lg shrink-0">
              <UserCheck size={32} className="text-purple-500" />
          </div>
          <AlertDialogHeader className="sm:text-center items-center mb-6">
            <AlertDialogTitle className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Reactivate Account</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400 font-medium text-sm leading-relaxed max-w-[280px]">
                Are you sure you want to reactivate <strong>{selectedUser?.name}</strong>'s account?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="w-full flex-col sm:flex-col gap-2 mt-2">
            <AlertDialogAction
              onClick={(e) => { e.preventDefault(); handleReactivateConfirm(); }}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl py-6 text-sm shadow-lg shadow-purple-200"
              disabled={isActionLoading}
            >
              {isActionLoading ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
              Reactivate
            </AlertDialogAction>
            <AlertDialogCancel 
                className="w-full border-gray-100 text-gray-400 font-bold rounded-xl py-6 text-sm hover:bg-gray-50 m-0"
            >
                Keep It
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  )
}
