import { useEffect, useState } from "react";
import { GroupProject, TimelineEvent } from "../lib/data";
import { Calendar, CalendarDays, CheckCircle2, Clock, Upload, FileText, MessageSquare, Plus, Download, GitBranch, GitPullRequest, Layout, X, Send, Paperclip } from "lucide-react";

type Props = {
  projectId: number;
  groupProjects: GroupProject[];
  setGroupProjects: React.Dispatch<React.SetStateAction<GroupProject[]>>;
};

export default function GroupProjectDetailView({ projectId, groupProjects, setGroupProjects }: Props) {
  const project = groupProjects.find((p) => p.id === projectId);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  const [isAddingUpdate, setIsAddingUpdate] = useState(false);
  const [updateText, setUpdateText] = useState("");
  const [updateDeadline, setUpdateDeadline] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskAbout, setTaskAbout] = useState("");
  const [taskDeadline, setTaskDeadline] = useState("");

  const [localTasks, setLocalTasks] = useState(project?.tasks || []);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: "Alice", text: "Hey team, how is the backend coming along?", time: "10:30 AM", isMe: false },
    { id: 2, user: "You", text: "I'm almost done with the API endpoints.", time: "10:35 AM", isMe: true },
    { id: 3, user: "Bob", text: "Great! I'll start integrating them today.", time: "10:40 AM", isMe: false },
  ]);

  useEffect(() => {
    setLocalTasks(project?.tasks || []);
    setSelectedTaskId(null);
  }, [projectId, project?.tasks]);

  if (!project) return <div className="text-slate-500 p-8">Project not found</div>;

  const selectedTask = selectedTaskId ? localTasks.find((task) => task.id === selectedTaskId) : null;
  const defaultAssigneeId = project.team.find((member) => member.name === "You")?.id || project.team[0]?.id;

  const formatDateForDisplay = (value?: string) => {
    if (!value) return "No deadline set";
    const date = new Date(`${value}T12:00:00`);
    if (isNaN(date.getTime())) return value;
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  };

  const handleAddUpdate = () => {
    if (!updateText.trim() && !attachedFile) return;
    const newEvent: TimelineEvent = {
      id: Date.now(),
      type: attachedFile ? "upload" : "comment",
      user: "You",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      content: updateText || `Uploaded ${attachedFile?.name}`,
      ...(updateDeadline.trim() && { deadline: updateDeadline.trim() }),
      ...(attachedFile && {
        file: {
          name: attachedFile.name,
          size: (attachedFile.size / 1024).toFixed(1) + " KB",
          type: attachedFile.type.split('/')[1]?.toUpperCase() || "FILE"
        }
      })
    };

    // Push the new event into the global group projects state
    setGroupProjects(prev => prev.map(p =>
      p.id === projectId
        ? { ...p, timeline: [newEvent, ...p.timeline] }
        : p
    ));

    setUpdateText("");
    setUpdateDeadline("");
    setAttachedFile(null);
    setIsAddingUpdate(false);
  };

  const handleAddTask = () => {
    if (!taskTitle.trim() || !defaultAssigneeId) return;

    const newTask = {
      id: Date.now(),
      title: taskTitle.trim(),
      about: taskAbout.trim(),
      deadline: taskDeadline || undefined,
      status: "todo" as const,
      assigneeId: defaultAssigneeId,
    };

    setLocalTasks((prev) => [newTask, ...prev]);
    setGroupProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, tasks: [newTask, ...p.tasks] }
          : p
      )
    );

    setTaskTitle("");
    setTaskAbout("");
    setTaskDeadline("");
    setIsAddingTask(false);
    setSelectedTaskId(newTask.id);
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    const newMsg = {
      id: Date.now(),
      user: "You",
      text: chatMessage,
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      isMe: true,
    };
    setChatMessages([...chatMessages, newMsg]);
    setChatMessage("");
  };

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case "upload": return <Upload size={16} className="text-indigo-500" />;
      case "status_change": return <CheckCircle2 size={16} className="text-emerald-500" />;
      case "comment": return <MessageSquare size={16} className="text-blue-500" />;
      case "creation": return <FileText size={16} className="text-slate-500" />;
      case "commit": return <GitBranch size={16} className="text-purple-500" />;
      case "pr": return <GitPullRequest size={16} className="text-rose-500" />;
      default: return <Clock size={16} className="text-slate-500" />;
    }
  };

  const getMemberInitials = (name: string) => name === "You" ? "ME" : name.charAt(0);

  const getMemberColor = (name?: string) => {
    if (!name) return "bg-slate-500";
    const member = project.team.find(m => m.name === name);
    return member ? member.color : "bg-slate-500";
  };

  const localTimeline = project.timeline;

  const filteredTimeline = selectedMemberId
    ? localTimeline.filter(t => {
        const member = project.team.find(m => m.id === selectedMemberId);
        return member && t.user === member.name;
      })
    : localTimeline;

  const tasksTodo = localTasks.filter(t => t.status === "todo");
  const tasksInProgress = localTasks.filter(t => t.status === "in-progress");
  const tasksDone = localTasks.filter(t => t.status === "done");

  const handleTaskStatusChange = (taskId: number, newStatus: string) => {
    setLocalTasks(localTasks.map(t => t.id === taskId ? { ...t, status: newStatus as any } : t));
  };

  const openTaskDetails = (taskId: number) => {
    setSelectedTaskId(taskId);
  };

  const renderTaskCard = (task: typeof project.tasks[0]) => {
    const assignee = project.team.find(m => m.id === task.assigneeId);
    const isMine = assignee?.name === "You";
    return (
      <div
        key={task.id}
        onClick={() => openTaskDetails(task.id)}
        className={`bg-white p-3 rounded-lg shadow-sm border flex flex-col gap-3 transition-colors cursor-pointer ${selectedTaskId === task.id ? "border-indigo-300 ring-1 ring-indigo-200" : "border-slate-100 hover:border-slate-200"}`}
      >
        <p className="text-sm font-medium text-slate-800">{task.title}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm ${assignee?.color}`}>
              {assignee ? getMemberInitials(assignee.name) : "?"}
            </div>
            <span className="text-xs text-slate-500 font-medium">{assignee?.name}</span>
          </div>
          {isMine && (
            <select
              value={task.status}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => handleTaskStatusChange(task.id, e.target.value)}
              className="text-xs border border-slate-200 rounded bg-slate-50 text-slate-600 px-1 py-0.5 outline-none focus:ring-1 focus:ring-indigo-500 transition-colors cursor-pointer"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          )}
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
            {task.deadline ? formatDateForDisplay(task.deadline) : "No deadline"}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openTaskDetails(task.id);
            }}
            className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            Open
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">

      {/* Header Info */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-start justify-between gap-6 transition-colors">
        <div className="space-y-4 max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="inline-block px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold tracking-wider rounded-md uppercase transition-colors">
              {project.course}
            </span>
            <div className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
              <Calendar size={16} />
              <span>Due: {project.dueDate}</span>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-slate-800">{project.title}</h2>

          <p className="text-slate-600 leading-relaxed">
            {project.description}
          </p>
        </div>
      </div>

      {/* Team Roster */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Team Members</h3>
            <span className="text-sm text-slate-500">Click a member to filter activity</span>
          </div>
          <button
            onClick={() => setIsChatOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm font-semibold rounded-xl transition-colors self-start sm:self-auto"
          >
            <MessageSquare size={18} /> Team Chat
          </button>
        </div>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setSelectedMemberId(null)}
            className={`px-4 py-2 rounded-xl border flex items-center gap-2 transition-all ${
              selectedMemberId === null
                ? "bg-slate-100 border-slate-300 shadow-sm"
                : "bg-white border-slate-200 hover:bg-slate-50 text-slate-500"
            }`}
          >
            <span className="text-sm font-semibold text-slate-700">All Members</span>
          </button>
          {project.team.map((member) => (
            <button
              key={member.id}
              onClick={() => setSelectedMemberId(member.id)}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl border transition-all ${
                selectedMemberId === member.id
                  ? "bg-slate-50 border-slate-300 shadow-sm"
                  : "bg-white border-slate-200 hover:bg-slate-50 opacity-70 hover:opacity-100"
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm ${member.color}`}>
                {getMemberInitials(member.name)}
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-800 leading-none mb-1">{member.name}</p>
                <p className="text-xs text-slate-500 font-medium leading-none">{member.role}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Kanban Task Board */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col transition-colors">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center transition-colors">
            <div className="flex items-center gap-2">
              <Layout className="text-indigo-500" size={20} />
              <h3 className="text-lg font-semibold text-slate-800">Project Tasks</h3>
            </div>
            <button
              onClick={() => setIsAddingTask((prev) => !prev)}
              className="p-1.5 bg-white border border-slate-200 rounded-md text-slate-500 hover:text-indigo-600 shadow-sm transition-colors"
              title="Add task"
            >
              <Plus size={16} />
            </button>
          </div>
          {isAddingTask && (
            <div className="p-5 border-b border-slate-100 bg-slate-50/40 space-y-3">
              <div className="grid gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Task Name</label>
                  <input
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="Enter task name"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">About the Task</label>
                  <textarea
                    value={taskAbout}
                    onChange={(e) => setTaskAbout(e.target.value)}
                    placeholder="Add a short description of the task"
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Deadline</label>
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-white">
                    <CalendarDays size={14} className="text-slate-400 shrink-0" />
                    <input
                      type="date"
                      value={taskDeadline}
                      onChange={(e) => setTaskDeadline(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-slate-700 text-sm"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => {
                    setIsAddingTask(false);
                    setTaskTitle("");
                    setTaskAbout("");
                    setTaskDeadline("");
                  }}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTask}
                  disabled={!taskTitle.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
                >
                  Save Task
                </button>
              </div>
            </div>
          )}
          <div className="p-6 flex-1 bg-slate-50/30 overflow-x-auto transition-colors">
            <div className="flex gap-4 min-w-[600px] h-full">
              <div className="flex-1 flex flex-col gap-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-slate-300"></span> To Do ({tasksTodo.length})
                </h4>
                {tasksTodo.map(renderTaskCard)}
              </div>

              <div className="flex-1 flex flex-col gap-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span> In Progress ({tasksInProgress.length})
                </h4>
                {tasksInProgress.map(renderTaskCard)}
              </div>

              <div className="flex-1 flex flex-col gap-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Done ({tasksDone.length})
                </h4>
                {tasksDone.map(renderTaskCard)}
              </div>
            </div>
          </div>
          <div className="border-t border-slate-100 p-6 bg-white">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-800">Task Details</h4>
                <p className="text-xs text-slate-500">Click a task to open its information here.</p>
              </div>
              {selectedTask && (
                <button
                  onClick={() => setSelectedTaskId(null)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            {selectedTask ? (
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">{selectedTask.status}</p>
                    <h5 className="text-lg font-bold text-slate-800">{selectedTask.title}</h5>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                    {formatDateForDisplay(selectedTask.deadline)}
                  </span>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">About</p>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {selectedTask.about || "No description has been added for this task yet."}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                  <div className="rounded-xl bg-white border border-slate-100 p-3">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Assignee</p>
                    <p className="font-medium text-slate-800">{project.team.find((member) => member.id === selectedTask.assigneeId)?.name || "Unassigned"}</p>
                  </div>
                  <div className="rounded-xl bg-white border border-slate-100 p-3">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Deadline</p>
                    <p className="font-medium text-slate-800">{formatDateForDisplay(selectedTask.deadline)}</p>
                  </div>
                  <div className="rounded-xl bg-white border border-slate-100 p-3">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Status</p>
                    <p className="font-medium text-slate-800 capitalize">{selectedTask.status}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                Select a task to see the task name, details, and deadline.
              </div>
            )}
          </div>
        </div>

        {/* Combined Timeline */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col transition-colors">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center transition-colors">
            <div className="flex items-center gap-2">
              <Clock className="text-blue-500" size={20} />
              <h3 className="text-lg font-semibold text-slate-800">
                {selectedMemberId
                  ? `Activity: ${project.team.find(m => m.id === selectedMemberId)?.name}`
                  : "Combined Activity Timeline"}
              </h3>
            </div>
            <button
              onClick={() => setIsAddingUpdate(!isAddingUpdate)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 text-slate-600 text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
              <Plus size={16} /> Add Update
            </button>
          </div>

          {isAddingUpdate && (
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 animate-in slide-in-from-top-2 space-y-3">
              <textarea
                className="w-full p-3 rounded-lg border border-slate-200 bg-white text-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-colors"
                rows={2}
                placeholder="What's your update?"
                value={updateText}
                onChange={(e) => setUpdateText(e.target.value)}
              />

              {/* Deadline field */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white">
                <CalendarDays size={14} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={updateDeadline}
                  onChange={(e) => setUpdateDeadline(e.target.value)}
                  placeholder="Task deadline (e.g. May 10, 2026) — optional"
                  className="flex-1 bg-transparent outline-none text-slate-700 placeholder:text-slate-400 text-sm"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div className="flex items-center gap-2">
                  <input type="file" id="file-upload" className="hidden" onChange={(e) => setAttachedFile(e.target.files?.[0] || null)} />
                  <label htmlFor="file-upload" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 rounded-lg cursor-pointer transition-colors shadow-sm">
                    <Paperclip size={14} />
                    <span className="truncate max-w-[150px]">{attachedFile ? attachedFile.name : "Attach File"}</span>
                  </label>
                  {attachedFile && (
                    <button onClick={() => setAttachedFile(null)} className="p-1 text-slate-400 hover:text-rose-500 transition-colors bg-slate-100 hover:bg-rose-50 rounded-full">
                      <X size={12} />
                    </button>
                  )}
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => { setIsAddingUpdate(false); setAttachedFile(null); setUpdateText(""); setUpdateDeadline(""); }} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors">
                    Cancel
                  </button>
                  <button onClick={handleAddUpdate} disabled={!updateText.trim() && !attachedFile} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white text-sm font-medium rounded-lg shadow-sm transition-colors">
                    Post Update
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="p-6 flex-1 overflow-y-auto max-h-[600px]">
            {filteredTimeline.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400">
                No activity found for this member.
              </div>
            ) : (
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[1.125rem] before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                {filteredTimeline.map((event) => (
                  <div key={event.id} className="relative flex gap-4">
                    <div className="relative z-10 w-9 h-9 shrink-0">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm ring-4 ring-white ${getMemberColor(event.user)}`}>
                        {event.user ? getMemberInitials(event.user) : "?"}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                        {getTimelineIcon(event.type)}
                      </div>
                    </div>

                    <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-100 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-slate-800">{event.user}</span>
                        <span className="text-xs text-slate-400">{event.date} • {event.time}</span>
                      </div>
                      <p className="text-sm text-slate-600 mb-2 leading-relaxed">{event.content}</p>

                      {event.deadline && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-semibold rounded-lg mb-2">
                          <CalendarDays size={11} />
                          Deadline: {event.deadline}
                        </div>
                      )}

                      {event.file && (
                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 hover:border-indigo-300 transition-colors cursor-pointer group/file">
                          <div className="p-2 bg-indigo-50 rounded shadow-sm shrink-0 transition-colors">
                            <FileText size={16} className="text-indigo-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-700 truncate group-hover/file:text-indigo-600 transition-colors">{event.file.name}</p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider">{event.file.size} • {event.file.type}</p>
                          </div>
                          <button className="text-slate-400 hover:text-indigo-600 transition-colors p-1">
                            <Download size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Floating Chat Window */}
      {isChatOpen && (
        <div className="fixed bottom-6 right-6 w-[340px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="px-4 py-3 bg-indigo-600 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <MessageSquare size={18} />
              <span className="font-semibold text-sm">{project.title} Chat</span>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="text-indigo-100 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto h-[350px] bg-slate-50 flex flex-col gap-4">
            {chatMessages.map(msg => (
              <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                {!msg.isMe && <span className="text-[11px] font-medium text-slate-500 ml-1 mb-1">{msg.user}</span>}
                <div className={`px-4 py-2.5 max-w-[85%] text-sm shadow-sm ${msg.isMe ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-sm' : 'bg-white text-slate-800 border border-slate-100 rounded-2xl rounded-tl-sm'}`}>
                  {msg.text}
                </div>
                <span className="text-[10px] font-medium text-slate-400 mt-1">{msg.time}</span>
              </div>
            ))}
          </div>
          <div className="p-3 bg-white border-t border-slate-100">
            <div className="flex items-center gap-2 bg-slate-100 rounded-full p-1 border border-transparent focus-within:border-indigo-300 transition-colors">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-transparent border-none px-4 py-1.5 text-sm text-slate-800 focus:outline-none placeholder:text-slate-400"
              />
              <button onClick={handleSendMessage} disabled={!chatMessage.trim()} className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors shrink-0">
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
