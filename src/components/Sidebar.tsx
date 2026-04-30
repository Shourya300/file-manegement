import { LayoutDashboard, FolderOpen, Users, LogOut } from "lucide-react";

type SidebarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-col hidden md:flex shrink-0 transition-colors">
      <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
          <LayoutDashboard size={24} className="fill-indigo-600/20 dark:fill-indigo-400/20" />
          <span className="text-xl font-bold tracking-tight">StudentDash</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 px-2">Menu</div>
        
        <button 
          onClick={() => setActiveTab("individual")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === "individual" 
              ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400" 
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <FolderOpen size={18} className={activeTab === "individual" ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"} />
          Individual Projects
        </button>
        
        <button 
          onClick={() => setActiveTab("group")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === "group" 
              ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400" 
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <Users size={18} className={activeTab === "group" ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"} />
          Group Projects
        </button>
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-semibold text-sm shadow-sm shrink-0">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">John Doe</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">ID: 2026101</p>
          </div>
        </div>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-colors">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
