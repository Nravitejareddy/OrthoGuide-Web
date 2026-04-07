import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone,
  Loader2,
  Calendar,
  Info,
  CheckCircle2,
  Check,
  ShieldAlert,
  UserPlus,
  BellRing,
  LockIcon
} from "lucide-react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { 
  getAdminReactivationRequests,
  markAllNotificationsRead,
  markAdminReactivationRead 
} from "@/api"
import { toast } from "sonner"

export default function AdminNotifications({ user }) {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getAdminReactivationRequests()
      setRequests(res.data || [])
    } catch (err) {
      console.error("Failed to fetch notifications", err)
      toast.error("Error loading notifications")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleMarkRead = async (id) => {
    try {
      await markAdminReactivationRead(id)
      setRequests(prev => prev.map(r => r.id === id ? { ...r, is_read: true } : r))
      window.dispatchEvent(new CustomEvent('notificationsUpdated'))
    } catch (err) {
      console.error(err)
      toast.error("Failed to mark as read")
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead({ user_id: user.id || user.user_id, role: "admin" })
      setRequests(prev => prev.map(r => ({ ...r, is_read: true })))
      window.dispatchEvent(new CustomEvent('notificationsUpdated'))
      toast.success("All notifications marked as read")
    } catch (err) {
      console.error(err)
      toast.error("Failed to mark all as read")
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-600" size={32} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white -mx-6 lg:-mx-10">
      {/* Top Header - Match Patient Notification Style */}
      <div className="border-b border-gray-100 px-8 py-5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate(-1)}
              className="text-gray-900 font-bold"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-gray-900">System Activity</h1>
          </div>
          <button 
            onClick={handleMarkAllRead}
            className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Mark All Read
          </button>
        </div>
      </div>

      {/* Main Content Area - Linear List */}
      <div className="max-w-4xl mx-auto pb-20">
        {requests.length === 0 ? (
          <div className="p-20 text-center">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No Pending Requests</p>
          </div>
        ) : (
          requests.map((request) => (
            <div 
              key={request.id} 
              onClick={() => {
                if (!request.is_read) handleMarkRead(request.id);
                const targetPath = request.user_role?.toLowerCase() === 'clinician' ? '/dashboard/admin/clinicians' : '/dashboard/admin/patients';
                navigate(`${targetPath}?search=${request.patient_id}`);
              }}
              className={`flex items-center gap-5 px-8 py-5 border-b border-gray-50 hover:bg-gray-50/50 transition-colors group cursor-pointer ${!request.is_read ? 'bg-blue-50/40 relative' : 'opacity-80'}`}
            >
              {/* Left Icon with Premium Styling */}
              <div className="shrink-0">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${!request.is_read ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 ring-4 ring-blue-50' : 'bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500'}`}>
                  {request.user_role?.toLowerCase() === 'clinician' ? <ShieldAlert size={22} /> : <UserPlus size={22} />}
                </div>
              </div>

              {/* Information Column */}
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                  <h3 className="text-base font-bold text-gray-900 truncate">
                    Reactivation Request
                  </h3>
                  <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap">
                    {request.created_at ? request.created_at.split('T')[1] ? request.created_at : request.created_at.split('T')[0] : 'Today'}
                  </span>
                </div>
                
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5 mb-1.5 flex items-center gap-2">
                   {request.user_role?.toUpperCase()} • ID: {request.patient_id}
                </p>

                <p className="text-sm text-gray-500 leading-snug truncate pr-4">
                  <span className="font-bold text-gray-700">{request.patient_name}</span> is requesting reactivation: "{request.reason}"
                </p>
              </div>

              {/* Unread Indicator */}
              {!request.is_read && (
                <div className="flex flex-col items-end gap-2">
                  <div className="w-2.5 h-2.5 bg-blue-600 rounded-full shrink-0 shadow-sm animate-pulse"></div>
                  <span className="text-[9px] font-black text-blue-600 uppercase tracking-tighter">New</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function AlertsList({ alerts, onAction, processingId }) {
  if (alerts.length === 0) {
    return <EmptyState message="No system alerts or reported issues found." icon={<Bell size={40} />} />
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {alerts.map((alert) => (
        <div key={alert.id} className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-indigo-100 transition-all group">
            <div className="flex items-start gap-5">
              <div className={`mt-1 p-3 rounded-2xl shadow-sm ${
                alert.severity >= 4 ? "bg-red-50 text-red-600 border border-red-100" : "bg-indigo-50 text-indigo-600 border border-indigo-100"
              }`}>
                {alert.severity >= 4 ? <AlertTriangle size={24} /> : <Info size={24} />}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-black text-gray-900 uppercase italic tracking-tight">{alert.issue_type || "Subject Issue"}</h3>
                  {alert.severity && (
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                        alert.severity >= 4 ? "bg-red-100 text-red-700" : "bg-indigo-100 text-indigo-700"
                    }`}>
                        Severity {alert.severity}/5
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 font-bold mt-1 uppercase tracking-tight flex items-center gap-2">
                  From: <span className="text-indigo-600">{alert.patient_id}</span> • <span className="text-gray-400">{new Date(alert.created_at).toLocaleString()}</span>
                </p>
                <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 max-w-2xl">
                    <p className="text-sm text-gray-600 font-medium leading-relaxed">{alert.description || alert.message}</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => onAction(alert.id)}
              disabled={processingId === alert.id}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 px-8 rounded-2xl text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-indigo-500/20 active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap min-w-[140px]"
            >
              {processingId === alert.id ? <Loader2 className="animate-spin" size={14} /> : <Check size={14} />}
              Resolve
            </button>
        </div>
      ))}
    </div>
  )
}

function EmptyState({ message, icon }) {
  return (
    <div className="bg-white/50 backdrop-blur-md border border-dashed border-gray-200 rounded-[3rem] p-20 flex flex-col items-center text-center">
      <div className="w-20 h-20 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center mb-6">
        {icon}
      </div>
      <p className="text-gray-400 font-black uppercase tracking-widest text-xs italic">{message}</p>
    </div>
  )
}
