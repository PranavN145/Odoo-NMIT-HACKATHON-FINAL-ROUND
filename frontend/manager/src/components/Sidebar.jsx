"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, SlidersHorizontal, PlusCircle, UserCheck, Calendar, Clock } from "lucide-react";

export default function Sidebar({ isMobileOpen, onCloseMobile }) {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/", icon: LayoutGrid },
    { label: "Manage Directory", href: "/manage", icon: SlidersHorizontal },
    { label: "Create Entry", href: "/create", icon: PlusCircle },
    { label: "Assign Task", href: "/assign-task", icon: UserCheck },
  ];

  const sidebarContent = (
    <div className="w-60 bg-white border-r border-[#D8E4E8] flex flex-col justify-between p-3.5 min-h-[calc(100vh-68px)]">
      {/* Top Navigation Group */}
      <div className="space-y-4">
        {/* Section Label */}
        <div className="px-3 pt-1">
          <span className="text-[10px] font-bold text-[#5F7485] uppercase tracking-wider">
            ADMIN NAVIGATION
          </span>
        </div>

        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#EAF5FB] text-[#006494] font-bold border-l-4 border-[#006494]"
                    : "text-[#13293D] hover:bg-[#F5F8FA]"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#006494]" : "text-[#5F7485]"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Sidebar Footer Workspace Badge */}
      <div className="pt-4 border-t border-[#D8E4E8] mt-auto px-2 space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
          <span className="text-[11px] font-bold text-[#13293D]">Admin Portal Active</span>
        </div>
        <p className="text-[10px] text-[#5F7485]">Skyline HR & Ops Workspace v2.4</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:block shrink-0">{sidebarContent}</aside>

      {/* Mobile Collapsible Navigation Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-[#13293D]/40 backdrop-blur-xs"
            onClick={onCloseMobile}
          />

          {/* Drawer Container */}
          <aside className="relative w-64 bg-white z-50 shadow-xl flex flex-col h-full">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
