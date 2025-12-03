
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BuildingGrid from './components/BuildingGrid';
import IncidentList from './components/IncidentList';
import ControlPanel from './components/ControlPanel';
import ReportView from './components/ReportView';
import TechnicianView from './components/TechnicianView';
import AssignTeamModal from './components/AssignTeamModal';
import LoginScreen from './components/LoginScreen';
import ToastContainer from './components/ToastContainer';
import { Incident, Team, User, UserRole, Priority, UsedPart, RegisteredUser, ToastMessage } from './types';
import { INITIAL_TEAMS, BUILDINGS, TECHNICIAN_ACCOUNTS, ADMIN_CREDENTIALS } from './constants';
import { ArrowLeft } from 'lucide-react';
import { sendApprovalEmail } from './utils/email';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
  
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [targetIncidentId, setTargetIncidentId] = useState<number | null>(null);

  // ADMIN INSPECTION MODE STATE
  const [inspectingTeamId, setInspectingTeamId] = useState<number | null>(null);

  // TOAST NOTIFICATION SYSTEM
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
    const savedIncidents = localStorage.getItem('school_incidents');
    const savedTeams = localStorage.getItem('school_teams');
    const savedUser = sessionStorage.getItem('school_user');
    const savedUsers = localStorage.getItem('school_registered_users');

    if (savedUser) { setCurrentUser(JSON.parse(savedUser)); }

    if (savedUsers) {
        setRegisteredUsers(JSON.parse(savedUsers));
    }

    if (savedIncidents) {
        setIncidents(JSON.parse(savedIncidents));
    } else {
        const seed: Incident[] = [
           { id: 1, buildingId: 'B1', buildingName: 'อาคารเรียน ป.1-2', roomNumber: '101', description: 'ไฟกะพริบ', reporterName: 'ครูสมศรี (สายชั้นประถมศึกษาปีที่ 1)', status: 'Done', priority: 'Low', assignedTeamId: 1, timestamp: Date.now() - 432000000, completedAt: Date.now() - 400000000, completionNote: 'เปลี่ยนหลอดไฟใหม่ 2 หลอด', usedParts: [{ id: 'p1', name: 'หลอดไฟ LED ยาว', quantity: 2, unit: 'หลอด' }] },
           { id: 2, buildingId: 'B13', buildingName: 'โรงอาหาร 1', roomNumber: '', description: 'ก๊อกน้ำรั่ว', reporterName: 'ป้าน้อย', status: 'Done', priority: 'High', assignedTeamId: 2, timestamp: Date.now() - 345600000, completedAt: Date.now() - 300000000, completionNote: 'เปลี่ยนซีลยางก๊อกน้ำและเทปพันเกลียว', usedParts: [{ id: 'p6', name: 'เทปพันเกลียว', quantity: 1, unit: 'ม้วน' }] },
           { id: 3, buildingId: 'B4', buildingName: 'อาคารสำนักงาน', roomNumber: 'ห้องธุรการ', description: 'แอร์ไม่เย็น', reporterName: 'ครูวิชัย (สายชั้นประถมศึกษาปีที่ 6)', status: 'Pending', priority: 'Medium', assignedTeamId: null, timestamp: Date.now() - 86400000 }
        ];
        setIncidents(seed);
    }

    if (savedTeams) {
        const loadedTeams = JSON.parse(savedTeams) as Team[];
        const loadedIds = new Set(loadedTeams.map(t => t.id));
        const newTeams = INITIAL_TEAMS.filter(t => !loadedIds.has(t.id));
        if (newTeams.length > 0) { setTeams([...loadedTeams, ...newTeams]); } else { setTeams(loadedTeams); }
    }
  }, []);

  useEffect(() => { localStorage.setItem('school_incidents', JSON.stringify(incidents)); }, [incidents]);
  useEffect(() => { localStorage.setItem('school_teams', JSON.stringify(teams)); }, [teams]);
  useEffect(() => { localStorage.setItem('school_registered_users', JSON.stringify(registeredUsers)); }, [registeredUsers]);

  const handleRegister = (user: RegisteredUser) => {
      // Check if username exists
      if (registeredUsers.some(u => u.username === user.username)) {
          addToast('error', 'ชื่อผู้ใช้นี้ถูกใช้งานแล้ว');
          return false;
      }
      setRegisteredUsers(prev => [...prev, user]);
      addToast('success', 'ลงทะเบียนสำเร็จ! โปรดรอการอนุมัติ');
      return true;
  };

  const handleApproveUser = async (username: string) => {
      const userToApprove = registeredUsers.find(u => u.username === username);
      if (userToApprove && userToApprove.email) {
          // Send notification email
          await sendApprovalEmail(userToApprove.email, userToApprove.name);
          addToast('success', `ส่งอีเมลแจ้งอนุมัติไปยัง ${userToApprove.email} แล้ว`);
      }
      setRegisteredUsers(prev => prev.map(u => u.username === username ? { ...u, status: 'approved' } : u));
  };

  const handleRejectUser = (username: string) => {
      setRegisteredUsers(prev => prev.map(u => u.username === username ? { ...u, status: 'rejected' } : u));
      // Or filter out: setRegisteredUsers(prev => prev.filter(u => u.username !== username));
  };

  const handleLogin = (username: string, password?: string, role?: UserRole, teamId?: number) => {
      // 1. Admin Login
      if (role === 'admin') {
          if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
             const user: User = { username, name: 'ผู้ดูแลระบบ', role: 'admin' };
             setCurrentUser(user);
             sessionStorage.setItem('school_user', JSON.stringify(user));
             addToast('success', 'เข้าสู่ระบบผู้ดูแลเรียบร้อยแล้ว');
             return true;
          }
          return false;
      }
      
      // 2. Technician Login
      if (role === 'technician') {
          // Logic handled in LoginScreen for tech matching, or could be moved here
          const user: User = { username, name: password || 'Unknown', role: 'technician', teamId }; // Password param used as name hack or verify before calling
          setCurrentUser(user);
          sessionStorage.setItem('school_user', JSON.stringify(user));
          addToast('success', `ยินดีต้อนรับ ${user.name}`);
          return true;
      }

      // 3. Teacher Login (Check Registered Users)
      const foundUser = registeredUsers.find(u => u.username === username && u.password === password && u.role === 'teacher');
      
      if (foundUser) {
          if (foundUser.status === 'pending') {
              addToast('info', 'บัญชีของคุณอยู่ระหว่างรอการอนุมัติ');
              return false;
          }
          if (foundUser.status === 'rejected') {
              addToast('error', 'บัญชีของคุณไม่ได้รับการอนุมัติ');
              return false;
          }
          
          const user: User = { 
              username: foundUser.username, 
              name: foundUser.name, 
              role: 'teacher', 
              gradeLevel: foundUser.gradeLevel,
              email: foundUser.email
          };
          setCurrentUser(user);
          sessionStorage.setItem('school_user', JSON.stringify(user));
          addToast('success', `ยินดีต้อนรับ ${user.name}`);
          return true;
      }

      return false;
  };

  // GUEST LOGIN LOGIC
  const handleGuestLogin = (guestName: string) => {
      const user: User = {
          username: `guest_${Date.now()}`,
          name: `${guestName} (Guest)`,
          role: 'teacher',
          gradeLevel: 'แจ้งซ่อมด่วน (Urgent)',
          status: 'approved'
      };
      setCurrentUser(user);
      sessionStorage.setItem('school_user', JSON.stringify(user));
      addToast('success', `เข้าสู่ระบบแบบเร่งด่วนสำเร็จ`);
  };

  const handleLogout = () => { 
      setCurrentUser(null); 
      sessionStorage.removeItem('school_user'); 
      setSelectedBuildingId(null);
      setInspectingTeamId(null);
      addToast('info', 'ออกจากระบบแล้ว');
  };

  const handleNewReport = (data: any) => {
      const building = BUILDINGS.find(b => b.id === data.buildingId);
      const newId = incidents.length > 0 ? Math.max(...incidents.map(i => i.id)) + 1 : 1;
      const newIncident: Incident = {
          id: newId, buildingId: data.buildingId, buildingName: building?.name || 'Unknown', roomNumber: data.roomNumber, description: data.description, reporterName: data.reporterName, priority: data.priority as Priority, status: 'Pending', assignedTeamId: null, timestamp: Date.now(),
          imageUrl: data.imageUrl
      };
      setIncidents(prev => [newIncident, ...prev]);
      addToast('success', 'ส่งเรื่องแจ้งซ่อมเรียบร้อยแล้ว');
  };

  const openAssignModal = (id: number) => { setTargetIncidentId(id); setAssignModalOpen(true); };

  const handleAssignTeam = (teamId: number, incidentId: number) => {
      const updatedTeams = teams.map(t => t.id === teamId ? { ...t, status: 'Busy', currentIncidentId: incidentId } as Team : t);
      const updatedIncidents = incidents.map(i => i.id === incidentId ? { ...i, status: 'In Progress', assignedTeamId: teamId } as Incident : i);
      setTeams(updatedTeams); setIncidents(updatedIncidents); setAssignModalOpen(false);
      addToast('success', 'มอบหมายงานให้ทีมช่างเรียบร้อย');
  };

  const handleCompleteJob = (incidentId: number, note?: string, usedParts?: UsedPart[]) => {
      const incident = incidents.find(i => i.id === incidentId);
      if (!incident) return;
      const teamId = incident.assignedTeamId;
      const updatedTeams = teams.map(t => t.id === teamId ? { ...t, status: 'Available', currentIncidentId: null } as Team : t);
      const updatedIncidents = incidents.map(i => i.id === incidentId ? { ...i, status: 'Done', completedAt: Date.now(), completionNote: note, usedParts: usedParts, isRushed: false } as Incident : i);
      setTeams(updatedTeams); setIncidents(updatedIncidents); setAssignModalOpen(false);
  };

  // ADMIN SUPERPOWERS
  const handleDeleteIncident = (id: number) => {
    const incident = incidents.find(i => i.id === id);
    if (incident && incident.assignedTeamId) {
        // Free up the team if they were working on this
        setTeams(prev => prev.map(t => t.id === incident.assignedTeamId ? { ...t, status: 'Available', currentIncidentId: null } as Team : t));
    }
    setIncidents(prev => prev.filter(i => i.id !== id));
    addToast('info', 'ลบรายการแจ้งซ่อมแล้ว');
  };

  const handleResetSystem = () => {
    setIncidents([]);
    setTeams(INITIAL_TEAMS);
    setRegisteredUsers([]); 
    localStorage.removeItem('school_incidents');
    localStorage.removeItem('school_teams');
    localStorage.removeItem('school_registered_users');
    setInspectingTeamId(null);
  };

  const handleInspectTeam = (teamId: number) => {
      setInspectingTeamId(teamId);
      addToast('info', 'เข้าสู่โหมดตรวจสอบการทำงาน');
  };
  
  const handleRushJob = (incidentId: number) => {
      setIncidents(prev => prev.map(i => i.id === incidentId ? { ...i, isRushed: true } : i));
  };

  // EXPORT / IMPORT DATA
  const handleExportData = () => {
    const data = {
      timestamp: Date.now(),
      incidents,
      teams,
      registeredUsers
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `school_ops_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast('success', 'ดาวน์โหลดไฟล์สำรองข้อมูลสำเร็จ');
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        if (data.incidents && Array.isArray(data.incidents)) {
          setIncidents(data.incidents);
        }
        if (data.teams && Array.isArray(data.teams)) {
          // Merge with existing team structure to ensure all teams exist
          const loadedTeams = data.teams as Team[];
          setTeams(loadedTeams);
        }
        if (data.registeredUsers && Array.isArray(data.registeredUsers)) {
           setRegisteredUsers(data.registeredUsers);
        }
        addToast('success', 'นำเข้าข้อมูลสำเร็จ');
      } catch (err) {
        addToast('error', 'ไฟล์ข้อมูลไม่ถูกต้อง');
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  let notificationCount = 0;
  if (currentUser?.role === 'admin') { 
      const pendingIncidents = incidents.filter(i => i.status === 'Pending').length;
      const pendingUsers = registeredUsers.filter(u => u.status === 'pending').length;
      notificationCount = pendingIncidents + pendingUsers;
  }
  else if (currentUser?.role === 'technician' && currentUser.teamId) { notificationCount = incidents.filter(i => i.assignedTeamId === currentUser.teamId && i.status === 'In Progress').length; }

  const displayIncidents = selectedBuildingId ? incidents.filter(i => i.buildingId === selectedBuildingId) : incidents;

  if (!currentUser) return (
      <>
        <ToastContainer toasts={toasts} removeToast={removeToast} />
        <LoginScreen onLogin={handleLogin} onRegister={handleRegister} onGuestLogin={handleGuestLogin} />
      </>
  );

  // Special View for Admin Inspection
  if (currentUser.role === 'admin' && inspectingTeamId) {
      const inspectedTeam = teams.find(t => t.id === inspectingTeamId);
      const mockUser: User = { 
          username: 'mock_tech', 
          name: inspectedTeam?.name || 'Unknown Technician', 
          role: 'admin', 
          teamId: inspectingTeamId 
      };

      return (
          <div className="min-h-screen flex flex-col font-sans pb-6">
              <ToastContainer toasts={toasts} removeToast={removeToast} />
              <header className="bg-purple-900 text-white p-3 flex items-center justify-between shadow-lg sticky top-0 z-50">
                  <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setInspectingTeamId(null)}
                        className="bg-purple-800 hover:bg-purple-700 p-2 rounded-full transition-colors"
                      >
                          <ArrowLeft size={20} />
                      </button>
                      <div>
                          <div className="text-[10px] text-purple-300 uppercase tracking-widest font-bold">Admin Inspection Mode</div>
                          <div className="font-bold text-sm">กำลังตรวจสอบ: {inspectedTeam?.name}</div>
                      </div>
                  </div>
                  <button 
                    onClick={() => setInspectingTeamId(null)}
                    className="bg-white/10 hover:bg-white/20 text-xs px-3 py-1.5 rounded border border-white/20"
                  >
                      Exit Inspection
                  </button>
              </header>
              <div className="flex-1 container mx-auto p-4 lg:p-6">
                 <TechnicianView 
                    user={mockUser} 
                    teams={teams} 
                    incidents={incidents} 
                    onCompleteJob={handleCompleteJob}
                    onRushJob={handleRushJob}
                    addToast={addToast}
                 />
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-cyan-500/30 selection:text-white pb-6 print:bg-white print:h-auto print:overflow-visible relative overflow-hidden">
      
      {/* Living Background Animation (Subtle floating orbs) */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden print:hidden">
          <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px] animate-float"></div>
          <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-purple-500/5 rounded-full blur-[80px] animate-float-delayed"></div>
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <div className="print:hidden">
        <Header user={currentUser} onLogout={handleLogout} notificationCount={notificationCount} />
      </div>
      
      <main className="flex-1 container mx-auto p-4 lg:p-6 mt-14 print:mt-0 print:p-0 print:max-w-none">
        
        {currentUser.role === 'teacher' && (
            <div className="py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <ReportView currentUser={currentUser} onSubmit={handleNewReport} incidents={incidents} />
            </div>
        )}

        {currentUser.role === 'technician' && (
            <div className="py-8 animate-in fade-in duration-500">
                <TechnicianView 
                    user={currentUser} 
                    teams={teams} 
                    incidents={incidents} 
                    onCompleteJob={handleCompleteJob} 
                    addToast={addToast}
                />
            </div>
        )}

        {currentUser.role === 'admin' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-full animate-in fade-in duration-500 print:block">
                <div className="lg:col-span-3 print:hidden">
                    <BuildingGrid incidents={incidents} selectedBuildingId={selectedBuildingId} onSelectBuilding={setSelectedBuildingId} />
                </div>
                <div className="lg:col-span-6 h-[600px] lg:h-[calc(100vh-140px)] print:h-auto print:w-full">
                    <IncidentList 
                        incidents={displayIncidents} 
                        onAssignClick={openAssignModal} 
                        onCompleteClick={(id) => handleCompleteJob(id, "Admin Override")}
                        onDeleteClick={handleDeleteIncident}
                        isAdmin={true}
                    />
                </div>
                <div className="lg:col-span-3 h-auto lg:h-[calc(100vh-140px)] print:hidden">
                    <ControlPanel 
                        teams={teams} 
                        incidents={incidents} 
                        isAdmin={true}
                        registeredUsers={registeredUsers}
                        onResetSystem={handleResetSystem}
                        onInspectTeam={handleInspectTeam}
                        onExportData={handleExportData}
                        onImportData={handleImportData}
                        onApproveUser={handleApproveUser}
                        onRejectUser={handleRejectUser}
                        addToast={addToast}
                    />
                </div>
            </div>
        )}
      </main>
      
      {/* Footer / Credits - Darkened text for better visibility on light background */}
      {currentUser.role !== 'admin' && (
        <footer className="text-center py-2 space-y-1 opacity-90 print:hidden">
            <div className="text-[10px] text-slate-700 font-bold tracking-wider">นายกานต์ โสมสัย ผู้พัฒนาระบบ</div>
            <div className="text-[9px] text-slate-500">โรงเรียนชุมชนมาบอำมฤต สังกัดสำนักงานเขตพื้นที่การศึกษาประถมศึกษาชุมพร เขต 1</div>
        </footer>
      )}

      {currentUser.role === 'admin' && (
          <AssignTeamModal isOpen={assignModalOpen} incident={incidents.find(i => i.id === targetIncidentId) || null} teams={teams} onClose={() => setAssignModalOpen(false)} onAssign={handleAssignTeam} />
      )}
    </div>
  );
};

export default App;
