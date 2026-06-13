import { Search, Bell, ChevronLeft, UserCircle2 } from "lucide-react";

type HeaderProps = {
  title: string;
  showBackButton?: boolean;
  onBack?: () => void;
};

export default function Header({ title, showBackButton, onBack }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-10 shrink-0 transition-colors shadow-[0_1px_0_rgba(15,23,42,0.04)]">
      <div className="flex items-center gap-4">
        {showBackButton && (
          <button 
            onClick={onBack}
            className="p-1.5 -ml-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        <h1 className="text-xl font-semibold text-slate-800 line-clamp-1">
          {title}
        </h1>
      </div>
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="relative hidden sm:block w-full max-w-xl">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search files..." 
            className="w-full pl-9 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          />
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <button className="relative p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <button className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-slate-100 transition-colors">
          <span className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 text-white flex items-center justify-center shadow-sm overflow-hidden">
            <UserCircle2 size={22} />
          </span>
          <span className="hidden lg:block text-sm font-semibold text-slate-700">John Doe</span>
        </button>
      </div>
    </header>
  );
}
