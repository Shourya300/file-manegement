import { useState } from "react";
import { IndividualProject, GroupProject } from "../lib/data";
import { ChevronLeft, ChevronRight, Calendar, ArrowRight } from "lucide-react";

type CalendarViewProps = {
  projects: IndividualProject[];
  groupProjects: GroupProject[];
  onSelectProject: (id: number, type: "individual" | "group") => void;
};

type CalEvent = {
  id: string;
  title: string;
  date: Date;
  colorClass: string;
  dotColor: string;
  projectId: number;
  projectType: "individual" | "group";
  course: string;
};

export default function CalendarView({ projects, groupProjects, onSelectProject }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 1)); // May 2026

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const daysOfWeek = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDay = (y: number, m: number) => new Date(y, m, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // --- Build events: DEADLINES ONLY ---
  const events: CalEvent[] = [];

  // 1. Individual project due dates
  projects.forEach((p) => {
    const d = new Date(p.dueDate);
    if (!isNaN(d.getTime())) {
      events.push({
        id: `ind-due-${p.id}`,
        title: p.title,
        date: d,
        colorClass: "bg-indigo-50 border-indigo-200 text-indigo-700",
        dotColor: "bg-indigo-500",
        projectId: p.id,
        projectType: "individual",
        course: p.course,
      });
    }

    // Individual project task deadlines (added via the deadline field)
    p.timeline.forEach((event) => {
      if (event.deadline) {
        const d = new Date(event.deadline);
        if (!isNaN(d.getTime())) {
          events.push({
            id: `ind-task-${event.id}`,
            title: event.content,
            date: d,
            colorClass: "bg-amber-50 border-amber-200 text-amber-800",
            dotColor: "bg-amber-500",
            projectId: p.id,
            projectType: "individual",
            course: p.course,
          });
        }
      }
    });
  });

  // 2. Group project due dates
  groupProjects.forEach((p) => {
    const d = new Date(p.dueDate);
    if (!isNaN(d.getTime())) {
      events.push({
        id: `group-due-${p.id}`,
        title: p.title,
        date: d,
        colorClass: "bg-emerald-50 border-emerald-200 text-emerald-800",
        dotColor: "bg-emerald-500",
        projectId: p.id,
        projectType: "group",
        course: p.course,
      });
    }

    // Group project task deadlines (from Add Update with deadline field)
    p.tasks.forEach((task) => {
      if (task.deadline) {
        const d = new Date(task.deadline);
        if (!isNaN(d.getTime())) {
          events.push({
            id: `group-task-board-${task.id}`,
            title: task.title,
            date: d,
            colorClass: "bg-amber-50 border-amber-200 text-amber-800",
            dotColor: "bg-amber-500",
            projectId: p.id,
            projectType: "group",
            course: p.course,
          });
        }
      }
    });

    // Group project task deadlines (from Add Update with deadline field)
    p.timeline.forEach((event) => {
      if (event.deadline) {
        const d = new Date(event.deadline);
        if (!isNaN(d.getTime())) {
          events.push({
            id: `group-task-${event.id}`,
            title: event.content,
            date: d,
            colorClass: "bg-amber-50 border-amber-200 text-amber-800",
            dotColor: "bg-amber-500",
            projectId: p.id,
            projectType: "group",
            course: p.course,
          });
        }
      }
    });
  });

  // --- Build calendar grid ---
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDay(year, month);

  const cells: { day: number; month: number; year: number; isCurrentMonth: boolean }[] = [];

  // Prev month padding
  const prevM = month === 0 ? 11 : month - 1;
  const prevY = month === 0 ? year - 1 : year;
  const daysInPrev = getDaysInMonth(prevY, prevM);
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    cells.push({ day: daysInPrev - i, month: prevM, year: prevY, isCurrentMonth: false });
  }

  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({ day: i, month, year, isCurrentMonth: true });
  }

  // Next month padding to fill 42 cells
  const nextM = month === 11 ? 0 : month + 1;
  const nextY = month === 11 ? year + 1 : year;
  for (let i = 1; cells.length < 42; i++) {
    cells.push({ day: i, month: nextM, year: nextY, isCurrentMonth: false });
  }

  const getEventsForDay = (cy: number, cm: number, cd: number) =>
    events.filter(e => e.date.getFullYear() === cy && e.date.getMonth() === cm && e.date.getDate() === cd);

  // All days in current month that have events (for the legend count)
  const eventDaysCount = cells.filter(c => c.isCurrentMonth && getEventsForDay(c.year, c.month, c.day).length > 0).length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[calc(100vh-140px)] transition-all animate-in fade-in duration-300 overflow-hidden">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-5 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <Calendar size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {monthNames[month]} {year}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {eventDaysCount} day{eventDaysCount !== 1 ? "s" : ""} with deadlines this month
            </p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          {/* Legend */}
          <div className="hidden lg:flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
              <span className="text-slate-600">Individual Due</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-slate-600">Group Due</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="text-slate-600">Task Deadline</span>
            </div>
          </div>

          {/* Nav */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button onClick={prevMonth} className="p-1.5 hover:bg-white text-slate-600 rounded-lg transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => setCurrentDate(new Date(2026, 4, 1))} className="px-3 py-1 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors">
              Today
            </button>
            <button onClick={nextMonth} className="p-1.5 hover:bg-white text-slate-600 rounded-lg transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 shrink-0 border-b border-slate-100">
        {daysOfWeek.map((d, i) => (
          <div key={i} className={`py-2.5 text-center text-xs font-bold tracking-wide ${i === 0 || i === 6 ? "text-slate-400" : "text-slate-500"}`}>
            {d}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 flex-1 min-h-0 divide-x divide-y divide-slate-100 border-r border-slate-100">
        {cells.map((cell, idx) => {
          const dayEvents = getEventsForDay(cell.year, cell.month, cell.day);
          const isToday = new Date().getDate() === cell.day && new Date().getMonth() === cell.month && new Date().getFullYear() === cell.year;

          return (
            <div
              key={idx}
              className={`p-1.5 flex flex-col min-h-0 group ${
                cell.isCurrentMonth
                  ? "bg-white"
                  : "bg-slate-50/60"
              }`}
            >
              {/* Day number */}
              <div className="flex items-center justify-between mb-1 px-0.5">
                <span className={`text-xs font-bold flex items-center justify-center w-6 h-6 rounded-full ${
                  isToday
                    ? "bg-indigo-600 text-white shadow-sm"
                    : cell.isCurrentMonth
                    ? "text-slate-700"
                    : "text-slate-400"
                }`}>
                  {cell.day}
                </span>
                {dayEvents.length > 1 && (
                  <span className="text-[9px] font-bold text-slate-400">
                    {dayEvents.length}
                  </span>
                )}
              </div>

              {/* Events — scrollable if many */}
              <div className="flex-1 overflow-y-auto space-y-1 min-h-0">
                {dayEvents.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => onSelectProject(event.projectId, event.projectType)}
                    className={`w-full text-left px-1.5 py-1 rounded-md border text-[10px] leading-tight font-semibold transition-all hover:brightness-95 active:scale-[0.98] group/btn flex flex-col gap-0.5 ${event.colorClass} cursor-pointer`}
                  >
                    <div className="flex items-center justify-between gap-0.5 w-full">
                      <span className="truncate opacity-70 text-[9px] font-bold uppercase tracking-wide">{event.course}</span>
                      <ArrowRight size={8} className="opacity-0 group-hover/btn:opacity-60 transition-all shrink-0" />
                    </div>
                    <span className="line-clamp-2 break-words font-semibold leading-snug">
                      {event.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
