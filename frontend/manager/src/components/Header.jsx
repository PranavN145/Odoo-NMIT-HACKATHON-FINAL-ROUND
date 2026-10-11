"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ChevronDown, Menu, X, ShieldCheck, CheckCircle2, User, Bell } from "lucide-react";

export default function Header({ onToggleMobileMenu, isMobileMenuOpen }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(true);

  return (
    <header className="bg-white h-[68px] border-b border-[#D8E4E8] px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Organization Brand & Mobile Menu Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="p-1.5 rounded-lg text-[#13293D] hover:bg-[#E8F1F2] md:hidden focus:outline-none"
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
          <div className="flex flex-col">
            <span className="font-bold text-[#13293D] text-sm md:text-base tracking-tight leading-tight">
              Skyline Student Association
            </span>
            <span className="text-[10px] font-semibold text-[#5F7485] tracking-wider uppercase leading-tight">
              Command Center
            </span>
          </div>
        </Link>
      </div>

      {/* Middle: Global Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#5F7485] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, ID, event, department..."
            className="w-full pl-9 pr-4 py-1.5 bg-[#F5F8FA] border border-[#D8E4E8] rounded-full text-xs text-[#13293D] placeholder:text-[#5F7485] focus:outline-none focus:ring-2 focus:ring-[#1B98E0] focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Right: Check-In Pill Action & Manager Profile */}
      <div className="flex items-center gap-3">
        {/* Check In Status Pill Button (OfficeFlow style) */}
        <button
          onClick={() => setIsCheckedIn(!isCheckedIn)}
          className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all shadow-xs cursor-pointer ${
            isCheckedIn
              ? "bg-[#10B981] hover:bg-[#059669] text-white"
              : "bg-[#006494] hover:bg-[#13293D] text-white"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
          <span>{isCheckedIn ? "Check Out →" : "Check In →"}</span>
        </button>

        {/* Profile Avatar & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2.5 p-1 rounded-full hover:bg-[#F5F8FA] transition-colors focus:outline-none cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#006494] text-white flex items-center justify-center font-bold text-xs shadow-xs border-2 border-white">
              AM
            </div>
            <div className="hidden lg:flex flex-col text-left pr-1">
              <span className="text-xs font-bold text-[#13293D] leading-tight">
                Alex Mercer
              </span>
              <span className="text-[10px] text-[#5F7485] leading-tight">
                Manager Admin
              </span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-[#5F7485] transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-[#D8E4E8] rounded-xl shadow-lg py-1.5 z-50">
              <div className="px-4 py-2 border-b border-[#D8E4E8]">
                <p className="text-xs font-bold text-[#13293D]">Alex Mercer</p>
                <p className="text-[11px] text-[#5F7485]">alex.mercer@skyline.edu</p>
                <div className="mt-1.5 inline-flex items-center gap-1 bg-[#EAF5FB] text-[#006494] text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3 text-[#006494]" />
                  <span>Admin Privileges</span>
                </div>
              </div>
              <a
                href="#profile"
                className="block px-4 py-2 text-xs text-[#13293D] hover:bg-[#F5F8FA] transition-colors"
              >
                Manager Settings
              </a>
              <a
                href="#logout"
                className="block px-4 py-2 text-xs text-[#006494] font-semibold hover:bg-[#F5F8FA] transition-colors"
              >
                Sign out
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
