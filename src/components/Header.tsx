import { Search, Bell, ChevronLeft } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

type HeaderProps = {
  title: string;
  showBackButton?: boolean;
  onBack?: () => void;
};

export default function Header({ title, showBackButton, onBack }: HeaderProps) {
  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-10 shrink-0 transition-colors">
      <div className="flex items-center gap-4">
        {showBackButton && (
          <button 
            onClick={onBack}
            className="p-1.5 -ml-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100 line-clamp-1">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <div className="relative hidden sm:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input 
            type="text" 
            placeholder="Search files..." 
            className="pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-full text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 w-48 lg:w-64 transition-all"
          />
        </div>
        <ThemeToggle />
        <button className="relative p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>
      </div>
    </header>
  );
}
