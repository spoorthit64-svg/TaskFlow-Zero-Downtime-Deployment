import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Layers,
  CheckCircle2,
  Columns3,
  BarChart3,
  ShieldCheck,
  Cloud,
  ArrowRight,
  Sparkles,
  Server,
  Lock,
  ChevronRight,
  Database
} from 'lucide-react';

export const LandingPage = () => {
  const { isAuthenticated, serverStatus } = useAuth();

  const [demoTasks, setDemoTasks] = useState([
    { id: 1, title: 'Deploy to Render & Vercel', status: 'COMPLETED', priority: 'HIGH' },
    { id: 2, title: 'Configure MongoDB Atlas cloud cluster', status: 'IN_PROGRESS', priority: 'HIGH' },
    { id: 3, title: 'Prepare Zero-Downtime Rollback strategy', status: 'PENDING', priority: 'MEDIUM' },
  ]);

  const toggleDemoTask = (id) => {
    setDemoTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextStatus =
            t.status === 'COMPLETED'
              ? 'PENDING'
              : t.status === 'PENDING'
              ? 'IN_PROGRESS'
              : 'COMPLETED';
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white font-sans">
      {/* Top Notification Bar */}
      <div className="bg-gradient-to-r from-indigo-900/60 via-slate-900 to-blue-900/60 border-b border-indigo-500/20 px-4 py-2 text-center text-xs text-slate-300 flex items-center justify-center gap-2">
        <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
          DevOps Ready
        </span>
        <span>Architected for Zero-Downtime Rolling Deployments & Rollbacks</span>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              TaskFlow
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                SaaS
              </span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#kanban" className="hover:text-white transition-colors">Kanban</a>
            <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white text-sm font-semibold shadow-md shadow-indigo-500/25 transition-all"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white text-sm font-semibold shadow-md shadow-indigo-500/25 transition-all"
                >
                  Get Started
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Full-Stack Modern Task Management System
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
            Orchestrate Projects with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-300">
              Zero-Downtime Precision
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            TaskFlow combines drag-and-drop Kanban agility, rich analytics, and enterprise JWT security. Built with React Vite and Spring Boot with seamless MongoDB Atlas integration.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Start Free Today
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition-all"
            >
              Explore Live Demo
            </Link>
          </div>

          {/* Interactive Live Preview Component */}
          <div className="mt-14 max-w-3xl mx-auto bg-slate-800/90 rounded-2xl p-6 border border-slate-700/80 shadow-2xl text-left backdrop-blur-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-700/80">
              <div className="flex items-center gap-2.5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs font-semibold text-slate-400 ml-2">Live Interactive Preview (Click tasks to cycle status)</span>
              </div>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Interactive
              </span>
            </div>

            <div className="mt-4 space-y-2.5">
              {demoTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => toggleDemoTask(t.id)}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700 hover:border-indigo-500/50 flex items-center justify-between gap-3 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                        t.status === 'COMPLETED'
                          ? 'bg-emerald-500 border-emerald-400 text-white'
                          : t.status === 'IN_PROGRESS'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                          : 'border-slate-600 group-hover:border-slate-500'
                      }`}
                    >
                      {t.status === 'COMPLETED' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <span
                      className={`text-sm font-medium transition-all ${
                        t.status === 'COMPLETED'
                          ? 'line-through text-slate-500'
                          : 'text-slate-200'
                      }`}
                    >
                      {t.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                        t.priority === 'HIGH'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}
                    >
                      {t.priority}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                        t.status === 'COMPLETED'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : t.status === 'IN_PROGRESS'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                      }`}
                    >
                      {t.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Bar */}
      <section className="border-y border-slate-800 bg-slate-950/60 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-extrabold text-white tracking-tight">99.99%</p>
              <p className="text-xs text-slate-400 font-medium mt-1">Uptime Target</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-indigo-400 tracking-tight">&lt; 100ms</p>
              <p className="text-xs text-slate-400 font-medium mt-1">REST API Latency</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-cyan-400 tracking-tight">100%</p>
              <p className="text-xs text-slate-400 font-medium mt-1">Stateless & Resilient</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-emerald-400 tracking-tight">Cloud Native</p>
              <p className="text-xs text-slate-400 font-medium mt-1">Vercel & Render Ready</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section id="features" className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Built for High-Velocity Engineering & Agile Teams
            </h2>
            <p className="mt-3 text-slate-400 text-sm">
              Everything you need to plan, track, and roll out complex software deliverables without friction.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-indigo-500/50 transition-all">
              <div className="w-11 h-11 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-5">
                <Columns3 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Drag & Drop Kanban Board</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Seamlessly move tasks across To Do, In Progress, and Completed columns with instant optimistic feedback.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-indigo-500/50 transition-all">
              <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-5">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Interactive Dashboard Analytics</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Visualize completion velocity, priority distribution, and status breakdowns with real-time SVG charts.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-indigo-500/50 transition-all">
              <div className="w-11 h-11 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-5">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Cryptographic JWT Security</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                BCrypt password hashing and stateless JJWT authentication ensure each user's tasks are strictly isolated.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-indigo-500/50 transition-all">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">MongoDB Atlas Integration</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connects directly to your MongoDB Atlas cloud database cluster with index optimization and dynamic URI configuration.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-indigo-500/50 transition-all">
              <div className="w-11 h-11 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-5">
                <Cloud className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Vercel & Render Ready</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Vercel SPA rewrite configuration, Render dynamic PORT binding, and customizable CORS origins make deployment seamless.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-indigo-500/50 transition-all">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-5">
                <Server className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Zero-Downtime Rollback Ready</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Equipped with live GET /api/health endpoint, ready to act as the target application for your CI/CD and DevOps pipeline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-slate-300">TaskFlow</span>
            <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Stack: React + Spring Boot + MongoDB Atlas</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${serverStatus === 'online' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              {serverStatus === 'online' ? 'API Online' : 'API Standby'}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};