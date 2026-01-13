
import React from 'react';
import { SystemStats } from '../types';

interface MetricsProps {
  stats: SystemStats;
}

const Metrics: React.FC<MetricsProps> = ({ stats }) => {
  const cards = [
    { 
      label: 'OTP Requests', 
      value: stats.totalSent, 
      color: 'blue', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    { 
      label: 'Successful Verifications', 
      value: stats.totalVerified, 
      color: 'emerald', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      label: 'Success Rate', 
      value: `${stats.successRate.toFixed(1)}%`, 
      color: 'purple', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      label: 'Blocked Attempts', 
      value: stats.totalBlocked, 
      color: 'rose', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, i) => (
        <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2.5 rounded-xl bg-${card.color}-50 text-${card.color}-600`}>
              {card.icon}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider text-${card.color}-600 px-2 py-0.5 rounded-full bg-${card.color}-50`}>
              Live
            </span>
          </div>
          <div className="space-y-1">
            <h4 className="text-3xl font-bold text-slate-900">{card.value}</h4>
            <p className="text-sm font-medium text-slate-500">{card.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Metrics;
