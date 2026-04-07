import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { ArrowLeft, HelpCircle, Phone, Mail, BookOpen, ChevronRight, Loader2, Info } from "lucide-react"
import { motion } from "framer-motion"
import { getSupportInfo } from "@/api"

export default function HelpCenter() {
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
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 animate-fade-in relative overflow-hidden">
      {/* Decorative Watermark */}
      <div className="absolute top-20 -right-20 opacity-[0.02] pointer-events-none transform rotate-12">
        <HelpCircle size={500} className="text-emerald-900" />
      </div>

      {/* Standard Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 px-2 py-4 flex items-center justify-between z-50 mb-4">
        <div className="flex items-center gap-4">
          <Link 
            to="/dashboard" 
            className="p-2.5 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all shadow-sm"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="flex-grow">
            <h1 className="text-sm font-black text-gray-900 tracking-tight flex items-center gap-2 uppercase leading-none">
              Help Center
              <HelpCircle size={14} className="text-emerald-500" />
            </h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mt-0.5">Find answers and contact support</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto mt-4 px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-6 px-4">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4 shadow-xl shadow-emerald-500/10 ring-4 ring-emerald-50/50"
          >
            <HelpCircle size={24} className="text-emerald-600" />
          </motion.div>
          
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl font-black text-gray-900 tracking-tighter mb-1"
          >
            How can we help?
          </motion.h2>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[11px] font-black text-gray-400 max-w-sm leading-tight uppercase tracking-tight"
          >
            For treatment queries, please contact our support team.
          </motion.p>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {/* Clinician Contact */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white border border-gray-100 rounded-[2rem] p-4 flex flex-col items-center text-center shadow-lg shadow-slate-200/40 group hover:scale-[1.01] transition-all duration-300"
          >
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-emerald-600 mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm border border-slate-100">
               <Phone size={18} />
            </div>
            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Main Emergency Line</p>
            <h3 className="text-sm font-black text-gray-900 tracking-tight">
                {supportInfo?.admin_phone || "+91 7299053348"}
            </h3>
          </motion.div>

          {/* Clinician Email */}
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white border border-gray-100 rounded-[2rem] p-4 flex flex-col items-center text-center shadow-lg shadow-slate-200/40 group hover:scale-[1.01] transition-all duration-300"
          >
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-emerald-600 mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm border border-slate-100">
               <Mail size={18} />
            </div>
            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">General/Patient Queries</p>
            <h3 className="text-sm font-black text-gray-900 tracking-tight">
                {supportInfo?.support_email || "prime@saveetha.com"}
            </h3>
          </motion.div>
        </div>

        {/* Knowledge Base Wide Card */}
        <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-slate-100/50 border border-slate-200/60 rounded-3xl p-4 flex items-center justify-between group hover:bg-white hover:border-emerald-200/50 transition-all duration-500 shadow-sm"
        >
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm border border-slate-100 group-hover:scale-105 transition-transform duration-500">
                    <BookOpen size={18} />
                </div>
                <div>
                    <h3 className="text-sm font-black text-gray-900 tracking-tight mb-0.5">Browse Knowledge Base</h3>
                    <p className="text-[9px] font-black text-gray-400 leading-none uppercase tracking-tight">
                        Quick answers about aligner care and cleaning tips.
                    </p>
                </div>
            </div>
        </motion.div>

        {/* Footer info */}
        <div className="mt-8 flex flex-col items-center">
            <div className="bg-slate-100 px-3 py-1 rounded-full mb-3">
                <p className="text-[9px] font-black text-gray-400 tracking-tight uppercase">
                    OrthoGuide Version {supportInfo?.app_version || "2.5.0"}
                </p>
            </div>
            <div className="flex items-center gap-3">
               <Link to="#" className="text-[8px] font-black text-gray-400 hover:text-emerald-600 transition-colors tracking-widest uppercase">Privacy Policy</Link>
               <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
               <Link to="#" className="text-[8px] font-black text-gray-400 hover:text-emerald-600 transition-colors tracking-widest uppercase">Terms of Service</Link>
            </div>
        </div>
      </main>
    </div>
  )
}
