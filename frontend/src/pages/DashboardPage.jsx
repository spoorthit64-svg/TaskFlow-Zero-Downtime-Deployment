import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { taskApi } from '../api/taskApi';
import { StatCard } from '../components/StatCard';
import { DonutChart } from '../components/DonutChart';
import { PriorityBarChart } from '../components/PriorityBarChart';
import { TaskCard } from '../components/TaskCard';
import { TaskModal } from '../components/TaskModal';
import { TaskDetailsModal } from '../components/TaskDetailsModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import {
  CheckCircle2,
  Clock,
  PlayCircle,
  ListTodo,
  TrendingUp,
  Plus,
  ArrowRight,
  RefreshCw,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [detailsTask, setDetailsTask] = useState(null);
  const [deleteTask, setDeleteTask] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      setError('');
      const data = await taskApi.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const handleUpdate = () => fetchStats();
    window.addEventListener('taskflow_task_updated', handleUpdate);
    return () => window.removeEventListener('taskflow_task_updated', handleUpdate);
  }, [fetchStats]);

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskApi.updateTaskStatus(taskId, newStatus);
      showToast('Task status updated', 'success');
      fetchStats();
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTask) return;
    setIsDeleting(true);
    try {
      await taskApi.deleteTask(deleteTask.id);
      showToast('Task deleted successfully', 'success');
      setDeleteTask(null);
      fetchStats();
    } catch (err) {
      showToast(err.message || 'Failed to delete task', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-28 bg-slate-200/70 rounded-2xl" />
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-200/70 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-slate-200/70 rounded-2xl" />
          <div className="h-64 bg-slate-200/70 rounded-2xl" />
        </div>
      </div>
    );
  }

  const activeCount = (stats?.pendingTasks || 0) + (stats?.inProgressTasks || 0);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {getTimeGreeting()}, {user?.name || 'Workspace Leader'}!
            </h2>
            <p className="mt-1 text-sm text-slate-300 font-medium">
              You have <strong className="text-white">{activeCount} active task{activeCount === 1 ? '' : 's'}</strong> remaining in your sprint queue.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedTask(null);
                setIsTaskModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Task
            </button>
            <button
              onClick={fetchStats}
              title="Refresh Data"
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchStats}
            className="text-xs font-bold underline hover:no-underline cursor-pointer"
          >
            Try Again
          </button>
        </div>
      )}

      {/* 5 Stats Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Tasks"
          value={stats?.totalTasks || 0}
          icon={ListTodo}
          color="indigo"
          subtitle="All created tasks"
        />
        <StatCard
          title="Completed"
          value={stats?.completedTasks || 0}
          icon={CheckCircle2}
          color="emerald"
          subtitle="Finished deliverables"
        />
        <StatCard
          title="In Progress"
          value={stats?.inProgressTasks || 0}
          icon={PlayCircle}
          color="amber"
          subtitle="Currently active"
        />
        <StatCard
          title="Pending"
          value={stats?.pendingTasks || 0}
          icon={Clock}
          color="blue"
          subtitle="Waiting in backlog"
        />
        <StatCard
          title="Completion Rate"
          value={`${stats?.completionRate || 0}%`}
          icon={TrendingUp}
          color="purple"
          subtitle="Overall project progress"
        />
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Breakdown Donut Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Task Status Breakdown</h3>
              <p className="text-xs text-slate-500 font-medium">Distribution across project lifecycle</p>
            </div>
            <Link
              to="/kanban"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              Open Kanban <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <DonutChart
            completed={stats?.completedTasks || 0}
            inProgress={stats?.inProgressTasks || 0}
            pending={stats?.pendingTasks || 0}
          />
        </div>

        {/* Priority Matrix */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Priority Matrix</h3>
              <p className="text-xs text-slate-500 font-medium">Workload urgency distribution</p>
            </div>
            <Link
              to="/tasks"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="pt-4">
            <PriorityBarChart
              high={stats?.tasksByPriority?.HIGH || 0}
              medium={stats?.tasksByPriority?.MEDIUM || 0}
              low={stats?.tasksByPriority?.LOW || 0}
            />
          </div>
        </div>
      </div>

      {/* Recent Tasks Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Deliverables</h3>
            <p className="text-xs text-slate-500 font-medium">Recently updated and queued tasks</p>
          </div>
          <Link
            to="/tasks"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
          >
            Manage All Tasks ({stats?.totalTasks || 0})
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats?.recentTasks && stats.recentTasks.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.recentTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onViewDetails={(t) => setDetailsTask(t)}
                onEdit={(t) => {
                  setSelectedTask(t);
                  setIsTaskModalOpen(true);
                }}
                onDelete={(t) => setDeleteTask(t)}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
              <ListTodo className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">No tasks in your queue yet</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Create your first project deliverable or milestone to start tracking progress.
            </p>
            <button
              onClick={() => {
                setSelectedTask(null);
                setIsTaskModalOpen(true);
              }}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Create First Task
            </button>
          </div>
        )}
      </div>

      {/* Task Creation / Edit Modal */}
      {isTaskModalOpen && (
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => {
            setIsTaskModalOpen(false);
            setSelectedTask(null);
          }}
          onTaskSaved={fetchStats}
          initialData={selectedTask}
        />
      )}

      {/* Task Details Modal */}
      {detailsTask && (
        <TaskDetailsModal
          isOpen={!!detailsTask}
          onClose={() => setDetailsTask(null)}
          task={detailsTask}
          onEdit={(t) => {
            setSelectedTask(t);
            setIsTaskModalOpen(true);
          }}
          onDelete={(t) => setDeleteTask(t)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteTask && (
        <DeleteConfirmModal
          isOpen={!!deleteTask}
          onClose={() => setDeleteTask(null)}
          onConfirm={handleDeleteConfirm}
          taskTitle={deleteTask.title}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};