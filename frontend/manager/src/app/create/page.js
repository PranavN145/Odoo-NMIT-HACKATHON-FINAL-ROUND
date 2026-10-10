import { PlusCircle, Calendar, ShoppingBag, Megaphone } from "lucide-react";

export default function CreatePage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#13293D]">
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
        <div className="bg-white rounded-xl border border-[#D8E4E8] p-6 shadow-2xs space-y-4 hover:border-[#1B98E0] transition-colors">
          <div className="w-10 h-10 rounded-lg bg-[#EAF5FB] text-[#006494] flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-[#13293D]">Create Event</h2>
          <p className="text-xs text-[#5F7485]">
            Set up date, venue, capacity limits, member pricing, and standard ticket prices.
          </p>
          <button className="w-full py-2 bg-[#006494] hover:bg-[#13293D] text-white text-xs font-semibold rounded-lg transition-colors">
            + New event
          </button>
        </div>

        {/* Create Merchandise Card */}
        <div className="bg-white rounded-xl border border-[#D8E4E8] p-6 shadow-2xs space-y-4 hover:border-[#1B98E0] transition-colors">
          <div className="w-10 h-10 rounded-lg bg-[#EAF5FB] text-[#006494] flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-[#13293D]">Create Merchandise</h2>
          <p className="text-xs text-[#5F7485]">
            Add new products, set base prices, upload photos, and configure size variants.
          </p>
          <button className="w-full py-2 bg-white border border-[#D8E4E8] hover:bg-[#F5F8FA] text-[#13293D] text-xs font-semibold rounded-lg transition-colors">
            + New merchandise
          </button>
        </div>

        {/* Create Announcement Card */}
        <div className="bg-white rounded-xl border border-[#D8E4E8] p-6 shadow-2xs space-y-4 hover:border-[#1B98E0] transition-colors">
          <div className="w-10 h-10 rounded-lg bg-[#EAF5FB] text-[#006494] flex items-center justify-center">
            <Megaphone className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-[#13293D]">Publish Announcement</h2>
          <p className="text-xs text-[#5F7485]">
            Publish announcements targeted to All, Members, or Volunteer groups.
          </p>
          <button className="w-full py-2 bg-white border border-[#D8E4E8] hover:bg-[#F5F8FA] text-[#13293D] text-xs font-semibold rounded-lg transition-colors">
            + New announcement
          </button>
        </div>
      </div>
    </div>
  );
}
