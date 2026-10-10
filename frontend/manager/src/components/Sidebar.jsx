"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, SlidersHorizontal, PlusCircle, UserCheck } from "lucide-react";

export default function Sidebar({ isMobileOpen, onCloseMobile }) {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/", icon: LayoutGrid },
    { label: "Manage", href: "/manage", icon: SlidersHorizontal },
    { label: "Create", href: "/create", icon: PlusCircle },
    { label: "Assign task", href: "/assign-task", icon: UserCheck },
  ];

  const sidebarContent = (
    <div className="w-60 bg-white border-r border-[#D8E4E8] flex flex-col justify-between p-3.5 min-h-[calc(100vh-68px)]">
      {/* Top Navigation Group */}
      <div className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#EAF5FB] text-[#006494] font-semibold"
                  : "text-[#13293D] hover:bg-[#F5F8FA]"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-[#006494]" : "text-[#5F7485]"}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Sidebar Footer Note */}
      <div className="pt-4 border-t border-[#D8E4E8] mt-auto px-2">
        <span className="text-[11px] font-medium text-[#5F7485] tracking-wide">
          v2.4.0 Management
        </span>
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
