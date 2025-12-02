import { ReactNode } from 'react';

interface GradientCardProps {
  children: ReactNode;
  className?: string;
  gradient?: string;
}

export default function GradientCard({ children, className = '', gradient = 'from-cyan-500 to-purple-500' }: GradientCardProps) {
  return (
    <div className={`relative group ${className}`}>
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-lg blur opacity-20 group-hover:opacity-40 transition-opacity`}></div>
      <div className="relative">
        {children}
      </div>
    </div>
  );
}
