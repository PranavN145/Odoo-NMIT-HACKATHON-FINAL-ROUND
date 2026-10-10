import Link from "next/link";
import { ArrowLeft, Package, Save } from "lucide-react";

export default function CreateMerchandisePage() {
  return (
    <div className="space-y-6 max-w-3xl">
      {/* Back Link & Header */}
      <div>
        <Link
          href="/create"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#006494] hover:text-[#1B98E0] transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Create Overview</span>
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-[#13293D] tracking-tight">
          Create Merchandise Item
        </h1>
        <p className="text-sm text-[#5F7485] mt-1">
          Add new products, set base prices, and configure stock variants.
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-xl border border-[#D8E4E8] p-6 shadow-2xs space-y-4">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#13293D] mb-1">Product Name</label>
            <input
              type="text"
              placeholder="e.g., Association Zip Hoodie"
              className="w-full px-3.5 py-2 bg-[#F5F8FA] border border-[#D8E4E8] rounded-lg text-xs text-[#13293D] focus:outline-none focus:ring-2 focus:ring-[#1B98E0]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#13293D] mb-1">Price ($ USD)</label>
              <input
                type="number"
                placeholder="25.00"
                className="w-full px-3.5 py-2 bg-[#F5F8FA] border border-[#D8E4E8] rounded-lg text-xs text-[#13293D] focus:outline-none focus:ring-2 focus:ring-[#1B98E0]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#13293D] mb-1">Initial Stock Units</label>
              <input
                type="number"
                placeholder="100"
                className="w-full px-3.5 py-2 bg-[#F5F8FA] border border-[#D8E4E8] rounded-lg text-xs text-[#13293D] focus:outline-none focus:ring-2 focus:ring-[#1B98E0]"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#D8E4E8] flex justify-end gap-3">
          <Link
            href="/manage/merchandise"
            className="px-4 py-2 bg-[#E8F1F2] hover:bg-[#D8E4E8] text-[#13293D] text-xs font-semibold rounded-lg transition-colors"
          >
            Cancel
          </Link>
          <button className="px-4 py-2 bg-[#006494] hover:bg-[#13293D] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer">
            <Save className="w-4 h-4" />
            <span>Save Product</span>
          </button>
        </div>
      </div>
    </div>
  );
}
