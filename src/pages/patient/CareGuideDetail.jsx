import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { 
  ArrowLeft, 
  Clock, 
  Droplet, 
  UtensilsCrossed, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  Info,
  ExternalLink,
  ShieldCheck,
  Star,
  Activity,
  Zap,
  Coffee,
  Sun,
  Moon,
  Flame,
  Brush,
  LayoutGrid,
  HandHelping,
  Shield
} from "lucide-react"

const detailedContent = {
  "wear-time": {
    title: "Wear Time Tips",
    subtitle: "Maximize Results",
    icon: Clock,
    color: "green",
    description: "Consistent wear time is the #1 factor in finishing your treatment on schedule and achieving the perfect smile.",
    sections: [
      {
        title: "The 22-Hour Standard",
        type: "hero",
        value: "22+",
        label: "hours/day",
        description: "Teeth only move when trays are seated. Every minute counts.",
        colSpan: "md:col-span-1"
      },
      {
        title: "Daily Budget (2hr Max)",
        type: "budget_bars",
        items: [
          { label: "B-FAST", time: "30m", percentage: 25 },
          { label: "LUNCH", time: "30m", percentage: 25 },
          { label: "DINNER", time: "45m", percentage: 38 },
          { label: "SNACKS", time: "15m", percentage: 12 }
        ],
        colSpan: "md:col-span-1"
      },
      {
        title: "Why Progress Matters",
        type: "grid_refined",
        items: [
          { 
            title: "Bone Remodeling", 
            icon: Flame, 
            desc: "Constant pressure activates cellular movement process.",
            bgColor: "bg-emerald-50",
            iconColor: "text-emerald-500"
          },
          { 
            title: "Avoid Lagging", 
            icon: AlertTriangle, 
            desc: "Trays lose fit if worn <20 hours, causing pain.",
            bgColor: "bg-cyan-50",
            iconColor: "text-cyan-500"
          },
          { 
            title: "30% Faster Results", 
            icon: Zap, 
            desc: "Hit 22+ hours to finish treatment significantly earlier.",
            bgColor: "bg-teal-50",
            iconColor: "text-teal-500"
          }
        ],
        colSpan: "md:col-span-1"
      }
    ]
  },
  "cleaning": {
    title: "Cleaning Aligners",
    subtitle: "Premium Care",
    icon: Droplet,
    color: "blue",
    description: "Keeping trays crystal clear ensures they stay invisible, odorless, and healthy for your gums and enamel.",
    sections: [
      {
        title: "Daily Care Routine",
        type: "list_circles",
        items: [
          { 
            title: "RINSE IMMEDIATELY", 
            desc: "Always rinse with lukewarm water the second you remove them to prevent saliva from drying.",
            icon: Droplet,
            color: "blue"
          },
          { 
            title: "GENTLE BRUSHING", 
            desc: "Use a dedicated soft brush and clear, non-abrasive liquid soap twice every single day.",
            icon: Brush,
            color: "blue"
          },
          { 
            title: "DEEP SOAK", 
            desc: "Use specialized cleaning crystals or tablets for a 15-minute soak during breakfast or dinner.",
            icon: LayoutGrid,
            color: "blue"
          }
        ],
        colSpan: "md:col-span-1"
      },
      {
        title: "Expert Pro-Tips",
        type: "grid_refined",
        items: [
          { 
            title: "TEMPERATURE ALERT", 
            icon: AlertTriangle, 
            desc: "Never use hot or boiling water. Medical-grade plastic will warp instantly.",
            bgColor: "bg-green-50",
            iconColor: "text-green-600"
          },
          { 
            title: "THE GOLDEN RULE", 
            icon: Shield, 
            desc: "If they aren't in your mouth, they MUST be in your case. Never wrap in napkins.",
            bgColor: "bg-green-50",
            iconColor: "text-green-600"
          },
          { 
            title: "ANTI-BACTERIAL FINISH", 
            icon: HandHelping, 
            desc: "Always air-dry trays before placing them back in the case to prevent growth.",
            bgColor: "bg-green-50",
            iconColor: "text-green-600"
          }
        ],
        colSpan: "md:col-span-1"
      },
      {
        title: "The 'Never' List",
        type: "grid_refined",
        items: [
          { 
            title: "TOOTHPASTE", 
            icon: XCircle, 
            desc: "Abrasives create tiny scratches.",
            bgColor: "bg-red-50",
            iconColor: "text-red-500"
          },
          { 
            title: "MOUTHWASH", 
            icon: XCircle, 
            desc: "Can stain the clear plastic.",
            bgColor: "bg-red-50",
            iconColor: "text-red-500"
          },
          { 
            title: "BOILING WATER", 
            icon: XCircle, 
            desc: "Warping is permanent.",
            bgColor: "bg-red-50",
            iconColor: "text-red-500"
          }
        ],
        colSpan: "md:col-span-1"
      }
    ]
  },
  "food-drink": {
    title: "Food & Drink",
    subtitle: "Safety Protocol",
    icon: UtensilsCrossed,
    color: "amber",
    description: "Your trays are durable but can be damaged or stained. Remove them before consuming anything other than plain water.",
    sections: [
      {
        title: "Safe Choice (Trays Out)",
        type: "list_check",
        colSpan: "md:col-span-1",
        items: [
          "Soft fruits, Berries & Pasta",
          "Dairy, Eggs & Smoothies",
          "Cooked vegetables & Rice",
          "Soft breads & Mild grains",
          "Soups (Warm, not boiling hot)"
        ]
      },
      {
        title: "Avoid / High Caution",
        type: "list_x",
        colSpan: "md:col-span-1",
        items: [
          "Popcorn & Sticky candies",
          "Hard nuts, seeds & brittle",
          "Tough, chewy bagels or pizza",
          "Corn on the cob (Cut it off)",
          "Hard Ice (Never crunch or bite)"
        ]
      },
      {
        title: "The Beverage Matrix",
        type: "matrix",
        colSpan: "md:col-span-1",
        items: [
          { text: "Plain Water", status: "Ideal", color: "green", tip: "Trays Stay In" },
          { text: "Black Coffee", status: "Trays Out", color: "amber", tip: "Extreme Staining" },
          { text: "Soda / Energy", status: "Trays Out", color: "red", tip: "Sugar & Acid Trap" },
          { text: "Red Wine", status: "Trays Out", color: "red", tip: "Deep Discoloration" }
        ]
      }
    ]
  },
  "common-issues": {
    title: "Common Issues",
    subtitle: "Quick Solutions",
    icon: AlertTriangle,
    color: "red",
    description: "Treatment is a journey. Minor soreness or adjustments are normal and easily managed with these steps.",
    sections: [
      {
        title: "Initial Adjustment",
        type: "cards",
        colSpan: "md:col-span-1",
        items: [
          { title: "Tray Soreness", desc: "Swap to new trays right before bed. This allows the most intensive movement to happen while you sleep through the discomfort." },
          { title: "Speech / Lisps", desc: "A minor lisp is normal for 48 hours. Practice reading aloud or singing along to music to help your tongue adjust quickly." }
        ]
      },
      {
        title: "Physical Fixes",
        type: "cards",
        colSpan: "md:col-span-1",
        items: [
          { title: "Sharp Edges", desc: "If a tray edge feels sharp, you can use a clean, new emery board to gently smooth the specific spot for better lip comfort." },
          { title: "Poor Seating", desc: "If a tray feels bouncy or has gaps, use 'chewies' for 5 minutes each time you reinsert to fully seat the tray on your teeth." }
        ]
      },
      {
        title: "Urgent Care Protocol",
        type: "urgent_refined",
        colSpan: "md:col-span-1",
        items: [
          { t: "Severe Pain", d: "If pain is throbbing and doesn't respond to OTC medication." },
          { t: "Lost Trays", d: "Call us immediately. Do NOT move to the next tray early without advice." },
          { t: "Broken Attachment", d: "Don't panic. Items can wait until your next visit unless sharp." }
        ]
      }
    ]
  }
};

