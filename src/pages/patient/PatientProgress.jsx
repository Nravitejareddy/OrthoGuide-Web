import React from "react"
import { Loader2, Check, ArrowLeft, Activity, Info, MoreHorizontal, Flag, Sparkles } from "lucide-react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { usePatientData } from "../../hooks/usePatientData"

function WavyProgress({ percent }) {
  return (
    <div className="relative w-full h-[70px] bg-gray-50 rounded-full border border-gray-100/50 shadow-inner group">
      {/* Clipped Progress Area (The Green Block) */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 2, ease: "circOut" }}
            className="absolute inset-y-0 left-0"
        >
            <div className="absolute bottom-0 left-0 right-0 h-[45%] bg-emerald-600 shadow-lg"></div>
            
            {/* Primary Wave Top */}
            <div className="absolute bottom-[45%] left-0 w-full h-8 -mb-0.5 overflow-hidden">
                <svg className="w-[200%] h-full fill-emerald-600 animate-wave" viewBox="0 0 1000 100" preserveAspectRatio="none">
                   <path d="M0,50 C150,100 350,0 500,50 C650,100 850,0 1000,50 L1000,100 L0,100 Z" />
                </svg>
            </div>

            {/* Decorative Wave Layer (lighter) */}
            <div className="absolute inset-0 -z-10 opacity-30">
               <div className="absolute bottom-0 left-0 right-0 h-[50%] bg-emerald-400"></div>
               <div className="absolute bottom-[50%] left-0 w-full h-10 -mb-0.5 overflow-hidden">
                 <svg className="w-[200%] h-full fill-emerald-400 animate-wave-slow" viewBox="0 0 1000 100" preserveAspectRatio="none">
                    <path d="M0,50 C150,100 350,0 500,50 C650,100 850,0 1000,50 L1000,100 L0,100 Z" />
                 </svg>
               </div>
            </div>
        </motion.div>
      </div>

      {/* Floating Indicator (Outside overflow-hidden to prevent clipping) */}
      <motion.div 
        initial={{ left: "0%" }}
        animate={{ left: `${percent}%` }}
        transition={{ duration: 2, ease: "circOut" }}
        className="absolute bottom-[48%] mb-1 z-30 -translate-x-1/2"
      >
        <div className="flex flex-col items-center">
            <div className="w-3.5 h-3.5 rounded-full bg-white border-[3px] border-emerald-900 shadow-xl"></div>
            <div className="mt-1 bg-emerald-900 text-white text-[6px] font-black px-2 py-1 rounded-md uppercase tracking-[0.15em] whitespace-nowrap shadow-xl">
                Current Stage
            </div>
        </div>
      </motion.div>
    </div>
  )
}

