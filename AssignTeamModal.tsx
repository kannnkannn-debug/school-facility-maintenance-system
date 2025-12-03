
import React from 'react';
import { Incident, Team } from '../types';
import { X, UserCheck, UserX } from 'lucide-react';
import { playClickSound } from '../utils/sound';

interface AssignTeamModalProps {
  isOpen: boolean;
  incident: Incident | null;
  teams: Team[];
  onClose: () => void;
  onAssign: (teamId: number, incidentId: number) => void;
}

const AssignTeamModal: React.FC<AssignTeamModalProps> = ({ isOpen, incident, teams, onClose, onAssign }) => {
  if (!isOpen || !incident) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="glass-panel w-full max-w-md rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-300 border border-white/10 overflow-hidden">
        
        {/* Glow header line */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>

        <div className="p-5 border-b border-white/5 flex justify-between items-center bg-slate-900/50">
          <h2 className="text-lg font-bold text-white uppercase tracking-wide text-glow">มอบหมายทีมช่าง</h2>
          <button 
            onClick={() => { playClickSound(); onClose(); }}
            className="text-slate-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 bg-slate-950/40">
          <div className="mb-6 text-sm bg-slate-900/60 p-3 rounded border border-slate-800">
             <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">รายละเอียดงาน</div>
             <div className="text-cyan-100 font-bold mb-1">{incident.description}</div>
             <div className="text-slate-400 text-xs flex items-center gap-1 font-mono">
                <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></span> {incident.buildingName}
             </div>
          </div>

          <div className="space-y-2">
             <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-bold">เลือกทีมปฏิบัติงาน</div>
             {teams.map(team => {
                 const isIdle = team.status === 'Available';
                 return (
                     <button
                        key={team.id}
                        disabled={!isIdle}
                        onClick={() => { if (isIdle) { playClickSound(); onAssign(team.id, incident.id); } }}
                        className={`
                            w-full flex justify-between items-center p-3 rounded border transition-all duration-200
                            ${isIdle 
                                ? 'bg-slate-900/50 border-slate-700 hover:border-cyan-500 hover:bg-cyan-900/20 text-white group shadow-[0_4px_10px_rgba(0,0,0,0.2)]' 
                                : 'bg-black/40 border-slate-800 text-slate-600 opacity-50 cursor-not-allowed'
                            }
                        `}
                     >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${isIdle ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-600'}`}>
                                {isIdle ? <UserCheck size={16} /> : <UserX size={16} />}
                            </div>
                            <div className="text-left">
                                <div className={`font-bold text-sm tracking-wide ${isIdle ? 'group-hover:text-cyan-300' : ''}`}>{team.name}</div>
                            </div>
                        </div>
                        {isIdle && <div className="text-[10px] font-bold text-emerald-500 bg-emerald-900/20 px-2 py-0.5 rounded border border-emerald-500/30">ว่าง</div>}
                     </button>
                 );
             })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignTeamModal;
