import React from 'react';

export const DonutChart = ({ completed = 0, inProgress = 0, pending = 0 }) => {
  const total = completed + inProgress + pending;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // SVG parameters
  const size = 160;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate segment lengths
  const completedOffset = 0;
  const completedStroke = total > 0 ? (completed / total) * circumference : 0;

  const inProgressOffset = -completedStroke;
  const inProgressStroke = total > 0 ? (inProgress / total) * circumference : 0;

  const pendingOffset = -(completedStroke + inProgressStroke);
  const pendingStroke = total > 0 ? (pending / total) * circumference : 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-4">
      {/* SVG Donut */}
      <div className="relative flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
          />
          {/* Completed Segment (Emerald) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#10b981"
            strokeWidth={strokeWidth}
            strokeDasharray={`${completedStroke} ${circumference}`}
            strokeDashoffset={completedOffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          {/* In Progress Segment (Amber) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#f59e0b"
            strokeWidth={strokeWidth}
            strokeDasharray={`${inProgressStroke} ${circumference}`}
            strokeDashoffset={inProgressOffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          {/* Pending Segment (Blue/Indigo) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#6366f1"
            strokeWidth={strokeWidth}
            strokeDasharray={`${pendingStroke} ${circumference}`}
            strokeDashoffset={pendingOffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-black text-slate-900 tracking-tight">{completionRate}%</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Done</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-2.5 w-full sm:w-auto">
        <div className="flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="font-semibold text-slate-700">Completed</span>
          </div>
          <span className="font-bold text-slate-900">{completed} ({total > 0 ? Math.round((completed / total) * 100) : 0}%)</span>
        </div>

        <div className="flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="font-semibold text-slate-700">In Progress</span>
          </div>
          <span className="font-bold text-slate-900">{inProgress} ({total > 0 ? Math.round((inProgress / total) * 100) : 0}%)</span>
        </div>

        <div className="flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span className="font-semibold text-slate-700">Pending</span>
          </div>
          <span className="font-bold text-slate-900">{pending} ({total > 0 ? Math.round((pending / total) * 100) : 0}%)</span>
        </div>
      </div>
    </div>
  );
};