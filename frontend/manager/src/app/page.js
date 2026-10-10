import Link from "next/link";
import {
  Users,
  Calendar,
  CheckSquare,
  Clock,
  FileText,
  UserCheck,
  Package,
  Plus,
  ShoppingBag,
  ClipboardList,
  ArrowRight,
  Info
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#13293D]">
            Dashboard
          </h1>
          <p className="text-sm text-[#5F7485] mt-1">
            A quick overview of your association.
          </p>
        </div>

        {/* Academic Year Badge */}
        <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-[#D8E4E8] text-xs font-medium text-[#13293D] shadow-xs self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-[#006494]"></span>
          <span>Academic Year 2025–2026</span>
        </div>
      </div>

      {/* 4 Summary Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Members */}
        <div className="bg-white rounded-xl border border-[#D8E4E8] p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#5F7485]">Total members</span>
            <div className="w-9 h-9 rounded-lg bg-[#EAF5FB] flex items-center justify-center text-[#006494]">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#13293D] tracking-tight">248</div>
          <div className="w-12 h-1 bg-[#13293D] rounded-full"></div>
        </div>

        {/* Card 2: Upcoming Events */}
        <div className="bg-white rounded-xl border border-[#D8E4E8] p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#5F7485]">Upcoming events</span>
            <div className="w-9 h-9 rounded-lg bg-[#EAF5FB] flex items-center justify-center text-[#006494]">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#13293D] tracking-tight">12</div>
          <div className="w-12 h-1 bg-[#13293D] rounded-full"></div>
        </div>

        {/* Card 3: Active Tasks */}
        <div className="bg-white rounded-xl border border-[#D8E4E8] p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#5F7485]">Active tasks</span>
            <div className="w-9 h-9 rounded-lg bg-[#EAF5FB] flex items-center justify-center text-[#006494]">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#13293D] tracking-tight">8</div>
          <div className="w-12 h-1 bg-[#13293D] rounded-full"></div>
        </div>

        {/* Card 4: Pending Items */}
        <div className="bg-white rounded-xl border border-[#D8E4E8] p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#5F7485]">Pending items</span>
            <div className="w-9 h-9 rounded-lg bg-[#EAF5FB] flex items-center justify-center text-[#006494]">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#13293D] tracking-tight">3</div>
          <div className="w-12 h-1 bg-[#13293D] rounded-full"></div>
        </div>
      </div>

      {/* 2 Main Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Activity (2 cols wide) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#D8E4E8] p-6 shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#D8E4E8] pb-4">
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-bold text-[#13293D]">Recent activity</h2>
              <span className="bg-[#E8F1F2] text-[#006494] text-xs font-semibold px-2.5 py-0.5 rounded-full">
                Audit Log
              </span>
            </div>
            <Link
              href="/manage"
              className="text-xs font-semibold text-[#006494] hover:text-[#1B98E0] flex items-center gap-1 transition-colors"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {/* Activity Item 1 */}
            <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-[#F5F8FA] transition-colors border-b border-[#F0F4F6] pb-4 last:border-b-0">
              <div className="w-9 h-9 rounded-lg bg-[#EAF5FB] text-[#006494] flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#13293D]">
                  Annual General Assembly draft updated
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs text-[#5F7485]">Related:</span>
                  <span className="bg-[#F0F4F6] text-[#13293D] text-[11px] font-medium px-2 py-0.5 rounded-md border border-[#D8E4E8]">
                    Spring Gala 2026
                  </span>
                </div>
              </div>
              <span className="text-xs text-[#5F7485] whitespace-nowrap">2 hours ago</span>
            </div>

            {/* Activity Item 2 */}
            <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-[#F5F8FA] transition-colors border-b border-[#F0F4F6] pb-4 last:border-b-0">
              <div className="w-9 h-9 rounded-lg bg-[#EAF5FB] text-[#006494] flex items-center justify-center shrink-0 mt-0.5">
                <UserCheck className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#13293D]">
                  New member roster submitted for review
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs text-[#5F7485]">Related:</span>
                  <span className="bg-[#F0F4F6] text-[#13293D] text-[11px] font-medium px-2 py-0.5 rounded-md border border-[#D8E4E8]">
                    Finance Committee
                  </span>
                </div>
              </div>
              <span className="text-xs text-[#5F7485] whitespace-nowrap">Yesterday</span>
            </div>

            {/* Activity Item 3 */}
            <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-[#F5F8FA] transition-colors">
              <div className="w-9 h-9 rounded-lg bg-[#EAF5FB] text-[#006494] flex items-center justify-center shrink-0 mt-0.5">
                <Package className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#13293D]">
                  Merchandise order fulfillment logged
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs text-[#5F7485]">Related:</span>
                  <span className="bg-[#F0F4F6] text-[#13293D] text-[11px] font-medium px-2 py-0.5 rounded-md border border-[#D8E4E8]">
                    Spring Hoodie Batch
                  </span>
                </div>
              </div>
              <span className="text-xs text-[#5F7485] whitespace-nowrap">3 days ago</span>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Actions */}
        <div className="bg-white rounded-xl border border-[#D8E4E8] p-6 shadow-2xs space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#13293D]">Quick actions</h2>
              <p className="text-xs text-[#5F7485] mt-0.5">Frequently used shortcuts</p>
            </div>

            <div className="space-y-3 pt-2">
              {/* Primary Action Button */}
              <Link
                href="/create"
                className="w-full py-2.5 px-4 bg-[#006494] hover:bg-[#13293D] text-white text-sm font-semibold rounded-lg shadow-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create event</span>
              </Link>

              {/* Secondary Action Button 1 */}
              <Link
                href="/create"
                className="w-full py-2.5 px-4 bg-white border border-[#D8E4E8] hover:bg-[#F5F8FA] text-[#13293D] text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <ShoppingBag className="w-4 h-4 text-[#006494]" />
                <span>Create merchandise</span>
              </Link>

              {/* Secondary Action Button 2 */}
              <Link
                href="/assign-task"
                className="w-full py-2.5 px-4 bg-white border border-[#D8E4E8] hover:bg-[#F5F8FA] text-[#13293D] text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <ClipboardList className="w-4 h-4 text-[#006494]" />
                <span>Assign task</span>
              </Link>
            </div>
          </div>

          {/* Shortcut Footer Info */}
          <div className="pt-4 border-t border-[#D8E4E8] flex items-center justify-between text-xs text-[#5F7485]">
            <div className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#006494]" />
              <span>Operations require tier-2 sign-off</span>
            </div>
            <kbd className="px-1.5 py-0.5 bg-[#F0F4F6] border border-[#D8E4E8] rounded-md font-mono text-[11px] text-[#13293D]">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>
    </div>
  );
}
