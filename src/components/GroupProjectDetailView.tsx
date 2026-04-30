import { useState } from "react";
import { groupProjects } from "../lib/data";
import { Calendar, CheckCircle2, Clock, Upload, FileText, MessageSquare, Plus, Download, GitBranch, GitPullRequest, Layout } from "lucide-react";

type Props = {
  projectId: number;
};

export default function GroupProjectDetailView({ projectId }: Props) {
  const project = groupProjects.find((p) => p.id === projectId);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  if (!project) return <div>Project not found</div>;

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case "upload": return <Upload size={16} className="text-indigo-500 dark:text-indigo-400" />;
      case "status_change": return <CheckCircle2 size={16} className="text-emerald-500 dark:text-emerald-400" />;
      case "comment": return <MessageSquare size={16} className="text-blue-500 dark:text-blue-400" />;
      case "creation": return <FileText size={16} className="text-slate-500 dark:text-slate-400" />;
      case "commit": return <GitBranch size={16} className="text-purple-500 dark:text-purple-400" />;
      case "pr": return <GitPullRequest size={16} className="text-rose-500 dark:text-rose-400" />;
      default: return <Clock size={16} className="text-slate-500 dark:text-slate-400" />;
    }
  };

  const getMemberInitials = (name: string) => name === "You" ? "ME" : name.charAt(0);

  const getMemberColor = (name?: string) => {
    if (!name) return "bg-slate-500";
    const member = project.team.find(m => m.name === name);
    return member ? member.color : "bg-slate-500";
  };

  const filteredTimeline = selectedMemberId 
    ? project.timeline.filter(t => {
        const member = project.team.find(m => m.id === selectedMemberId);
        return member && t.user === member.name;
      })
    : project.timeline;

  const tasksTodo = project.tasks.filter(t => t.status === "todo");
  const tasksInProgress = project.tasks.filter(t => t.status === "in-progress");
  const tasksDone = project.tasks.filter(t => t.status === "done");

  const renderTaskCard = (task: typeof project.tasks[0]) => {
    const assignee = project.team.find(m => m.id === task.assigneeId);
    return (
      <div key={task.id} className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col gap-3 transition-colors">
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{task.title}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm ${assignee?.color}`}>
              {assignee ? getMemberInitials(assignee.name) : "?"}
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{assignee?.name}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
      
      {/* Header Info */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-start justify-between gap-6 transition-colors">
        <div className="space-y-4 max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="inline-block px-3 py-1 bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 text-xs font-bold tracking-wider rounded-md uppercase transition-colors">
              {project.course}
            </span>
            <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 font-medium">
              <Calendar size={16} />
              <span>Due: {project.dueDate}</span>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{project.title}</h2>
          
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {project.description}
          </p>
        </div>
      </div>

      {/* Team Roster */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Team Members</h3>
          <span className="text-sm text-slate-500 dark:text-slate-400">Click a member to filter activity</span>
        </div>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => setSelectedMemberId(null)}
            className={`px-4 py-2 rounded-xl border flex items-center gap-2 transition-all ${
              selectedMemberId === null 
                ? "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 shadow-sm" 
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-500"
            }`}
          >
            <span className="text-sm font-semibold dark:text-slate-300">All Members</span>
          </button>
          {project.team.map((member) => (
            <button 
              key={member.id}
              onClick={() => setSelectedMemberId(member.id)}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl border transition-all ${
                selectedMemberId === member.id 
                  ? "bg-slate-50 dark:bg-slate-800/80 border-slate-300 dark:border-slate-600 shadow-sm" 
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 opacity-70 hover:opacity-100"
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm ${member.color}`}>
                {getMemberInitials(member.name)}
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-none mb-1">{member.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-none">{member.role}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Kanban Task Board */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col transition-colors">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center transition-colors">
            <div className="flex items-center gap-2">
              <Layout className="text-indigo-500 dark:text-indigo-400" size={20} />
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Project Tasks</h3>
            </div>
            <button className="p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm transition-colors">
              <Plus size={16} />
            </button>
          </div>
          <div className="p-6 flex-1 bg-slate-50/30 dark:bg-slate-950/30 overflow-x-auto transition-colors">
            <div className="flex gap-4 min-w-[600px] h-full">
              {/* To Do Column */}
              <div className="flex-1 flex flex-col gap-3">
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600"></span> To Do ({tasksTodo.length})
                </h4>
                {tasksTodo.map(renderTaskCard)}
              </div>
              
              {/* In Progress Column */}
              <div className="flex-1 flex flex-col gap-3">
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span> In Progress ({tasksInProgress.length})
                </h4>
                {tasksInProgress.map(renderTaskCard)}
              </div>

              {/* Done Column */}
              <div className="flex-1 flex flex-col gap-3">
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Done ({tasksDone.length})
                </h4>
                {tasksDone.map(renderTaskCard)}
              </div>
            </div>
          </div>
        </div>

        {/* Combined Timeline */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col transition-colors">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 transition-colors">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              {selectedMemberId 
                ? `Activity: ${project.team.find(m => m.id === selectedMemberId)?.name}` 
                : "Combined Activity Timeline"}
            </h3>
          </div>
          <div className="p-6 flex-1 overflow-y-auto max-h-[600px]">
            {filteredTimeline.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 dark:text-slate-500">
                No activity found for this member.
              </div>
            ) : (
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[1.125rem] before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-700 before:to-transparent">
                {filteredTimeline.map((event) => (
                  <div key={event.id} className="relative flex gap-4">
                    {/* Tiny User Avatar Indicator */}
                    <div className="relative z-10 w-9 h-9 shrink-0">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm ring-4 ring-white dark:ring-slate-900 ${getMemberColor(event.user)}`}>
                        {event.user ? getMemberInitials(event.user) : "?"}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm">
                         {getTimelineIcon(event.type)}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{event.user}</span>
                        <span className="text-xs text-slate-400 dark:text-slate-500">{event.date} • {event.time}</span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">{event.content}</p>
                      
                      {event.file && (
                        <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-colors cursor-pointer group/file">
                          <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded shadow-sm shrink-0 transition-colors">
                            <FileText size={16} className="text-indigo-500 dark:text-indigo-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate group-hover/file:text-indigo-600 dark:group-hover/file:text-indigo-400 transition-colors">{event.file.name}</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">{event.file.size} • {event.file.type}</p>
                          </div>
                          <button className="text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-1">
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
    </div>
  );
}
