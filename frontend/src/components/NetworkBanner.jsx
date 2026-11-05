import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { WifiOff, RefreshCw, AlertCircle } from 'lucide-react';

export const NetworkBanner = () => {
  const { serverStatus, checkBackendHealth } = useAuth();
  const [retrying, setRetrying] = useState(false);

  if (serverStatus !== 'offline') return null;

  const handleRetry = async () => {
    setRetrying(true);
    await checkBackendHealth();
    setTimeout(() => setRetrying(false), 500);
  };

  return (
    <div className="bg-gradient-to-r from-rose-600 to-amber-600 text-white px-4 py-2.5 shadow-md flex items-center justify-between gap-3 text-sm font-medium z-40 sticky top-0">
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 shrink-0 text-white animate-pulse" />
        <span>
          <strong>Backend Service Offline:</strong> Could not connect to API server. If deploying, verify your Render backend or local server is running.
        </span>
      </div>
      <button
        onClick={handleRetry}
        disabled={retrying}
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-semibold backdrop-blur-sm transition-all shrink-0 cursor-pointer disabled:opacity-50"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${retrying ? 'animate-spin' : ''}`} />
        {retrying ? 'Connecting...' : 'Retry Connection'}
      </button>
    </div>
  );
};