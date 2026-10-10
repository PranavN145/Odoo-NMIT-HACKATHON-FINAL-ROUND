"use client";

import { useState } from "react";
import Link from "next/link";
import { User, ChevronDown, Menu, X, ShieldCheck } from "lucide-react";

export default function Header({ onToggleMobileMenu, isMobileMenuOpen }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="bg-white h-[68px] border-b border-[#D8E4E8] px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Organization Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="p-1.5 rounded-lg text-[#13293D] hover:bg-[#E8F1F2] md:hidden focus:outline-hidden"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <Link href="/" className="flex items-center gap-3 group">
          {/* Logo icon */}
          <div className="w-9 h-9 rounded-lg bg-[#EAF5FB] border border-[#BDE0FE] flex items-center justify-center text-[#006494] shadow-xs group-hover:bg-[#1B98E0] group-hover:text-white transition-colors">
            <ShieldCheck className="w-5 h-5" />
          </div>
          {/* Organization Title */}
          <span className="font-bold text-[#13293D] text-base md:text-lg tracking-tight">
            Skyline Student Association
          </span>
        </Link>
      </div>

      {/* Right: Logged-in Manager Profile */}
      <div className="relative">
        <button
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-[#F5F8FA] transition-colors focus:outline-hidden"
        >
          <div className="w-9 h-9 rounded-full bg-[#13293D] text-white flex items-center justify-center font-medium shadow-xs">
            <User className="w-5 h-5" />
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-sm font-semibold text-[#13293D] leading-tight">
              Alex Mercer
            </span>
            <span className="text-xs text-[#5F7485] leading-tight">
              Manager
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 text-[#5F7485] transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
        </button>

        {/* Profile Dropdown Menu */}
        {isProfileOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-[#D8E4E8] rounded-xl shadow-lg py-1.5 z-50">
            <div className="px-4 py-2 border-b border-[#D8E4E8]">
              <p className="text-sm font-semibold text-[#13293D]">Alex Mercer</p>
              <p className="text-xs text-[#5F7485]">alex.mercer@skyline.edu</p>
            </div>
            <a
              href="#profile"
              className="block px-4 py-2 text-sm text-[#13293D] hover:bg-[#E8F1F2] transition-colors"
            >
              Manager Settings
            </a>
            <a
              href="#logout"
              className="block px-4 py-2 text-sm text-[#006494] hover:bg-[#E8F1F2] transition-colors"
            >
              Sign out
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
