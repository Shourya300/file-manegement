import { FolderOpen, Clock, CheckCircle2, MoreVertical, Calendar, Upload } from "lucide-react";
import { individualProjects } from "../lib/data";

type Props = {
  onSelectProject: (id: number) => void;
};

export default function IndividualProjectsTab({ onSelectProject }: Props) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <FolderOpen size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Projects</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">3</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Upcoming Deadlines</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">2</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Completed</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">12</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Ongoing Assignments</h2>
          <button className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors">
            View all
          </button>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {individualProjects.map((project) => (
            <div 
              key={project.id} 
              className="p-6 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer"
              onClick={() => onSelectProject(project.id)}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="inline-block px-2.5 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 text-xs font-semibold rounded-md mb-2 transition-colors">
                        {project.course}
                      </span>
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {project.title}
                      </h3>
                    </div>
                    <button 
                      className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => { e.stopPropagation(); }}
                    >
                      <MoreVertical size={20} />
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={16} className="text-slate-400 dark:text-slate-500" />
                      <span>Due: <span className="font-medium text-slate-700 dark:text-slate-300">{project.dueDate}</span></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${
                        project.status === 'Completed' ? 'bg-emerald-500' :
                        project.status === 'In Progress' ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-600'
                      }`}></span>
                      <span>{project.status}</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full max-w-md pt-2">
                    <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${
                          project.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'
                        }`}
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="lg:w-80 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700/50 group-hover:bg-white dark:group-hover:bg-slate-800 transition-colors">
                  <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Recent Update</h4>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-8 h-8 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 shadow-sm shrink-0 transition-colors">
                      {project.status === 'Completed' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Upload size={16} />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{project.recentUpdate}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{project.updateTime}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
