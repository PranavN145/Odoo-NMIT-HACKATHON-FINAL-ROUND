import Link from "next/link";
import { SlidersHorizontal, Calendar, Package, Users, ArrowRight } from "lucide-react";

export default function ManagePage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#13293D] tracking-tight">
            Manage
          </h1>
          <p className="text-sm text-[#5F7485] mt-1">
            Manage events, merchandise, and volunteers.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-[#D8E4E8] text-xs font-medium text-[#13293D] shadow-xs">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#006494]" />
          <span>Management Console</span>
        </div>
      </div>

      {/* Grid of 3 Fully Clickable Management Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1 — Events */}
        <Link
          href="/manage/events"
          className="group block bg-white rounded-xl border border-[#D8E4E8] p-6 shadow-2xs space-y-4 hover:border-[#1B98E0] hover:shadow-md hover:bg-[#FAFDFE] active:scale-[0.99] cursor-pointer transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#1B98E0] focus:ring-offset-2 focus:border-[#1B98E0]"
        >
          <div className="w-10 h-10 rounded-lg bg-[#EAF5FB] text-[#006494] flex items-center justify-center group-hover:bg-[#1B98E0] group-hover:text-white transition-colors">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-[#13293D] group-hover:text-[#006494] transition-colors">
              Events
            </h2>
            <p className="text-xs text-[#5F7485] leading-relaxed">
              View and manage association events.
            </p>
          </div>
          <div className="pt-2 flex items-center text-xs font-semibold text-[#006494] group-hover:text-[#1B98E0] gap-1 transition-colors">
            <span>View events</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {/* Card 2 — Merchandise */}
        <Link
          href="/manage/merchandise"
          className="group block bg-white rounded-xl border border-[#D8E4E8] p-6 shadow-2xs space-y-4 hover:border-[#1B98E0] hover:shadow-md hover:bg-[#FAFDFE] active:scale-[0.99] cursor-pointer transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#1B98E0] focus:ring-offset-2 focus:border-[#1B98E0]"
        >
          <div className="w-10 h-10 rounded-lg bg-[#EAF5FB] text-[#006494] flex items-center justify-center group-hover:bg-[#1B98E0] group-hover:text-white transition-colors">
            <Package className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-[#13293D] group-hover:text-[#006494] transition-colors">
              Merchandise
            </h2>
            <p className="text-xs text-[#5F7485] leading-relaxed">
              Manage products, prices, and availability.
            </p>
          </div>
          <div className="pt-2 flex items-center text-xs font-semibold text-[#006494] group-hover:text-[#1B98E0] gap-1 transition-colors">
            <span>View merchandise</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {/* Card 3 — Volunteers */}
        <Link
          href="/manage/volunteers"
          className="group block bg-white rounded-xl border border-[#D8E4E8] p-6 shadow-2xs space-y-4 hover:border-[#1B98E0] hover:shadow-md hover:bg-[#FAFDFE] active:scale-[0.99] cursor-pointer transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#1B98E0] focus:ring-offset-2 focus:border-[#1B98E0]"
        >
          <div className="w-10 h-10 rounded-lg bg-[#EAF5FB] text-[#006494] flex items-center justify-center group-hover:bg-[#1B98E0] group-hover:text-white transition-colors">
            <Users className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-[#13293D] group-hover:text-[#006494] transition-colors">
              Volunteers
            </h2>
            <p className="text-xs text-[#5F7485] leading-relaxed">
              View volunteers and their responsibilities.
            </p>
          </div>
          <div className="pt-2 flex items-center text-xs font-semibold text-[#006494] group-hover:text-[#1B98E0] gap-1 transition-colors">
            <span>View volunteers</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

      </div>
    </div>
  );
}
