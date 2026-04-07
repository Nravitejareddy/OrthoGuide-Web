import React from 'react';

export default function StatCard({ title, value, change, icon, color = "green" }) {
  const isPositive = change && change.startsWith("+");
  
  const colorMap = {
    green: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    red: "bg-red-50 text-red-600",
    indigo: "bg-indigo-50 text-indigo-600"
  };

  const selectedColor = colorMap[color] || colorMap.green;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-5 shadow-sm hover:shadow-md transition-all group relative overflow-hidden self-start">
      <div className={`w-12 h-12 rounded-xl ${selectedColor} flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform`}>
        {icon}
      </div>
      <div className="flex flex-col justify-center min-w-0">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 truncate">{title}</p>
        <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-gray-900 tracking-tight leading-none">{value}</span>
            {change && change !== "0%" && (
                <span className={`text-[10px] font-black tracking-tight px-1.5 py-0.5 rounded-md ${isPositive ? "text-emerald-600 bg-emerald-50" : "text-red-600 bg-red-50"}`}>
                    {change}
                </span>
            )}
        </div>
      </div>
    </div>
  );
}
