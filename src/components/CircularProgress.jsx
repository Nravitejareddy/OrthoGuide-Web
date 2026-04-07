import React, { useState, useEffect } from "react"

export default function CircularProgress({ 
  percent, 
  stage, 
  subtitle, 
  size = 70, 
  strokeWidth = 12, 
  hideLabels = false,
  variant = "hero" 
}) {
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const radius = size;
  const stroke = strokeWidth;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  
  useEffect(() => {
    setAnimatedPercent(0); // Reset to 0 first
    const timer = setTimeout(() => {
      setAnimatedPercent(percent);
    }, 50);
    return () => clearTimeout(timer);
  }, [percent]);

  const strokeDashoffset = circumference - (animatedPercent / 100) * circumference;

  const containerStyles = variant === "hero" 
    ? "p-8 bg-white rounded-[2rem] shadow-sm border border-gray-100" 
    : "p-10 bg-white rounded-[3rem] shadow-xl shadow-slate-100 border border-gray-50";

  return (
    <div className={`flex items-center gap-8 ${containerStyles}`}>
      <div className="relative shrink-0">
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
          <circle
            stroke="#f1f5f9"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke="#10b981"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="transition-all duration-[1500ms] ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-gray-900 tracking-tighter leading-none">{animatedPercent}%</span>
            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1">Complete</span>
        </div>
      </div>

      <div className="flex flex-col">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
           {stage || "Current Stage"}
        </span>
        <h4 className="text-gray-900 text-2xl font-black tracking-tight mb-2 leading-tight">
           {subtitle || "Treatment Phase"}
        </h4>
        <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-[200px]">
           You're doing great! Keep following your alignment schedule to stay on track for your perfect smile.
        </p>
      </div>
    </div>
  );
}
