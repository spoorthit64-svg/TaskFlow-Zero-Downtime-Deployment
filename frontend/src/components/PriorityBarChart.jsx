import React from 'react';

export const PriorityBarChart = ({ high = 0, medium = 0, low = 0 }) => {
  const total = high + medium + low;

  const items = [
    { label: 'High Priority', count: high, color: 'bg-rose-500', barBg: 'bg-rose-50', textColor: 'text-rose-700' },
    { label: 'Medium Priority', count: medium, color: 'bg-amber-500', barBg: 'bg-amber-50', textColor: 'text-amber-700' },
    { label: 'Low Priority', count: low, color: 'bg-emerald-500', barBg: 'bg-emerald-50', textColor: 'text-emerald-700' },
  ];

  return (
    <div className="space-y-4 p-2">
      {items.map((item) => {
        const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
        return (
          <div key={item.label} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">{item.label}</span>
              <span className="font-bold text-slate-900">
                {item.count} <span className="font-medium text-slate-400">({percentage}%)</span>
              </span>
            </div>
            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};