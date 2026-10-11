import Link from "next/link";
import { PlusCircle, Calendar, ShoppingBag, Megaphone, ArrowRight } from "lucide-react";

export default function CreatePage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#13293D] tracking-tight">
            Create
          </h1>
          <p className="text-sm text-[#5F7485] mt-1">
            Create new events, merchandise catalogue items, or organization announcements.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-[#D8E4E8] text-xs font-medium text-[#13293D] shadow-xs">
          <PlusCircle className="w-3.5 h-3.5 text-[#006494]" />
          <span>New Entry</span>
        </div>
      </div>

      {/* Creation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Create Event Card */}
        <Link
          href="/create/event"
          className="group block bg-white rounded-xl border border-[#D8E4E8] p-6 shadow-2xs space-y-4 hover:border-[#1B98E0] hover:shadow-md hover:bg-[#FAFDFE] cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-[#1B98E0]"
        >
          <div className="w-10 h-10 rounded-lg bg-[#EAF5FB] text-[#006494] flex items-center justify-center group-hover:bg-[#1B98E0] group-hover:text-white transition-colors">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-[#13293D] group-hover:text-[#006494] transition-colors">
              Create Event
            </h2>
            <p className="text-xs text-[#5F7485] leading-relaxed">
              Set up date, venue, capacity limits, member pricing, and standard ticket prices.
            </p>
          </div>
          <div className="pt-2 flex items-center text-xs font-semibold text-[#006494] group-hover:text-[#1B98E0] gap-1 transition-colors">
            <span>+ New event</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {/* Create Merchandise Card */}
        <Link
          href="/create/merchandise"
          className="group block bg-white rounded-xl border border-[#D8E4E8] p-6 shadow-2xs space-y-4 hover:border-[#1B98E0] hover:shadow-md hover:bg-[#FAFDFE] cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-[#1B98E0]"
        >
          <div className="w-10 h-10 rounded-lg bg-[#EAF5FB] text-[#006494] flex items-center justify-center group-hover:bg-[#1B98E0] group-hover:text-white transition-colors">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-[#13293D] group-hover:text-[#006494] transition-colors">
              Create Merchandise
            </h2>
            <p className="text-xs text-[#5F7485] leading-relaxed">
              Add new products, set base prices, upload photos, and configure size variants.
            </p>
          </div>
          <div className="pt-2 flex items-center text-xs font-semibold text-[#006494] group-hover:text-[#1B98E0] gap-1 transition-colors">
            <span>+ New merchandise</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {/* Create Announcement Card */}
        <Link
          href="/create/event"
          className="group block bg-white rounded-xl border border-[#D8E4E8] p-6 shadow-2xs space-y-4 hover:border-[#1B98E0] hover:shadow-md hover:bg-[#FAFDFE] cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-[#1B98E0]"
        >
          <div className="w-10 h-10 rounded-lg bg-[#EAF5FB] text-[#006494] flex items-center justify-center group-hover:bg-[#1B98E0] group-hover:text-white transition-colors">
            <Megaphone className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-[#13293D] group-hover:text-[#006494] transition-colors">
              Publish Announcement
            </h2>
            <p className="text-xs text-[#5F7485] leading-relaxed">
              Publish announcements targeted to All, Members, or Volunteer groups.
            </p>
          </div>
          <div className="pt-2 flex items-center text-xs font-semibold text-[#006494] group-hover:text-[#1B98E0] gap-1 transition-colors">
            <span>+ New announcement</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>
      </div>
    </div>
  );
}
