
import React from 'react';
import { Incident } from '../types';
import { Package } from 'lucide-react';

interface MaterialSummaryProps {
  incidents: Incident[];
}

const MaterialSummary: React.FC<MaterialSummaryProps> = ({ incidents }) => {
  const partTotals: Record<string, { name: string, quantity: number, unit: string }> = {};
  incidents.forEach(inc => {
    if (inc.status === 'Done' && inc.usedParts) {
        inc.usedParts.forEach(part => {
            if (!partTotals[part.id]) { partTotals[part.id] = { name: part.name, quantity: 0, unit: part.unit }; }
            partTotals[part.id].quantity += part.quantity;
        });
    }
  });
  const sortedParts = Object.values(partTotals).sort((a, b) => b.quantity - a.quantity);

  return (
    <div className="glass-panel rounded-xl p-5 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
            <Package className="text-indigo-400" size={18} />
            สรุปการใช้วัสดุ
        </h2>
        <span className="text-[10px] text-slate-400 bg-black/20 px-2 py-0.5 rounded border border-white/5 uppercase font-mono font-tech">
            Total Used
        </span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-2">
        {sortedParts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-slate-500 text-xs">
                <Package size={24} className="mb-2 opacity-20" />
                ไม่พบข้อมูล
            </div>
        ) : (
            sortedParts.map((part, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 rounded bg-slate-900/40 border border-white/5 hover:bg-slate-800/50 hover:border-indigo-500/30 transition-colors group">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded bg-indigo-900/20 text-indigo-300 flex items-center justify-center text-[10px] font-bold border border-indigo-500/20 font-mono font-tech">
                            {idx + 1}
                        </div>
                        <span className="text-xs text-slate-300 group-hover:text-white transition-colors">{part.name}</span>
                    </div>
                    <div className="text-right">
                        <span className="text-sm font-bold text-cyan-400 font-tech">{part.quantity}</span>
                        <span className="text-[10px] text-slate-500 ml-1">{part.unit}</span>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
};

export default MaterialSummary;
