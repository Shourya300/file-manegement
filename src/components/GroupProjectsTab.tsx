import { Clock } from "lucide-react";
import { groupProjects } from "../lib/data";

type Props = {
  onSelectProject: (id: number) => void;
};

export default function GroupProjectsTab({ onSelectProject }: Props) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-6 py-5 transition-colors">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Assignments</p>
            <h2 className="text-lg font-semibold text-slate-800">Group Projects</h2>
          </div>
          <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
            {groupProjects.length} active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {groupProjects.map((project) => (
          <div 
            key={project.id} 
            className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow cursor-pointer group"
            onClick={() => onSelectProject(project.id)}
          >
            <div className="p-6 border-b border-slate-100 transition-colors">
              <div className="flex justify-between items-start mb-4">
                 <span className="inline-block px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-md transition-colors">
                  {project.course}
                </span>
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full flex items-center gap-1.5 transition-colors">
                  <Clock size={14} /> {project.dueDate}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">{project.title}</h3>
              
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center -space-x-2">
                  {project.team.map((member, i) => (
                    <div 
                      key={i} 
                      className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-white shadow-sm relative transition-colors ${
                        member.name === 'You' ? 'bg-indigo-500 z-40' : 
                        i === 0 ? 'bg-slate-400 z-30' : 
                        i === 1 ? 'bg-slate-500 z-20' : 'bg-slate-600 z-10'
                      }`}
                      title={member.name}
                    >
                      {member.name === 'You' ? 'ME' : member.name.charAt(0)}
                    </div>
                  ))}
                  <button className="w-8 h-8 rounded-full border-2 border-white bg-slate-50 text-slate-500 flex items-center justify-center text-xs font-medium shadow-sm hover:bg-slate-100 transition-colors z-0">
                    +
                  </button>
                </div>
                <button 
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectProject(project.id);
                  }}
                >
                  View Details
                </button>
              </div>
            </div>

            <div className="p-6 bg-slate-50/50 flex-1 transition-colors">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Latest Team Updates</h4>
              <div className="space-y-4">
                {project.recentUpdates.map((update, i) => (
                  <div key={i} className="flex gap-3 relative">
                    {i !== project.recentUpdates.length - 1 && (
                      <div className="absolute left-[11px] top-6 bottom-[-16px] w-0.5 bg-slate-200 transition-colors"></div>
                    )}
                    <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[10px] font-bold shrink-0 shadow-sm z-10 text-slate-600 transition-colors">
                      {update.user.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm text-slate-800">
                        <span className="font-semibold">{update.user}</span> {update.action}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{update.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
