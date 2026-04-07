import { BookOpen, Info, Clock, Droplet, Utensils, AlertTriangle, Loader2, ChevronRight, Sparkles, CheckCircle2, ArrowLeft } from "lucide-react"
import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { getCareGuide } from "../../api"

const iconMap = {
  clock: Clock,
  droplet: Droplet,
  utensils: Utensils,
  alert: AlertTriangle
}

const tipSlugs = {
  "Wear Time Tips": "wear-time",
  "Cleaning Your Aligners": "cleaning",
  "Food & Drink Guide": "food-drink",
  "Common Issues": "common-issues"
}

export default function CareGuide({ user }) {
  const [treatmentStage, setTreatmentStage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCareGuide = async () => {
      if (!user?.user_id && !user?.id) {
        setLoading(false);
        return;
      }
      try {
        const res = await getCareGuide(user.user_id || user.id);
        setTreatmentStage(res.data.treatment_stage || "");
      } catch (err) {
        console.error("Failed to fetch care guide:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCareGuide();
  }, [user]);

  if (!user) return null;

  const staticTips = [
    {
      icon: "droplet",
      title: "Cleaning Your Aligners",
      description: "Daily care tips for crystal-clear aligners",
      color: "blue"
    },
    {
      icon: "utensils",
      title: "Food & Drink Guide",
      description: "What to eat and avoid during treatment",
      color: "yellow"
    },
    {
      icon: "clock",
      title: "Wear Time Tips",
      description: "Maximize results with 22+ hours daily",
      color: "green"
    },
    {
      icon: "alert",
      title: "Common Issues",
      description: "Solutions for discomfort and problems",
      color: "red"
    }
  ];

  return (
    <div className="flex flex-col space-y-6 animate-fade-up">
      {/* Standard Header */}
      <div className="flex items-center gap-4 py-4 px-2 border-b border-gray-100/50 backdrop-blur-sm shrink-0 z-20 mb-4">
        <Link to="/dashboard" className="p-2.5 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-green-600 hover:bg-green-50 transition-all shadow-sm">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-grow">
          <h1 className="text-sm font-black text-gray-900 tracking-tight flex items-center gap-2 uppercase leading-none">
            Care Guide
            <Sparkles size={14} className="text-green-500" />
            {treatmentStage && (
              <span className="ml-1 inline-flex items-center gap-1 bg-green-50 text-green-700 px-2.5 py-0.5 rounded-full text-[9px] font-bold border border-green-100 uppercase tracking-widest whitespace-nowrap">
                STAGE: {treatmentStage}
              </span>
            )}
          </h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mt-0.5">Everything you need for a successful treatment</p>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex justify-center items-center">
          <Loader2 className="animate-spin text-green-600 h-8 w-8" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
          {staticTips.map((tip, idx) => {
            const IconComponent = iconMap[tip.icon] || Info;
            return (
              <GuideCard
                key={idx}
                icon={<IconComponent size={22} />}
                title={tip.title}
                description={tip.description}
                color={tip.color}
                onClick={() => navigate(`/dashboard/patient/care-guide/${tipSlugs[tip.title]}`)}
              />
            );
          })}
        </div>
      )}

      {/* Quick Tips Section from App */}
      <div className="bg-white border border-gray-100 rounded-[1.5rem] p-6 shadow-sm">
         <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-4">Quick Tips</h3>
         <div className="space-y-4">
            <QuickTip text="Remove aligners before eating or drinking (except water)" />
            <QuickTip text="Brush teeth before reinserting aligners" />
            <QuickTip text="Clean aligners with lukewarm water only" />
            <QuickTip text="Store in case when not wearing" />
         </div>
      </div>

      <div className="bg-linear-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group shrink-0">
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
            <Info size={24} />
          </div>
          <div>
            <h3 className="text-sm font-black flex items-center gap-2 mb-1 uppercase tracking-widest text-green-400">
               Weekly Pro Tip
            </h3>
            <p className="text-white/90 text-sm leading-relaxed font-bold">
              "When switching to a new tray, do it right before going to bed to help minimize initial discomfort."
            </p>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-500" />
      </div>
    </div>
  )
}

function QuickTip({ text }) {
  return (
    <div className="flex items-center gap-3">
       <div className="w-5 h-5 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
          <CheckCircle2 size={12} />
       </div>
       <p className="text-sm font-black text-gray-700">{text}</p>
    </div>
  )
}

function GuideCard({ icon, title, description, color, onClick }) {
  const colorStyles = {
    blue: { bg: "bg-blue-50", text: "text-blue-500", hoverBg: "hover:border-blue-200", iconBg: "group-hover:bg-blue-500" },
    yellow: { bg: "bg-amber-50", text: "text-amber-600", hoverBg: "hover:border-amber-200", iconBg: "group-hover:bg-amber-500" },
    green: { bg: "bg-green-50", text: "text-green-600", hoverBg: "hover:border-green-200", iconBg: "group-hover:bg-green-600" },
    red: { bg: "bg-red-50", text: "text-red-500", hoverBg: "hover:border-red-200", iconBg: "group-hover:bg-red-500" }
  };
  
  const currentStyle = colorStyles[color] || colorStyles.green;

  return (
    <div 
      onClick={onClick}
      className={`bg-white border border-gray-100 rounded-3xl p-6 shadow-sm ${currentStyle.hoverBg} hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer active:scale-[0.98] flex flex-col gap-6 h-full`}
    >
      <div className="flex items-start justify-between">
        <div className={`${currentStyle.text} ${currentStyle.bg} w-14 h-14 rounded-2xl flex items-center justify-center ${currentStyle.iconBg} group-hover:text-white transition-all shadow-sm`}>
          {icon}
        </div>
        <div className={`w-8 h-8 rounded-xl ${currentStyle.bg} ${currentStyle.text} flex items-center justify-center opacity-40 group-hover:opacity-100 transition-all`}>
          <ChevronRight size={16} />
        </div>
      </div>
      <div>
        <h3 className="text-xl font-black text-gray-900 mb-1 tracking-tight">{title}</h3>
        <p className="text-[13px] text-gray-400 font-bold leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
