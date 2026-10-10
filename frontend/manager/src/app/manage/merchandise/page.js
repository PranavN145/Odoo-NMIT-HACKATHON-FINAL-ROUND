"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Search, Package, DollarSign, Tag, Layers } from "lucide-react";
import { DEMO_MERCHANDISE } from "@/lib/dashboardAdapter";

export default function ManageMerchandisePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMerchandise = DEMO_MERCHANDISE.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Back Link & Header */}
      <div>
        <Link
          href="/manage"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#006494] hover:text-[#1B98E0] transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Manage Overview</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#13293D] tracking-tight">
              Manage merchandise
            </h1>
            <p className="text-sm text-[#5F7485] mt-1">
              Manage products, prices, stock availability, and merchandise catalogue.
            </p>
          </div>
          <Link
            href="/create/merchandise"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#006494] hover:bg-[#13293D] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create merchandise</span>
          </Link>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="bg-white rounded-xl border border-[#D8E4E8] p-4 shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 text-[#5F7485] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products by item title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#F5F8FA] border border-[#D8E4E8] rounded-lg text-xs text-[#13293D] placeholder:text-[#5F7485] focus:outline-none focus:ring-2 focus:ring-[#1B98E0] focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Merchandise Grid Container */}
      <div className="bg-white rounded-xl border border-[#D8E4E8] p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#D8E4E8] pb-3">
          <h2 className="text-base font-bold text-[#13293D]">
            Catalogue Items ({filteredMerchandise.length})
          </h2>
          <span className="text-xs text-[#5F7485]">
            Showing {filteredMerchandise.length} of {DEMO_MERCHANDISE.length} products
          </span>
        </div>

        {filteredMerchandise.length === 0 ? (
          /* Useful Empty State */
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#EAF5FB] text-[#006494] flex items-center justify-center mx-auto">
              <Package className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-[#13293D]">No products found</p>
            <p className="text-xs text-[#5F7485] max-w-sm mx-auto">
              No products match "{searchQuery}". Check for typos or clear your search query.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="px-3.5 py-1.5 bg-[#E8F1F2] hover:bg-[#D8E4E8] text-[#006494] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Clear search
            </button>
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredMerchandise.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-[#D8E4E8] p-5 shadow-2xs space-y-3 hover:border-[#1B98E0] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-[#EAF5FB] text-[#006494] flex items-center justify-center">
                    <Package className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-semibold bg-[#EAF5FB] text-[#006494] border border-[#BDE0FE] px-2 py-0.5 rounded-full">
                    Listed
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#13293D]">{item.name}</h3>
                  <div className="flex items-center gap-1 mt-1 text-xs text-[#006494] font-semibold">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>${item.price.toFixed(2)} USD</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F0F4F6] flex items-center justify-between text-xs">
                  <span className="text-[#5F7485] flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-[#5F7485]" />
                    Stock: <strong className="text-[#13293D] font-semibold">{item.inStock} units</strong>
                  </span>
                  <button className="text-xs font-semibold text-[#006494] hover:underline cursor-pointer">
                    Edit stock →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
