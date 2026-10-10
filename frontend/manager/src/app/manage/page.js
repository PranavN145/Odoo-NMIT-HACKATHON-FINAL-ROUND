import { SlidersHorizontal, Users, Package, Calendar } from "lucide-react";

export default function ManagePage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#13293D]">
            Manage
          </h1>
          <p className="text-sm text-[#5F7485] mt-1">
            Manage student organization records, events, and merchandise catalogues.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-[#D8E4E8] text-xs font-medium text-[#13293D] shadow-xs">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#006494]" />
          <span>Management Console</span>
        </div>
      </div>

      {/* Grid Content Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Members Management Card */}
        <div className="bg-white rounded-xl border border-[#D8E4E8] p-6 shadow-2xs space-y-4">
          <div className="w-10 h-10 rounded-lg bg-[#EAF5FB] text-[#006494] flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-[#13293D]">Members Roster</h2>
          <p className="text-xs text-[#5F7485]">
            Review student memberships, dues status, and active member benefits.
          </p>
          <button className="mt-2 text-xs font-semibold text-[#006494] hover:underline">
            Manage roster →
          </button>
        </div>

        {/* Events Management Card */}
        <div className="bg-white rounded-xl border border-[#D8E4E8] p-6 shadow-2xs space-y-4">
          <div className="w-10 h-10 rounded-lg bg-[#EAF5FB] text-[#006494] flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-[#13293D]">Event Catalog</h2>
          <p className="text-xs text-[#5F7485]">
            Edit event details, update capacity limits, and monitor ticket sales.
          </p>
          <button className="mt-2 text-xs font-semibold text-[#006494] hover:underline">
            Manage events →
          </button>
        </div>

        {/* Inventory Management Card */}
        <div className="bg-white rounded-xl border border-[#D8E4E8] p-6 shadow-2xs space-y-4">
          <div className="w-10 h-10 rounded-lg bg-[#EAF5FB] text-[#006494] flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-[#13293D]">Merchandise Inventory</h2>
          <p className="text-xs text-[#5F7485]">
            Track size-wise stock (S, M, L, XL), prices, and fulfillment orders.
          </p>
          <button className="mt-2 text-xs font-semibold text-[#006494] hover:underline">
            Manage inventory →
          </button>
        </div>
      </div>
    </div>
  );
}
