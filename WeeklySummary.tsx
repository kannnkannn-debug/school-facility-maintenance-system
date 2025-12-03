
import React from 'react';
import { Incident } from '../types';
import { BarChart3 } from 'lucide-react';

interface WeeklySummaryProps {
  incidents: Incident[];
}

const WeeklySummary: React.FC<WeeklySummaryProps> = ({ incidents }) => {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d;
  });

  const chartData = days.map(date => {
    const dayStart = new Date(date.setHours(0, 0, 0, 0)).getTime();
    const dayEnd = new Date(date.setHours(23, 59, 59, 999)).getTime();
    const dayIncidents = incidents.filter(i => i.timestamp >= dayStart && i.timestamp <= dayEnd);
    const doneCount = dayIncidents.filter(i => i.status === 'Done').length;
    const pendingCount = dayIncidents.filter(i => i.status !== 'Done').length;
    return {
      label: date.toLocaleDateString('th-TH', { weekday: 'short' }),
      fullDate: date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' }),
      total: doneCount + pendingCount, done: doneCount, pending: pendingCount
    };
  });
  const maxVal = Math.max(...chartData.map(d => d.total), 5);

  return (
    <div className="glass-panel rounded-xl p-5 h-full flex flex-col">
      <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
        <BarChart3 className="text-indigo-400" size={18} />
        สรุปงานรายสัปดาห์
      </h2>

      <div className="flex-1 flex items-end justify-between gap-2 min-h-[160px] pb-4 pt-4 border-b border-white/5 relative">
        {/* Grid lines background */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
            <div className="w-full h-[1px] bg-slate-500"></div>
            <div className="w-full h-[1px] bg-slate-500"></div>
            <div className="w-full h-[1px] bg-slate-500"></div>
            <div className="w-full h-[1px] bg-slate-500"></div>
        </div>

        {chartData.map((d, i) => {
          const heightPercent = (d.total / maxVal) * 100;
          const donePercent = d.total > 0 ? (d.done / d.total) * 100 : 0;
          
          return (
            <div key={i} className="flex flex-col items-center flex-1 h-full justify-end group z-10">
              <div className="mb-2 opacity-0 group-hover:opacity-100 transition-opacity absolute -mt-12 bg-black/80 text-xs px-2 py-1 rounded border border-white/20 whitespace-nowrap z-20 backdrop-blur-md font-tech">
                <span className="text-emerald-400">{d.done} เสร็จ</span> / <span className="text-blue-400">{d.pending} ค้าง</span>
              </div>

              <div className="w-full max-w-[18px] rounded-t-sm bg-slate-800/50 relative overflow-hidden transition-all duration-500 shadow-[0_0_10px_rgba(0,0,0,0.5)]" style={{ height: `${heightPercent}%` }}>
                <div className="absolute bottom-0 left-0 right-0 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] transition-all duration-500" style={{ height: `${donePercent}%` }}></div>
                <div className="absolute top-0 left-0 right-0 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] transition-all duration-500" style={{ height: `${100 - donePercent}%` }}></div>
              </div>

              <div className="mt-2 text-[10px] text-white font-bold uppercase font-mono drop-shadow-md">{d.label}</div>
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-center gap-4 mt-3 text-[10px] text-white uppercase tracking-wider font-bold drop-shadow-md">
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_currentColor]"></div> เสร็จสิ้น</div>
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_5px_currentColor]"></div> คงค้าง</div>
      </div>
    </div>
  );
};

export default WeeklySummary;
