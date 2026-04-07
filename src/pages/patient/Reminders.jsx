import { Bell, Clock, Calendar, CheckCircle, Shield, Loader2, Save, Activity, Info, AlertTriangle, ArrowLeft } from "lucide-react"
import { useState, useEffect } from "react"
import { getNotificationSettings, updateNotificationSettings, getPatientDashboardData, getPatientNotifications, markNotificationRead } from "../../api"
import { toast } from "sonner"
import { Link } from "react-router-dom"

export default function Reminders({ user }) {
  const [settings, setSettings] = useState(null)
  const [dashboardData, setDashboardData] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchData = async () => {
    const patientId = user?.user_id || user?.id;
    if (!patientId) return;
    try {
      const [settingsRes, dashboardRes, notifRes] = await Promise.all([
        getNotificationSettings(patientId),
        getPatientDashboardData(patientId),
        getPatientNotifications(patientId)
      ]);
      setSettings(settingsRes.data);
      setDashboardData(dashboardRes.data);
      setNotifications(notifRes.data.slice(0, 5)); // Show top 5
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleToggle = async (key) => {
    if (!settings) return; // Guard against null settings during loading or error
    const patientId = user?.user_id || user?.id;
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    setSaving(true);
    try {
      await updateNotificationSettings({
        patient_id: patientId,
        ...newSettings
      });
      toast.success("Preferences updated");
    } catch (err) {
      toast.error("Failed to update preferences");
      setSettings(settings);
    } finally {
      setSaving(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return null

  return (
    <div className="h-full flex flex-col space-y-6 animate-fade-up overflow-hidden">
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
            Stay Notified
            <Bell size={14} className="text-green-500" />
          </h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Manage your treatment reminders and alerts</p>
        </div>
        {saving && (
          <div className="flex items-center gap-2 text-green-600 font-semibold text-[10px] uppercase tracking-widest bg-green-50 px-4 py-2 rounded-full border border-green-100 shadow-sm animate-pulse">
            <Save size={12} /> Saving...
          </div>
        )}
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-0">
        {/* Settings Column */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-md shadow-xl shadow-slate-200/50 p-8">
          <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-8 flex items-center gap-2">
            <Shield size={16} className="text-green-600" /> Reminder Preferences
          </h3>

          {loading ? (
            <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-green-600" /></div>
          ) : (
            <div className="space-y-4">
              <ToggleRow
                label="Oral Hygiene"
                description="Daily reminders to brush and floss your teeth."
                active={settings?.oral_hygiene}
                onToggle={() => handleToggle('oral_hygiene')}
              />
              <ToggleRow
                label="Appliance Care"
                description="Prompts to clean and check your aligners."
                active={settings?.appliance_care}
                onToggle={() => handleToggle('appliance_care')}
              />
              <ToggleRow
                label="Appointments"
                description="Notifications for upcoming treatment sessions."
                active={settings?.appointment}
                onToggle={() => handleToggle('appointment')}
              />
            </div>
          )}
        </div>

        {/* Alerts & Updates Column */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-md shadow-xl shadow-slate-200/50 p-8 flex flex-col min-h-0">
          <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-8 flex items-center gap-2">
            <Bell size={16} className="text-green-600" /> Recent Alerts & Updates
          </h3>

          <div className="space-y-4 flex-1 overflow-y-auto pr-2 scrollbar-thin">
            {loading ? (
              <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-green-600" /></div>
            ) : notifications.length > 0 ? (
              notifications.map((n) => (
                <div 
                  key={n.id}
                  onClick={() => !n.is_read && handleMarkRead(n.id)}
                  className={`flex items-start gap-4 p-5 rounded-md border transition-all cursor-pointer ${
                    !n.is_read ? 'bg-green-50/50 border-green-100 hover:bg-green-100/50' : 'bg-gray-50/30 border-gray-100 hover:bg-gray-50/60'
                  }`}
                >
                  <div className={`p-2.5 rounded-md ${
                    n.type === 'report_issue' ? 'bg-red-50 text-red-500' :
                    n.type === 'appointment' ? 'bg-blue-50 text-blue-500' :
                    'bg-green-50 text-green-500'
                  }`}>
                    {n.type === 'report_issue' ? <AlertTriangle size={18} /> : 
                     n.type === 'appointment' ? <Calendar size={18} /> : <Info size={18} />}
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className={`text-sm leading-relaxed ${!n.is_read ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
                      {n.message}
                    </p>
                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
                      <Clock size={10} /> {new Date(n.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {!n.is_read && <div className="w-2 h-2 bg-green-500 rounded-full mt-2 shrink-0 animate-pulse" />}
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-400">
                <p className="text-sm font-medium">No recent alerts</p>
                <p className="text-xs mt-1">Your doctor will notify you of any updates.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ToggleRow({ label, description, active, onToggle }) {
  return (
    <div className="flex items-center justify-between p-5 bg-gray-50/50 border border-gray-100 rounded-md hover:bg-white transition-all shadow-sm">
      <div className="flex-grow pr-4">
        <p className="text-sm font-semibold text-gray-900">{label}</p>
        <p className="text-xs text-gray-500 font-medium mt-1">{description}</p>
      </div>
      <button
        onClick={onToggle}
        className={`w-14 h-8 rounded-full relative transition-all duration-300 ${active ? 'bg-green-600' : 'bg-gray-200'}`}
      >
        <div className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full shadow-md transition-all duration-300 ${active ? 'translate-x-6' : 'translate-x-0'}`} />
      </button>
    </div>
  )
}
