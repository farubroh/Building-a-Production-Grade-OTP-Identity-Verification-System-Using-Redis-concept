
import React, { useState } from 'react';
import { AuditLogEntry, LogStatus } from '../types';
import { PURPOSE_LABELS, CHANNEL_ICONS } from '../constants';

interface AuditLogsProps {
  logs: AuditLogEntry[];
}

const AuditLogs: React.FC<AuditLogsProps> = ({ logs }) => {
  const [filter, setFilter] = useState<LogStatus | 'ALL'>('ALL');

  const filteredLogs = filter === 'ALL' ? logs : logs.filter(l => l.status === filter);

  const getStatusStyle = (status: LogStatus) => {
    switch (status) {
      case LogStatus.VERIFIED: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case LogStatus.SENT: return 'bg-blue-100 text-blue-700 border-blue-200';
      case LogStatus.FAILED: return 'bg-red-100 text-red-700 border-red-200';
      case LogStatus.EXPIRED: return 'bg-slate-100 text-slate-700 border-slate-200';
      case LogStatus.BLOCKED: return 'bg-orange-100 text-orange-700 border-orange-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Security Audit Logs</h3>
          <p className="text-sm text-slate-500">Traceability and compliance data for every session.</p>
        </div>
        <div className="flex gap-2">
           <select 
             className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
             value={filter}
             onChange={(e) => setFilter(e.target.value as any)}
           >
             <option value="ALL">All Events</option>
             {Object.values(LogStatus).map(s => (
               <option key={s} value={s}>{s.replace('OTP_', '')}</option>
             ))}
           </select>
        </div>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <th className="px-6 py-4">Timestamp</th>
              <th className="px-6 py-4">Identity</th>
              <th className="px-6 py-4">Purpose</th>
              <th className="px-6 py-4">Channel</th>
              <th className="px-6 py-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">No logs match the current filter.</td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-xs font-medium text-slate-500 whitespace-nowrap">
                    {log.timestamp.toLocaleDateString()} <br/>
                    <span className="text-slate-400">{log.timestamp.toLocaleTimeString()}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                    {log.identifier}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold border ${PURPOSE_LABELS[log.purpose].color}`}>
                      {PURPOSE_LABELS[log.purpose].label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      {CHANNEL_ICONS[log.channel]}
                      <span className="text-xs font-medium">{log.channel}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusStyle(log.status)}`}>
                      {log.status.replace('OTP_', '')}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
        <button className="text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors uppercase tracking-widest">
          Download CSV Report
        </button>
      </div>
    </div>
  );
};

export default AuditLogs;
