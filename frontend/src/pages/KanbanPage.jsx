import React, { useState, useEffect, useCallback } from 'react';
import { taskApi } from '../api/taskApi';
import { useToast } from '../context/ToastContext';
import { TaskCard } from '../components/TaskCard';
import { TaskModal } from '../components/TaskModal';
import { TaskDetailsModal } from '../components/TaskDetailsModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import {
  Columns3,
  Plus,
  RefreshCw,
  Clock,
  PlayCircle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const KanbanPage = () => {
  const { showToast } = useToast();

  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [activeDropZone, setActiveDropZone] = useState(null);

  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [presetStatus, setPresetStatus] = useState('PENDING');
  const [detailsTask, setDetailsTask] = useState(null);
  const [deleteTask, setDeleteTask] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await taskApi.getTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message || 'Failed to load Kanban tasks');
      showToast(err.message || 'Failed to load Kanban tasks', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchTasks();
    const handleUpdate = () => fetchTasks();
    window.addEventListener('taskflow_task_updated', handleUpdate);
    return () => window.removeEventListener('taskflow_task_updated', handleUpdate);
  }, [fetchTasks]);

  // Drag and drop handlers
  const handleDragStart = (e, task) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedTaskId(task.id);
  };

  const handleDragOver = (e, columnStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (activeDropZone !== columnStatus) {
      setActiveDropZone(columnStatus);
    }
  };

  const handleDragLeave = (e, columnStatus) => {
    if (activeDropZone === columnStatus) {
      setActiveDropZone(null);
    }
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    setActiveDropZone(null);
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    setDraggedTaskId(null);

    if (!taskId) return;

    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === targetStatus) return;

    // Optimistic UI update
    const previousTasks = [...tasks];
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: targetStatus } : t))
    );

    try {
      await taskApi.updateTaskStatus(taskId, targetStatus);
      showToast(`Moved to ${targetStatus.replace('_', ' ')}`, 'success');
    } catch (err) {
      // Rollback on error
      setTasks(previousTasks);
      showToast(err.message || 'Failed to update task status', 'error');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    const previousTasks = [...tasks];
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      await taskApi.updateTaskStatus(taskId, newStatus);
      showToast('Status updated', 'success');
    } catch (err) {
      setTasks(previousTasks);
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTask) return;
    setIsDeleting(true);
    try {
      await taskApi.deleteTask(deleteTask.id);
      showToast('Task deleted successfully', 'success');
      setTasks((prev) => prev.filter((t) => t.id !== deleteTask.id));
      setDeleteTask(null);
    } catch (err) {
      showToast(err.message || 'Failed to delete task', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const openNewTaskInColumn = (status) => {
    setSelectedTask(null);
    setPresetStatus(status);
    setIsTaskModalOpen(true);
  };

  const columns = [
    {
      id: 'PENDING',
      title: 'To Do',
      color: 'border-indigo-400 bg-indigo-50/20',
      badge: 'bg-indigo-100 text-indigo-700',
      icon: Clock,
      tasks: tasks.filter((t) => t.status === 'PENDING'),
    },
    {
      id: 'IN_PROGRESS',
      title: 'In Progress',
      color: 'border-amber-400 bg-amber-50/20',
      badge: 'bg-amber-100 text-amber-700',
      icon: PlayCircle,
      tasks: tasks.filter((t) => t.status === 'IN_PROGRESS'),
    },
    {
      id: 'COMPLETED',
      title: 'Completed',
      color: 'border-emerald-400 bg-emerald-50/20',
      badge: 'bg-emerald-100 text-emerald-700',
      icon: CheckCircle2,
      tasks: tasks.filter((t) => t.status === 'COMPLETED'),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Columns3 className="w-5 h-5 text-indigo-600" />
            Agile Kanban Board
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Drag and drop deliverables between columns to dynamically update workflow progress
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => openNewTaskInColumn('PENDING')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
          <button
            onClick={fetchTasks}
            title="Refresh Kanban Board"
            className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 3 Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {columns.map((col) => {
          const Icon = col.icon;
          const isOver = activeDropZone === col.id;

          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={(e) => handleDragLeave(e, col.id)}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`bg-slate-100/70 rounded-2xl p-4 border-2 transition-all min-h-[500px] flex flex-col ${
                isOver ? 'border-indigo-500 bg-indigo-50/40 scale-[1.01]' : 'border-slate-200/80'
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-slate-600" />
                  <h3 className="font-bold text-sm text-slate-800">{col.title}</h3>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.badge}`}>
                    {col.tasks.length}
                  </span>
                </div>
                <button
                  onClick={() => openNewTaskInColumn(col.id)}
                  title={`Add Task to ${col.title}`}
                  className="p-1 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-white transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Column Content */}
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, idx) => (
                    <div key={idx} className="h-32 bg-slate-200/60 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : col.tasks.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-slate-300 rounded-xl">
                  <p className="text-xs font-semibold text-slate-400">No tasks in {col.title}</p>
                  <p className="text-[11px] text-slate-400 mt-1">Drag items here or click +</p>
                  <button
                    onClick={() => openNewTaskInColumn(col.id)}
                    className="mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                  >
                    + Add New Task
                  </button>
                </div>
              ) : (
                <div className="space-y-3 flex-1">
                  {col.tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      isDraggable={true}
                      onDragStart={handleDragStart}
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
              )}
            </div>
          );
        })}
      </div>

      {/* Task Creation / Edit Modal */}
      {isTaskModalOpen && (
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => {
            setIsTaskModalOpen(false);
            setSelectedTask(null);
          }}
          onTaskSaved={fetchTasks}
          initialData={selectedTask}
          presetStatus={presetStatus}
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