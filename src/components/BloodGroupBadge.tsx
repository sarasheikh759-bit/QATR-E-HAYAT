import React from 'react';
import { BloodGroup } from '../types';

interface BloodGroupBadgeProps {
  group: BloodGroup;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const BloodGroupBadge: React.FC<BloodGroupBadgeProps> = ({
  group,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 min-w-8 font-semibold',
    md: 'text-sm px-2.5 py-1 min-w-10 font-bold',
    lg: 'text-base px-3.5 py-1.5 min-w-12 font-extrabold',
  }[size];

  return (
    <span
      className={`inline-flex items-center justify-center rounded-lg bg-red-50 text-[#C62828] border border-red-200 tracking-wide shadow-2xs ${sizeClasses} ${className}`}
    >
      <span className="text-red-500 mr-0.5 text-xs font-normal">🩸</span>
      {group}
    </span>
  );
};