function JourneyStep({ step, isLast }) {
  const isCompleted = step.status === "Completed";
  const isActive = step.active;
  const isUpcoming = !isCompleted && !isActive;

  return (
    <div className={`flex flex-col items-center relative ${isLast ? '' : 'flex-1'}`}>
      {/* Connecting Line */}
      {!isLast && (
        <div className={`absolute top-5 left-[50%] right-[-50%] h-[2px] z-0 ${isCompleted ? 'bg-emerald-700' : 'bg-gray-100'}`}></div>
      )}

      {/* Step Icon */}
      <div className={`w-11 h-11 rounded-full flex items-center justify-center relative z-10 transition-all duration-500 shadow-md ${
        isCompleted ? "bg-emerald-700 text-white" :
        isActive ? "bg-white border-[6px] border-emerald-700 text-emerald-900 ring-8 ring-emerald-50 scale-110" :
        "bg-gray-200 text-gray-500"
      }`}>
        {isCompleted ? <Check size={20} strokeWidth={3} /> :
         isActive ? <div className="w-2.5 h-2.5 bg-emerald-900 rounded-full"></div> :
         step.phase.toLowerCase().includes('finishing') ? <MoreHorizontal size={18} /> :
         step.phase.toLowerCase().includes('retention') || isLast ? <Flag size={18} /> :
         <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>}
      </div>

      {/* Label */}
      <div className="mt-4 text-center px-2">
        <h4 className={`text-[10px] font-black tracking-tight leading-tight max-w-[80px] h-8 flex items-center justify-center ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
          {step.phase}
        </h4>
        <p className={`text-[8px] font-black uppercase tracking-widest mt-1 px-2 py-0.5 rounded-sm inline-block ${
          isCompleted ? "text-emerald-600" :
          isActive ? "bg-emerald-100 text-emerald-700" :
          "text-gray-400"
        }`}>
          {isCompleted ? "Completed" : isActive ? "Current Stage" : "Upcoming"}
        </p>
      </div>
    </div>
  )
}

export default function PatientProgress({ user }) {
  const { dashboardData, loading, error } = usePatientData(user?.user_id || user?.id);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center space-y-4">
        <p className="text-gray-500 font-medium text-lg italic">Clinical data sync pending...</p>
        <button className="text-emerald-600 hover:underline font-black uppercase text-xs tracking-widest" onClick={() => window.location.reload()}>Retry Link</button>
      </div>
    );
  }

  const timeline = dashboardData.timeline || [];
  const percent = dashboardData.progress_percent || 0;

  return (
    <div className="min-h-screen bg-white animate-fade-up">
      {/* Standard Header */}
      <div className="flex items-center gap-4 py-4 px-2 border-b border-gray-100/50 backdrop-blur-sm shrink-0 z-40 mb-4 sticky top-0 bg-white/80">
        <Link to="/dashboard" className="p-2.5 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-green-600 hover:bg-green-50 transition-all shadow-sm">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-grow">
          <h1 className="text-sm font-black text-gray-900 tracking-tight flex items-center gap-2 uppercase">
            Treatment Journey
            <Sparkles size={14} className="text-green-500" />
          </h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Real-time Clinical Progress</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6 space-y-8">
        
        {/* Compact Percentage Section */}
        <div className="text-center space-y-1">
            <motion.h1 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-7xl font-black text-gray-900 leading-none tracking-tighter"
            >
                {percent}%
            </motion.h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                Overall Treatment Progress
            </p>
            <div className="pt-2">
              <p className="text-[13px] font-black text-gray-900 uppercase tracking-tight">
                {dashboardData.treatment_phase || "Active Treatment"} 
                <span className="text-emerald-500 ml-1.5 font-bold tracking-normal opacity-80">(Stage {dashboardData.current_stage_number || 1} of {dashboardData.total_stages || 6})</span>
              </p>
            </div>
        </div>

        {/* Scaled Wavy Progress Section */}
        <section className="w-full">
            <WavyProgress percent={percent} />
        </section>

        {/* Horizontal Milestone Section */}
        <section className="space-y-12 pb-12">
            <h3 className="text-center text-sm font-black text-gray-900 tracking-tight">Journey Milestones</h3>
            
            <div className="flex justify-between items-start w-full overflow-x-auto pb-4 scrollbar-hide px-2">
                {timeline.length > 0 ? timeline.map((step, idx) => (
                    <JourneyStep 
                        key={idx} 
                        step={step} 
                        isLast={idx === timeline.length - 1} 
                    />
                )) : (
                    <div className="w-full text-center py-8 text-gray-400 font-bold italic opacity-40">Journey mapping...</div>
                )}
            </div>
        </section>

        {/* Footer Data Status */}
        <footer className="pt-8 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                Clinical Data Sync: Active
            </div>
            <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">
                {dashboardData.estimated_completion ? `Est. Completion: ${dashboardData.estimated_completion}` : "Projecting Timeline..."}
            </div>
        </footer>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes wave {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-wave {
          animation: wave 10s linear infinite;
        }
        .animate-wave-slow {
          animation: wave 15s linear infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  )
}
