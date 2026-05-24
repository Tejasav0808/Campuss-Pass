import React from 'react';
import { motion } from 'framer-motion';

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export interface LightBeamButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  gradientColors?: [string, string, string];
}

/**
 * LightBeamButton
 * 
 * A high-performance button with a rotating light beam border effect.
 * Uses CSS @property for smooth gradient rotation animations on the border.
 */
export function LightBeamButton({ 
  children, 
  className, 
  onClick,
  gradientColors = ["#8b5cf6", "#06b6d4", "#8b5cf6"],
  ...props 
}: LightBeamButtonProps) {
  const gradientString = `conic-gradient(from var(--gradient-angle), transparent 0%, ${gradientColors[0]} 40%, ${gradientColors[1]} 50%, transparent 60%, transparent 100%)`;

  const Component = onClick ? motion.button : (motion.button as any);

  return (
    <>
      <style>{`
        @property --gradient-angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes border-spin {
          from { --gradient-angle: 0deg; }
          to { --gradient-angle: 360deg; }
        }
        .animate-border-spin {
          animation: border-spin 2s linear infinite;
        }
      `}</style>
      
      <Component
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={cn(
          "group/btn relative isolate overflow-hidden rounded-full bg-white/5 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-white/10",
          "shadow-[0_0_20px_-5px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_-5px_rgba(139,92,246,0.5)]",
          className
        )}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2">{children}</span>
        
        {/* Gradient Border Simulation */}
        <div 
          className="absolute inset-0 -z-10 rounded-full p-[1.5px] animate-border-spin" 
          style={{ 
            '--gradient-angle': '0deg',
            background: gradientString
          } as any} 
        />
        
        {/* Inner Background (keeps text readable) */}
        <div className="absolute inset-[1.5px] -z-10 rounded-full bg-[#1e293b]" />
        
        {/* Shine Effect Overlay */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.1)_0%,transparent_60%)] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
      </Component>
    </>
  );
}

export default LightBeamButton;
