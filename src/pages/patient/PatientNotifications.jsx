import { Bell, CheckCircle, AlertTriangle, Info, Loader2, Calendar, ArrowLeft } from "lucide-react"
import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { getPatientNotifications, markNotificationRead, markAllNotificationsRead } from "../../api"
import { toast } from "sonner"

export default function PatientNotifications({ user }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchNotifs = async () => {
    if (!user?.user_id && !user?.id) return;
    try {
      const res = await getPatientNotifications(user.user_id || user.id);
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, [user]);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      toast.error("Failed to mark notification as read");
    }
  };

  const handleMarkAllRead = async () => {
    const userId = user.user_id || user.id;
    if (!userId) return;
    try {
      await markAllNotificationsRead({ user_id: userId, role: "patient" });
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      toast.success("All notifications marked as read");
    } catch (err) {
      toast.error("Failed to mark all as read");
    }
  };

  if (!user) return null

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="space-y-6 animate-fade-up min-h-screen relative">
      {/* Premium Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-green-50/50 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-blue-50/30 blur-[100px]"></div>
      </div>

      {/* Standard Header */}
      <div className="flex items-center gap-4 py-4 px-2 border-b border-gray-100/50 backdrop-blur-sm shrink-0 z-20 mb-4">
        <Link to="/dashboard" className="p-2.5 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-green-600 hover:bg-green-50 transition-all shadow-sm">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-grow">
          <h1 className="text-sm font-black text-gray-900 tracking-tight flex items-center gap-2 uppercase">
            Notifications
            <Bell size={14} className="text-green-500" />
          </h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Stay updated with your care</p>
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={handleMarkAllRead}
            className="text-[10px] font-bold text-green-600 hover:text-green-800 uppercase tracking-widest px-4 py-2 bg-green-50 rounded-full border border-green-100 transition-all shadow-sm"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl shadow-slate-200/50 overflow-hidden divide-y divide-gray-100">
        {loading ? (
          <div className="p-20 flex justify-center">
             <Loader2 className="animate-spin text-green-600 h-8 w-8" />
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((n) => (
            <div 
              key={n.id} 
              onClick={() => {
                if (!n.is_read) handleMarkRead(n.id);
                if (n.type === 'appointment') {
                  navigate('/dashboard/patient/appointments');
                }
              }}
              className={`p-6 flex items-start gap-6 transition-all cursor-pointer ${!n.is_read ? "bg-green-50/40 hover:bg-green-100/40" : "hover:bg-gray-50/50 opacity-70"}`}
            >
              <div className={`p-3 rounded-2xl ${
                n.type === "report_issue" ? "bg-red-50 text-red-500 border border-red-100" : 
                n.type === "appointment" ? "bg-blue-50 text-blue-500 border border-blue-100" : 
                "bg-green-50 text-green-500 border border-green-100"
              }`}>
                {n.type === "report_issue" ? <AlertTriangle size={20} /> : n.type === "appointment" ? <Calendar size={20} /> : <CheckCircle size={20} />}
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-1">
                  <p className={`text-base ${!n.is_read ? "font-semibold text-gray-900" : "font-medium text-gray-500"}`}>
                    {n.type === 'appointment' ? "Appointment Updated" : 
                     n.type === 'report_issue' ? "Report Update" : 
                     n.type === 'oral_hygiene' ? "Oral Hygiene Reminder" : 
                     n.type === 'appliance_care' ? "Appliance Care Reminder" : 
                     n.type.replace('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </p>
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">{n.created_at}</span>
                </div>
                <p className={`text-sm leading-relaxed ${!n.is_read ? "font-medium text-gray-700" : "font-normal text-gray-500"}`}>{n.message}</p>
              </div>
              {!n.is_read && (
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full mt-4 ring-4 ring-green-100 animate-pulse shrink-0" />
              )}
            </div>
          ))
        ) : (
          <div className="p-20 text-center text-gray-400 font-semibold uppercase tracking-widest">
             No notifications yet
          </div>
        )}
      </div>
    </div>
  )
}
