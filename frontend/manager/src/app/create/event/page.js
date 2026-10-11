import Link from "next/link";
import { ArrowLeft, Calendar, Save } from "lucide-react";

export default function CreateEventPage() {
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
          Create New Event
        </h1>
        <p className="text-sm text-[#5F7485] mt-1">
          Set up date, venue, capacity limits, member pricing, and standard ticket prices.
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-xl border border-[#D8E4E8] p-6 shadow-2xs space-y-4">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#13293D] mb-1">Event Title</label>
            <input
              type="text"
              placeholder="e.g., Spring Hackathon 2026"
              className="w-full px-3.5 py-2 bg-[#F5F8FA] border border-[#D8E4E8] rounded-lg text-xs text-[#13293D] focus:outline-none focus:ring-2 focus:ring-[#1B98E0]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#13293D] mb-1">Date & Time</label>
              <input
                type="datetime-local"
                className="w-full px-3.5 py-2 bg-[#F5F8FA] border border-[#D8E4E8] rounded-lg text-xs text-[#13293D] focus:outline-none focus:ring-2 focus:ring-[#1B98E0]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#13293D] mb-1">Venue Location</label>
              <input
                type="text"
                placeholder="e.g., Main Auditorium"
                className="w-full px-3.5 py-2 bg-[#F5F8FA] border border-[#D8E4E8] rounded-lg text-xs text-[#13293D] focus:outline-none focus:ring-2 focus:ring-[#1B98E0]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#13293D] mb-1">Capacity</label>
              <input
                type="number"
                placeholder="200"
                className="w-full px-3.5 py-2 bg-[#F5F8FA] border border-[#D8E4E8] rounded-lg text-xs text-[#13293D] focus:outline-none focus:ring-2 focus:ring-[#1B98E0]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#13293D] mb-1">Member Price ($)</label>
              <input
                type="number"
                placeholder="0.00"
                className="w-full px-3.5 py-2 bg-[#F5F8FA] border border-[#D8E4E8] rounded-lg text-xs text-[#13293D] focus:outline-none focus:ring-2 focus:ring-[#1B98E0]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#13293D] mb-1">Standard Price ($)</label>
              <input
                type="number"
                placeholder="15.00"
                className="w-full px-3.5 py-2 bg-[#F5F8FA] border border-[#D8E4E8] rounded-lg text-xs text-[#13293D] focus:outline-none focus:ring-2 focus:ring-[#1B98E0]"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#D8E4E8] flex justify-end gap-3">
          <Link
            href="/manage/events"
            className="px-4 py-2 bg-[#E8F1F2] hover:bg-[#D8E4E8] text-[#13293D] text-xs font-semibold rounded-lg transition-colors"
          >
            Cancel
          </Link>
          <button className="px-4 py-2 bg-[#006494] hover:bg-[#13293D] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer">
            <Save className="w-4 h-4" />
            <span>Publish Event</span>
          </button>
        </div>
      </div>
    </div>
  );
}
