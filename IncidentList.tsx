
import React, { useState } from 'react';
import { Incident, Priority } from '../types';
import { Clock, CheckCircle, MapPin, User, Wrench, Search, Filter, MessageSquare, Package, AlertCircle, Printer, Trash2, Image as ImageIcon, ShieldCheck, X } from 'lucide-react';
import { playClickSound } from '../utils/sound';
import { formatRelativeTime, formatFullDate } from '../utils/date';
import HoldButton from './HoldButton';

interface IncidentListProps {
  incidents: Incident[];
  onAssignClick: (incidentId: number) => void;
  onCompleteClick: (incidentId: number) => void;
  onDeleteClick?: (incidentId: number) => void;
  isAdmin?: boolean;
}

const IncidentList: React.FC<IncidentListProps> = ({ incidents, onAssignClick, onCompleteClick, onDeleteClick, isAdmin = false }) => {
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'In Progress' | 'Done'>('All');
  const [priorityFilter, setPriorityFilter] = useState<'All' | Priority>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  // FILTERING LOGIC
  const filteredIncidents = incidents.filter(i => {
    if (statusFilter !== 'All' && i.status !== statusFilter) return false;
    if (priorityFilter !== 'All' && i.priority !== priorityFilter) return false;
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const textMatch = 
            i.description.toLowerCase().includes(q) || 
            i.buildingName.toLowerCase().includes(q) ||
            i.roomNumber.toLowerCase().includes(q) ||
            i.reporterName.toLowerCase().includes(q);
        if (!textMatch) return false;
    }
    return true;
  });

  // SORTING LOGIC
  const displayList = filteredIncidents.sort((a, b) => {
      if (statusFilter === 'All') {
          const statusWeight = { 'Pending': 2, 'In Progress': 1, 'Done': 0 };
          if (statusWeight[a.status] !== statusWeight[b.status]) {
              return statusWeight[b.status] - statusWeight[a.status];
          }
      }
      const priorityWeight = { 'Critical': 3, 'High': 2, 'Medium': 1, 'Low': 0 };
      if (priorityWeight[a.priority] !== priorityWeight[b.priority]) {
          return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      return b.timestamp - a.timestamp;
  });

  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case 'Critical': return <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/30 animate-pulse print:border-red-600 print:text-red-700"><AlertCircle size={10} /> วิกฤต</span>;
      case 'High': return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/30 print:border-orange-600 print:text-orange-700">สูง</span>;
      case 'Medium': return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30 print:border-blue-600 print:text-blue-700">ปานกลาง</span>;
      case 'Low': return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-700/30 text-slate-400 border border-slate-600/30 print:border-slate-400 print:text-slate-600">ต่ำ</span>;
    }
  };

  const handlePrint = () => {
      playClickSound();
      window.print();
  };

  return (
    <div className="glass-panel rounded-xl flex flex-col h-full overflow-hidden border-slate-800 print:border-none print:shadow-none print:bg-white print:h-auto">
      
      {/* Expanded Image Modal */}
      {expandedImage && (
          <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setExpandedImage(null)}>
              <img src={expandedImage} alt="Expanded" className="max-w-full max-h-full rounded-lg shadow-2xl" />
              <button className="absolute top-4 right-4 text-white hover:text-red-500 p-2"><X size={32} /></button>
          </div>
      )}

      {/* Toolbar */}
      <div className="p-3 border-b border-white/5 bg-slate-900/40 space-y-3 backdrop-blur-sm z-20 print:hidden">
         {/* Search & Print */}
         <div className="flex gap-2">
             <div className="relative group flex-1">
                 <Search className="absolute left-3 top-2.5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={16} />
                 <input 
                    type="text" 
                    placeholder="ค้นหา (อาคาร, ปัญหา, ผู้แจ้ง)..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-700/50 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none placeholder:text-slate-600 transition-all font-sans"
                 />
             </div>
             <button 
                onClick={handlePrint}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-2 rounded-lg border border-slate-700 transition-all flex items-center gap-2"
                title="พิมพ์รายการ"
             >
                 <Printer size={18} />
             </button>
         </div>

         {/* Filter Dropdown */}
         <div className="flex gap-2">
             <div className="flex items-center gap-2 bg-slate-950/50 border border-slate-700/50 rounded-lg px-3 py-1.5 w-full">
                 <Filter size={14} className="text-slate-500" />
                 <select 
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value as any)}
                    className="bg-transparent text-xs text-slate-300 w-full outline-none border-none cursor-pointer"
                 >
                     <option value="All">ระดับความเร่งด่วน (ทั้งหมด)</option>
                     <option value="Critical">🔴 วิกฤต (Critical)</option>
                     <option value="High">🟠 สูง (High)</option>
                     <option value="Medium">🔵 ปานกลาง (Medium)</option>
                     <option value="Low">⚪️ ต่ำ (Low)</option>
                 </select>
             </div>
         </div>
      </div>

      {/* Print Header */}
      <div className="hidden print:block p-4 border-b border-black text-center mb-4">
          <h1 className="text-2xl font-bold text-black">รายการแจ้งซ่อมอุปกรณ์</h1>
          <p className="text-sm text-gray-600">โรงเรียนชุมชนมาบอำมฤต</p>
          <p className="text-xs text-gray-500 mt-2">พิมพ์เมื่อ: {new Date().toLocaleString('th-TH')}</p>
      </div>

      {/* Status Tabs */}
      <div className="flex border-b border-white/5 bg-slate-900/60 z-10 print:hidden">
          {['All', 'Pending', 'In Progress', 'Done'].map(f => (
              <button
                key={f}
                onClick={() => {
                  playClickSound();
                  setStatusFilter(f as any);
                }}
                className={`flex-1 py-3 text-[10px] sm:text-xs font-bold transition-all relative ${
                    statusFilter === f 
                    ? 'text-cyan-400 bg-white/5' 
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                }`}
              >
                  {statusFilter === f && (
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
                  )}
                  {f === 'All' ? 'ทั้งหมด' : f === 'Pending' ? 'รอจัดสรร' : f === 'In Progress' ? 'กำลังซ่อม' : 'เสร็จสิ้น'}
              </button>
          ))}
      </div>
      
      {/* Content List */}
      <div className="overflow-y-auto flex-1 p-3 space-y-2 custom-scrollbar bg-slate-950/20 print:overflow-visible print:bg-white print:p-0">
        {displayList.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full py-12 text-slate-500 opacity-80 animate-in zoom-in duration-300">
                <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4 border border-slate-700/50 shadow-inner">
                    <ShieldCheck className="w-8 h-8 text-emerald-500/50" />
                </div>
                <p className="font-tech text-sm uppercase tracking-widest font-bold text-slate-400">ALL SYSTEMS NOMINAL</p>
                <p className="text-xs text-slate-600 mt-1">ไม่พบรายการแจ้งซ่อมในหมวดนี้</p>
            </div>
        )}

        {displayList.map((incident, index) => {
          const isDone = incident.status === 'Done';
          const isPending = incident.status === 'Pending';
          const isInProgress = incident.status === 'In Progress';

          return (
            <div 
              key={incident.id}
              className={`
                relative rounded-lg p-3.5 border transition-all duration-200 group break-inside-avoid stagger-item
                ${isDone 
                  ? 'bg-slate-900/40 border-slate-800 opacity-60 hover:opacity-100 print:bg-white print:border-gray-300 print:opacity-100' 
                  : 'hud-card print:bg-white print:border-gray-300'
                }
              `}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                    {/* Top Row: Priority & ID */}
                    <div className="flex items-center gap-2 mb-1.5">
                         {/* Status Dot */}
                         <div className={`w-2 h-2 rounded-full shadow-[0_0_5px_currentColor] print:shadow-none ${
                             isPending ? 'bg-amber-500 text-amber-500' : 
                             isInProgress ? 'bg-blue-500 text-blue-500' : 
                             'bg-emerald-500 text-emerald-500'
                         }`}></div>
                         
                         {getPriorityBadge(incident.priority)}
                         
                         <span className="text-[10px] text-slate-600 font-mono font-tech ml-auto print:text-gray-500">
                            #{incident.id.toString().padStart(4, '0')}
                         </span>
                    </div>

                    {/* Title */}
                    <h3 className={`text-sm font-semibold mb-1 leading-snug ${isDone ? 'text-slate-400' : 'text-slate-100'} line-clamp-2 print:line-clamp-none print:text-black print:whitespace-normal`}>
                        {incident.description}
                    </h3>
                    
                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-2 print:text-gray-700">
                        <span className="flex items-center gap-1"><MapPin size={11} className="text-cyan-600 print:text-black" /> {incident.buildingName} {incident.roomNumber && <span className="text-slate-500 print:text-gray-600">({incident.roomNumber})</span>}</span>
                        <span className="flex items-center gap-1">
                            <Clock size={11} className="text-slate-600 print:text-black" /> 
                            <span className="print:hidden">{formatRelativeTime(incident.timestamp)}</span>
                            <span className="hidden print:inline">{formatFullDate(incident.timestamp)}</span>
                        </span>
                        <span className="flex items-center gap-1"><User size={11} className="text-purple-600 print:text-black" /> {incident.reporterName}</span>
                    </div>
                    
                    {/* Image Attachment (Thumbnail) */}
                    {incident.imageUrl && (
                        <div className="mt-3 print:hidden">
                            <button 
                                onClick={(e) => { e.stopPropagation(); setExpandedImage(incident.imageUrl!); }}
                                className="flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300 border border-cyan-900/50 bg-cyan-950/30 px-2 py-1 rounded transition-colors group/img"
                            >
                                <ImageIcon size={12} /> ดูรูปภาพประกอบ
                                <div className="h-6 w-6 ml-1 rounded bg-black/50 overflow-hidden relative border border-slate-700">
                                    <img src={incident.imageUrl} alt="thumbnail" className="w-full h-full object-cover" />
                                </div>
                            </button>
                        </div>
                    )}
                </div>

                {/* Delete Button (Only for Admin & Not Print) - Use HoldButton for cool UX */}
                {isAdmin && onDeleteClick && (
                    <div className="print:hidden opacity-0 group-hover:opacity-100 transition-opacity">
                         <HoldButton
                            onAction={() => onDeleteClick(incident.id)}
                            className="text-slate-700 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                            duration={1000}
                         >
                            <Trash2 size={16} />
                         </HoldButton>
                    </div>
                )}
              </div>

              {/* Expanded Details for Done Jobs */}
              {isDone && (incident.completionNote || (incident.usedParts && incident.usedParts.length > 0)) && (
                  <div className="mt-3 pt-2 border-t border-dashed border-slate-800 space-y-2 print:border-gray-300">
                      {incident.completionNote && (
                        <div className="flex items-start gap-1.5 text-xs text-slate-400 print:text-gray-600">
                            <MessageSquare size={12} className="mt-0.5 text-emerald-600 shrink-0 print:text-black" />
                            <span className="italic text-slate-500 print:text-gray-600">"{incident.completionNote}"</span>
                        </div>
                      )}
                      {incident.usedParts && incident.usedParts.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                           {incident.usedParts.map((part, idx) => (
                               <div key={idx} className="flex items-center gap-1 text-[9px] bg-slate-950 text-slate-500 px-1.5 py-0.5 rounded border border-slate-800 print:bg-gray-100 print:text-black print:border-gray-300">
                                   <Package size={9} /> {part.name} <span className="text-emerald-500 font-tech print:text-black">x{part.quantity}</span>
                               </div>
                           ))}
                        </div>
                      )}
                  </div>
              )}

              {/* Actions */}
              {!isDone && (
                  <div className="mt-3 flex gap-2 print:hidden">
                      {isPending && (
                          <button
                            onClick={() => { playClickSound(); onAssignClick(incident.id); }}
                            className="flex-1 text-xs py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 font-medium transition-all active:scale-95 flex items-center justify-center gap-1.5"
                          >
                             <Wrench size={12} /> มอบหมาย
                          </button>
                      )}
                      {isInProgress && (
                          <button
                            onClick={() => { playClickSound(); onCompleteClick(incident.id); }}
                            className="flex-1 text-xs py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20 font-medium transition-all active:scale-95 flex items-center justify-center gap-1.5"
                          >
                             <CheckCircle size={12} /> ปิดงาน
                          </button>
                      )}
                  </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IncidentList;
