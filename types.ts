
export type IncidentStatus = 'Pending' | 'In Progress' | 'Done';

export type TeamStatus = 'Available' | 'Busy';

export type UserRole = 'teacher' | 'admin' | 'technician';

export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';

export type UserStatus = 'pending' | 'approved' | 'rejected';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface UsedPart {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface User {
  username: string;
  name: string;
  role: UserRole;
  teamId?: number; // For technicians
  gradeLevel?: string; // For teachers
  email?: string;
  phoneNumber?: string;
  status?: UserStatus;
}

export interface RegisteredUser extends User {
  password?: string;
  createdAt: number;
}

export interface Building {
  id: string;
  name: string;
}

export interface Incident {
  id: number;
  buildingId: string;
  buildingName: string;
  roomNumber: string;
  description: string;
  reporterName: string;
  status: IncidentStatus;
  priority: Priority;
  assignedTeamId: number | null;
  timestamp: number; // Date.now()
  completedAt?: number;
  completionNote?: string;
  usedParts?: UsedPart[]; // New field for material tracking
  isRushed?: boolean; // Admin rushed this job
  imageUrl?: string; // Attached image (Base64)
}

export interface Team {
  id: number;
  name: string;
  status: TeamStatus;
  currentIncidentId: number | null;
}