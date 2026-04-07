import { Building, Settings2, Globe, FileText, ToggleLeft, Activity, Bell, Loader2, User, Shield, Server } from "lucide-react"
import { useState, useEffect } from "react"
import { useAdminSettings } from "@/hooks/useDashboardData"
import { updateSystemSettings, getAnalyticsOverview } from "@/api"
import StatCard from "@/components/admin/StatCard"

export default function ClinicSettings({ user }) {
  const { settings, loading, fetchSettings } = useAdminSettings()
  
  const [formData, setFormData] = useState({
    clinic_name: "OrthoGuide Network",
    support_email: "support@orthoguide.com",
    admin_phone: "+1 234 567 8900",
    enable_public_registration: false,
    ai_diagnostic_assistant: true,
    sms_reminders: true,
    maintenance_mode: false
  })
  
  
  const [saving, setSaving] = useState(false)
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await getAnalyticsOverview()
        setAnalytics(res.data)
      } catch (err) {
        console.error("Failed to load analytics", err)
      }
    }
    fetchAnalytics()
  }, [])

  useEffect(() => {
    if (settings) {
      setFormData({
        clinic_name: settings.clinic_name || "",
        support_email: settings.support_email || "",
        admin_phone: settings.admin_phone || "",
        enable_public_registration: settings.enable_public_registration || false,
        ai_diagnostic_assistant: settings.ai_diagnostic_assistant || false,
        sms_reminders: settings.sms_reminders || false,
        maintenance_mode: settings.maintenance_mode || false
      })
    }
  }, [settings])

  if (!user) return null

  if (loading) {
    return <div className="min-h-[400px] flex items-center justify-center"><Loader2 className="animate-spin text-gray-800" size={32} /></div>
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateSystemSettings(formData)
      await fetchSettings()
      alert("Settings saved successfully!")
    } catch (err) {
      console.error(err)
      alert("Failed to save settings.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 leading-none">Global Configurations</h1>
          <p className="text-gray-500 text-sm mt-2">Manage settings, integrations, and platform limits.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className={`bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors shadow-sm ${saving ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Quick Stats Headers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Total Users" 
          value={analytics?.total_users?.toString() || "..."} 
          icon={<User size={20} />} 
          active
        />
        <StatCard 
          title="Active Patients" 
          value={analytics?.total_patients?.toString() || "..."} 
          icon={<Shield size={20} />} 
        />
        <StatCard 
          title="Clinicians" 
          value={analytics?.total_clinicians?.toString() || "..."} 
          icon={<Activity size={20} />} 
        />
      
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Navigation / Categories */}
        <div className="lg:col-span-1 space-y-2">
          <SettingsTab icon={<Building size={16}/>} label="Clinic Information" active />
          <SettingsTab icon={<Activity size={16}/>} label="System Limits" />
          <SettingsTab icon={<Globe size={16}/>} label="API & Integrations" />
          <SettingsTab icon={<FileText size={16}/>} label="Legal & Compliance" />
          <SettingsTab icon={<Bell size={16}/>} label="System Notifications" />
        </div>

        {/* Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3 mb-5">Primary Business Details</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputGroup 
                  label="Platform Name" 
                  value={formData.clinic_name} 
                  onChange={(v) => setFormData({...formData, clinic_name: v})} 
                />
                <InputGroup 
                  label="Support Contact" 
                  value={formData.support_email} 
                  onChange={(v) => setFormData({...formData, support_email: v})} 
                />
              </div>
              <InputGroup 
                label="Admin Phone" 
                value={formData.admin_phone} 
                onChange={(v) => setFormData({...formData, admin_phone: v})} 
              />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3 mb-5 flex items-center justify-between">
              Feature Toggles
              <span className="text-[10px] uppercase tracking-widest text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Global</span>
            </h3>
            <div className="space-y-4">
              <ToggleRow 
                label="Enable Public Registration" 
                desc="Allow patients to create accounts before clinic assignment." 
                active={formData.enable_public_registration} 
                onChange={(v) => setFormData({...formData, enable_public_registration: v})}
              />
              <ToggleRow 
                label="AI Diagnostic Assistant" 
                desc="Beta feature: Allow doctors to run auto-analysis on uploaded scans." 
                active={formData.ai_diagnostic_assistant} 
                onChange={(v) => setFormData({...formData, ai_diagnostic_assistant: v})}
              />
              <ToggleRow 
                label="SMS Reminders" 
                desc="Send automated text messages for upcoming appointments." 
                active={formData.sms_reminders} 
                onChange={(v) => setFormData({...formData, sms_reminders: v})}
              />
              <ToggleRow 
                label="Maintenance Mode" 
                desc="Take the entire platform offline for updates." 
                active={formData.maintenance_mode} 
                onChange={(v) => setFormData({...formData, maintenance_mode: v})}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

function SettingsTab({ icon, label, active }) {
  return (
    <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors text-left ${
      active ? "bg-green-50 text-green-700 border border-green-100" : "bg-white text-gray-700 border border-gray-100 hover:bg-gray-50"
    }`}>
      {icon} {label}
    </button>
  )
}

function InputGroup({ label, value, type="text", onChange }) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">{label}</label>
      {type === "textarea" ? (
        <textarea 
          value={value} 
          onChange={(e) => onChange && onChange(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all rows-2" 
        />
      ) : (
        <input 
          type="text" 
          value={value} 
          onChange={(e) => onChange && onChange(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all" 
        />
      )}
    </div>
  )
}

function ToggleRow({ label, desc, active, onChange }) {
  return (
    <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
      <div>
        <p className="text-sm font-bold text-gray-900">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
      </div>
      <button 
        onClick={() => onChange && onChange(!active)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none group mt-1`}
      >
        <div className={`h-4 w-8 rounded-full shadow-inner transition-colors ${active ? "bg-green-500" : "bg-gray-300"}`} />
        <div className={`absolute left-0 h-5 w-5 rounded-full border border-gray-200 bg-white shadow-sm transition-transform ${active ? "translate-x-4 border-green-500" : "translate-x-0"}`} />
      </button>
    </div>
  )
}
