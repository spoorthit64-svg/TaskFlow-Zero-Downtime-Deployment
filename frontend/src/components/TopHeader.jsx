import React from 'react';
import { Menu, Plus, Activity, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const TopHeader = ({ onMenuClick, onOpenNewTask, title = 'Dashboard' }) => {
  const { user, serverStatus, serverDetails } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left Title & Mobile Menu */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none">
            {title}
          </h1>
          <p className="text-xs text-slate-500 font-medium hidden sm:block mt-1">
            TaskFlow Cloud Workspace
          </p>
        </div>
      </div>

      {/* Right Action Bar */}
      <div className="flex items-center gap-3">
        {/* Backend health status pill */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          <span
            className={`w-2 h-2 rounded-full ${
              serverStatus === 'online'
                ? 'bg-emerald-500'
                : serverStatus === 'offline'
                ? 'bg-rose-500'
                : 'bg-amber-500'
            }`}
          />
          <span>{serverStatus === 'online' ? 'System Normal' : 'API Standby'}</span>
        </div>

        {/* Quick Create Task Button */}
        <button
          onClick={onOpenNewTask}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-sm font-semibold shadow-sm hover:shadow-md hover:shadow-indigo-500/20 transition-all cursor-pointer transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Task</span>
        </button>
      </div>
    </header>
  );
};