import React from 'react';
import { LogOut, Bell } from 'lucide-react';
import { User } from '../types';
import { playClickSound } from '../utils/sound';
import SchoolLogo from './SchoolLogo';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  notificationCount?: number;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, notificationCount = 0 }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b-0 border-b-slate-800/50">
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
      
      <div className="container mx-auto px-4 py-3 flex justify-between items-center gap-4">
        
        {/* Logo / Title */}
        <div className="flex items-center gap-3 group cursor-default">
          <div className="relative w-12 h-14 flex items-center justify-center">
            <div className="absolute inset-0 bg-cyan-500/20 blur-md rounded-full group-hover:bg-cyan-500/40 transition-all duration-500"></div>
            <div className="w-full h-full relative z-10 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">
                <SchoolLogo />
            </div>
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold leading-tight tracking-wide drop-shadow-md">
              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-text-shimmer">
                ระบบแจ้งซ่อม
              </span>
            </h1>
            <p className="text-[10px] sm:text-xs text-cyan-200/60 font-medium">โรงเรียนชุมชนมาบอำมฤต</p>
          </div>
        </div>

        {/* User Info / Logout */}
        {user && (
          <div className="flex items-center gap-3 sm:gap-5">
            
            {/* Notifications */}
            <div className="relative mr-1">
               <button 
                onClick={() => playClickSound()}
                className="text-slate-400 hover:text-cyan-400 transition-colors p-1.5 rounded-full hover:bg-cyan-900/20"
               >
                 <Bell size={20} className={notificationCount > 0 ? 'animate-pulse text-cyan-300' : ''} />
               </button>
               {notificationCount > 0 && (
                 <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[16px] h-[16px] px-1 text-[10px] font-bold text-white bg-red-500 border border-slate-900 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.6)]">
                   {notificationCount > 9 ? '9+' : notificationCount}
                 </span>
               )}
            </div>

            <div className="text-right hidden sm:block">
              <div className="text-sm font-semibold text-slate-100 tracking-wide text-glow">{user.name}</div>
              <div className="text-[10px] text-cyan-500/80 uppercase tracking-widest font-bold font-tech">
                {user.role === 'admin' ? 'ผู้ดูแลระบบ' : user.role === 'technician' ? 'ทีมช่าง' : 'ครู/บุคลากร'}
              </div>
            </div>
            
            <div className="h-8 w-[1px] bg-gradient-to-b from-transparent via-slate-700 to-transparent hidden sm:block"></div>

            <button
              onClick={() => {
                playClickSound();
                onLogout();
              }}
              className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 hover:bg-red-900/30 text-slate-300 hover:text-red-400 transition-all duration-300 border border-slate-700 hover:border-red-500/50"
              title="ออกจากระบบ"
            >
              <LogOut size={16} className="group-hover:translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline text-xs font-medium">ออก</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;