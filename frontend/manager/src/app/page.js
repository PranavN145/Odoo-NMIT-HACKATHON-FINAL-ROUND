import Link from "next/link";
import {
  Users,
  Calendar,
  ShoppingBag,
  Clock,
  MapPin,
  ArrowRight,
  Plus,
  ClipboardList,
  UserCheck
} from "lucide-react";
import {
  getDashboardMetrics,
  getUpcomingEvents,
  getVolunteerTasks
} from "@/lib/dashboardAdapter";

export default function DashboardPage() {
  const metrics = getDashboardMetrics();
  const upcomingEvents = getUpcomingEvents(4);
  const volunteerTasks = getVolunteerTasks(4);

  return (
    <div className="space-y-6">
      {/* Section 3: Compact Left-Aligned Dashboard Heading */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#13293D] tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm text-[#5F7485] mt-1">
          Overview of your association.
        </p>
      </div>

      {/* Section 4: Compact Row of 4 Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Volunteers */}
        <div className="bg-white rounded-xl border border-[#D8E4E8] p-4 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#5F7485] uppercase tracking-wider">
              Total volunteers
            </span>
            <div className="text-2xl font-bold text-[#13293D]">
              {metrics.totalVolunteers}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#EAF5FB] flex items-center justify-center text-[#006494] shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2: Upcoming Events */}
        <div className="bg-white rounded-xl border border-[#D8E4E8] p-4 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#5F7485] uppercase tracking-wider">
              Upcoming events
            </span>
            <div className="text-2xl font-bold text-[#13293D]">
              {metrics.upcomingEvents}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#EAF5FB] flex items-center justify-center text-[#006494] shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3: Merchandise Products */}
        <div className="bg-white rounded-xl border border-[#D8E4E8] p-4 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#5F7485] uppercase tracking-wider">
              Merchandise products
            </span>
            <div className="text-2xl font-bold text-[#13293D]">
              {metrics.merchandiseProducts}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#EAF5FB] flex items-center justify-center text-[#006494] shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 4: Pending Tasks */}
        <div className="bg-white rounded-xl border border-[#D8E4E8] p-4 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#5F7485] uppercase tracking-wider">
              Pending tasks
            </span>
            <div className="text-2xl font-bold text-[#13293D]">
              {metrics.pendingTasks}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#EAF5FB] flex items-center justify-center text-[#006494] shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Content Area: 2-Column Balanced Layout on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Upcoming Events (2 Cols Wide) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#D8E4E8] p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#D8E4E8] pb-3">
            <h2 className="text-base font-bold text-[#13293D]">Upcoming events</h2>
            <Link
              href="/manage"
              className="text-xs font-semibold text-[#006494] hover:text-[#1B98E0] flex items-center gap-1 transition-colors"
            >
              <span>View all events</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Upcoming Events Rows */}
          {upcomingEvents.length > 0 ? (
            <div className="divide-y divide-[#F0F4F6]">
              {upcomingEvents.map((event) => (
                <Link
                  key={event.id}
                  href="/manage"
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg hover:bg-[#F5F8FA] transition-colors gap-2 group cursor-pointer"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#13293D] group-hover:text-[#006494] transition-colors">
                        {event.title}
                      </span>
                      {event.status === "PUBLISHED" ? (
                        <span className="bg-[#EAF5FB] text-[#006494] text-[10px] font-semibold px-2 py-0.5 rounded-full">
                          PUBLISHED
                        </span>
                      ) : (
                        <span className="bg-[#FFF4E5] text-[#B76E00] text-[10px] font-semibold px-2 py-0.5 rounded-full">
                          DRAFT
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#5F7485]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#006494]" />
                        {event.formattedDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#006494]" />
                        {event.venue}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-medium text-[#006494] self-end sm:self-center shrink-0">
                    View details →
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            /* Concise Empty State */
            <div className="py-8 text-center space-y-3">
              <Calendar className="w-8 h-8 text-[#5F7485] mx-auto opacity-40" />
              <p className="text-xs text-[#5F7485]">No upcoming events scheduled.</p>
              <Link
                href="/create"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#006494] text-white text-xs font-semibold rounded-lg hover:bg-[#13293D] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create event</span>
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Volunteer Tasks & Quick Actions */}
        <div className="space-y-6">
          
          {/* Volunteer Tasks Section */}
          <div className="bg-white rounded-xl border border-[#D8E4E8] p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#D8E4E8] pb-3">
              <h2 className="text-base font-bold text-[#13293D]">Volunteer tasks</h2>
              <Link
                href="/assign-task"
                className="text-xs font-semibold text-[#006494] hover:text-[#1B98E0] flex items-center gap-1 transition-colors"
              >
                <span>View all tasks</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Volunteer Task Rows */}
            {volunteerTasks.length > 0 ? (
              <div className="space-y-3">
                {volunteerTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-lg border border-[#D8E4E8] bg-[#F5F8FA] space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-[#13293D] line-clamp-1">
                        {task.title}
                      </span>
                      {task.status === "IN_PROGRESS" ? (
                        <span className="bg-[#EAF5FB] text-[#006494] text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0">
                          IN PROGRESS
                        </span>
                      ) : task.status === "COMPLETED" ? (
                        <span className="bg-[#E8F8F0] text-[#1E7E48] text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0">
                          COMPLETED
                        </span>
                      ) : (
                        <span className="bg-[#FFF4E5] text-[#B76E00] text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0">
                          PENDING
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#5F7485]">
                      <span className="flex items-center gap-1">
                        <UserCheck className="w-3 h-3 text-[#006494]" />
                        {task.assigneeName || "Unassigned"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#006494]" />
                        {task.formattedDueDate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Concise Empty State */
              <div className="py-6 text-center space-y-2">
                <ClipboardList className="w-8 h-8 text-[#5F7485] mx-auto opacity-40" />
                <p className="text-xs text-[#5F7485]">No active volunteer tasks.</p>
                <Link
                  href="/assign-task"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#D8E4E8] text-[#13293D] text-xs font-semibold rounded-lg hover:bg-[#F5F8FA] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-[#006494]" />
                  <span>Assign task</span>
                </Link>
              </div>
            )}
          </div>

          {/* Section 7: Quick Actions */}
          <div className="bg-white rounded-xl border border-[#D8E4E8] p-5 shadow-2xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#13293D]">Quick actions</h2>
              <p className="text-xs text-[#5F7485] mt-0.5">Direct workflow shortcuts</p>
            </div>

            <div className="space-y-2.5">
              {/* Action 1: Create Event */}
              <Link
                href="/create"
                className="w-full py-2.5 px-4 bg-[#006494] hover:bg-[#13293D] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create event</span>
              </Link>

              {/* Action 2: Create Merchandise */}
              <Link
                href="/create"
                className="w-full py-2.5 px-4 bg-white border border-[#D8E4E8] hover:bg-[#F5F8FA] text-[#13293D] text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <ShoppingBag className="w-4 h-4 text-[#006494]" />
                <span>Create merchandise</span>
              </Link>

              {/* Action 3: Assign Task */}
              <Link
                href="/assign-task"
                className="w-full py-2.5 px-4 bg-white border border-[#D8E4E8] hover:bg-[#F5F8FA] text-[#13293D] text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <ClipboardList className="w-4 h-4 text-[#006494]" />
                <span>Assign task</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
