
import React, { useState } from 'react';
import { SystemStats, AuditLogEntry } from '../types';
import Metrics from './Metrics';
import AuditLogs from './AuditLogs';
import { analyzeSecurityLogs } from '../services/geminiService';

interface DashboardProps {
  stats: SystemStats;
  logs: AuditLogEntry[];
}

const Dashboard: React.FC<DashboardProps> = ({ stats, logs }) => {
  const [securityAdvice, setSecurityAdvice] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleSecurityAnalysis = async () => {
    setAnalyzing(true);
    const result = await analyzeSecurityLogs(logs);
    setSecurityAdvice(result);
    setAnalyzing(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">System Performance</h2>
          <p className="text-slate-500 font-medium">Monitoring verification cycles and security metrics in real-time.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSecurityAnalysis}
            disabled={analyzing}
            className="bg-white border border-slate-200 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            {analyzing ? (
              <svg className="animate-spin h-4 w-4 text-emerald-600" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 2.944a11.955 11.955 0 01-8.618 3.04m17.236 0L12 21.056 3.382 5.984M12 2.944V21.056" />
              </svg>
            )}
            AI Security Advisor
          </button>
          <div className="h-10 w-[1px] bg-slate-200 mx-2 hidden md:block"></div>
          <div className="flex -space-x-2">
            {[1,2,3].map(i => (
              <img key={i} src={`https://picsum.photos/seed/${i + 20}/32/32`} className="w-8 h-8 rounded-full border-2 border-white" alt="avatar" />
            ))}
          </div>
        </div>
      </div>

      {/* Security Advisor Response */}
      {securityAdvice && (
        <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl shadow-xl relative overflow-hidden animate-in slide-in-from-top-4 duration-500">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
             <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
               <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
             </svg>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-500/20 p-2 rounded-lg">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg">AI Security Analysis Report</h3>
          </div>
          <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed whitespace-pre-wrap font-medium opacity-90">
            {securityAdvice}
          </div>
          <button 
            onClick={() => setSecurityAdvice(null)} 
            className="mt-6 text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1 font-bold uppercase tracking-widest"
          >
            Dismiss Report
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <Metrics stats={stats} />

      {/* Main Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
           <AuditLogs logs={logs} />
        </div>
        
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Service Health</h3>
            <div className="space-y-6">
              {[
                { label: 'OTP Generator', status: 'Healthy', latency: '12ms', color: 'emerald' },
                { label: 'Redis Cache', status: 'Healthy', latency: '2ms', color: 'emerald' },
                { label: 'SMS Gateway', status: 'Degraded', latency: '4.2s', color: 'amber' },
                { label: 'Email SMTP', status: 'Healthy', latency: '1.1s', color: 'emerald' },
              ].map((service, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full bg-${service.color}-500 shadow-sm shadow-${service.color}-200`}></div>
                    <span className="text-sm font-semibold text-slate-700">{service.label}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-900">{service.status}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{service.latency}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
               <div className="flex justify-between items-center mb-2">
                 <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Storage Usage</span>
                 <span className="text-xs font-bold text-slate-700">42%</span>
               </div>
               <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                 <div className="bg-emerald-500 h-full w-[42%]" />
               </div>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl text-white shadow-xl">
             <h3 className="text-lg font-bold mb-4">Implementation Guides</h3>
             <ul className="space-y-4">
               {[
                 { title: 'OTP Hashing Logic', desc: 'Securely storing digests in Redis' },
                 { title: 'Rate Limiting Strategy', desc: 'Fixed window & Token bucket' },
                 { title: 'Channel Abstraction', desc: 'Plug-and-play provider architecture' },
               ].map((guide, i) => (
                 <li key={i} className="group cursor-pointer">
                    <div className="text-emerald-400 font-bold text-sm group-hover:underline">{guide.title}</div>
                    <div className="text-slate-400 text-xs mt-1">{guide.desc}</div>
                 </li>
               ))}
             </ul>
             <button className="w-full mt-6 border border-slate-700 py-3 rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors">
               View Documentation
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
