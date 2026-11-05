import React from 'react';
import { Calendar, Tag, MoreVertical, Edit, Trash2, Eye, AlertCircle } from 'lucide-react';

export const TaskCard = ({
  task,
  onEdit,
  onDelete,
  onViewDetails,
  onStatusChange,
  isDraggable = false,
  onDragStart,
}) => {
  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'HIGH':
        return {
          label: 'High',
          badge: 'bg-rose-50 text-rose-700 border-rose-200/80',
          dot: 'bg-rose-500',
        };
      case 'MEDIUM':
        return {
          label: 'Medium',
          badge: 'bg-amber-50 text-amber-700 border-amber-200/80',
          dot: 'bg-amber-500',
        };
      default:
        return {
          label: 'Low',
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
          dot: 'bg-emerald-500',
        };
    }
  };

  const isOverdue = () => {
    if (!task.dueDate || task.status === 'COMPLETED') return false;
    const today = new Date().toISOString().split('T')[0];
    return task.dueDate < today;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const priorityConfig = getPriorityConfig(task.priority);
  const overdue = isOverdue();

  return (
    <div
      draggable={isDraggable}
      onDragStart={onDragStart ? (e) => onDragStart(e, task) : undefined}
      className={`bg-white rounded-xl p-4 border border-slate-200 shadow-2xs hover:shadow-md transition-all group ${
        isDraggable ? 'cursor-grab active:cursor-grabbing hover:-translate-y-0.5' : ''
      }`}
    >
      {/* Top Header: Priority Badge & Status Changer */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${priorityConfig.badge}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${priorityConfig.dot}`} />
          {priorityConfig.label}
        </span>

        {onStatusChange && (
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value)}
            className="text-[11px] font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 cursor-pointer focus:outline-hidden"
          >
            <option value="PENDING">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        )}
      </div>

      {/* Task Title */}
      <h4
        onClick={() => onViewDetails && onViewDetails(task)}
        className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 cursor-pointer mb-1.5"
      >
        {task.title}
      </h4>

      {/* Description Excerpt */}
      {task.description && (
        <p className="text-xs text-slate-500 line-clamp-2 mb-3">
          {task.description}
        </p>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600"
            >
              #{tag}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
              +{task.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Card Footer: Due Date & Action Icons */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
        {task.dueDate ? (
          <div
            className={`flex items-center gap-1 font-medium ${
              overdue ? 'text-rose-600 font-semibold' : 'text-slate-500'
            }`}
          >
            {overdue ? <AlertCircle className="w-3.5 h-3.5 shrink-0" /> : <Calendar className="w-3.5 h-3.5 shrink-0" />}
            <span className="text-[11px]">
              {overdue ? 'Overdue: ' : 'Due: '}
              {formatDate(task.dueDate)}
            </span>
          </div>
        ) : (
          <span className="text-[11px] text-slate-400">No deadline</span>
        )}

        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(task)}
              title="View Details"
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(task)}
              title="Edit Task"
              className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(task)}
              title="Delete Task"
              className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};