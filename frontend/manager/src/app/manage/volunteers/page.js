"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Search, Users, Mail, UserCheck, CheckCircle2 } from "lucide-react";
import { DEMO_VOLUNTEERS, DEMO_TASKS } from "@/lib/dashboardAdapter";

export default function ManageVolunteersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVolunteers = DEMO_VOLUNTEERS.filter(
    (volunteer) =>
      volunteer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      volunteer.email.toLowerCase().includes(searchQuery.toLowerCase())
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
              Manage volunteers
            </h1>
            <p className="text-sm text-[#5F7485] mt-1">
              View volunteers and their assigned responsibilities.
            </p>
          </div>
          <Link
            href="/assign-task"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#006494] hover:bg-[#13293D] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Assign task</span>
          </Link>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="bg-white rounded-xl border border-[#D8E4E8] p-4 shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 text-[#5F7485] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search volunteers by name or email address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#F5F8FA] border border-[#D8E4E8] rounded-lg text-xs text-[#13293D] placeholder:text-[#5F7485] focus:outline-none focus:ring-2 focus:ring-[#1B98E0] focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Volunteer List Container */}
      <div className="bg-white rounded-xl border border-[#D8E4E8] p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#D8E4E8] pb-3">
          <h2 className="text-base font-bold text-[#13293D]">
            Active Volunteer Roster ({filteredVolunteers.length})
          </h2>
          <span className="text-xs text-[#5F7485]">
            Showing {filteredVolunteers.length} of {DEMO_VOLUNTEERS.length} volunteers
          </span>
        </div>

        {filteredVolunteers.length === 0 ? (
          /* Useful Empty State */
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#EAF5FB] text-[#006494] flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-[#13293D]">No volunteers found</p>
            <p className="text-xs text-[#5F7485] max-w-sm mx-auto">
              No volunteers matched "{searchQuery}". Clear your search term to see the active roster.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="px-3.5 py-1.5 bg-[#E8F1F2] hover:bg-[#D8E4E8] text-[#006494] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Clear search
            </button>
          </div>
        ) : (
          /* Volunteer Roster List */
          <div className="divide-y divide-[#F0F4F6]">
            {filteredVolunteers.map((volunteer) => {
              const assignedTasks = DEMO_TASKS.filter((t) => t.assigneeId === volunteer.id);

              return (
                <div
                  key={volunteer.id}
                  className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#FAFDFE] px-3 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-[#13293D] text-white font-semibold flex items-center justify-center text-xs shadow-xs shrink-0">
                      {volunteer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#13293D]">
                          {volunteer.name}
                        </span>
                        <span className="bg-[#EAF5FB] text-[#006494] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#BDE0FE] flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-[#006494]" />
                          Active Volunteer
                        </span>
                      </div>
                      <div className="text-xs text-[#5F7485] flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-[#5F7485]" />
                        <span>{volunteer.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="text-xs text-[#5F7485] bg-[#F5F8FA] px-3 py-1.5 rounded-lg border border-[#D8E4E8]">
                      Assigned Tasks:{" "}
                      <strong className="text-[#13293D] font-semibold">
                        {assignedTasks.length > 0
                          ? assignedTasks.map((t) => t.title).join(", ")
                          : "No active task"}
                      </strong>
                    </div>
                    <Link
                      href="/assign-task"
                      className="px-3.5 py-1.5 bg-[#E8F1F2] hover:bg-[#D8E4E8] text-[#006494] text-xs font-semibold rounded-lg transition-colors text-center shrink-0"
                    >
                      Assign task →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
