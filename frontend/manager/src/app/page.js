"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Calendar,
  Package,
  CheckSquare,
  Search,
  Plus,
  ArrowRight,
  CheckCircle2,
  Clock,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  X,
  Edit3,
  Briefcase,
  FileText,
  UserCheck,
  ChevronRight,
  Filter,
  Eye,
  Lock
} from "lucide-react";
import { DEMO_EVENTS, DEMO_TASKS, DEMO_MERCHANDISE, DEMO_VOLUNTEERS } from "@/lib/dashboardAdapter";

// Extended OfficeFlow-style Directory Dataset
const DIRECTORY_MEMBERS = [
  {
    id: "m1",
    name: "Pranav Narkhede",
    initials: "PN",
    role: "Company Admin / Founder",
    dept: "Management - HQ",
    loginId: "OIPRNA202600003",
    email: "pranav.narkhede6040@gmail.com",
    mobile: "7040313121",
    status: "ACTIVE",
    avatarBg: "bg-[#006494]",
    location: "HQ - Office",
    skills: ["Management", "Leadership", "Product Strategy"],
    bio: "Leading overall association operations, platform development, and executive administration."
  },
  {
    id: "m2",
    name: "Pratham Gupta",
    initials: "PG",
    role: "Associate Software Engineer",
    dept: "Engineering - Bangalore",
    loginId: "OIPRAT202600004",
    email: "pratham04060303@gmail.com",
    mobile: "7040313424",
    status: "ACTIVE",
    avatarBg: "bg-[#13293D]",
    location: "Bangalore - Hybrid",
    skills: ["Team Collaboration", "Problem Solving", "Full-Stack Dev"],
    bio: "Developing core web services, event ticketing API endpoints, and member authentication."
  },
  {
    id: "m3",
    name: "Aarav Sharma",
    initials: "AS",
    role: "Senior Product Designer",
    dept: "Product Design - Bangalore",
    loginId: "OIAARA202600002",
    email: "aarav.sharma@skyline.edu",
    mobile: "+91 98450 12345",
    status: "ACTIVE",
    avatarBg: "bg-[#247BA0]",
    location: "Bangalore - Hybrid",
    skills: ["Figma", "UI/UX Design", "Design Systems", "Prototyping"],
    bio: "Product designer focusing on UX ergonomics, design systems, and enterprise UI patterns."
  },
  {
    id: "m4",
    name: "Priya Patel",
    initials: "PP",
    role: "Senior Financial Analyst",
    dept: "Finance - Mumbai",
    loginId: "OIPRIY202600005",
    email: "priya.patel@skyline.edu",
    mobile: "+91 98200 45678",
    status: "ON_LEAVE",
    avatarBg: "bg-[#1B98E0]",
    location: "Mumbai - Office",
    skills: ["Financial Planning", "Budget Allocation", "Audit Logs"],
    bio: "Managing merchandise sales ledger, ticket pricing structures, and annual budget reports."
  },
  {
    id: "m5",
    name: "Rohan Verma",
    initials: "RV",
    role: "Customer Success Lead",
    dept: "Customer Success - Delhi",
    loginId: "OIROHA202600006",
    email: "rohan.verma@skyline.edu",
    mobile: "+91 98110 56789",
    status: "ACTIVE",
    avatarBg: "bg-[#006494]",
    location: "Delhi - Remote",
    skills: ["Member Support", "Event Logistics", "Conflict Resolution"],
    bio: "Coordinating student registration helpdesk and volunteer onboarding programs."
  },
  {
    id: "m6",
    name: "Alex Mercer (Admin)",
    initials: "AD",
    role: "Head of People & Operations",
    dept: "Human Resources - Bangalore",
    loginId: "OIADMIN202600001",
    email: "admin@skyline.edu",
    mobile: "+91 98000 00001",
    status: "ACTIVE",
    avatarBg: "bg-[#13293D]",
    location: "Bangalore - HQ",
    skills: ["People Operations", "HR Strategy", "Compliance"],
    bio: "Overseeing executive committee rosters, volunteer tasks, and member permissions."
  }
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("directory"); // "directory", "attendance", "events", "tasks"
  const [selectedMember, setSelectedMember] = useState(null);
  const [profileTab, setProfileTab] = useState("resume"); // "resume", "private", "salary"
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Edit Form State
  const [editFormData, setEditFormData] = useState({
    name: "",
    mobile: "",
    dob: "14 Jun 1992",
    maritalStatus: "Single",
    address: "42 Indiranagar 100ft Road, Bangalore 560038",
    skills: "Figma, UI/UX Design, Design Systems",
    dept: "Management",
    role: "Company Admin / Founder"
  });

  const handleMemberClick = (member) => {
    setSelectedMember(member);
    setEditFormData({
      name: member.name,
      mobile: member.mobile,
      dob: "14 Jun 1992",
      maritalStatus: "Single",
      address: "42 Indiranagar 100ft Road, Bangalore 560038",
      skills: member.skills.join(", "),
      dept: member.dept.split(" - ")[0],
      role: member.role
    });
  };

  const filteredMembers = DIRECTORY_MEMBERS.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.loginId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === "ALL" || m.dept.startsWith(deptFilter);
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Command Center Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#D8E4E8] shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold text-[#13293D] tracking-tight">
              {selectedMember ? "Employee Profile (Form View)" : "Employees Directory"}
            </h1>
            {selectedMember && (
              <span className="bg-[#EAF5FB] text-[#006494] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#BDE0FE]">
                {selectedMember.loginId}
              </span>
            )}
          </div>
          <p className="text-xs text-[#5F7485] mt-1">
            {selectedMember
              ? `Viewing details for ${selectedMember.name} • ${selectedMember.role}`
              : "Welcome Administrator! Entering HR & Ops Command Center."}
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {selectedMember ? (
            <button
              onClick={() => setSelectedMember(null)}
              className="px-3.5 py-2 bg-[#E8F1F2] hover:bg-[#D8E4E8] text-[#13293D] text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              ← Back to Directory
            </button>
          ) : (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-[#006494] hover:bg-[#13293D] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>NEW</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Tab Navigation Bar */}
      {!selectedMember && (
        <div className="bg-white rounded-2xl border border-[#D8E4E8] p-2 shadow-2xs flex flex-wrap items-center justify-between gap-2">
          {/* Main Navigation Tabs */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab("directory")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "directory"
                  ? "bg-[#006494] text-white shadow-2xs"
                  : "text-[#5F7485] hover:bg-[#F5F8FA] hover:text-[#13293D]"
              }`}
            >
              Directory Cards ({filteredMembers.length})
            </button>
            <button
              onClick={() => setActiveTab("attendance")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "attendance"
                  ? "bg-[#006494] text-white shadow-2xs"
                  : "text-[#5F7485] hover:bg-[#F5F8FA] hover:text-[#13293D]"
              }`}
            >
              Attendance Roster
            </button>
            <button
              onClick={() => setActiveTab("events")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "events"
                  ? "bg-[#006494] text-white shadow-2xs"
                  : "text-[#5F7485] hover:bg-[#F5F8FA] hover:text-[#13293D]"
              }`}
            >
              Scheduled Events ({DEMO_EVENTS.length})
            </button>
            <button
              onClick={() => setActiveTab("tasks")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "tasks"
                  ? "bg-[#006494] text-white shadow-2xs"
                  : "text-[#5F7485] hover:bg-[#F5F8FA] hover:text-[#13293D]"
              }`}
            >
              Volunteer Tasks ({DEMO_TASKS.length})
            </button>
          </div>

          {/* Department Filter Dropdown */}
          <div className="flex items-center gap-2 pr-2">
            <Filter className="w-3.5 h-3.5 text-[#5F7485]" />
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="bg-[#F5F8FA] border border-[#D8E4E8] text-xs font-semibold text-[#13293D] rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#1B98E0]"
            >
              <option value="ALL">All Departments</option>
              <option value="Management">Management</option>
              <option value="Engineering">Engineering</option>
              <option value="Product Design">Product Design</option>
              <option value="Finance">Finance</option>
            </select>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* DETAILED PROFILE FORM VIEW (When a member card is clicked) */}
      {/* ------------------------------------------------------------------- */}
      {selectedMember ? (
        <div className="space-y-6">
          {/* Member Profile Overview Card */}
          <div className="bg-white rounded-2xl border border-[#D8E4E8] p-6 shadow-2xs space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#D8E4E8]">
              {/* Left Profile Head info */}
              <div className="flex items-center gap-5">
                <div
                  className={`w-16 h-16 rounded-full ${selectedMember.avatarBg} text-white font-extrabold text-xl flex items-center justify-center shadow-md shrink-0 border-2 border-white`}
                >
                  {selectedMember.initials}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-[#13293D]">{selectedMember.name}</h2>
                    <span className="bg-[#EAF5FB] text-[#006494] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#BDE0FE]">
                      {selectedMember.loginId}
                    </span>
                  </div>
                  <p className="text-xs text-[#5F7485] flex items-center gap-3 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-[#13293D] font-semibold">
                      <Mail className="w-3.5 h-3.5 text-[#006494]" />
                      {selectedMember.email}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-[#006494]" />
                      {selectedMember.mobile}
                    </span>
                  </p>
                </div>
              </div>

              {/* Right Meta Info & Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="text-xs space-y-1 text-right sm:text-left pr-4 border-r border-[#D8E4E8] hidden sm:block">
                  <p className="text-[#5F7485]">Department: <strong className="text-[#13293D]">{selectedMember.dept}</strong></p>
                  <p className="text-[#5F7485]">Location: <strong className="text-[#13293D]">{selectedMember.location}</strong></p>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-4 py-2 bg-[#006494] hover:bg-[#13293D] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Personal Info</span>
                </button>
              </div>
            </div>

            {/* Profile Sub-Tabs: Resume, Private Info, Salary Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-[#D8E4E8] pb-1">
                <button
                  onClick={() => setProfileTab("resume")}
                  className={`px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                    profileTab === "resume"
                      ? "border-[#006494] text-[#006494]"
                      : "border-transparent text-[#5F7485] hover:text-[#13293D]"
                  }`}
                >
                  Resume / About
                </button>
                <button
                  onClick={() => setProfileTab("private")}
                  className={`px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                    profileTab === "private"
                      ? "border-[#006494] text-[#006494]"
                      : "border-transparent text-[#5F7485] hover:text-[#13293D]"
                  }`}
                >
                  Private Info
                </button>
                <button
                  onClick={() => setProfileTab("salary")}
                  className={`px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1 ${
                    profileTab === "salary"
                      ? "border-[#006494] text-[#006494]"
                      : "border-transparent text-[#5F7485] hover:text-[#13293D]"
                  }`}
                >
                  <span>Salary Info</span>
                  <span className="bg-[#EF4444] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                    Admin
                  </span>
                </button>
              </div>

              {/* Tab Content Panels */}
              {profileTab === "resume" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                  <div className="lg:col-span-2 space-y-4">
                    <div className="bg-[#F5F8FA] rounded-xl p-4 border border-[#D8E4E8] space-y-2">
                      <h3 className="text-xs font-bold text-[#006494] uppercase tracking-wider flex items-center gap-1.5">
                        <UserCheck className="w-4 h-4" />
                        About Member
                      </h3>
                      <p className="text-xs text-[#13293D] leading-relaxed">
                        {selectedMember.bio}
                      </p>
                    </div>

                    <div className="bg-[#F5F8FA] rounded-xl p-4 border border-[#D8E4E8] space-y-2">
                      <h3 className="text-xs font-bold text-[#006494] uppercase tracking-wider flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4" />
                        What I Love About My Role
                      </h3>
                      <p className="text-xs text-[#5F7485] leading-relaxed">
                        Collaborating with multidisciplinary student teams, architecting scalable event features, and delivering seamless digital user experiences for the Skyline community.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Skills Box */}
                    <div className="bg-[#F5F8FA] rounded-xl p-4 border border-[#D8E4E8] space-y-3">
                      <h3 className="text-xs font-bold text-[#13293D] uppercase tracking-wider">
                        Skills & Expertise
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedMember.skills.map((skill, i) => (
                          <span
                            key={i}
                            className="bg-[#EAF5FB] text-[#006494] border border-[#BDE0FE] text-xs font-semibold px-2.5 py-1 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Certifications Box */}
                    <div className="bg-[#F5F8FA] rounded-xl p-4 border border-[#D8E4E8] space-y-3">
                      <h3 className="text-xs font-bold text-[#13293D] uppercase tracking-wider">
                        Certifications
                      </h3>
                      <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border border-[#D8E4E8]">
                        <span className="font-semibold text-[#13293D]">NN/g UX Master Certified</span>
                        <span className="bg-[#10B981] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Verified
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {profileTab === "private" && (
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-[#F5F8FA] p-3.5 rounded-xl border border-[#D8E4E8] space-y-1">
                    <span className="text-[#5F7485]">DATE OF BIRTH</span>
                    <p className="font-bold text-[#13293D]">14 Jun 1992</p>
                  </div>
                  <div className="bg-[#F5F8FA] p-3.5 rounded-xl border border-[#D8E4E8] space-y-1">
                    <span className="text-[#5F7485]">GENDER</span>
                    <p className="font-bold text-[#13293D]">Not Specified</p>
                  </div>
                  <div className="bg-[#F5F8FA] p-3.5 rounded-xl border border-[#D8E4E8] space-y-1">
                    <span className="text-[#5F7485]">NATIONALITY</span>
                    <p className="font-bold text-[#13293D]">Indian</p>
                  </div>
                  <div className="bg-[#F5F8FA] p-3.5 rounded-xl border border-[#D8E4E8] space-y-1">
                    <span className="text-[#5F7485]">MARITAL STATUS</span>
                    <p className="font-bold text-[#13293D]">Single</p>
                  </div>
                </div>
              )}

              {profileTab === "salary" && (
                <div className="pt-2 space-y-4 text-xs">
                  <div className="bg-[#F5F8FA] p-4 rounded-xl border border-[#D8E4E8] flex items-center justify-between">
                    <div>
                      <span className="text-[#5F7485]">MONTHLY STIPEND / WAGE</span>
                      <p className="text-xl font-extrabold text-[#13293D] mt-0.5">₹ 90,000 / Month</p>
                    </div>
                    <div className="bg-[#006494] text-white px-3.5 py-1.5 rounded-xl font-bold">
                      Net Take-Home: ₹ 84,400.00
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ------------------------------------------------------------------- */
        /* TAB 1: DIRECTORY CARDS GRID (OfficeFlow exact style) */
        /* ------------------------------------------------------------------- */
        activeTab === "directory" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                onClick={() => handleMemberClick(member)}
                className="bg-white rounded-2xl border border-[#D8E4E8] p-5 shadow-2xs space-y-4 hover:border-[#006494] hover:shadow-md transition-all cursor-pointer group relative"
              >
                {/* Top Avatar & Online Indicator */}
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-2xl ${member.avatarBg} text-white font-extrabold text-sm flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}
                  >
                    {member.initials}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        member.status === "ACTIVE" ? "bg-[#10B981]" : "bg-[#F59E0B]"
                      }`}
                    ></span>
                    <span className="text-[10px] font-bold text-[#5F7485]">
                      {member.status === "ACTIVE" ? "Active" : "On Leave"}
                    </span>
                  </div>
                </div>

                {/* Member Info */}
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#13293D] group-hover:text-[#006494] transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#006494]">{member.role}</p>
                  <p className="text-xs text-[#5F7485]">{member.dept}</p>
                </div>

                {/* Reference ID Pill & Email */}
                <div className="pt-3 border-t border-[#F0F4F6] flex items-center justify-between text-xs">
                  <span className="bg-[#EAF5FB] text-[#006494] text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border border-[#BDE0FE]">
                    {member.loginId}
                  </span>
                  <span className="text-xs text-[#5F7485] group-hover:text-[#006494] font-semibold flex items-center gap-1 transition-colors">
                    View profile <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* ------------------------------------------------------------------- */}
      {/* TAB 2: ATTENDANCE MANAGEMENT TABLE VIEW (OfficeFlow exact style) */}
      {/* ------------------------------------------------------------------- */}
      {!selectedMember && activeTab === "attendance" && (
        <div className="bg-white rounded-2xl border border-[#D8E4E8] p-5 shadow-2xs space-y-5">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D8E4E8] pb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-[#13293D]">Attendance Management</h2>
              <div className="flex items-center gap-1.5 bg-[#F5F8FA] border border-[#D8E4E8] rounded-xl px-3 py-1 text-xs font-bold text-[#13293D]">
                <span>22, October 2025</span>
              </div>
            </div>

            {/* Attendance Summary Stat Pills */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0] px-3 py-1 rounded-full font-bold">
                87% Present
              </span>
              <span className="bg-[#EAF5FB] text-[#006494] border border-[#BDE0FE] px-3 py-1 rounded-full font-bold">
                5 Present
              </span>
              <span className="bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A] px-3 py-1 rounded-full font-bold">
                1 On Leave
              </span>
              <span className="bg-[#FEE2E2] text-[#EF4444] border border-[#FECACA] px-3 py-1 rounded-full font-bold">
                0 Absent
              </span>
            </div>
          </div>

          {/* Roster Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F8FA] border-b border-[#D8E4E8] text-[#5F7485] font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">EMP / MEMBER</th>
                  <th className="py-3 px-4">CHECK IN</th>
                  <th className="py-3 px-4">CHECK OUT</th>
                  <th className="py-3 px-4">WORK HOURS</th>
                  <th className="py-3 px-4">EXTRA HOURS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F4F6]">
                {DIRECTORY_MEMBERS.map((member) => (
                  <tr key={member.id} className="hover:bg-[#FAFDFE] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full ${member.avatarBg} text-white font-bold text-xs flex items-center justify-center`}
                        >
                          {member.initials}
                        </div>
                        <div>
                          <p className="font-bold text-[#13293D]">{member.name}</p>
                          <p className="text-[10px] text-[#5F7485]">{member.dept}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#13293D]">10:00</td>
                    <td className="py-3.5 px-4 font-semibold text-[#13293D]">19:00</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-[#ECFDF5] text-[#10B981] font-bold px-2.5 py-1 rounded-lg inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" /> 09:00 hrs
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-[#EAF5FB] text-[#006494] font-bold px-2 py-0.5 rounded-md">
                        +01:00
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* TAB 3: SCHEDULED EVENTS VIEW */}
      {/* ------------------------------------------------------------------- */}
      {!selectedMember && activeTab === "events" && (
        <div className="bg-white rounded-2xl border border-[#D8E4E8] p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#D8E4E8] pb-3">
            <h2 className="text-base font-bold text-[#13293D]">Association Events</h2>
            <Link
              href="/manage/events"
              className="text-xs font-bold text-[#006494] hover:underline"
            >
              Full Events Management →
            </Link>
          </div>

          <div className="divide-y divide-[#F0F4F6]">
            {DEMO_EVENTS.map((event) => (
              <div
                key={event.id}
                className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#FAFDFE] px-3 rounded-xl transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-[#13293D]">{event.title}</span>
                    <span className="bg-[#EAF5FB] text-[#006494] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#BDE0FE]">
                      {event.status}
                    </span>
                  </div>
                  <div className="text-xs text-[#5F7485] flex items-center gap-4 flex-wrap">
                    <span>{event.formattedDate}</span>
                    <span>{event.venue}</span>
                    <span>Registrations: <strong>{event.registeredCount} / {event.capacity}</strong></span>
                  </div>
                </div>

                <Link
                  href="/manage/events"
                  className="px-4 py-2 bg-[#E8F1F2] hover:bg-[#D8E4E8] text-[#13293D] text-xs font-semibold rounded-xl text-center shrink-0"
                >
                  Manage Tickets
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* TAB 4: VOLUNTEER TASKS VIEW */}
      {/* ------------------------------------------------------------------- */}
      {!selectedMember && activeTab === "tasks" && (
        <div className="bg-white rounded-2xl border border-[#D8E4E8] p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#D8E4E8] pb-3">
            <h2 className="text-base font-bold text-[#13293D]">Active Volunteer Tasks</h2>
            <Link
              href="/assign-task"
              className="text-xs font-bold text-[#006494] hover:underline"
            >
              Assign New Task →
            </Link>
          </div>

          <div className="divide-y divide-[#F0F4F6]">
            {DEMO_TASKS.map((task) => (
              <div
                key={task.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAFDFE] px-3 rounded-xl transition-colors"
              >
                <div className="space-y-1">
                  <span className="text-sm font-bold text-[#13293D]">{task.title}</span>
                  <div className="text-xs text-[#5F7485] flex items-center gap-3">
                    <span>Assignee: <strong className="text-[#13293D]">{task.assigneeName}</strong></span>
                    <span>Due: <strong>{task.formattedDueDate}</strong></span>
                  </div>
                </div>

                <span className="bg-[#EAF5FB] text-[#006494] text-xs font-bold px-3 py-1 rounded-full border border-[#BDE0FE] self-start sm:self-auto">
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* EDIT PERSONAL INFO MODAL (OfficeFlow style) */}
      {/* ------------------------------------------------------------------- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#13293D]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#D8E4E8] shadow-2xl w-full max-w-xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#D8E4E8] pb-3">
              <h2 className="text-base font-bold text-[#13293D]">
                Edit Profile — {editFormData.name}
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-[#5F7485] hover:text-[#13293D] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-[#13293D] mb-1">Full Name *</label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F5F8FA] border border-[#D8E4E8] rounded-xl text-[#13293D] focus:ring-2 focus:ring-[#1B98E0]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#13293D] mb-1">Phone / Mobile *</label>
                <input
                  type="text"
                  value={editFormData.mobile}
                  onChange={(e) => setEditFormData({ ...editFormData, mobile: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F5F8FA] border border-[#D8E4E8] rounded-xl text-[#13293D] focus:ring-2 focus:ring-[#1B98E0]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#13293D] mb-1">Date of Birth</label>
                <input
                  type="text"
                  value={editFormData.dob}
                  onChange={(e) => setEditFormData({ ...editFormData, dob: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F5F8FA] border border-[#D8E4E8] rounded-xl text-[#13293D] focus:ring-2 focus:ring-[#1B98E0]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#13293D] mb-1">Marital Status</label>
                <select
                  value={editFormData.maritalStatus}
                  onChange={(e) => setEditFormData({ ...editFormData, maritalStatus: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F5F8FA] border border-[#D8E4E8] rounded-xl text-[#13293D] focus:ring-2 focus:ring-[#1B98E0]"
                >
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block font-semibold text-[#13293D] mb-1">Residential Address</label>
                <input
                  type="text"
                  value={editFormData.address}
                  onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F5F8FA] border border-[#D8E4E8] rounded-xl text-[#13293D] focus:ring-2 focus:ring-[#1B98E0]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block font-semibold text-[#13293D] mb-1">Skills (Comma-separated)</label>
                <input
                  type="text"
                  value={editFormData.skills}
                  onChange={(e) => setEditFormData({ ...editFormData, skills: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F5F8FA] border border-[#D8E4E8] rounded-xl text-[#13293D] focus:ring-2 focus:ring-[#1B98E0]"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#D8E4E8] flex justify-end gap-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 bg-[#E8F1F2] hover:bg-[#D8E4E8] text-[#13293D] text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("Profile updated successfully!");
                  setIsEditModalOpen(false);
                }}
                className="px-4 py-2 bg-[#006494] hover:bg-[#13293D] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* CREATE EMPLOYEE / MEMBER MODAL (OfficeFlow style) */}
      {/* ------------------------------------------------------------------- */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#13293D]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#D8E4E8] shadow-2xl w-full max-w-lg p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#D8E4E8] pb-3">
              <h2 className="text-base font-bold text-[#13293D]">
                Create Employee Record
              </h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 text-[#5F7485] hover:text-[#13293D] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-[#13293D] mb-1">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. David Miller"
                  className="w-full px-3 py-2 bg-[#F5F8FA] border border-[#D8E4E8] rounded-xl text-[#13293D]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#13293D] mb-1">Work Email *</label>
                <input
                  type="email"
                  placeholder="david.miller@skyline.edu"
                  className="w-full px-3 py-2 bg-[#F5F8FA] border border-[#D8E4E8] rounded-xl text-[#13293D]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#13293D] mb-1">Department *</label>
                <select className="w-full px-3 py-2 bg-[#F5F8FA] border border-[#D8E4E8] rounded-xl text-[#13293D]">
                  <option>Engineering</option>
                  <option>Management</option>
                  <option>Product Design</option>
                  <option>Finance</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-[#13293D] mb-1">Job Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Developer"
                  className="w-full px-3 py-2 bg-[#F5F8FA] border border-[#D8E4E8] rounded-xl text-[#13293D]"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#D8E4E8] flex justify-end gap-3">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 bg-[#E8F1F2] text-[#13293D] text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("New member created successfully!");
                  setIsCreateModalOpen(false);
                }}
                className="px-4 py-2 bg-[#006494] hover:bg-[#13293D] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Create Employee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
