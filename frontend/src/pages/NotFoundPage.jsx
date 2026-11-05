import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowLeft, Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 text-center font-sans">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-blue-600 flex items-center justify-center text-white mb-6 shadow-xl shadow-indigo-500/25">
        <Layers className="w-8 h-8" />
      </div>
      <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
        404
      </h1>
      <h2 className="text-xl font-bold mt-2 text-slate-200">Page Not Found</h2>
      <p className="mt-2 text-sm text-slate-400 max-w-sm">
        The task, board, or route you requested does not exist or has been relocated.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md transition-all"
        >
          <Home className="w-4 h-4" />
          Go to Dashboard
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Home
        </Link>
      </div>
    </div>
  );
};