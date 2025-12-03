import React, { useState, useRef } from 'react';
import { playClickSound } from '../utils/sound';

interface HoldButtonProps {
  onAction: () => void;
  children: React.ReactNode;
  className?: string;
  progressClassName?: string;
  duration?: number; // ms, default 1000
  disabled?: boolean;
}

const HoldButton: React.FC<HoldButtonProps> = ({ 
  onAction, 
  children, 
  className = '', 
  progressClassName = 'bg-white/20', 
  duration = 1000, 
  disabled = false 
}) => {
  const [isHolding, setIsHolding] = useState(false);
  const timeoutRef = useRef<any>(null);

  const startHold = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;
    // Prevent default context menu on long press on mobile
    // e.preventDefault(); 
    setIsHolding(true);
    playClickSound(); // Start sound

    timeoutRef.current = setTimeout(() => {
      triggerAction();
    }, duration);
  };

  const endHold = () => {
    if (!isHolding) return;
    setIsHolding(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const triggerAction = () => {
    setIsHolding(false);
    playClickSound(); // Success sound (could be different)
    onAction();
  };

  return (
    <button
      onMouseDown={startHold}
      onMouseUp={endHold}
      onMouseLeave={endHold}
      onTouchStart={startHold}
      onTouchEnd={endHold}
      disabled={disabled}
      className={`relative overflow-hidden group select-none ${className} ${isHolding ? 'holding' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {/* Background Fill Animation */}
      <div 
        className={`absolute inset-0 origin-left scale-x-0 transition-none ${progressClassName}`}
        style={{ 
            animation: isHolding ? `progressFill ${duration}ms linear forwards` : 'none'
        }}
      ></div>
      
      {/* Content */}
      <div className="relative z-10 pointer-events-none">
        {children}
      </div>
    </button>
  );
};

export default HoldButton;