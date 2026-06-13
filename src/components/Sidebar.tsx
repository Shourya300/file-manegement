import { LayoutDashboard, FolderOpen, Users, LogOut, Calendar, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { IndividualProject, GroupProject } from "../lib/data";

type SidebarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  projects?: IndividualProject[];
  groupProjects?: GroupProject[];
};

export default function Sidebar({ activeTab, setActiveTab, projects = [], groupProjects = [] }: SidebarProps) {
  const [miniDate, setMiniDate] = useState(new Date(2026, 4, 1)); // May 2026
  const [isProjectsOpen, setIsProjectsOpen] = useState(true);

  const year = miniDate.getFullYear();
  const month = miniDate.getMonth();
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const daysOfWeek = ["S","M","T","W","T","F","S"];

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDay = (y: number, m: number) => new Date(y, m, 1).getDay();

  // Collect all deadline dates for dot indicators
  const deadlineDates = new Set<string>();
  projects.forEach((p) => {
    const d = new Date(p.dueDate);
    if (!isNaN(d.getTime())) deadlineDates.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
    p.timeline.forEach(e => {
      if (e.deadline) {
        const td = new Date(e.deadline);
        if (!isNaN(td.getTime())) deadlineDates.add(`${td.getFullYear()}-${td.getMonth()}-${td.getDate()}`);
      }
    });
  });
  groupProjects.forEach((p) => {
    const d = new Date(p.dueDate);
    if (!isNaN(d.getTime())) deadlineDates.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
    p.timeline.forEach(e => {
      if (e.deadline) {
        const td = new Date(e.deadline);
        if (!isNaN(td.getTime())) deadlineDates.add(`${td.getFullYear()}-${td.getMonth()}-${td.getDate()}`);
      }
    });
  });

  useEffect(() => {
    if (activeTab === "individual" || activeTab === "group") {
      setIsProjectsOpen(true);
    }
  }, [activeTab]);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDay(year, month);

  // Build mini grid cells
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayIndex; i++) cells.push(null);
  for (let i = 1; i <= daysInMonth; i++) cells.push(i);
  // pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  const today = new Date();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex-col hidden md:flex shrink-0 transition-colors shadow-[1px_0_0_rgba(15,23,42,0.04)]">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-2 text-indigo-600">
          <LayoutDashboard size={24} className="fill-indigo-600/20" />
          <span className="text-xl font-bold tracking-tight">StudentDash</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="px-4 pt-6 pb-3 space-y-1">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">Menu</div>

        <button
          onClick={() => setIsProjectsOpen((open) => !open)}
          className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === "individual" || activeTab === "group"
              ? "bg-indigo-50 text-indigo-700"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          <span className="flex items-center gap-3">
            <FolderOpen size={18} className={activeTab === "individual" || activeTab === "group" ? "text-indigo-600" : "text-slate-400"} />
            Projects
          </span>
          <ChevronDown size={16} className={`transition-transform ${isProjectsOpen ? "rotate-180" : "rotate-0"}`} />
        </button>

        {isProjectsOpen && (
          <div className="ml-4 pl-3 border-l border-slate-200 space-y-1">
            <button
              onClick={() => setActiveTab("individual")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === "individual"
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <FolderOpen size={10} className={activeTab === "individual" ? "text-indigo-600" : "text-slate-400"} />
              My Individual Projects
            </button>

            <button
              onClick={() => setActiveTab("group")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === "group"
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Users size={10} className={activeTab === "group" ? "text-indigo-600" : "text-slate-400"} />
              Group Projects
            </button>
          </div>
        )}

        <button
          onClick={() => setActiveTab("calendar")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === "calendar"
              ? "bg-indigo-50 text-indigo-700"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          <Calendar size={18} className={activeTab === "calendar" ? "text-indigo-600" : "text-slate-400"} />
          Calendar
        </button>
      </nav>

      {/* Mini Calendar */}
      <div className="mx-4 mt-2 mb-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
        {/* Month nav */}
        <div className="flex items-center justify-between mb-2.5">
          <button
            onClick={() => setMiniDate(new Date(year, month - 1, 1))}
            className="p-1 rounded-md hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <ChevronLeft size={12} />
          </button>
          <span className="text-[11px] font-bold text-slate-700">
            {monthNames[month]} {year}
          </span>
          <button
            onClick={() => setMiniDate(new Date(year, month + 1, 1))}
            className="p-1 rounded-md hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <ChevronRight size={12} />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-1">
          {daysOfWeek.map((d, i) => (
            <div key={i} className="text-center text-[9px] font-bold text-slate-400 py-0.5">
              {d}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-y-0.5">
          {cells.map((day, idx) => {
            if (day === null) return <div key={idx} />;

            const isToday =
              today.getDate() === day &&
              today.getMonth() === month &&
              today.getFullYear() === year;

            const hasEvent = deadlineDates.has(`${year}-${month}-${day}`);

            return (
              <button
                key={idx}
                onClick={() => setActiveTab("calendar")}
                className={`relative flex items-center justify-center text-[10px] font-semibold w-6 h-6 mx-auto rounded-full transition-colors ${
                  isToday
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-700 hover:bg-slate-200"
                }`}
              >
                {day}
                {hasEvent && !isToday && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>

    </aside>
  );
}
