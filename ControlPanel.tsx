
import React, { useState, useRef } from 'react';
import { Team, Incident, RegisteredUser } from '../types';
import WeeklySummary from './WeeklySummary';
import MaterialSummary from './MaterialSummary';
import { Users, AlertTriangle, RefreshCw, Eye, Database, Download, Upload, UserPlus, Check, X, Mail, Phone, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { playClickSound } from '../utils/sound';
import SchoolLogo from './SchoolLogo';
import HoldButton from './HoldButton';

interface ControlPanelProps {
  teams: Team[];
  incidents: Incident[];
  isAdmin?: boolean;
  registeredUsers?: RegisteredUser[];
  onResetSystem?: () => void;
  onInspectTeam?: (teamId: number) => void;
  onExportData?: () => void;
  onImportData?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onApproveUser?: (username: string) => void;
  onRejectUser?: (username: string) => void;
  addToast?: (type: 'success' | 'error' | 'info', message: string) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  teams, 
  incidents, 
  isAdmin = false, 
  registeredUsers = [],
  onResetSystem, 
  onInspectTeam,
  onExportData,
  onImportData,
  onApproveUser,
  onRejectUser,
  addToast
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const pendingCount = incidents.filter(i => i.status === 'Pending').length;
  const progressCount = incidents.filter(i => i.status === 'In Progress').length;
  const doneCount = incidents.filter(i => i.status === 'Done').length;
  
  const pendingUsers = registeredUsers.filter(u => u.status === 'pending');

  const handleResetClick = () => {
    if (onResetSystem) {
        onResetSystem();
        if(addToast) addToast('error', 'ระบบถูกรีเซ็ตเรียบร้อยแล้ว');
    }
  };

  const handleImportClick = () => {
    playClickSound();
    fileInputRef.current?.click();
  };

  const handleApprove = (username: string) => {
    if(onApproveUser) {
        onApproveUser(username);
        if(addToast) addToast('success', 'อนุมัติผู้ใช้งานเรียบร้อยแล้ว');
    }
  };

  const handleReject = (username: string) => {
    if(onRejectUser) {
        onRejectUser(username);
        if(addToast) addToast('info', 'ปฏิเสธผู้ใช้งานเรียบร้อยแล้ว');
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto custom-scrollbar pr-1 pb-4">
      {/* School Logo Header for Dashboard */}
      <div className="flex items-center gap-3 px-2 py-1 mb-2">
         <div className="w-10 h-10 drop-shadow-md">
            <SchoolLogo />
         </div>
         <div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">แผงควบคุมหลัก</h2>
            <p className="text-[10px] text-slate-500 font-tech font-bold">ADMIN CONTROL CENTER</p>
         </div>
      </div>
      
      {/* 1. Key Stats Rows (Redesigned) */}
      <div className="grid grid-cols-3 gap-3">
          {/* Pending Stats */}
          <div className="glass-panel p-4 rounded-xl relative overflow-hidden group hover:bg-amber-950/20 transition-colors">
              <div className="absolute -right-3 -bottom-3 text-amber-500/10 group-hover:text-amber-500/20 transition-colors">
                  <AlertCircle size={64} />
              </div>
              <div className="relative z-10">
                  <div className="text-amber-400 font-bold text-3xl font-tech drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]">{pendingCount}</div>
                  <div className="text-[10px] text-slate-400 font-bold tracking-wider mt-1 uppercase">รอจัดสรร</div>
              </div>
              <div className="absolute bottom-0 left-0 h-[2px] w-full bg-amber-500/50 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          </div>

          {/* In Progress Stats */}
          <div className="glass-panel p-4 rounded-xl relative overflow-hidden group hover:bg-blue-950/20 transition-colors">
              <div className="absolute -right-3 -bottom-3 text-blue-500/10 group-hover:text-blue-500/20 transition-colors">
                  <Clock size={64} />
              </div>
              <div className="relative z-10">
                  <div className="text-blue-400 font-bold text-3xl font-tech drop-shadow-[0_0_8px_rgba(96,165,250,0.4)]">{progressCount}</div>
                  <div className="text-[10px] text-slate-400 font-bold tracking-wider mt-1 uppercase">กำลังซ่อม</div>
              </div>
              <div className="absolute bottom-0 left-0 h-[2px] w-full bg-blue-500/50 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          </div>

          {/* Done Stats */}
          <div className="glass-panel p-4 rounded-xl relative overflow-hidden group hover:bg-emerald-950/20 transition-colors">
              <div className="absolute -right-3 -bottom-3 text-emerald-500/10 group-hover:text-emerald-500/20 transition-colors">
                  <CheckCircle2 size={64} />
              </div>
              <div className="relative z-10">
                  <div className="text-emerald-400 font-bold text-3xl font-tech drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]">{doneCount}</div>
                  <div className="text-[10px] text-slate-400 font-bold tracking-wider mt-1 uppercase">เสร็จสิ้น</div>
              </div>
              <div className="absolute bottom-0 left-0 h-[2px] w-full bg-emerald-500/50 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          </div>
      </div>

      {/* NEW USER REQUESTS (Admin Only) */}
      {isAdmin && pendingUsers.length > 0 && onApproveUser && onRejectUser && (
          <div className="glass-panel rounded-xl p-5 border-cyan-500/30 bg-cyan-950/10 relative overflow-hidden animate-in fade-in slide-in-from-right-4">
              <div className="absolute top-0 right-0 p-2 opacity-20"><UserPlus size={40} className="text-cyan-400" /></div>
              <h3 className="text-xs font-bold text-cyan-300 mb-3 flex items-center gap-2 uppercase tracking-wider relative z-10">
                  <UserPlus size={14} /> คำขอลงทะเบียนใหม่ ({pendingUsers.length})
              </h3>
              <div className="space-y-2 relative z-10">
                  {pendingUsers.map(u => (
                      <div key={u.username} className="bg-slate-900/80 border border-cyan-500/20 p-3 rounded-lg flex items-center justify-between shadow-lg">
                          <div>
                              <div className="text-xs font-bold text-white">{u.name}</div>
                              <div className="text-[10px] text-slate-400 flex flex-col gap-1 mt-1">
                                  <span>{u.gradeLevel}</span>
                                  <div className="flex items-center gap-2">
                                      <span className="flex items-center gap-0.5"><Mail size={8} /> {u.email}</span>
                                      {u.phoneNumber && <span className="flex items-center gap-0.5"><Phone size={8} /> {u.phoneNumber}</span>}
                                  </div>
                              </div>
                          </div>
                          <div className="flex gap-2">
                              <button onClick={() => handleApprove(u.username)} className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded shadow-lg transition-colors" title="อนุมัติ"><Check size={14}/></button>
                              <button onClick={() => handleReject(u.username)} className="p-1.5 bg-red-600 hover:bg-red-500 text-white rounded shadow-lg transition-colors" title="ปฏิเสธ"><X size={14}/></button>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* 2. Charts & Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
          <div className="h-64 shrink-0">
             <WeeklySummary incidents={incidents} />
          </div>
          <div className="h-64 shrink-0">
             <MaterialSummary incidents={incidents} />
          </div>
      </div>

      {/* 3. Teams List */}
      <div className="glass-panel rounded-xl p-5 flex-1 min-h-[300px]">
         <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
            <Users size={18} className="text-indigo-400" /> สถานะทีมช่าง
         </h3>
         <div className="space-y-3">
            {teams.map(team => {
                const isBusy = team.status === 'Busy';
                const currentIncident = isBusy ? incidents.find(i => i.id === team.currentIncidentId) : null;
                
                return (
                    <div key={team.id} className="bg-slate-900/40 border border-white/5 rounded-lg p-3 transition-all hover:border-white/10 hover:bg-slate-800/40 group">
                        <div className="flex justify-between items-center mb-2">
                             <div className="font-semibold text-slate-200 text-sm tracking-wide">{team.name}</div>
                             <div className={`text-[10px] px-2 py-0.5 rounded border font-bold tracking-wider ${isBusy ? 'bg-amber-500/10 border-amber-500/50 text-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.2)]' : 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.2)]'}`}>
                                 {isBusy ? 'ไม่ว่าง' : 'ว่าง'}
                             </div>
                        </div>
                        {isBusy && currentIncident && (
                            <div className="text-[10px] text-slate-400 bg-black/20 p-2 rounded border border-white/5 flex items-start gap-2">
                                <div className="w-1 h-full bg-amber-500 rounded-full shrink-0"></div>
                                <div>
                                    <span className="block text-amber-500/80 mb-0.5 font-bold uppercase tracking-wider">กำลังซ่อม:</span>
                                    {currentIncident.buildingName} - {currentIncident.description}
                                </div>
                            </div>
                        )}
                        {/* INSPECT BUTTON FOR ADMIN */}
                        {isAdmin && onInspectTeam && (
                            <button 
                                onClick={() => { playClickSound(); onInspectTeam(team.id); }}
                                className="w-full mt-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-cyan-300 border border-slate-700 rounded text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all opacity-60 group-hover:opacity-100"
                            >
                                <Eye size={12} /> ตรวจสอบ (Inspect)
                            </button>
                        )}
                    </div>
                )
            })}
         </div>
      </div>
      
      {/* 4. DATA MANAGEMENT (Backup/Restore) - LIGHT THEME for Text Visibility */}
      {isAdmin && onExportData && onImportData && (
          <div className="rounded-xl p-5 border border-slate-300/50 bg-white/60 shadow-sm backdrop-blur-sm mt-2">
              <h3 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-2 uppercase tracking-wider">
                  <Database size={14} className="text-blue-600" /> สำรองข้อมูล (Database)
              </h3>
              <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => { playClickSound(); onExportData(); }}
                    className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                      <Download size={14} /> Export
                  </button>
                  <button 
                    onClick={handleImportClick}
                    className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                      <Upload size={14} /> Import
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".json" 
                    onChange={onImportData} 
                  />
              </div>
          </div>
      )}

      {/* 5. DANGER ZONE (Admin Only) - LIGHT THEME for Text Visibility */}
      {isAdmin && onResetSystem && (
          <div className="rounded-xl p-5 border border-red-300/50 bg-red-50/60 shadow-sm backdrop-blur-sm mt-2">
              <h3 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-2 uppercase tracking-wider">
                  <AlertTriangle size={14} className="text-red-600" /> Danger Zone
              </h3>
              
              <HoldButton 
                onAction={handleResetClick}
                className="w-full py-3 bg-white hover:bg-red-50 text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
                progressClassName="bg-red-500/20"
                duration={3000}
              >
                  <RefreshCw size={14} /> กดค้าง 3 วิ เพื่อรีเซ็ตระบบ
              </HoldButton>
          </div>
      )}

      {/* CREDITS (Admin Only Location) - Darker text for light background */}
      <div className="mt-4 pt-4 text-center opacity-80 border-t border-slate-300/50">
        <div className="text-[10px] text-slate-600 font-bold tracking-wider">นายกานต์ โสมสัย ผู้พัฒนาระบบ</div>
        <div className="text-[9px] text-slate-500">โรงเรียนชุมชนมาบอำมฤต สังกัดสำนักงานเขตพื้นที่การศึกษาประถมศึกษาชุมพร เขต 1</div>
      </div>
    </div>
  );
};

export default ControlPanel;
