import { Bell, CheckCircle, AlertTriangle, Info, Clock, Loader2, Check, ArrowLeft } from "lucide-react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getSystemAlerts, getPatientNotifications, resolveSystemAlert, markNotificationRead, markAllNotificationsRead } from "@/api"
import { toast } from "sonner"

export default function NotificationsPage({ user, role }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  // ... (keeping implementation logic same)

  if (loading) {
    return <div className="min-h-[400px] flex items-center justify-center"><Loader2 className="animate-spin text-green-600" size={32} /></div>
  }

  const unreadCount = items.filter(n => role === "admin" ? n.status !== "Resolved" : !n.is_read).length

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/50 backdrop-blur-md p-4 rounded-2xl border border-white/50 shadow-sm">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="p-2 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-green-600 hover:bg-green-50 transition-all shadow-sm">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-lg font-black text-gray-900 tracking-tight leading-none uppercase">
              {role === "admin" ? "System Alerts" : "Notifications"}
            </h1>
            <p className="text-gray-400 text-[10px] font-bold mt-1 uppercase tracking-tight">
              {role === "admin" 
                ? `${unreadCount} pending system issues.` 
                : `${unreadCount} unread system alerts.`}
            </p>
          </div>
        </div>
        
        {unreadCount > 0 && (
           <button 
            onClick={handleMarkAllRead}
            className="text-[10px] font-black text-green-600 hover:text-green-800 uppercase tracking-widest px-4 py-2 bg-green-50 rounded-full border border-green-100 transition-all active:scale-95"
           >
             Mark all read
           </button>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-100">
          {items.length === 0 ? (
            <div className="p-20 text-center text-gray-400 font-medium uppercase tracking-widest text-xs">No {role === "admin" ? "alerts" : "notifications"} found.</div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                onClick={() => role !== "admin" && !item.is_read && handleAction(item.id)}
                className={`p-6 flex items-start gap-4 transition-colors cursor-pointer ${
                  (role === "admin" ? item.status !== "Resolved" : !item.is_read) ? "bg-green-50/20" : "hover:bg-gray-50 opacity-70"
                }`}
              >
                <div className="mt-1">
                  {getIcon(item.type)}
                </div>
                <div className="flex-grow">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className={`text-sm ${(role === "admin" ? item.status !== "Resolved" : !item.is_read) ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}>
                        {role === "admin" ? `Issue: ${item.type}` : item.type?.toUpperCase()}
                      </h3>
                      {role === "admin" && (
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5 uppercase tracking-tighter">
                          Patient ID: {item.patient_id}
                        </p>
                      )}
                    </div>
                    {role === "admin" && item.status !== "Resolved" && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleAction(item.id); }}
                        className="text-[10px] bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-2 rounded-md uppercase transition-colors flex items-center gap-1"
                      >
                        <Check size={10} /> Resolve
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{item.message}</p>
                  <div className="flex items-center gap-1.5 mt-3">
                    <Clock size={12} className="text-gray-300" />
                    <span className="text-[11px] text-gray-400">{item.created_at || item.time}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
