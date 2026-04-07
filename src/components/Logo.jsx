import React from 'react';

export const Logo = ({ size = 32, className = "", hideText = false, textColor = "text-gray-900" }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        {/* Main Brand Surface - matching mobile splash color */}
        <div 
          className="absolute inset-0 bg-[#10B981] rounded-lg shadow-lg shadow-emerald-200/50" 
          style={{ borderRadius: size * 0.25 }}
        />
        
        <svg 
          viewBox="0 0 100 100" 
          className="absolute inset-0 w-full h-full" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Molar Tooth Body Shape - White as in mobile splash */}
          <path
            d="M50,18 C35,18 20,15 20,35 C20,55 25,90 38,90 C45,90 47,78 50,78 C53,78 55,90 62,90 C75,90 80,55 80,35 C80,15 65,18 50,18 Z"
            fill="white"
          />
          
          {/* Vertical Oval Eyes - Brand Green as in mobile project */}
          <ellipse cx="37" cy="45" rx="5" ry="9" fill="#10B981" />
          <ellipse cx="63" cy="45" rx="5" ry="9" fill="#10B981" />
          
          {/* Perfectly Curved Smile - Brand Green as in mobile project */}
          <path
            d="M38,62 C42,70 58,70 62,62"
            stroke="#10B981"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </svg>

        {/* Floating Chat Bubble - Integrated as in mobile splash layout (35% bottom, -6% right) */}
        <div className="absolute bottom-[35%] -right-[6%] w-[38%] h-[38%] hover:scale-110 transition-transform">
           <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M20,20 H80 C90,20 95,25 95,35 V65 C95,75 90,80 80,80 H45 L15,95 L30,80 H20 C10,80 5,75 5,65 V35 C5,25 10,20 20,20 Z"
                fill="url(#bubble-grad)"
              />
              <defs>
                <radialGradient id="bubble-grad" cx="50" cy="50" r="50" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#10B981" />
                  <stop offset="1" stopColor="#059669" />
                </radialGradient>
              </defs>
              <circle cx="35" cy="50" r="4" fill="white" />
              <circle cx="50" cy="50" r="4" fill="white" />
              <circle cx="65" cy="50" r="4" fill="white" />
           </svg>
        </div>

      </div>
      
      {!hideText && (
        <div className="flex flex-col -space-y-1">
          <span className={`font-black tracking-tight ${textColor}`} style={{ fontSize: size * 0.55 }}>
            Ortho{textColor === "text-white" ? "Guide" : <span className="text-green-600">Guide</span>}
          </span>
        </div>
      )}
    </div>
  )
}

export default Logo;
