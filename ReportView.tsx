
import React, { useState, useEffect, useRef } from 'react';
import { BUILDINGS } from '../constants';
import { ClipboardPen, MapPin, User, CheckCircle2, AlertTriangle, ArrowRight, Camera, X, Loader2, History, Clock } from 'lucide-react';
import { User as UserType, Priority, Incident } from '../types';
import { playClickSound } from '../utils/sound';
import SchoolLogo from './SchoolLogo';
import { formatRelativeTime } from '../utils/date';

interface ReportViewProps {
  currentUser: UserType;
  onSubmit: (data: any) => void;
  incidents?: Incident[];
}

const ReportView: React.FC<ReportViewProps> = ({ currentUser, onSubmit, incidents = [] }) => {
  const getDisplayName = () => {
    return currentUser.gradeLevel 
        ? `${currentUser.name} (${currentUser.gradeLevel})`
        : currentUser.name;
  };

  const [formData, setFormData] = useState({
    buildingId: '',
    roomNumber: '',
    description: '',
    priority: 'Medium' as Priority,
    reporterName: getDisplayName(),
    imageUrl: '' as string
  });
  const [submitted, setSubmitted] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormData(prev => ({ ...prev, reporterName: getDisplayName() }));
  }, [currentUser]);

  // Filter incidents for this user (history)
  const myIncidents = incidents
    .filter(i => i.reporterName === getDisplayName())
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5); // Show last 5

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    if (!formData.buildingId || !formData.description || !formData.reporterName) return;
    onSubmit(formData);
    setSubmitted(true);
    setTimeout(() => {
        setSubmitted(false);
        setFormData({
            buildingId: '',
            roomNumber: '',
            description: '',
            priority: 'Medium',
            reporterName: getDisplayName(),
            imageUrl: ''
        });
    }, 3000);
  };

  // IMAGE COMPRESSION UTILITY
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 800; // Resize to max width 800px
                const MAX_HEIGHT = 800;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);
                
                // Compress to JPEG with 0.6 quality (High compression)
                const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
                resolve(dataUrl);
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Basic type check
      if (!file.type.startsWith('image/')) {
          alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
          return;
      }

      setIsCompressing(true);
      try {
          const compressedBase64 = await compressImage(file);
          setFormData(prev => ({ ...prev, imageUrl: compressedBase64 }));
      } catch (error) {
          console.error("Image compression failed", error);
          alert("เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ");
      } finally {
          setIsCompressing(false);
      }
    }
  };

  const clearImage = () => {
    setFormData(prev => ({ ...prev, imageUrl: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (submitted) {
      return (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-6 text-center animate-in fade-in zoom-in duration-300">
              <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)] border border-emerald-500/30">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2 tracking-wide text-glow">ส่งข้อมูลสำเร็จ</h2>
              <p className="text-slate-400 mb-8 max-w-sm">
                  ระบบได้บันทึกการแจ้งซ่อมของคุณแล้ว ทีมช่างจะดำเนินการตรวจสอบโดยเร็วที่สุด
              </p>
              <button 
                onClick={() => { playClickSound(); setSubmitted(false); }}
                className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded border border-slate-600 hover:border-white/30 transition-all"
              >
                  แจ้งซ่อมรายการอื่น
              </button>
          </div>
      );
  }

  return (
    <div className="max-w-2xl mx-auto w-full space-y-6">
      <div className="glass-panel rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.3)] overflow-hidden">
        <div className="p-6 border-b border-white/5 bg-gradient-to-r from-blue-900/30 to-transparent relative">
          <div className="absolute top-4 right-4 w-12 h-12 opacity-80">
              <SchoolLogo />
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-3 tracking-widest text-glow relative z-10">
            <ClipboardPen className="text-cyan-400" />
            แบบฟอร์มแจ้งซ่อม
          </h2>
          <p className="text-cyan-200/50 text-xs mt-1 ml-9 relative z-10">กรุณากรอกข้อมูลให้ครบถ้วนในช่องที่มีเครื่องหมายดอกจัน (*)</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                        <MapPin size={14} /> สถานที่ / อาคาร <span className="text-red-400">*</span>
                    </label>
                    <select required value={formData.buildingId} onChange={e => setFormData({...formData, buildingId: e.target.value})} className="w-full bg-slate-950/60 border border-slate-700 rounded p-3 text-slate-200 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all">
                        <option value="">-- เลือกอาคาร --</option>
                        {BUILDINGS.map(b => ( <option key={b.id} value={b.id}>{b.name}</option> ))}
                    </select>
                </div>
                
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">ห้อง / จุดที่พบปัญหา</label>
                    <input type="text" placeholder="เช่น ห้อง 402, ทางเดินชั้น 1" value={formData.roomNumber} onChange={e => setFormData({...formData, roomNumber: e.target.value})} className="w-full bg-slate-950/60 border border-slate-700 rounded p-3 text-slate-200 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all placeholder:text-slate-700" />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">รายละเอียดปัญหา <span className="text-red-400">*</span></label>
                <textarea required rows={4} placeholder="ระบุอาการเสีย หรือความเสียหายที่พบ..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-950/60 border border-slate-700 rounded p-3 text-slate-200 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all placeholder:text-slate-700 resize-none" />
            </div>

            <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Camera size={14} /> รูปภาพประกอบ (ถ้ามี)
                 </label>
                 
                 {!formData.imageUrl ? (
                     <div 
                        onClick={() => !isCompressing && fileInputRef.current?.click()}
                        className={`w-full border-2 border-dashed border-slate-700 rounded-xl p-6 text-center transition-all group ${isCompressing ? 'opacity-50 cursor-wait' : 'hover:border-cyan-500/50 hover:bg-slate-900/30 cursor-pointer'}`}
                     >
                         <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-cyan-900/30 group-hover:text-cyan-400 transition-colors text-slate-500">
                             {isCompressing ? <Loader2 size={20} className="animate-spin text-cyan-400" /> : <Camera size={20} />}
                         </div>
                         <p className="text-xs text-slate-500">
                             {isCompressing ? 'กำลังปรับขนาดรูปภาพ...' : 'คลิกเพื่อแนบรูปภาพ (ระบบจะย่อขนาดให้อัตโนมัติ)'}
                         </p>
                         <input 
                            type="file" 
                            ref={fileInputRef} 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleImageChange}
                            disabled={isCompressing} 
                         />
                     </div>
                 ) : (
                     <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-black/50 p-1 group">
                         <img src={formData.imageUrl} alt="Preview" className="w-full h-48 object-contain rounded-lg" />
                         <div className="absolute top-2 right-2 flex gap-2">
                            <button 
                                type="button" 
                                onClick={clearImage}
                                className="p-1.5 bg-red-600 text-white rounded-full hover:bg-red-500 shadow-lg transition-transform hover:scale-110"
                            >
                                <X size={14} />
                            </button>
                         </div>
                         <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 text-white text-[10px] rounded backdrop-blur-sm">
                             พร้อมส่ง
                         </div>
                     </div>
                 )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                  <label className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                      <AlertTriangle size={14} /> ระดับความเร่งด่วน
                  </label>
                  <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value as Priority})} className="w-full bg-slate-950/60 border border-slate-700 rounded p-3 text-slate-200 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all">
                      <option value="Low">ต่ำ (รอได้ / ไม่กระทบการเรียน)</option>
                      <option value="Medium">ปานกลาง (ควรซ่อมตามรอบ)</option>
                      <option value="High">สูง (กระทบการใช้งาน)</option>
                      <option value="Critical">วิกฤต (อันตราย / ต้องซ่อมทันที)</option>
                  </select>
              </div>

              <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <User size={14} /> ผู้แจ้ง <span className="text-red-400">*</span>
                  </label>
                  <input required type="text" readOnly value={formData.reporterName} className="w-full bg-slate-900/40 border border-slate-800 rounded p-3 text-slate-500 cursor-not-allowed outline-none text-sm" />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5">
            <button 
                type="submit" 
                disabled={isCompressing}
                className={`w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded shadow-[0_0_15px_rgba(8,145,178,0.4)] transition-all active:scale-[0.98] uppercase tracking-widest flex items-center justify-center gap-2 group ${isCompressing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {isCompressing ? 'กำลังประมวลผลรูปภาพ...' : (
                    <>ส่งเรื่องแจ้งซ่อม <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
                )}
            </button>
          </div>
        </form>
      </div>

      {/* MY HISTORY SECTION */}
      {myIncidents.length > 0 && (
          <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
                  <History className="text-indigo-400" size={18} />
                  รายการแจ้งซ่อมล่าสุดของฉัน
              </h3>
              <div className="space-y-3">
                  {myIncidents.map(inc => (
                      <div key={inc.id} className="bg-slate-900/40 border border-white/5 p-3 rounded-lg flex items-center justify-between">
                          <div className="min-w-0 flex-1">
                              <div className="text-xs font-medium text-slate-200 truncate pr-2">{inc.description}</div>
                              <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-1">
                                  <span>{inc.buildingName}</span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1"><Clock size={10} /> {formatRelativeTime(inc.timestamp)}</span>
                              </div>
                          </div>
                          <div className={`
                              text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider
                              ${inc.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : ''}
                              ${inc.status === 'In Progress' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : ''}
                              ${inc.status === 'Done' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : ''}
                          `}>
                              {inc.status === 'Pending' ? 'รอจัดสรร' : inc.status === 'In Progress' ? 'กำลังซ่อม' : 'เสร็จสิ้น'}
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}
    </div>
  );
};

export default ReportView;
