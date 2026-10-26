import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const BloodBridgeLogo: React.FC<LogoProps> = ({ className = '', size = 36 }) => {
  return (
    <div 
      className={`relative flex items-center justify-center shrink-0 overflow-hidden rounded-full bg-white shadow-xs border border-red-100 ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src="/assets/aistudio/image_64b93ba8.png"
        alt="Lahoo Ka Qatra Logo"
        className="w-full h-full object-cover"
      />
    </div>
  );
};
