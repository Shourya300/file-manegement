import { useState } from "react";
import { IndividualProject, TimelineEvent } from "../lib/data";
import { Calendar, Upload, FileText, Plus, Download, X, Paperclip, Clock, CheckCircle2, MessageSquare, GitBranch, CalendarDays } from "lucide-react";

type Props = {
  projectId: number;
  onSelectProject?: (id: number) => void;
  projects: IndividualProject[];
  setProjects: React.Dispatch<React.SetStateAction<IndividualProject[]>>;
};

export default function ProjectDetailView({ projectId, projects, setProjects }: Props) {
  const project = projects.find((p) => p.id === projectId);

  const [taskText, setTaskText] = useState("");
  const [taskDeadline, setTaskDeadline] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  const formatDeadlineForDisplay = (deadlineValue: string) => {
    const deadlineDate = new Date(`${deadlineValue}T12:00:00`);
    if (isNaN(deadlineDate.getTime())) return deadlineValue;

    return deadlineDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getProgressForStatus = (status: IndividualProject["status"]) => {
    switch (status) {
      case "Completed":
        return 100;
      case "In Progress":
        return 60;
      default:
        return 20;
    }
  };

  if (!project) return <div className="text-slate-500 p-8">Project not found</div>;

  const handleStatusChange = (nextStatus: IndividualProject["status"]) => {
    if (nextStatus === project.status) return;

    const statusEvent: TimelineEvent = {
      id: Date.now(),
      type: "status_change",
      content: `Status changed to ${nextStatus}.`,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    };

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;

        return {
          ...p,
          status: nextStatus,
          progress: getProgressForStatus(nextStatus),
          recentUpdate: statusEvent.content,
          updateTime: "Just now",
          timeline: [...p.timeline, statusEvent],
        };
      })
    );
  };

  const handleAddTask = () => {
    if (!taskText.trim() && !attachedFile) return;

    const deadlineForDisplay = taskDeadline ? formatDeadlineForDisplay(taskDeadline) : "";

    const newEvent: TimelineEvent = {
      id: Date.now(),
      type: attachedFile ? "upload" : "comment",
      content: taskText || `Uploaded ${attachedFile?.name}`,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      ...(deadlineForDisplay && { deadline: deadlineForDisplay }),
      ...(attachedFile && {
        file: {
          name: attachedFile.name,
          size: (attachedFile.size / 1024).toFixed(1) + " KB",
          type: attachedFile.type.split("/")[1]?.toUpperCase() || "FILE",
        },
      }),
    };

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            timeline: [...p.timeline, newEvent],
            recentUpdate: newEvent.content,
            updateTime: "Just now",
          };
        }
        return p;
      })
    );

    setTaskText("");
    setTaskDeadline("");
    setAttachedFile(null);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "upload": return <Upload size={14} className="text-indigo-500" />;
      case "status_change": return <CheckCircle2 size={14} className="text-emerald-500" />;
      case "comment": return <MessageSquare size={14} className="text-blue-500" />;
      case "creation": return <FileText size={14} className="text-slate-400" />;
      case "commit": return <GitBranch size={14} className="text-purple-500" />;
      default: return <Clock size={14} className="text-slate-400" />;
    }
  };

  const getActivityLabel = (type: string) => {
    switch (type) {
      case "upload": return "File Upload";
      case "status_change": return "Status Change";
      case "comment": return "Task Update";
      case "creation": return "Assignment Start";
      case "commit": return "Commit";
      default: return "Activity";
    }
  };

  // Newest first for the activity log
  const displayTasks = [...project.timeline].reverse();

  // Chronological order for timeline sidebar
  const timelineEvents = [...project.timeline].sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`).getTime();
    const dateB = new Date(`${b.date} ${b.time}`).getTime();
    return isNaN(dateA) || isNaN(dateB) ? 0 : dateA - dateB;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">

      {/* Header */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 transition-colors">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold tracking-wider rounded-md uppercase">
              {project.course}
            </span>
            <div className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
              <Calendar size={15} />
              <span>Due: {project.dueDate}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-medium ml-2">
              <span className={`w-2 h-2 rounded-full ${
                project.status === "Completed" ? "bg-emerald-500" :
                project.status === "In Progress" ? "bg-amber-500" : "bg-slate-300"
              }`} />
              <select
                value={project.status}
                onChange={(e) => handleStatusChange(e.target.value as IndividualProject["status"])}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-600 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                aria-label="Change assignment status"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-slate-800">{project.title}</h2>

          <p className="text-slate-600 leading-relaxed max-w-4xl">
            {project.description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Activity Log */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col transition-colors">

          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FileText className="text-indigo-500" size={20} />
              <h3 className="text-lg font-semibold text-slate-800">Tasks & Activities</h3>
              <span className="ml-1 text-xs font-bold px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full">
                {project.timeline.length}
              </span>
            </div>
          </div>

          {/* Add Task Form */}
          <div className="p-6 border-b border-slate-100 bg-slate-50/30">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Post Task Update or Upload File
            </p>
            <div className="flex flex-col gap-3">
              <textarea
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
                placeholder="Write a task update, progress note, or describe an upload..."
                rows={2}
                className="w-full p-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-colors"
              />

              {/* Deadline + Attach row */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex items-center gap-2 flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm">
                  <CalendarDays size={15} className="text-slate-400 shrink-0" />
                  <input
                    type="date"
                    value={taskDeadline}
                    onChange={(e) => setTaskDeadline(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-slate-700 text-sm"
                  />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <input
                    type="file"
                    id="task-file-upload"
                    className="hidden"
                    onChange={(e) => setAttachedFile(e.target.files?.[0] || null)}
                  />
                  <label
                    htmlFor="task-file-upload"
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-500 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 rounded-xl cursor-pointer transition-colors border border-slate-200"
                  >
                    <Paperclip size={14} />
                    <span className="truncate max-w-[130px]">{attachedFile ? attachedFile.name : "Attach File"}</span>
                  </label>
                  {attachedFile && (
                    <button
                      onClick={() => setAttachedFile(null)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 bg-slate-100 hover:bg-rose-50 rounded-full transition-colors"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>

              <button
                onClick={handleAddTask}
                disabled={!taskText.trim() && !attachedFile}
                className="w-full sm:w-auto self-end px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors flex items-center gap-2 justify-center"
              >
                <Plus size={15} />
                Add Update
              </button>
            </div>
          </div>

          {/* Activity Feed (newest first) */}
          <div className="p-6 flex-1 overflow-y-auto max-h-[480px] space-y-3">
            {displayTasks.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-slate-400 gap-2">
                <FileText className="opacity-20" size={44} />
                <p className="text-sm">No tasks or activities yet.</p>
              </div>
            ) : (
              displayTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex gap-3 p-4 rounded-xl border bg-white border-slate-100 hover:border-slate-200 transition-all shadow-sm group"
                >
                  {/* Icon */}
                  <div className="mt-0.5 w-7 h-7 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                    {getActivityIcon(task.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md uppercase tracking-wider">
                        {getActivityLabel(task.type)}
                      </span>
                      <span className="text-xs text-slate-400 font-medium shrink-0">
                        {task.date} · {task.time}
                      </span>
                    </div>

                    <p className="text-sm text-slate-700 font-medium leading-snug mb-2">
                      {task.content}
                    </p>

                    {task.deadline && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-semibold rounded-lg mb-2">
                        <CalendarDays size={11} />
                        Deadline: {task.deadline}
                      </div>
                    )}

                    {task.file && (
                      <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg border border-slate-100 hover:border-indigo-200 transition-colors cursor-pointer group/file max-w-sm">
                        <FileText size={15} className="text-indigo-500 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-700 truncate">{task.file.name}</p>
                          <p className="text-[10px] text-slate-400">{task.file.size} · {task.file.type}</p>
                        </div>
                        <Download size={13} className="text-slate-400 group-hover/file:text-indigo-500 transition-colors shrink-0" />
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">

          {/* Task Deadline Timeline for this assignment */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 transition-colors">
            <div className="flex items-center gap-2 mb-5">
              <CalendarDays size={18} className="text-indigo-500" />
              <h3 className="text-sm font-semibold text-slate-800">Task Timeline</h3>
            </div>

            {timelineEvents.length === 0 ? (
              <p className="text-sm text-slate-400 italic text-center py-4">No timeline events yet.</p>
            ) : (
              <div className="relative border-l-2 border-slate-100 ml-2 pl-5 space-y-5">
                {timelineEvents.map((event, idx) => {
                  const isLast = idx === timelineEvents.length - 1;
                  return (
                    <div key={event.id} className="relative">
                      {/* Node */}
                      <span className={`absolute -left-[25px] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 bg-white ${
                        event.deadline
                          ? "border-amber-400"
                          : isLast
                          ? "border-indigo-500"
                          : "border-slate-300"
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          event.deadline
                            ? "bg-amber-400"
                            : isLast
                            ? "bg-indigo-500"
                            : "bg-slate-300"
                        }`} />
                      </span>

                      <div>
                        {/* Date + time */}
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">
                          {event.date} · {event.time}
                        </p>

                        {/* Content */}
                        <p className="text-xs font-semibold text-slate-700 leading-snug">
                          {event.content}
                        </p>

                        {/* Deadline badge */}
                        {event.deadline && (
                          <div className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold rounded-md">
                            <CalendarDays size={10} />
                            Due: {event.deadline}
                          </div>
                        )}

                        {/* File indicator */}
                        {event.file && (
                          <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-indigo-600 font-semibold">
                            <FileText size={10} />
                            {event.file.name}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Latest Files */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 transition-colors">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Latest Files</h3>
            <div className="space-y-2">
              {project.timeline.filter((t) => t.file).length === 0 ? (
                <p className="text-sm text-slate-500 italic text-center py-4">No files uploaded yet.</p>
              ) : (
                project.timeline
                  .filter((t) => t.file)
                  .slice()
                  .reverse()
                  .map((event, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 transition-colors rounded-xl border border-slate-100 cursor-pointer"
                    >
                      <FileText size={15} className="text-indigo-500 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-700 truncate">{event.file?.name}</p>
                        <p className="text-[10px] text-slate-400">{event.date}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0">{event.file?.size}</span>
                    </div>
                  ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
