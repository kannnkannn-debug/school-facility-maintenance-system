import React from 'react';
import { School } from 'lucide-react';

interface SchoolLogoProps {
  className?: string;
}

const SchoolLogo: React.FC<SchoolLogoProps> = ({ className = "w-full h-full" }) => {
  return (
    <School 
      className={`${className} text-cyan-400`} 
      strokeWidth={1.5} 
    />
  );
};

export default SchoolLogo;