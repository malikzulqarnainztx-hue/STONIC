import React from 'react';
import {
  Compass,
  Globe,
  Brain,
  Users,
  Layers,
  Activity,
  Folder,
  Award,
  Video,
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface DesktopIconsProps {
  onOpenApp: (appId: string) => void;
  onOpenStory: () => void;
}

export const DesktopIcons: React.FC<DesktopIconsProps> = ({ onOpenApp, onOpenStory }) => {
  const icons = [
    { id: 'command', label: 'Jarvis Core', icon: Compass, color: 'text-[var(--theme-primary)]' },
    { id: 'browser', label: 'Browser Automator', icon: Globe, color: 'text-sky-400' },
    { id: 'world-events', label: 'World Events', icon: Globe, color: 'text-amber-400' },
    { id: 'memory', label: 'Mind Vault', icon: Brain, color: 'text-pink-400' },
    { id: 'agent-town', label: 'Agent Town RPG', icon: Users, color: 'text-purple-400' },
    { id: 'workflows', label: 'Workflows', icon: Layers, color: 'text-emerald-400' },
    { id: 'telemetry', label: 'System HUD', icon: Activity, color: 'text-red-400' },
    { id: 'files', label: 'Files & Storage', icon: Folder, color: 'text-cyan-400' },
  ];

  return (
    <div className="flex flex-col gap-3 p-2 select-none z-10 w-24">
      {icons.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => {
              sound.playClick();
              onOpenApp(item.id);
            }}
            className="flex flex-col items-center p-2 rounded-xl hover:bg-white/10 border border-transparent hover:border-[var(--theme-border)] transition-all cursor-pointer group text-center"
          >
            <div className={`p-2.5 rounded-xl bg-black/60 border border-white/10 shadow-lg group-hover:scale-110 transition-transform ${item.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-rajdhani font-semibold text-gray-200 mt-1.5 leading-tight group-hover:text-[var(--theme-primary)] drop-shadow">
              {item.label}
            </span>
          </button>
        );
      })}

      {/* Story Video Shortcut */}
      <button
        onClick={() => {
          sound.playClick();
          onOpenStory();
        }}
        className="flex flex-col items-center p-2 rounded-xl hover:bg-white/10 border border-transparent hover:border-[var(--theme-border)] transition-all cursor-pointer group text-center mt-2 pt-2 border-t border-white/10"
      >
        <div className="p-2.5 rounded-xl bg-red-600/20 border border-red-500/40 text-red-400 shadow-lg group-hover:scale-110 transition-transform">
          <Video className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-rajdhani font-bold text-gray-200 mt-1 leading-tight group-hover:text-red-400 drop-shadow">
          Usman's Story
        </span>
      </button>
    </div>
  );
};
