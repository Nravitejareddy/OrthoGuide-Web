import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { 
  ArrowLeft, 
  HelpCircle, 
  Phone, 
  Mail, 
  BookOpen, 
  ChevronRight, 
  Loader2, 
  Server, 
  Globe, 
  Shield, 
  Activity, 
  Database,
  Cpu,
  Monitor
} from "lucide-react"
import { motion } from "framer-motion"
import { getSupportInfo } from "@/api"

export default function HelpPage({ user, role }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [supportInfo, setSupportInfo] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getSupportInfo()
        setSupportInfo(res.data)
      } catch (err) {
        console.error("Error fetching support info:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    )
  }

  const technicalFaqs = [
    { question: "How is system-wide data handled?", answer: "All patient and clinician data is encrypted at rest and in transit using industry-standard protocols." },
    { question: "What should I do if the API connection fails?", answer: "Check the 'Server Environment' card below. Ensure the server IP matches your current network subnet and is reachable." },
    { question: "How do I perform a global password reset?", answer: "Admins can reset any user's password from the Manage Patients or Manage Clinicians screens. Users will then be prompted to change it upon login." },
    { question: "Can I export system-wide analytics data?", answer: "Yes, use the 'Generate CSV Dump' feature on your main Command Center dashboard for a full platform report." }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 animate-fade-in relative overflow-hidden">
      {/* Decorative Watermark */}
      <div className="absolute top-20 -right-20 opacity-[0.03] pointer-events-none transform rotate-12">
        <HelpCircle size={500} className="text-purple-900" />
      </div>

      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between z-50">
        <div className="flex items-center gap-4">
          <Link 
            to="/dashboard" 
            className="p-2.5 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-all shadow-sm"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-sm font-black text-gray-900 tracking-tight leading-none uppercase">SYSTEM HEALTH & SUPPORT</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mt-1">IT & INFRASTRUCTURE RESOURCES</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto mt-6 px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-8 px-4">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-purple-500/10 ring-4 ring-purple-50/50"
          >
            <Shield size={28} className="text-purple-600" />
          </motion.div>
          
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-2xl font-black text-gray-900 tracking-tighter mb-2"
          >
            Need technical assistance?
          </motion.h2>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[11px] font-black text-gray-400 max-w-sm leading-tight uppercase tracking-tight"
          >
            For platform infrastructure, API, or data-related queries, please contact the IT support help desk.
          </motion.p>
        </div>

        {/* Support Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white border border-gray-100 rounded-[2rem] p-6 flex flex-col items-center text-center shadow-lg shadow-slate-200/40 group hover:scale-[1.01] transition-all duration-300"
          >
            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-purple-600 mb-4 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 shadow-sm border border-slate-100">
               <Phone size={22} />
            </div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">IT Help Desk</p>
            <h3 className="text-base font-black text-gray-900 tracking-tight">
                {supportInfo?.admin_phone || "+91 98765 43210"}
            </h3>
          </motion.div>

          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white border border-gray-100 rounded-[2rem] p-6 flex flex-col items-center text-center shadow-lg shadow-slate-200/40 group hover:scale-[1.01] transition-all duration-300"
          >
            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-purple-600 mb-4 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 shadow-sm border border-slate-100">
               <Mail size={22} />
            </div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Technical Support Email</p>
            <h3 className="text-base font-black text-gray-900 tracking-tight">
                {supportInfo?.support_email || "support@orthoguide.com"}
            </h3>
          </motion.div>
        </div>

        {/* Server Environment Card */}
        <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-purple-600 rounded-[2rem] p-6 text-white shadow-xl shadow-purple-500/20 mb-8 overflow-hidden relative"
        >
            <div className="absolute top-0 right-0 p-8 opacity-10">
                <Server size={120} />
            </div>
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                        <Activity size={20} className="text-white" />
                    </div>
                    <h3 className="text-lg font-black tracking-tight leading-none">Server Environment</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 group hover:bg-white/20 transition-all">
                        <div className="flex items-center gap-2 mb-1">
                            <Globe size={12} className="text-purple-200" />
                            <p className="text-[8px] font-black uppercase tracking-widest text-purple-200">System Gateway IP</p>
                        </div>
                        <p className="text-sm font-bold font-mono">10.219.71.194</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 group hover:bg-white/20 transition-all">
                        <div className="flex items-center gap-2 mb-1">
                            <Activity size={12} className="text-purple-200" />
                            <p className="text-[8px] font-black uppercase tracking-widest text-purple-200">Uptime Status</p>
                        </div>
                        <p className="text-sm font-bold">99.9% Operational</p>
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-purple-100/70 border-t border-white/10 pt-4">
                    <Cpu size={12} />
                    <span>CENTRALIZED DATA NODE: ASIA-SOUTH-1</span>
                </div>
            </div>
        </motion.div>


        {/* Footer info */}
        <div className="mt-12 flex flex-col items-center">
            <div className="bg-slate-100 px-4 py-1.5 rounded-full mb-4">
                <p className="text-[9px] font-black text-gray-400 tracking-tight uppercase">
                    OrthoGuide Admin Infrastructure v{supportInfo?.app_version || "2.5.0"}
                </p>
            </div>
            <div className="flex items-center gap-4">
               <Link to="#" className="text-[10px] font-black text-gray-400 hover:text-purple-600 transition-colors tracking-widest uppercase">Privacy Compliance</Link>
               <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
               <Link to="#" className="text-[10px] font-black text-gray-400 hover:text-purple-600 transition-colors tracking-widest uppercase">Platform Specs</Link>
            </div>
        </div>
      </main>
    </div>
  )
}