export default function CareGuideDetail() {
  const { tipId } = useParams();
  const data = detailedContent[tipId];
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(false);
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, [tipId]);

  if (!data) return null;

  const IconComponent = data.icon;
  const colorSchemes = {
    green: "from-emerald-600 to-teal-700 bg-emerald-50",
    blue: "from-blue-600 to-emerald-500 bg-blue-50",
    amber: "from-amber-600 to-orange-700 bg-amber-50",
    red: "from-red-600 to-rose-700 bg-red-50"
  };

  return (
    <div className="h-full flex flex-col space-y-3 animate-fade-up overflow-hidden">
      {/* Standard Header */}
      <div className="flex items-center gap-4 py-4 px-2 border-b border-gray-100/50 backdrop-blur-sm shrink-0 z-20 mb-2">
        <Link to="/dashboard/patient/care-guide" className="p-2.5 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-green-600 hover:bg-green-50 transition-all shadow-sm">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-grow">
          <h1 className="text-sm font-black text-gray-900 tracking-tight flex items-center gap-2 uppercase">
            Care Guide
            <div className="w-1 h-1 bg-gray-300 rounded-full" />
            <span className="text-green-600">{data.title}</span>
          </h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Detailed Treatment Instructions</p>
        </div>
      </div>

      <div className={`relative overflow-hidden rounded-3xl p-4 md:p-5 text-white shadow-xl bg-linear-to-br ${colorSchemes[data.color]} shrink-0`}>
        <div className="relative z-10 flex items-center justify-between gap-6">
          <div className="flex items-center gap-5 md:gap-6">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center shrink-0 border border-white/30 shadow-inner group transition-transform duration-500 hover:scale-110">
              <IconComponent size={24} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                 <h1 className="text-xl md:text-2xl font-black tracking-tighter">{data.title}</h1>
                 <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10 shadow-sm backdrop-blur-md">
                    {data.subtitle}
                 </span>
              </div>
              <p className="text-white/90 text-[11px] font-semibold max-w-2xl leading-relaxed tracking-tight">{data.description}</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-[60px] -mr-24 -mt-24 pointer-events-none" />
      </div>

      <div className="flex-1 grid grid-cols-3 gap-4 min-h-0 overflow-hidden py-1">
        {data.sections.map((section, idx) => (
          <div key={idx} className="flex flex-col h-full min-h-0 group">
            <div className="bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-lg hover:border-emerald-100 transition-all duration-300 h-full flex flex-col overflow-hidden">
              <div className="px-5 py-3.5 shrink-0 border-b border-gray-50 bg-gray-50/10">
                <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.25em] flex items-center gap-2.5">
                  <div className={`w-1 h-1 rounded-full ${data.color === 'green' ? 'bg-emerald-500' : data.color === 'blue' ? 'bg-blue-500' : 'bg-red-500'}`} />
                  {section.title}
                </h3>
              </div>
              
              <div className="flex-1 overflow-hidden p-4 min-h-0 flex flex-col">
                <div className="flex-1 flex flex-col pt-1">
                  {section.type === 'hero' && (
                    <div className="text-center space-y-4 py-2">
                      <div className="relative w-32 h-32 mx-auto group">
                         <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                            <circle 
                              cx="50" cy="50" r="42" 
                              fill="none" stroke="#F3F4F6" 
                              strokeWidth="8" 
                            />
                            <circle 
                              cx="50" cy="50" r="42" 
                              fill="none" stroke="#10B981" 
                              strokeWidth="10" 
                              strokeDasharray="264"
                              strokeDashoffset={isMounted ? "26" : "264"}
                              strokeLinecap="round"
                              className="transition-all duration-[1500ms] ease-out shadow-sm"
                            />
                         </svg>
                         <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-black text-slate-900 tracking-tighter leading-none mb-0.5">{section.value}</span>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{section.label}</span>
                         </div>
                      </div>
                      <p className="text-[11px] text-slate-400 font-bold px-2 leading-relaxed tracking-tight max-w-[180px] mx-auto">
                        {section.description}
                      </p>
                    </div>
                  )}

                  {section.type === 'budget_bars' && (
                    <div className="space-y-6 flex flex-col justify-around py-2">
                       {section.items.map((item, i) => (
                         <div key={i} className="space-y-2">
                           <div className="flex justify-between items-end px-1">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                              <span className="text-xs font-black text-emerald-600 tracking-tight">{item.time}</span>
                           </div>
                           <div className="h-1.5 bg-slate-50 border border-slate-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                                style={{ width: isMounted ? `${item.percentage}%` : "0%" }}
                              />
                           </div>
                         </div>
                       ))}
                    </div>
                  )}

                  {section.type === 'list_circles' && (
                    <div className="space-y-6 flex flex-col justify-around py-2">
                      {section.items.map((item, i) => (
                        <div key={i} className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                             <item.icon size={18} className="text-blue-600" />
                          </div>
                          <div>
                            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-tight mb-0.5">{item.title}</h4>
                            <p className="text-[10px] text-slate-500 font-bold leading-relaxed tracking-tight">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.type === 'grid_refined' && (
                    <div className="space-y-8 flex flex-col justify-around py-2">
                      {section.items.map((item, i) => (
                        <div key={i} className="flex items-start gap-4 group/item">
                          <div className={`w-10 h-10 ${item.bgColor} rounded-xl flex items-center justify-center shrink-0 border border-white shadow-sm transition-transform duration-500 group-hover/item:scale-110`}>
                            <item.icon size={18} className={item.iconColor} />
                          </div>
                          <div className="pt-0.5">
                            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-tight mb-1.5">{item.title}</h4>
                            <p className="text-[10px] text-slate-500 font-bold leading-relaxed tracking-tight">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.type === 'grid' && (
                    <div className="space-y-5">
                      {section.items.map((item, i) => (
                        <div key={i} className="flex items-start gap-4 group/item">
                          <div className="p-2 bg-slate-50 rounded-xl group-hover/item:bg-emerald-50 transition-colors">
                            <item.icon size={18} className="text-emerald-600" />
                          </div>
                          <div>
                            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-tight mb-0.5">{item.title}</h4>
                            <p className="text-[10px] text-slate-500 font-bold leading-relaxed">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.type === 'avoid_grid' && (
                    <div className="grid grid-cols-1 gap-4">
                      {section.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-rose-50/30 border border-rose-100/30 group hover:bg-white hover:shadow-md hover:border-rose-200 transition-all">
                          <item.icon size={24} className="text-rose-500 shrink-0" />
                          <div>
                             <span className="text-xs font-black text-rose-900 uppercase block mb-0.5">{item.label}</span>
                             <p className="text-[11px] text-rose-600/80 font-bold leading-tight">{item.reason}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.type === 'steps' && (
                    <div className="space-y-6">
                      {section.items.map((item, i) => (
                        <div key={i} className="flex gap-4 group">
                          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white text-xs font-black flex items-center justify-center shrink-0 shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                            {i + 1}
                          </div>
                          <div className="flex-1 border-b border-gray-50 pb-2 group-last:border-0">
                            <p className="text-xs font-black text-gray-900 uppercase tracking-tight mb-1">{item.t}</p>
                            <p className="text-[11px] text-gray-500 leading-snug font-bold">{item.d}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.type === 'list_check' && (
                    <div className="space-y-2">
                      {section.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-emerald-50/40 border border-emerald-100/50 hover:bg-white hover:shadow-md transition-all">
                          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                          <p className="text-[13px] text-slate-700 font-bold tracking-tight">{item}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.type === 'list_x' && (
                    <div className="space-y-2">
                      {section.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-rose-50/40 border border-rose-100/50 hover:bg-white hover:shadow-md transition-all">
                          <XCircle size={16} className="text-rose-500 shrink-0" />
                          <p className="text-[13px] text-rose-800 font-bold tracking-tight">{item}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.type === 'matrix' && (
                    <div className="space-y-2">
                      {section.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-lg hover:border-amber-100 transition-all">
                          <div className="flex flex-col">
                             <span className="font-black text-slate-900 text-[13px] tracking-tight">{item.text}</span>
                             <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{item.tip}</span>
                          </div>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider shadow-sm
                            ${item.color === 'green' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : ''}
                            ${item.color === 'amber' ? 'bg-amber-100 text-amber-700 border border-amber-200' : ''}
                            ${item.color === 'red' ? 'bg-rose-100 text-rose-700 border border-rose-200' : ''}
                          `}>
                            {item.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.type === 'budget' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        {section.items.map((item, i) => (
                          <div key={i} className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100/50 group hover:bg-amber-50 hover:border-amber-200 transition-all">
                            <div className="text-2xl font-black text-amber-600 leading-none mb-1 tracking-tighter">{item.time}</div>
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</div>
                            <div className="text-[9px] text-amber-800/60 font-bold uppercase whitespace-nowrap">{item.desc}</div>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between shadow-sm">
                         <span className="text-xs font-black text-amber-900 uppercase tracking-widest leading-none">{section.totalValue}</span>
                         <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full text-[10px] font-black text-amber-700 uppercase shadow-sm">
                            <Star size={12} className="fill-amber-400 text-amber-400"/> Strict Cap
                         </div>
                      </div>
                    </div>
                  )}

                  {section.type === 'cards' && (
                    <div className="space-y-4">
                      {section.items.map((item, i) => (
                        <div key={i} className="bg-gray-50/50 p-4 rounded-xl border border-gray-100/50 hover:bg-white hover:shadow-lg transition-all">
                          <h4 className="text-[13px] font-black text-slate-900 mb-1.5 uppercase tracking-tight flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                             {item.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 font-bold leading-relaxed tracking-tight">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.type === 'urgent_refined' && (
                    <div className="flex-1 flex flex-col justify-around py-1 px-1">
                      {section.items.map((item, i) => (
                        <div key={i} className="flex gap-3 group items-center">
                          <div className="p-2 bg-rose-50 rounded-xl text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-all shrink-0">
                             <AlertTriangle size={18} />
                          </div>
                          <div>
                            <p className="text-[11px] font-black text-rose-900 uppercase tracking-tight mb-0.5">{item.t}</p>
                            <p className="text-[10px] text-rose-700/80 font-bold leading-tight">{item.d}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {section.footerBtn && (
                  <div className="mt-6 pt-2">
                    <button className="w-full bg-slate-900 text-white font-black py-3 rounded-2xl text-[9px] uppercase tracking-widest transition-all">
                      {section.footerBtn}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
