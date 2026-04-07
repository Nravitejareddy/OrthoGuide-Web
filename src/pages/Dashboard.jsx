import { useAuth } from "@/hooks/useAuth"
import { useNavigate, Link, NavLink, Outlet } from "react-router-dom"
import ErrorBoundary from "@/components/ErrorBoundary"
import { useState, useEffect } from "react"
import { LogOut, Bell, Home, User, Settings, HelpCircle, LayoutDashboard, Menu, X, Bot, Clock, BookOpen, AlertTriangle, Calendar, Users, BarChart3, Building, Shield, Stethoscope, TrendingUp } from "lucide-react"
import Logo from "../components/Logo"
import { getUnreadNotificationsCount } from "../api"

export default function Dashboard() {
  const { user, logout, loading } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (user) {
      const fetchUnread = async () => {
        try {
          const res = await getUnreadNotificationsCount(user.user_id || user.id, user.role || 'patient');
          setUnreadCount(res.data.count);
        } catch (err) {
          console.error("Error fetching unread count:", err);
        }
      };

      fetchUnread();
      
      // Listen for custom event from children
      window.addEventListener('notificationsUpdated', fetchUnread);
      
      const interval = setInterval(fetchUnread, 30000); 
      return () => {
        clearInterval(interval);
        window.removeEventListener('notificationsUpdated', fetchUnread);
      };
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-3 border-green-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const role = user.role || "patient"
  const roleLabel = role === "clinician" ? "Doctor" : role === "admin" ? "Admin" : "Patient"

  const baseLinks = [
    { to: "/dashboard", icon: <LayoutDashboard size={18} />, label: "Dashboard", end: true },
  ]

  const patientLinks = [
    { to: "/dashboard/patient/ai-assistant", icon: <Bot size={18} />, label: "AI Assistant" },
    { to: "/dashboard/patient/progress", icon: <TrendingUp size={18} />, label: "My Progress" },
    { to: "/dashboard/patient/appointments", icon: <Calendar size={18} />, label: "Appointments" },
    { to: "/dashboard/patient/profile", icon: <User size={18} />, label: "Profile" },
  ]

  const clinicianLinks = [
    { to: "/dashboard/clinician/patients", icon: <Users size={18} />, label: "Patients" },
    { to: "/dashboard/clinician/schedule", icon: <Calendar size={18} />, label: "Schedule" },
    { to: "/dashboard/clinician/profile", icon: <User size={18} />, label: "Profile" },
  ]

  const adminLinks = [
    { to: "/dashboard/admin/clinicians", icon: <Stethoscope size={18} />, label: "Clinicians" },
    { to: "/dashboard/admin/patients", icon: <Users size={18} />, label: "Patients" },
    { to: "/dashboard/admin/notifications", icon: <Bell size={18} />, label: "Notifications" },
    { to: "/dashboard/admin/profile", icon: <User size={18} />, label: "Profile" },
  ]

  const genericLinks = [
    { to: "/dashboard/profile", icon: <User size={18} />, label: "Profile" },
    { to: "/dashboard/help", icon: <HelpCircle size={18} />, label: "Help" },
  ]

  const sidebarLinks = role === "patient" 
    ? [...baseLinks, ...patientLinks] 
    : role === "clinician"
    ? [...baseLinks, ...clinicianLinks]
    : role === "admin"
    ? [...baseLinks, ...adminLinks]
    : [...baseLinks, ...genericLinks]

  // Role-based theme colors
  const themeColors = {
    patient: {
      bg: "bg-green-500",
      bgLight: "bg-green-500/10",
      text: "text-green-500",
      hover: "hover:bg-white/5",
      sidebarBg: "bg-[#0B0E14]",
      notifPath: "/dashboard/patient/notifications"
    },
    clinician: {
      bg: "bg-blue-600",
      bgLight: "bg-blue-600/10",
      text: "text-blue-600",
      hover: "hover:bg-white/5",
      sidebarBg: "bg-[#0B0E14]",
      notifPath: "/dashboard/notifications"
    },
    admin: {
      bg: "bg-purple-600",
      bgLight: "bg-purple-600/10",
      text: "text-purple-600",
      hover: "hover:bg-white/5",
      sidebarBg: "bg-[#0B0E14]",
      notifPath: "/dashboard/admin/notifications"
    }
  }

  const theme = themeColors[role] || themeColors.patient

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 shrink-0 ${theme.sidebarBg} border-r border-white/5 transform transition-transform lg:translate-x-0 lg:static ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-20 flex items-center px-6 mb-4 group cursor-pointer">
            <Logo size={36} textColor="text-white" />
            <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-gray-400">
              <X size={18} />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex-grow px-4 space-y-1 overflow-y-auto">
            {sidebarLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `
                  w-full flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? `${theme.bg} text-white font-bold shadow-xl shadow-green-500/20` 
                    : `text-gray-500 font-bold ${theme.hover} hover:text-gray-300`
                  }
                `}
              >
                <div className="shrink-0 transition-transform group-hover:scale-110">
                  {link.icon}
                </div>
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Bottom */}
          <div className="px-4 pb-8 space-y-4 mt-auto">
             <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Support</p>
                <Link to={role === "patient" ? "/dashboard/patient/help-center" : role === "clinician" ? "/dashboard/clinician/help-center" : "/dashboard/help"} className="flex items-center gap-3 text-xs font-bold text-gray-300 hover:text-white transition-colors">
                   <HelpCircle size={16} />
                   Help Center
                </Link>
             </div>
            <button
              onClick={() => { logout(); navigate("/"); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-red-400/80 hover:bg-red-500/10 rounded-xl transition-all group"
            >
              <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" />
      )}

      {/* Main Content */}
      <div className="flex-grow flex flex-col min-h-screen max-h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 flex items-center justify-between px-6 lg:px-10 shrink-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-600 p-1">
              <Menu size={22} />
            </button>
          </div>
          
          <div className="flex items-center gap-6">
            {(role === "patient" || role === "admin") && (
              <NavLink
                to={theme.notifPath}
                className={({ isActive }) => `p-2.5 rounded-2xl transition-all relative ${
                  isActive ? `bg-white shadow-sm ${theme.text}` : "text-gray-400 hover:text-gray-600 bg-gray-100/50"
                }`}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[8px] font-bold flex items-center justify-center rounded-full ring-2 ring-white">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </NavLink>
            )}
            
            <div className="flex items-center gap-4">
              <Link 
                to={role === "patient" ? "/dashboard/patient/profile" : role === "clinician" ? "/dashboard/clinician/profile" : role === "admin" ? "/dashboard/admin/profile" : "/dashboard/profile"}
                className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shadow-sm transition-transform hover:scale-105 active:scale-95 border-2 border-white overflow-hidden`}
              >
                 <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}&backgroundColor=b6e3f4`} 
                    alt="avatar"
                    className="w-full h-full object-cover"
                 />
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-grow px-6 lg:px-10 pb-10 overflow-y-auto overflow-x-hidden">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
        
      </div>
    </div>
  )
}
