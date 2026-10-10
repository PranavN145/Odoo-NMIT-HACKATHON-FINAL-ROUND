import { UserCheck, ClipboardList, Clock, AlertCircle } from "lucide-react";

export default function AssignTaskPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#13293D]">
            Assign task
          </h1>
          <p className="text-sm text-[#5F7485] mt-1">
            Delegate operational responsibilities and event duties to eligible volunteers.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-[#D8E4E8] text-xs font-medium text-[#13293D] shadow-xs">
          <UserCheck className="w-3.5 h-3.5 text-[#006494]" />
          <span>Volunteer Delegation</span>
        </div>
      </div>

      {/* Task Delegation Form & Task List Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Task Assignment Form */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#D8E4E8] p-6 shadow-2xs space-y-4">
          <h2 className="text-lg font-bold text-[#13293D] border-b border-[#D8E4E8] pb-3">
            Task Details
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#13293D] uppercase tracking-wider mb-1.5">
                Task Title
              </label>
              <input
                type="text"
                placeholder="e.g. Check-in Desk Staffing for Spring Gala"
                className="w-full px-3.5 py-2.5 bg-[#E8F1F2]/40 border border-[#D8E4E8] rounded-lg text-sm focus:outline-hidden focus:border-[#1B98E0] focus:ring-1 focus:ring-[#1B98E0]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#13293D] uppercase tracking-wider mb-1.5">
                  Select Volunteer
                </label>
                <select className="w-full px-3.5 py-2.5 bg-[#E8F1F2]/40 border border-[#D8E4E8] rounded-lg text-sm text-[#13293D] focus:outline-hidden focus:border-[#1B98E0]">
                  <option value="">Unassigned (Open for applications)</option>
                  <option value="1">Jane Smith (isVolunteer: true)</option>
                  <option value="2">David Lee (isVolunteer: true)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#13293D] uppercase tracking-wider mb-1.5">
                  Deadline
                </label>
                <input
                  type="datetime-local"
                  className="w-full px-3.5 py-2.5 bg-[#E8F1F2]/40 border border-[#D8E4E8] rounded-lg text-sm focus:outline-hidden focus:border-[#1B98E0]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#13293D] uppercase tracking-wider mb-1.5">
                Task Instructions & Scope
              </label>
              <textarea
                rows={3}
                placeholder="Detailed instructions for the assigned volunteer..."
                className="w-full px-3.5 py-2.5 bg-[#E8F1F2]/40 border border-[#D8E4E8] rounded-lg text-sm focus:outline-hidden focus:border-[#1B98E0]"
              ></textarea>
            </div>

            <div className="pt-2">
              <button className="py-2.5 px-6 bg-[#006494] hover:bg-[#13293D] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors">
                Assign volunteer task
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Active Volunteer Tasks List */}
        <div className="bg-white rounded-xl border border-[#D8E4E8] p-6 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#13293D] border-b border-[#D8E4E8] pb-3">
              Active Delegations
            </h2>

            <div className="space-y-3">
              <div className="p-3 rounded-lg border border-[#D8E4E8] bg-[#F5F8FA] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#13293D]">Ticket Scanning</span>
                  <span className="bg-[#EAF5FB] text-[#006494] text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    IN PROGRESS
                  </span>
                </div>
                <p className="text-xs text-[#5F7485]">Assignee: Jane Smith</p>
                <div className="flex items-center gap-1 text-[11px] text-[#5F7485]">
                  <Clock className="w-3 h-3 text-[#006494]" />
                  <span>Due tomorrow at 5:00 PM</span>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-[#D8E4E8] bg-[#F5F8FA] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#13293D]">Merchandise Booth</span>
                  <span className="bg-[#FFF4E5] text-[#B76E00] text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    PENDING
                  </span>
                </div>
                <p className="text-xs text-[#5F7485]">Assignee: Unassigned</p>
                <div className="flex items-center gap-1 text-[11px] text-[#5F7485]">
                  <Clock className="w-3 h-3 text-[#006494]" />
                  <span>Due in 3 days</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#D8E4E8] flex items-center gap-2 text-xs text-[#5F7485]">
            <AlertCircle className="w-4 h-4 text-[#006494] shrink-0" />
            <span>Only members with isVolunteer = true are eligible</span>
          </div>
        </div>
      </div>
    </div>
  );
}
