// components/navbar/Navbar.jsx
import React, { useState } from 'react'
import { Menu, X, Building2, Shield } from 'lucide-react'

const Navbar = ({ onMenuClick, isOpen }) => {
  return (
    <nav className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-xl hover:bg-slate-100 active:scale-95 transition-all duration-200"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-slate-700" />
          ) : (
            <Menu className="w-6 h-6 text-slate-700" />
          )}
        </button>

        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500/20 rounded-lg blur-sm" />
            <div className="relative bg-gradient-to-br from-indigo-600 to-violet-600 p-1.5 rounded-lg">
              <Building2 className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent leading-tight">
              CHMS
            </span>
            <span className="text-[10px] font-medium text-slate-400 leading-tight tracking-wider uppercase">
              KMH
            </span>
          </div>
        </div>

        <div className="w-10" /> {/* Spacer for centering */}
      </div>
    </nav>
  )
}

export default Navbar