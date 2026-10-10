"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Search, Calendar, MapPin, Users, Ticket, Filter } from "lucide-react";
import { DEMO_EVENTS } from "@/lib/dashboardAdapter";

export default function ManageEventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Filter events based on search query and status filter
  const filteredEvents = DEMO_EVENTS.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus =
      statusFilter === "ALL" || event.status.toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

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
              Manage events
            </h1>
            <p className="text-sm text-[#5F7485] mt-1">
              View, filter, and manage association events and ticket registrations.
            </p>
          </div>
          <Link
            href="/create/event"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#006494] hover:bg-[#13293D] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create event</span>
          </Link>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-xl border border-[#D8E4E8] p-4 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#5F7485] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search events by title or venue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#F5F8FA] border border-[#D8E4E8] rounded-lg text-xs text-[#13293D] placeholder:text-[#5F7485] focus:outline-none focus:ring-2 focus:ring-[#1B98E0] focus:border-transparent transition-all"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1 text-xs text-[#5F7485] mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Status:</span>
          </div>
          {["ALL", "PUBLISHED", "DRAFT"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                statusFilter === status
                  ? "bg-[#006494] text-white shadow-2xs"
                  : "bg-[#F5F8FA] text-[#5F7485] hover:bg-[#E8F1F2] hover:text-[#13293D]"
              }`}
            >
              {status === "ALL" ? "All Statuses" : status.charAt(0) + status.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Events List Container */}
      <div className="bg-white rounded-xl border border-[#D8E4E8] p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#D8E4E8] pb-3">
          <h2 className="text-base font-bold text-[#13293D]">
            Association Events Catalog ({filteredEvents.length})
          </h2>
          <span className="text-xs text-[#5F7485]">
            Showing {filteredEvents.length} of {DEMO_EVENTS.length} events
          </span>
        </div>

        {filteredEvents.length === 0 ? (
          /* Useful Empty State */
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#EAF5FB] text-[#006494] flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-[#13293D]">No events found</p>
            <p className="text-xs text-[#5F7485] max-w-sm mx-auto">
              No events matched your search query "{searchQuery}". Try adjusting your search term or status filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("ALL");
              }}
              className="px-3.5 py-1.5 bg-[#E8F1F2] hover:bg-[#D8E4E8] text-[#006494] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        ) : (
          /* Events Data Table / Cards */
          <div className="divide-y divide-[#F0F4F6]">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#FAFDFE] px-3 rounded-lg transition-colors"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base font-semibold text-[#13293D]">
                      {event.title}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        event.status === "PUBLISHED"
                          ? "bg-[#EAF5FB] text-[#006494] border border-[#BDE0FE]"
                          : "bg-[#F0F4F6] text-[#5F7485] border border-[#D8E4E8]"
                      }`}
                    >
                      {event.status}
                    </span>
                  </div>

                  <div className="text-xs text-[#5F7485] flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#006494]" />
                      {event.formattedDate}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#006494]" />
                      {event.venue}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[#006494]" />
                      Registrations: <strong className="text-[#13293D] font-semibold">{event.registeredCount} / {event.capacity}</strong>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Ticket className="w-3.5 h-3.5 text-[#006494]" />
                      Member: ${event.memberPrice.toFixed(2)} | Non-Member: ${event.standardPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button className="px-3.5 py-1.5 bg-[#E8F1F2] hover:bg-[#D8E4E8] text-[#13293D] text-xs font-medium rounded-lg transition-colors cursor-pointer">
                    Edit Event
                  </button>
                  <button className="px-3.5 py-1.5 bg-white border border-[#D8E4E8] hover:bg-[#F5F8FA] text-[#006494] text-xs font-semibold rounded-lg transition-colors cursor-pointer">
                    View Tickets
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
