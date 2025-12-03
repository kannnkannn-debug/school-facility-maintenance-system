
export const formatRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return 'เมื่อสักครู่';
  if (diff < hour) return `${Math.floor(diff / minute)} นาทีที่แล้ว`;
  if (diff < day) return `${Math.floor(diff / hour)} ชม. ที่แล้ว`;
  if (diff < 2 * day) return 'เมื่อวานนี้';
  if (diff < 7 * day) return `${Math.floor(diff / day)} วันที่แล้ว`;
  
  return new Date(timestamp).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
};

export const formatFullDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString('th-TH', { 
    dateStyle: 'short', 
    timeStyle: 'short' 
  });
};
