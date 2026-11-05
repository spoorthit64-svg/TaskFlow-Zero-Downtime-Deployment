import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { TopHeader } from '../components/TopHeader';
import { NetworkBanner } from '../components/NetworkBanner';
import { ToastContainer } from '../components/ToastContainer';
import { TaskModal } from '../components/TaskModal';

export const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Overview Dashboard';
      case '/tasks':
        return 'Task Management';
      case '/kanban':
        return 'Kanban Board';
      case '/profile':
        return 'Profile & Account Settings';
      default:
        return 'Dashboard';
    }
  };

  const handleTaskCreated = () => {
    // Notify child views to refresh their task lists
    window.dispatchEvent(new CustomEvent('taskflow_task_updated'));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <NetworkBanner />
      <ToastContainer />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <TopHeader
            title={getPageTitle()}
            onMenuClick={() => setIsSidebarOpen(true)}
            onOpenNewTask={() => setIsTaskModalOpen(true)}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Global Quick New Task Modal */}
      {isTaskModalOpen && (
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          onTaskSaved={handleTaskCreated}
        />
      )}
    </div>
  );
};