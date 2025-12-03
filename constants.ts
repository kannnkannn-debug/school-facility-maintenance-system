
import { Building, Team } from './types';

export const BUILDINGS: Building[] = [
  { id: "B1", name: "อาคารเรียน ป.1-2" },
  { id: "B2", name: "อาคารเรียน ป.4-5" },
  { id: "B3", name: "อาคารเรียน ป.3 และ 6" },
  { id: "B4", name: "อาคารสำนักงาน" },
  { id: "B5", name: "อาคารเก็บของ" },
  { id: "B6", name: "สนามกีฬาโรงเรียนและศาลาเฉลิมพระเกียรติ" },
  { id: "B7", name: "อาคารอนุบาลใหม่" },
  { id: "B8", name: "อาคารอนุบาล" },
  { id: "B9", name: "อาคารศิลปวัฒนธรรม" },
  { id: "B10", name: "ห้องสมุดโรงเรียน" },
  { id: "B11", name: "หอประชุม" },
  { id: "B12", name: "ห้องคอมพิวเตอร์" },
  { id: "B13", name: "โรงอาหาร 1" },
  { id: "B14", name: "โรงอาหาร 2" },
  { id: "B15", name: "ห้องพยาบาล" },
  { id: "B16", name: "แฟลตบ้านพักครู" },
  { id: "B17", name: "บ้านพักครู (ระบุบ้านเลขที่)" },
  { id: "B18", name: "ห้องน้ำอาคาร ป.4-5" },
  { id: "B19", name: "ห้องน้ำอาคาร ป.1-2" },
  { id: "B20", name: "ห้องน้ำอาคารสำนักงาน" },
  { id: "B21", name: "ห้องน้ำอาคารอักษราอำมฤต" }
];

export const INITIAL_TEAMS: Team[] = [
  { id: 1, name: "ทีมช่าง A (ไฟฟ้า)", status: "Available", currentIncidentId: null },
  { id: 2, name: "ทีมช่าง B (ประปา/ทั่วไป)", status: "Available", currentIncidentId: null },
  { id: 3, name: "ทีมช่าง C (โครงสร้าง)", status: "Available", currentIncidentId: null },
  { id: 4, name: "ทีมช่าง D (แอร์/เครื่องปรับอากาศ)", status: "Available", currentIncidentId: null }
];

// Available parts for technicians to select
export const AVAILABLE_PARTS = [
    { id: 'p1', name: 'หลอดไฟ LED ยาว', unit: 'หลอด' },
    { id: 'p2', name: 'หลอดไฟ LED กลม', unit: 'หลอด' },
    { id: 'p3', name: 'สตาร์ทเตอร์', unit: 'ตัว' },
    { id: 'p4', name: 'เทปพันสายไฟ', unit: 'ม้วน' },
    { id: 'p5', name: 'ก๊อกน้ำทองเหลือง', unit: 'ตัว' },
    { id: 'p6', name: 'เทปพันเกลียว', unit: 'ม้วน' },
    { id: 'p7', name: 'ท่อ PVC 1/2 นิ้ว', unit: 'เส้น' },
    { id: 'p8', name: 'ข้อต่อ PVC', unit: 'ตัว' },
    { id: 'p9', name: 'กลอนประตู', unit: 'ชุด' },
    { id: 'p10', name: 'มือจับหน้าต่าง', unit: 'อัน' },
    { id: 'p11', name: 'บานพับประตู', unit: 'ตัว' },
    { id: 'p12', name: 'น้ำมันกันสนิม', unit: 'กระป๋อง' },
    { id: 'p13', name: 'สายยาง', unit: 'เมตร' },
    { id: 'p14', name: 'น้ำยาแอร์ R32', unit: 'ถัง' },
    { id: 'p15', name: 'แคปการัน (Capacitor)', unit: 'ตัว' },
    { id: 'p16', name: 'ฟิลเตอร์แอร์', unit: 'แผ่น' }
];

// Teacher Grade Levels
export const TEACHER_GRADE_LEVELS = [
  "สายชั้นอนุบาล 2",
  "สายชั้นอนุบาล 3",
  "สายชั้นประถมศึกษาปีที่ 1",
  "สายชั้นประถมศึกษาปีที่ 2",
  "สายชั้นประถมศึกษาปีที่ 3",
  "สายชั้นประถมศึกษาปีที่ 4",
  "สายชั้นประถมศึกษาปีที่ 5",
  "สายชั้นประถมศึกษาปีที่ 6"
];

// Admin Credentials
export const ADMIN_CREDENTIALS = {
  username: 'admin_mab',
  password: 'mab_admin2024'
};

// Technician Accounts
export const TECHNICIAN_ACCOUNTS = [
  { username: 'tech_elec', password: 'mab_tech1', name: 'นายช่างสมชาย (ไฟฟ้า)', teamId: 1 },
  { username: 'tech_water', password: 'mab_tech2', name: 'นายช่างสมศักดิ์ (ประปา)', teamId: 2 },
  { username: 'tech_struct', password: 'mab_tech3', name: 'นายช่างสมปอง (โครงสร้าง)', teamId: 3 },
  { username: 'tech_air', password: 'mab_tech4', name: 'นายช่างอำพล (แอร์)', teamId: 4 },
];
