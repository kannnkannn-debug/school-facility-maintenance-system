
import React, { useState } from 'react';
import { User, Lock, ArrowRight, ShieldCheck, ClipboardList, Wrench, GraduationCap, Mail, UserPlus, ArrowLeft, CheckCircle2, Phone, Zap, Hammer, PaintRoller, HardHat, Settings } from 'lucide-react';
import { UserRole, RegisteredUser } from '../types';
import { TECHNICIAN_ACCOUNTS, TEACHER_GRADE_LEVELS } from '../constants';
import { playClickSound } from '../utils/sound';
import SchoolLogo from './SchoolLogo';

interface LoginScreenProps {
  onLogin: (username: string, password?: string, role?: UserRole, teamId?: number) => boolean;
  onRegister: (user: RegisteredUser) => boolean;
  onGuestLogin: (name: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onRegister, onGuestLogin }) => {
  const [activeTab, setActiveTab] = useState<UserRole>('teacher');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Register State
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regGrade, setRegGrade] = useState('');
  
  // Guest State
  const [guestName, setGuestName] = useState('');

  const handleTabChange = (role: UserRole) => {
    playClickSound();
    setActiveTab(role);
    setError('');
    setUsername('');
    setPassword('');
    setIsRegistering(false);
    setIsGuestMode(false);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      playClickSound();
      if (!regName || !regUsername || !regPassword || !regEmail || !regPhone || !regGrade) {
          setError('กรุณากรอกข้อมูลให้ครบถ้วน');
          return;
      }

      const newUser: RegisteredUser = {
          name: regName,
          username: regUsername,
          password: regPassword,
          email: regEmail,
          phoneNumber: regPhone,
          gradeLevel: regGrade,
          role: 'teacher',
          status: 'pending',
          createdAt: Date.now()
      };

      const success = onRegister(newUser);
      if (success) {
          setIsSuccess(true);
          setTimeout(() => {
              setIsSuccess(false);
              setIsRegistering(false);
              setUsername(regUsername);
              setPassword('');
              setRegName(''); setRegUsername(''); setRegPassword(''); setRegEmail(''); setRegPhone(''); setRegGrade('');
              setError('');
          }, 3000);
      }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    setError('');

    if (activeTab === 'teacher') {
       const success = onLogin(username, password, 'teacher');
       if (!success) {
           setError('ชื่อผู้ใช้/รหัสผ่านไม่ถูกต้อง หรือบัญชียังไม่อนุมัติ');
       }
    } else if (activeTab === 'admin') {
       const success = onLogin(username, password, 'admin');
       if (!success) setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    } else if (activeTab === 'technician') {
      const tech = TECHNICIAN_ACCOUNTS.find(t => t.username === username && t.password === password);
      if (tech) {
        onLogin(tech.username, tech.name, 'technician', tech.teamId); // Pass name as password param for tech logic in App.tsx wrapper if needed, or update interface
      } else {
        setError('ไม่พบข้อมูลช่าง หรือชื่อผู้ใช้/รหัสผ่านผิดพลาด');
      }
    }
  };
  
  const handleGuestSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      playClickSound();
      if(!guestName.trim()) {
          setError('กรุณาระบุชื่อผู้แจ้ง');
          return;
      }
      onGuestLogin(guestName);
  };

  if (isSuccess) {
      return (
          <div className="min-h-screen flex items-center justify-center p-4 bg-black/80 relative">
              <div className="glass-panel p-8 rounded-2xl max-w-md w-full text-center space-y-4 animate-in zoom-in duration-300">
                  <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                      <CheckCircle2 size={40} className="text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">ลงทะเบียนสำเร็จ</h2>
                  <p className="text-slate-400 text-sm">
                      ข้อมูลของคุณถูกส่งไปยังผู้ดูแลระบบแล้ว<br/>
                      โปรดรอการอนุมัติ (Approval) ก่อนเข้าใช้งาน
                  </p>
                  <p className="text-xs text-slate-500 mt-4">กำลังกลับสู่หน้าเข้าสู่ระบบ...</p>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden flex-col">
      {/* Background Ambience (Subtle light mode pulses) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[100px] animate-pulse" style={{animationDelay: '2s'}}></div>
          
          {/* DECORATIVE BACKGROUND ICONS - Increased opacity for visibility */}
          {/* Top Left - Tools */}
          <div className="absolute top-[5%] left-[5%] text-slate-500/10 rotate-[-15deg] animate-float">
            <Wrench size={180} />
          </div>
          {/* Top Right - Electrical */}
          <div className="absolute top-[10%] right-[5%] text-cyan-600/10 rotate-[15deg] animate-float-delayed">
            <Zap size={150} />
          </div>
          {/* Bottom Left - Maintenance */}
          <div className="absolute bottom-[10%] left-[8%] text-blue-500/10 rotate-[-10deg] animate-float-delayed">
            <PaintRoller size={160} />
          </div>
          {/* Bottom Right - Construction */}
          <div className="absolute bottom-[5%] right-[8%] text-slate-600/10 rotate-[10deg] animate-float">
            <Hammer size={170} />
          </div>
          {/* Center/Random - Safety & Systems */}
          <div className="absolute top-[40%] left-[15%] text-slate-500/10 rotate-[-5deg] animate-float">
            <HardHat size={120} />
          </div>
          <div className="absolute top-[30%] right-[20%] text-cyan-700/10 rotate-[20deg] animate-float-delayed">
            <Settings size={130} />
          </div>
      </div>

      <div className="max-w-[420px] w-full glass-panel rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] relative z-10 overflow-hidden border-t border-l border-white/20">
        
        {/* Glow Line Top */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-70"></div>

        {/* Header (Only show if not registering to save space) */}
        {!isRegistering && !isGuestMode && (
            <div className="pt-10 pb-6 px-8 text-center relative flex flex-col items-center">
            <div className="w-24 h-24 mx-auto flex items-center justify-center mb-6 relative group">
                <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full group-hover:bg-cyan-400/30 transition-all duration-500"></div>
                <div className="relative z-10 p-0 transform group-hover:scale-105 transition-transform duration-500 w-full h-full">
                    <SchoolLogo className="w-full h-full drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]" />
                </div>
            </div>
            
            <div className="space-y-1 w-full">
                <div className="flex items-center justify-center gap-3">
                    <div className="w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_5px_rgba(34,211,238,1)] animate-pulse"></div>
                    <h2 className="text-sm font-bold text-cyan-300 tracking-wider drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] bg-clip-text text-transparent bg-gradient-to-r from-cyan-200 to-cyan-400">
                        ระบบแจ้งซ่อมอุปกรณ์ของสถานศึกษา
                    </h2>
                    <div className="w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_5px_rgba(34,211,238,1)] animate-pulse"></div>
                </div>

                <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide leading-tight relative z-10 py-1">
                    โรงเรียนชุมชนมาบอำมฤต
                </h1>

                <div className="relative mt-2 py-1.5 flex justify-center">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
                    <p className="text-[9px] text-cyan-400/80 font-tech tracking-[0.25em] uppercase font-bold drop-shadow-sm">
                        School Facility Maintenance System
                    </p>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
                </div>
            </div>
            </div>
        )}

        {/* REGISTRATION FORM */}
        {isRegistering ? (
            <div className="p-6 pt-8 animate-in slide-in-from-right-4 duration-300">
                <button onClick={() => setIsRegistering(false)} className="mb-4 text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors">
                    <ArrowLeft size={14} /> กลับไปเข้าสู่ระบบ
                </button>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <UserPlus className="text-cyan-400" /> ลงทะเบียนครูใหม่
                </h2>
                
                <form onSubmit={handleRegisterSubmit} className="space-y-3">
                     <div>
                        <input type="text" placeholder="ชื่อ-นามสกุล (ภาษาไทย)" value={regName} onChange={e => setRegName(e.target.value)} className="w-full bg-slate-950/60 border border-slate-700/50 rounded-lg p-3 text-sm text-white focus:border-cyan-500 outline-none" required />
                     </div>
                     <div>
                        <input type="email" placeholder="อีเมล (Email)" value={regEmail} onChange={e => setRegEmail(e.target.value)} className="w-full bg-slate-950/60 border border-slate-700/50 rounded-lg p-3 text-sm text-white focus:border-cyan-500 outline-none" required />
                     </div>
                     <div>
                        <input type="tel" placeholder="เบอร์โทรศัพท์ (Phone Number)" value={regPhone} onChange={e => setRegPhone(e.target.value)} className="w-full bg-slate-950/60 border border-slate-700/50 rounded-lg p-3 text-sm text-white focus:border-cyan-500 outline-none" required />
                     </div>
                     <div>
                        <select value={regGrade} onChange={e => setRegGrade(e.target.value)} className="w-full bg-slate-950/60 border border-slate-700/50 rounded-lg p-3 text-sm text-white focus:border-cyan-500 outline-none" required>
                             <option value="">-- เลือกสายชั้น --</option>
                             {TEACHER_GRADE_LEVELS.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                     </div>
                     <div className="pt-2 border-t border-white/5"></div>
                     <div>
                        <input type="text" placeholder="ชื่อผู้ใช้ (Username)" value={regUsername} onChange={e => setRegUsername(e.target.value)} className="w-full bg-slate-950/60 border border-slate-700/50 rounded-lg p-3 text-sm text-white focus:border-cyan-500 outline-none font-tech" required />
                     </div>
                     <div>
                        <input type="password" placeholder="รหัสผ่าน (Password)" value={regPassword} onChange={e => setRegPassword(e.target.value)} className="w-full bg-slate-950/60 border border-slate-700/50 rounded-lg p-3 text-sm text-white focus:border-cyan-500 outline-none font-tech" required />
                     </div>

                     {error && <div className="text-red-400 text-xs p-2 bg-red-950/30 rounded border border-red-500/20">{error}</div>}

                     <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg shadow-lg mt-2">
                         ลงทะเบียน (Submit Request)
                     </button>
                </form>
            </div>
        ) : isGuestMode ? (
            /* GUEST / URGENT LOGIN FORM */
            <div className="p-6 pt-8 animate-in slide-in-from-right-4 duration-300">
                <button onClick={() => setIsGuestMode(false)} className="mb-4 text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors">
                    <ArrowLeft size={14} /> กลับไปเข้าสู่ระบบ
                </button>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        <Zap size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">แจ้งซ่อมด่วน</h2>
                        <p className="text-xs text-slate-400">กรณีเร่งด่วน (ไม่ต้องลงทะเบียน)</p>
                    </div>
                </div>
                
                <form onSubmit={handleGuestSubmit} className="space-y-4">
                     <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400">ชื่อผู้แจ้ง (ระบุให้ชัดเจน) <span className="text-red-400">*</span></label>
                        <input 
                            type="text" 
                            placeholder="เช่น ครูสมชาย (ห้องพยาบาล)" 
                            value={guestName} 
                            onChange={e => setGuestName(e.target.value)} 
                            className="w-full bg-slate-950/60 border border-slate-700/50 rounded-lg p-3 text-sm text-white focus:border-amber-500 outline-none" 
                            required 
                            autoFocus
                        />
                     </div>

                     {error && <div className="text-red-400 text-xs p-2 bg-red-950/30 rounded border border-red-500/20">{error}</div>}

                     <button type="submit" className="w-full bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-white font-bold py-3 rounded-lg shadow-lg mt-2 flex items-center justify-center gap-2 transition-all">
                         <Zap size={16} fill="currentColor" /> เข้าใช้งานทันที
                     </button>
                </form>
            </div>
        ) : (
            <>
                {/* Tabs */}
                <div className="px-6 mb-2">
                    <div className="flex p-1 bg-slate-950/50 rounded-xl border border-white/5 backdrop-blur-sm">
                    <button
                        onClick={() => handleTabChange('teacher')}
                        className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 rounded-lg text-xs font-bold transition-all duration-300 ${
                        activeTab === 'teacher' 
                            ? 'bg-gradient-to-br from-cyan-900/80 to-slate-900 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.15)] border border-cyan-500/30' 
                            : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                        }`}
                    >
                        <ClipboardList size={18} className={activeTab === 'teacher' ? 'drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]' : ''} />
                        ครู/บุคลากร
                    </button>
                    <button
                        onClick={() => handleTabChange('admin')}
                        className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 rounded-lg text-xs font-bold transition-all duration-300 ${
                        activeTab === 'admin' 
                            ? 'bg-gradient-to-br from-purple-900/80 to-slate-900 text-purple-300 shadow-[0_0_15px_rgba(192,38,211,0.15)] border border-purple-500/30' 
                            : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                        }`}
                    >
                        <ShieldCheck size={18} className={activeTab === 'admin' ? 'drop-shadow-[0_0_5px_rgba(192,38,211,0.8)]' : ''} />
                        ผู้ดูแลระบบ
                    </button>
                    <button
                        onClick={() => handleTabChange('technician')}
                        className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 rounded-lg text-xs font-bold transition-all duration-300 ${
                        activeTab === 'technician' 
                            ? 'bg-gradient-to-br from-amber-900/80 to-slate-900 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.15)] border border-amber-500/30' 
                            : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                        }`}
                    >
                        <Wrench size={18} className={activeTab === 'technician' ? 'drop-shadow-[0_0_5px_rgba(245,158,11,0.8)]' : ''} />
                        ทีมช่าง
                    </button>
                    </div>
                </div>

                {/* LOGIN FORM */}
                <form onSubmit={handleLogin} className="p-6 pt-2 space-y-5">
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="relative group">
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 block pl-1">ชื่อผู้ใช้ (Username)</label>
                            <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                            </div>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 bg-slate-950/60 border border-slate-700/50 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 focus:bg-slate-900/80 transition-all tracking-wide font-tech"
                                placeholder="Enter username"
                                autoFocus
                            />
                            </div>
                        </div>
                        <div className="relative group">
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 block pl-1">รหัสผ่าน (Password)</label>
                            <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 bg-slate-950/60 border border-slate-700/50 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 focus:bg-slate-900/80 transition-all tracking-wide font-tech"
                                placeholder="••••••••"
                            />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-400 text-xs bg-red-950/30 border border-red-500/30 p-3 rounded-lg flex items-center gap-2 animate-in slide-in-from-top-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                        {error}
                        </div>
                    )}

                    <div className="space-y-3">
                        <button
                            type="submit"
                            className={`
                                w-full font-bold py-3.5 rounded-lg shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm tracking-wide uppercase group relative overflow-hidden
                                ${activeTab === 'teacher' ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-900/20' : ''}
                                ${activeTab === 'admin' ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-900/20' : ''}
                                ${activeTab === 'technician' ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/20' : ''}
                            `}
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                เข้าสู่ระบบ <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                            {/* Glossy overlay on button */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                        </button>
                        
                        {activeTab === 'teacher' && (
                            <div className="space-y-2 pt-2">
                                <button 
                                    type="button"
                                    onClick={() => setIsGuestMode(true)}
                                    className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-amber-900/40 to-red-900/40 border border-amber-500/50 text-amber-200 hover:text-white hover:from-amber-600 hover:to-red-600 transition-all text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(245,158,11,0.2)] animate-pulse"
                                >
                                    <Zap size={14} className="fill-current" /> แจ้งซ่อมด่วน (Quick Access)
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setIsRegistering(true)}
                                    className="w-full py-2 text-xs text-slate-600 hover:text-cyan-600 transition-colors font-bold"
                                >
                                    ยังไม่มีบัญชี? <span className="underline decoration-cyan-500/50">ลงทะเบียนครูใหม่</span>
                                </button>
                            </div>
                        )}
                    </div>
                </form>
            </>
        )}
      </div>

      {/* Footer Credits on Login Screen - Darker text for visibility on light bg */}
      <div className="absolute bottom-4 left-0 right-0 text-center space-y-1 z-10 pointer-events-none">
        <div className="text-[10px] text-slate-800 font-bold tracking-wider">นายกานต์ โสมสัย ผู้พัฒนาระบบ</div>
        <div className="text-[9px] text-slate-600">โรงเรียนชุมชนมาบอำมฤต สังกัดสำนักงานเขตพื้นที่การศึกษาประถมศึกษาชุมพร เขต 1</div>
      </div>
    </div>
  );
};

export default LoginScreen;
