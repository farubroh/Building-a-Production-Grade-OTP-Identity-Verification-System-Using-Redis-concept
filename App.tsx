
import React, { useState, useEffect } from 'react';
import { AuditLogEntry, SystemStats, OtpPurpose, OtpChannel, LogStatus } from './types';
import { otpService } from './services/otpService';
import Dashboard from './components/Dashboard';
import DemoClient from './components/DemoClient';

const App: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [stats, setStats] = useState<SystemStats>({
    totalSent: 0,
    totalVerified: 0,
    totalFailed: 0,
    totalBlocked: 0,
    successRate: 0
  });

  const refreshData = () => {
    setLogs(otpService.getLogs());
    setStats(otpService.getStats());
  };

  useEffect(() => {
    refreshData();
    // Simulate some initial traffic for visual appeal
    const init = async () => {
      try {
        await otpService.requestOtp("demo@veri-shield.com", OtpPurpose.REGISTRATION, OtpChannel.EMAIL);
        refreshData();
      } catch (e) {}
    };
    init();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Side Bar for Client Demo (Simulation of what a user sees) */}
      <div className="w-full lg:w-[400px] xl:w-[450px] border-r border-slate-200 bg-white sticky top-0 h-screen overflow-y-auto z-10">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 2.944a11.955 11.955 0 01-8.618 3.04m17.236 0L12 21.056 3.382 5.984M12 2.944V21.056" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">VeriShield</h1>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Identity Demo Console</p>
          </div>
        </div>
        
        <div className="p-6">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 shadow-inner">
            <h2 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              Client-Side Interface
            </h2>
            <DemoClient onAction={refreshData} />
          </div>

          <div className="mt-8 p-6 bg-slate-900 rounded-2xl text-slate-100 shadow-xl overflow-hidden relative">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
               </svg>
             </div>
             <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">Internal Backend Logs</h3>
             <div className="mono text-[10px] space-y-1.5 h-[300px] overflow-y-auto custom-scrollbar">
                {logs.length === 0 && <p className="text-slate-500 italic">Waiting for requests...</p>}
                {logs.map((log) => (
                  <div key={log.id} className="border-l border-slate-700 pl-2 py-0.5">
                    <span className="text-slate-500">[{log.timestamp.toLocaleTimeString()}]</span>{" "}
                    {/* Fix: Added missing LogStatus import to resolve the "Cannot find name 'LogStatus'" error */}
                    <span className={
                      log.status === LogStatus.VERIFIED ? "text-emerald-400" :
                      log.status === LogStatus.FAILED ? "text-red-400" :
                      log.status === LogStatus.BLOCKED ? "text-orange-400" :
                      "text-blue-400"
                    }>{log.status}</span>{" "}
                    <span className="text-slate-300 opacity-80">{log.identifier}</span>
                    {log.metadata && <div className="text-slate-600 italic mt-0.5">{log.metadata}</div>}
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* Main Admin Dashboard */}
      <main className="flex-1 bg-slate-50 p-6 lg:p-10 overflow-y-auto">
        <Dashboard stats={stats} logs={logs} />
      </main>
    </div>
  );
};

export default App;
