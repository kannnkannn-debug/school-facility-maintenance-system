
import React, { useState } from 'react';
import { Incident, Team, User, UsedPart } from '../types';
import { AVAILABLE_PARTS } from '../constants';
import { Wrench, CheckCircle, MapPin, Clock, MessageSquare, Plus, Trash2, Package, RotateCcw, Box, ArrowRight, AlertTriangle, Zap, Image as ImageIcon, History } from 'lucide-react';
import { playClickSound } from '../utils/sound';
import { formatRelativeTime } from '../utils/date';
import HoldButton from './HoldButton';

interface TechnicianViewProps {
  user: User;
  teams: Team[];
  incidents: Incident[];
  onCompleteJob: (incidentId: number, note?: string, usedParts?: UsedPart[]) => void;
  onRushJob?: (incidentId: number) => void;
  addToast?: (type: 'success' | 'error' | 'info', message: string) => void;
}

const TechnicianView: React.FC<TechnicianViewProps> = ({ user, teams, incidents, onCompleteJob, onRushJob, addToast }) => {
  const [note, setNote] = useState('');
  const [selectedPartId, setSelectedPartId] = useState(AVAILABLE_PARTS[0].id);
  const [quantity, setQuantity] = useState(1);
  const [addedParts, setAddedParts] = useState<UsedPart[]>([]);
  const [isCustomPart, setIsCustomPart] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customUnit, setCustomUnit] = useState('ชิ้น');
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  const myTeam = teams.find(t => t.id === user.teamId);
  const currentJob = myTeam?.currentIncidentId 
    ? incidents.find(i => i.id === myTeam.currentIncidentId)
    : null;
  const jobHistory = incidents.filter(i => i.assignedTeamId === user.teamId && i.status === 'Done')
    .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));

  const handleAddPart = () => {
    playClickSound();
    let partToAdd: UsedPart;
    if (isCustomPart) {
        if (!customName.trim()) return;
        partToAdd = { id: `custom-${Date.now()}`, name: customName.trim(), quantity: quantity, unit: customUnit.trim() || 'ชิ้น' };
        setCustomName(''); setCustomUnit('ชิ้น'); setIsCustomPart(false);
    } else {
        const partInfo = AVAILABLE_PARTS.find(p => p.id === selectedPartId);
        if (!partInfo) return;
        partToAdd = { id: partInfo.id, name: partInfo.name, quantity: quantity, unit: partInfo.unit };
    }
    const existingIndex = addedParts.findIndex(p => p.id === partToAdd.id || (p.name === partToAdd.name && p.unit === partToAdd.unit));
    if (existingIndex >= 0) {
        const updated = [...addedParts];
        updated[existingIndex].quantity += quantity;
        setAddedParts(updated);
    } else {
        setAddedParts([...addedParts, partToAdd]);
    }
    setQuantity(1);
  };

  const handleRemovePart = (id: string) => {
    playClickSound();
    setAddedParts(addedParts.filter(p => p.id !== id));
  };

  const handleComplete = () => {
    if (currentJob) {
        onCompleteJob(currentJob.id, note, addedParts);
        if(addToast) addToast('success', 'ปิดงานเรียบร้อยแล้ว');
        setNote(''); setAddedParts([]); setQuantity(1); setIsCustomPart(false);
    }
  };

  const handleRushClick = () => {
      if (currentJob && onRushJob) {
          onRushJob(currentJob.id);
          if(addToast) addToast('error', 'ส่งสัญญาณเร่งงานด่วนแล้ว!');
      }
  };

  const adjustQty = (delta: number) => {
    playClickSound();
    setQuantity(prev => Math.max(1, prev + delta));
  };

  if (!myTeam) return <div className="text-center p-10 text-red-400">System Error: Team Not Found</div>;

  return (
    <div className="max-w-xl mx-auto w-full pb-24 space-y-6">
      
      {/* Expanded Image Modal */}
      {expandedImage && (
          <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setExpandedImage(null)}>
              <img src={expandedImage} alt="Expanded" className="max-w-full max-h-full rounded-lg shadow-2xl" />
              <button className="absolute top-4 right-4 text-white hover:text-red-500 p-2"><Trash2 className="rotate-45" size={32} /></button>
          </div>
      )}

      {/* 1. OPERATOR CARD */}
      <div className="glass-panel p-5 rounded-2xl flex items-center gap-4 border-l-4 border-l-cyan-500 relative overflow-hidden">
        {/* Admin Inspection Indicator */}
        {user.role === 'admin' && (
             <div className="absolute top-0 right-0 bg-purple-600 text-[9px] text-white px-2 py-0.5 rounded-bl font-bold uppercase tracking-wider">
                 Admin Eye View
             </div>
        )}

        <div className="bg-slate-800 p-3 rounded-full border border-slate-700 shadow-inner">
             <Wrench className="text-cyan-400" size={24} />
        </div>
        <div>
             <div className="text-[10px] text-slate-400 uppercase tracking-widest font-tech mb-0.5">Operator Online</div>
             <h2 className="text-xl font-bold text-white">{user.name}</h2>
             <div className={`text-xs font-bold inline-flex items-center gap-2 mt-1 ${myTeam.status === 'Busy' ? 'text-amber-400' : 'text-emerald-400'}`}>
                 <span className={`w-2 h-2 rounded-full ${myTeam.status === 'Busy' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                 {myTeam.status === 'Busy' ? 'กำลังปฏิบัติงาน (BUSY)' : 'พร้อมปฏิบัติงาน (READY)'}
             </div>
        </div>
      </div>

      {/* 2. MISSION CARD (Current Job) */}
      {currentJob ? (
        <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
            {/* Mission Header */}
            <div className={`
                rounded-2xl border overflow-hidden shadow-2xl relative transition-all duration-300
                ${currentJob.isRushed 
                    ? 'bg-gradient-to-br from-red-950/40 to-slate-900 border-red-500 shadow-[0_0_30px_rgba(220,38,38,0.2)] animate-pulse' 
                    : 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700'
                }
            `}>
                {/* SCAN LINE EFFECT for ACTIVE Jobs */}
                <div className="scan-line-effect"></div>

                <div className={`p-4 border-b flex justify-between items-start relative z-10 ${currentJob.isRushed ? 'bg-red-900/30 border-red-500/30' : 'bg-cyan-900/30 border-cyan-500/20'}`}>
                    <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                             <span className="text-[10px] font-bold bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30 uppercase tracking-wider">Mission Active</span>
                             
                             {/* RUSHED BADGE */}
                             {currentJob.isRushed && (
                                 <span className="text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded border border-red-400 uppercase tracking-wider animate-bounce flex items-center gap-1">
                                     <AlertTriangle size={10} fill="currentColor" /> ด่วนที่สุด (RUSHED)
                                 </span>
                             )}

                             <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${currentJob.priority === 'Critical' ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-blue-500/20 text-blue-300 border-blue-500/30'}`}>
                                {currentJob.priority} Priority
                             </span>
                        </div>
                        <h3 className="text-lg font-bold text-white leading-snug mt-2">{currentJob.description}</h3>
                    </div>
                    <div className="text-right">
                         <div className="text-[10px] text-slate-400 font-tech">JOB ID</div>
                         <div className="text-xl font-bold text-white font-tech">#{currentJob.id.toString().padStart(4,'0')}</div>
                    </div>
                </div>
                
                <div className="p-5 relative z-10">
                    {/* Admin Rush Button (Hold to Rush) */}
                    {user.role === 'admin' && onRushJob && !currentJob.isRushed && (
                        <HoldButton
                            onAction={handleRushClick}
                            className="w-full mb-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 text-sm uppercase tracking-wide transition-all"
                            duration={1500}
                        >
                            <Zap size={18} className="fill-white" /> กดค้างเพื่อเร่งงาน (Hold to Rush)
                        </HoldButton>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-950/50 p-3 rounded-xl border border-white/5">
                            <div className="text-slate-500 text-[10px] uppercase mb-1 flex items-center gap-1"><MapPin size={10}/> Location</div>
                            <div className="text-cyan-100 font-bold text-sm">{currentJob.buildingName}</div>
                            <div className="text-slate-400 text-xs">{currentJob.roomNumber || '-'}</div>
                        </div>
                        <div className="bg-slate-950/50 p-3 rounded-xl border border-white/5">
                            <div className="text-slate-500 text-[10px] uppercase mb-1 flex items-center gap-1"><Clock size={10}/> Reported</div>
                            <div className="text-cyan-100 font-bold text-sm font-tech">{new Date(currentJob.timestamp).toLocaleTimeString('th-TH', {hour: '2-digit', minute:'2-digit'})}</div>
                            <div className="text-slate-400 text-xs">{formatRelativeTime(currentJob.timestamp)}</div>
                        </div>
                    </div>

                    {/* Image Preview for Technician */}
                    {currentJob.imageUrl && (
                        <div className="mt-4">
                             <div className="text-slate-500 text-[10px] uppercase mb-1 flex items-center gap-1"><ImageIcon size={10}/> Attached Image</div>
                             <div 
                                className="relative h-40 rounded-xl overflow-hidden border border-slate-700 bg-black/50 cursor-pointer group"
                                onClick={() => setExpandedImage(currentJob.imageUrl!)}
                             >
                                 <img src={currentJob.imageUrl} alt="Problem" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                 <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                                     <span className="bg-black/60 text-white text-xs px-2 py-1 rounded">คลิกเพื่อขยาย</span>
                                 </div>
                             </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mission Tools (Input Form) */}
            <div className="glass-panel rounded-2xl p-5 space-y-5">
                {/* 1. Materials */}
                <div>
                     <div className="flex justify-between items-center mb-3">
                        <label className="text-xs font-bold text-slate-300 flex items-center gap-2 uppercase tracking-wider">
                            <Box size={14} className="text-blue-400" /> เบิกวัสดุ (Materials)
                        </label>
                        {isCustomPart && (
                            <button onClick={() => setIsCustomPart(false)} className="text-[10px] text-cyan-400 flex items-center gap-1 border border-cyan-500/30 px-2 py-1 rounded-full hover:bg-cyan-900/30">
                                <RotateCcw size={10} /> กลับไปเลือก
                            </button>
                        )}
                     </div>

                     <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/50 space-y-3">
                         <div className="flex flex-col gap-3">
                            {!isCustomPart ? (
                                <select value={selectedPartId} onChange={(e) => {
                                    if(e.target.value === 'CUSTOM') { setIsCustomPart(true); } else { setSelectedPartId(e.target.value); }
                                }} className="w-full h-12 bg-slate-950 text-white text-sm rounded-lg px-3 border border-slate-700 focus:border-cyan-500 outline-none">
                                    {AVAILABLE_PARTS.map(p => (<option key={p.id} value={p.id}>{p.name} ({p.unit})</option>))}
                                    <option value="CUSTOM" className="text-amber-400 font-bold">+ ระบุเอง (Other)</option>
                                </select>
                            ) : (
                                <div className="flex gap-2">
                                    <input type="text" placeholder="ชื่อรายการ..." value={customName} onChange={e => setCustomName(e.target.value)} className="flex-1 h-12 bg-slate-950 text-white text-sm rounded-lg px-3 border border-cyan-500/50 focus:ring-1 focus:ring-cyan-500 outline-none" autoFocus />
                                    <input type="text" placeholder="หน่วย" value={customUnit} onChange={e => setCustomUnit(e.target.value)} className="w-20 h-12 bg-slate-950 text-white text-sm rounded-lg px-3 border border-slate-700 outline-none" />
                                </div>
                            )}

                            <div className="flex gap-3">
                                <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg h-12 w-32 shrink-0">
                                    <button onClick={() => adjustQty(-1)} className="w-10 h-full text-slate-400 hover:text-white hover:bg-slate-800 rounded-l active:bg-slate-700">-</button>
                                    <div className="flex-1 text-center font-bold text-lg text-cyan-400 font-tech">{quantity}</div>
                                    <button onClick={() => adjustQty(1)} className="w-10 h-full text-slate-400 hover:text-white hover:bg-slate-800 rounded-r active:bg-slate-700">+</button>
                                </div>
                                <button onClick={handleAddPart} disabled={isCustomPart && !customName} className="flex-1 h-12 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100">
                                    <Plus size={18} /> เพิ่มรายการ
                                </button>
                            </div>
                         </div>
                         
                         {addedParts.length > 0 && (
                             <div className="mt-2 space-y-2">
                                 {addedParts.map(part => (
                                     <div key={part.id} className="flex justify-between items-center bg-slate-800 p-2.5 rounded-lg border border-slate-700">
                                         <div className="text-sm text-slate-200">
                                             {part.name} <span className="text-emerald-400 font-bold ml-1">x{part.quantity}</span> <span className="text-slate-500 text-xs">{part.unit}</span>
                                         </div>
                                         <button onClick={() => handleRemovePart(part.id)} className="text-slate-500 hover:text-red-400 p-1"><Trash2 size={16}/></button>
                                     </div>
                                 ))}
                             </div>
                         )}
                     </div>
                </div>

                {/* 2. Note */}
                <div>
                     <label className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-2 uppercase tracking-wider">
                         <MessageSquare size={14} className="text-purple-400" /> บันทึกผลงาน (Note)
                     </label>
                     <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="รายละเอียดการซ่อม..." className="w-full bg-slate-950/60 border border-slate-700 rounded-xl p-4 text-sm text-white focus:border-emerald-500 outline-none h-24 resize-none" />
                </div>

                {/* 3. Complete Button (Hold to Confirm) */}
                <HoldButton 
                    onAction={handleComplete} 
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg py-4 rounded-xl shadow-[0_4px_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-3"
                    duration={1500}
                >
                    <CheckCircle size={24} /> กดค้างเพื่อปิดงาน (Hold to Complete)
                </HoldButton>
            </div>
        </div>
      ) : (
        <div className="glass-panel border-dashed border-slate-700 rounded-2xl p-10 flex flex-col items-center justify-center text-center min-h-[300px] animate-in fade-in duration-500">
             <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                 <Package size={40} className="text-slate-600" />
             </div>
             <h3 className="text-xl font-bold text-slate-300 mb-2">ไม่มีภารกิจในขณะนี้</h3>
             <p className="text-slate-500 text-sm">Standby for new assignments</p>
        </div>
      )}

      {/* 3. History Log - Wrapped in Glass Panel for Better Visibility */}
      <div className="glass-panel rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
              <History size={18} className="text-indigo-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">ประวัติการทำงานล่าสุด</h3>
          </div>
          <div className="space-y-3">
              {jobHistory.length === 0 ? (
                  <div className="text-center text-slate-500 text-xs italic py-4">ยังไม่มีประวัติงาน</div>
              ) : (
                  jobHistory.map(job => (
                      <div key={job.id} className="bg-slate-900/60 border border-white/5 p-4 rounded-xl flex justify-between items-start hover:bg-slate-800 transition-colors shadow-sm">
                          <div>
                              <div className="text-slate-200 font-medium text-sm mb-1">{job.description}</div>
                              <div className="text-[10px] text-slate-400 flex items-center gap-2">
                                  <span>ID: #{job.id}</span>
                                  <span>•</span>
                                  <span>{formatRelativeTime(job.completedAt || 0)}</span>
                              </div>
                              {job.usedParts && job.usedParts.length > 0 && (
                                  <div className="mt-2 flex flex-wrap gap-1">
                                      {job.usedParts.map((p,i) => (
                                          <span key={i} className="text-[9px] bg-black/30 text-slate-300 px-1.5 py-0.5 rounded border border-white/10">{p.name} x{p.quantity}</span>
                                      ))}
                                  </div>
                              )}
                          </div>
                          <div className="bg-emerald-500/10 text-emerald-500 p-1.5 rounded-lg border border-emerald-500/20">
                              <CheckCircle size={16} />
                          </div>
                      </div>
                  ))
              )}
          </div>
      </div>
    </div>
  );
};

export default TechnicianView;
