import Link from "next/link";
import { DollarSign, ArrowLeft, TrendingUp, CreditCard, PieChart } from "lucide-react";

export default function FinancePage() {
  return (
    <div className="space-y-6">
      {/* Back Link & Header */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#006494] hover:text-[#1B98E0] transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#13293D] tracking-tight">
              Finance & Accounting
            </h1>
            <p className="text-sm text-[#5F7485] mt-1">
              Overview of ticket revenues, merchandise sales, and budget allocations.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-[#D8E4E8] text-xs font-medium text-[#13293D] shadow-xs">
            <DollarSign className="w-3.5 h-3.5 text-[#006494]" />
            <span>Financial Ledger</span>
          </div>
        </div>
      </div>

      {/* Finance Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-[#D8E4E8] p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#5F7485]">Ticket Revenue</span>
            <TrendingUp className="w-4 h-4 text-[#006494]" />
          </div>
          <p className="text-2xl font-bold text-[#13293D]">$14,850.00</p>
          <p className="text-[11px] text-[#5F7485]">From 3 published events</p>
        </div>

        <div className="bg-white rounded-xl border border-[#D8E4E8] p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#5F7485]">Merchandise Sales</span>
            <CreditCard className="w-4 h-4 text-[#006494]" />
          </div>
          <p className="text-2xl font-bold text-[#13293D]">$6,240.00</p>
          <p className="text-[11px] text-[#5F7485]">From 6 products in catalog</p>
        </div>

        <div className="bg-white rounded-xl border border-[#D8E4E8] p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#5F7485]">Budget Allocation</span>
            <PieChart className="w-4 h-4 text-[#006494]" />
          </div>
          <p className="text-2xl font-bold text-[#13293D]">$25,000.00</p>
          <p className="text-[11px] text-[#5F7485]">Annual Association Budget</p>
        </div>
      </div>
    </div>
  );
}
