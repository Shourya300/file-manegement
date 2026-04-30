import { individualProjects } from "../lib/data";
import { Calendar, CheckCircle2, Clock, Upload, FileText, MessageSquare, Plus, Download } from "lucide-react";

type Props = {
  projectId: number;
};

export default function ProjectDetailView({ projectId }: Props) {
  const project = individualProjects.find((p) => p.id === projectId);

  if (!project) return <div>Project not found</div>;

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case "upload": return <Upload size={16} className="text-indigo-500" />;
      case "status_change": return <CheckCircle2 size={16} className="text-emerald-500" />;
      case "comment": return <MessageSquare size={16} className="text-blue-500" />;
      case "creation": return <FileText size={16} className="text-slate-500" />;
      default: return <Clock size={16} className="text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
      
      {/* Header Info */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold tracking-wider rounded-md uppercase">
              {project.course}
            </span>
            <div className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
              <Calendar size={16} />
              <span>Due: {project.dueDate}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-slate-500 font-medium ml-2">
              <span className={`w-2 h-2 rounded-full ${
                project.status === 'Completed' ? 'bg-emerald-500' :
                project.status === 'In Progress' ? 'bg-amber-500' : 'bg-slate-300'
              }`}></span>
              <span>{project.status}</span>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-slate-800">{project.title}</h2>
          
          <p className="text-slate-600 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Progress Circle or Bar */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 min-w-[240px] shrink-0">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Current Progress</h3>
          <div className="flex items-end gap-3 mb-2">
            <span className="text-4xl font-bold text-indigo-600">{project.progress}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5 mb-4">
            <div 
              className={`h-2.5 rounded-full transition-all duration-1000 ${
                project.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'
              }`}
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
          <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
            <Plus size={18} />
            Add Update
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-lg font-semibold text-slate-800">Activity Timeline</h3>
          </div>
          <div className="p-8">
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-10 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
              {project.timeline.map((event) => (
                <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  {/* Timeline Icon */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    {getTimelineIcon(event.type)}
                  </div>
                  
                  {/* Content Card */}
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-xl border border-slate-100 shadow-sm group-hover:shadow-md transition-shadow relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">{event.date}</span>
                      <span className="text-xs font-medium text-slate-400">{event.time}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-800 mb-3">{event.content}</p>
                    
                    {/* Attached File if any */}
                    {event.file && (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 group-hover:bg-indigo-50/50 transition-colors cursor-pointer">
                        <div className="p-2 bg-white rounded shadow-sm shrink-0">
                          <FileText size={20} className="text-indigo-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-700 truncate">{event.file.name}</p>
                          <p className="text-xs text-slate-500">{event.file.size} • {event.file.type}</p>
                        </div>
                        <button className="text-slate-400 hover:text-indigo-600 transition-colors p-1">
                          <Download size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Latest Files</h3>
            <div className="space-y-3">
              {project.timeline.filter(t => t.file).map((event, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 transition-colors rounded-lg border border-slate-100 cursor-pointer">
                  <FileText size={16} className="text-indigo-500 shrink-0" />
                  <span className="text-sm font-medium text-slate-700 truncate flex-1">{event.file?.name}</span>
                  <span className="text-xs text-slate-400 shrink-0">{event.file?.size}</span>
                </div>
              ))}
              {project.timeline.filter(t => t.file).length === 0 && (
                <p className="text-sm text-slate-500 italic text-center py-4">No files uploaded yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
