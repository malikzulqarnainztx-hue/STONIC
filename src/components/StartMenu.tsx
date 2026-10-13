import React from 'react';
import { Power, Moon, RotateCcw, Shield, Brain, Globe, Compass, Users, Layers, Activity, Folder, Info, Award } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApp: (appId: string) => void;
  onOpenStory: () => void;
  onLockdown: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({
  isOpen,
  onClose,
  onOpenApp,
  onOpenStory,
  onLockdown,
}) => {
  if (!isOpen) return null;

  const appItems = [
    { id: 'command', label: 'Stonic Voice Assistant (Female ♀)', icon: Compass, color: 'text-[var(--theme-primary)]', desc: 'Primary female voice companion & AI assistant' },
    { id: 'browser', label: 'Browser Automator', icon: Globe, color: 'text-sky-400', desc: 'AI agent with hands' },
    { id: 'world-events', label: 'World Event Monitor', icon: Globe, color: 'text-amber-400', desc: 'Real-time planetary radar' },
    { id: 'memory', label: 'Memory & Mind Vault', icon: Brain, color: 'text-pink-400', desc: 'Personalized emotional memory' },
    { id: 'agent-town', label: 'Agent Town RPG', icon: Users, color: 'text-purple-400', desc: 'Spatial multi-agent simulation' },
    { id: 'workflows', label: 'Autonomous Workflows', icon: Layers, color: 'text-emerald-400', desc: 'Downloads cleaner & scripts' },
    { id: 'telemetry', label: 'System Hardware HUD', icon: Activity, color: 'text-red-400', desc: 'CPU, RAM, GPU diagnostics' },
    { id: 'files', label: 'Desktop File Manager', icon: Folder, color: 'text-cyan-400', desc: 'Local file organizer' },
  ];

  return (
    <div className="fixed bottom-14 left-4 z-50 w-96 hud-panel rounded-2xl border-2 border-[var(--theme-border)] shadow-[0_0_50px_var(--theme-glow)] overflow-hidden select-none animate-in fade-in slide-in-from-bottom-4 duration-150">
      {/* Operator Profile Banner */}
      <div className="p-4 bg-black/60 border-b border-[var(--theme-border)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--theme-primary)]/20 border-2 border-[var(--theme-primary)] flex items-center justify-center font-orbitron font-bold text-white text-xs shadow-[0_0_12px_var(--theme-glow)]">
            OP
          </div>
          <div>
            <div className="text-xs font-bold font-orbitron text-white">OPERATOR</div>
            <div className="text-[10px] font-code text-[var(--theme-primary)]">STONIC AI OS · MARK VII</div>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onOpenStory();
            onClose();
          }}
          title="The Story Behind Stonic AI"
          className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-[var(--theme-primary)] text-gray-300 hover:text-white cursor-pointer"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      {/* Apps Grid */}
      <div className="p-3 max-h-80 overflow-y-auto space-y-1">
        <div className="text-[10px] font-code text-gray-400 px-2 py-1 font-semibold uppercase">
          PINNED STONIC APPLICATIONS
        </div>
        {appItems.map((app) => {
          const Icon = app.icon;
          return (
            <button
              key={app.id}
              onClick={() => {
                sound.playClick();
                onOpenApp(app.id);
                onClose();
              }}
              className="w-full p-2.5 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-3 text-left cursor-pointer group"
            >
              <div className={`p-2 rounded-lg bg-black/60 border border-white/10 ${app.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold font-rajdhani text-gray-100 group-hover:text-[var(--theme-primary)] truncate">
                  {app.label}
                </div>
                <div className="text-[10px] font-code text-gray-400 truncate">
                  {app.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Power Controls */}
      <div className="p-3 bg-black/80 border-t border-[var(--theme-border)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playAlert();
              onLockdown();
              onClose();
            }}
            className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-code font-bold hover:bg-red-500/30 flex items-center gap-1.5 cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>LOCKDOWN (PROTOCOL 0)</span>
          </button>
        </div>

        <div className="text-[10px] font-code opacity-60">
          WINDOWS 10/11 CORE
        </div>
      </div>
    </div>
  );
};
