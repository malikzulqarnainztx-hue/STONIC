import React from 'react';
import { Minus, Square, X } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface DesktopWindowProps {
  id: string;
  title: string;
  icon?: React.ReactNode;
  isOpen: boolean;
  isMinimized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  children: React.ReactNode;
  className?: string;
}

export const DesktopWindow: React.FC<DesktopWindowProps> = ({
  id,
  title,
  icon,
  isOpen,
  isMinimized,
  onClose,
  onMinimize,
  children,
  className = '',
}) => {
  if (!isOpen || isMinimized) return null;

  return (
    <div
      className={`hud-panel rounded-2xl flex flex-col border border-[var(--theme-border)] shadow-[0_12px_40px_rgba(0,0,0,0.6)] overflow-hidden transition-all duration-200 ${className}`}
    >
      {/* Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-black/50 border-b border-[var(--theme-border)] select-none">
        <div className="flex items-center gap-2">
          {icon && <span className="text-[var(--theme-primary)]">{icon}</span>}
          <span className="font-orbitron font-bold text-xs tracking-wider text-gray-100">
            {title}
          </span>
        </div>

        {/* Window Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              sound.playClick();
              onMinimize();
            }}
            title="Minimize"
            className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              sound.playClick();
            }}
            title="Maximize"
            className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Square className="w-3 h-3" />
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            title="Close"
            className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto p-4">{children}</div>
    </div>
  );
};
