// components/Loader.jsx
import { Show } from '@clerk/react'
import React from 'react'

const Loader = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-slate-50 flex flex-col items-center justify-center overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-200/20 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Main Loader Container */}
      <div className="relative flex flex-col items-center gap-8">
        
        {/* Animated Building Logo */}
        <div className="relative">
          {/* Outer Ring Animation */}
          <div className="absolute inset-0 -m-4">
            <div className="w-28 h-28 rounded-full border-2 border-indigo-100 animate-[spin_4s_linear_infinite]" />
            <div className="absolute inset-0 w-28 h-28 rounded-full border-2 border-transparent border-t-indigo-400 border-r-violet-400 animate-[spin_2s_linear_infinite]" />
          </div>

          {/* Building Icon Container */}
          <div className="relative w-20 h-20 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl shadow-2xl shadow-indigo-500/30 flex items-center justify-center animate-[bounce_2s_ease-in-out_infinite]">
            {/* Building SVG */}
            <svg 
              viewBox="0 0 48 48" 
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Main Building Body */}
              <rect x="8" y="12" width="32" height="32" rx="2" className="animate-[pulse_3s_ease-in-out_infinite]" />
              
              {/* Roof */}
              <path d="M4 12L24 2L44 12" className="animate-[draw_2s_ease-out_forwards]" strokeDasharray="60" strokeDashoffset="60" />
              
              {/* Windows Row 1 */}
              <rect x="13" y="18" width="6" height="6" rx="1" className="animate-[fadeIn_0.5s_ease-out_0.5s_both]" />
              <rect x="29" y="18" width="6" height="6" rx="1" className="animate-[fadeIn_0.5s_ease-out_0.7s_both]" />
              
              {/* Windows Row 2 */}
              <rect x="13" y="28" width="6" height="6" rx="1" className="animate-[fadeIn_0.5s_ease-out_0.9s_both]" />
              <rect x="29" y="28" width="6" height="6" rx="1" className="animate-[fadeIn_0.5s_ease-out_1.1s_both]" />
              
              {/* Door */}
              <rect x="19" y="34" width="10" height="10" rx="1" className="animate-[fadeIn_0.5s_ease-out_1.3s_both]" />
              
              {/* Door Handle */}
              <circle cx="26" cy="39" r="1" fill="currentColor" className="animate-[fadeIn_0.3s_ease-out_1.5s_both]" />
            </svg>

            {/* Shine Effect */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" />
            </div>
          </div>

          {/* Orbiting Dots */}
          <div className="absolute inset-0 -m-8 animate-[spin_3s_linear_infinite]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-indigo-400 rounded-full" />
          </div>
          <div className="absolute inset-0 -m-10 animate-[spin_4s_linear_infinite_reverse]">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-violet-400 rounded-full" />
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center space-y-3">
          {/* CHMS Title */}
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
                CHMS
              </span>
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-slate-400 tracking-[0.3em] uppercase">
              Central Hostel Management System
            </p>
          </div>

          {/* Loading Indicator */}
          <div className="flex items-center justify-center gap-1.5 pt-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 animate-[loadingBounce_1.4s_ease-in-out_infinite]"
                style={{ animationDelay: `${i * 0.16}s` }}
              />
            ))}
          </div>
          <Show when={"signed-in"}>
          <p className="text-xs text-slate-400 font-medium animate-pulse">
            Loading your portal...
          </p>
          </Show>
        </div>
      </div>

      {/* Bottom Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100">
        <div className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 animate-[loadingBar_2s_ease-in-out_infinite]" />
      </div>

      {/* Add custom animations via style tag */}
      <style>{`
        @keyframes draw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes loadingBounce {
          0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes loadingBar {
          0% { width: 0%; left: 0; }
          50% { width: 100%; left: 0; }
          100% { width: 0%; left: 100%; }
        }
        @keyframes animate-gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: animate-gradient 3s ease infinite;
        }
      `}</style>
    </div>
  )
}

export default Loader