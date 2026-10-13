import React, { useState, useEffect } from 'react';
import { ThemeId } from '../types';
import {
  Compass,
  Globe,
  Brain,
  Users,
  Layers,
  Activity,
  Folder,
  Volume2,
  VolumeX,
  Smartphone,
  Mic,
  MicOff,
  Cpu,
  Shield,
  Sparkles,
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface StonicTaskbarProps {
  activeAppId: string;
  onSelectApp: (appId: string) => void;
  isStartOpen: boolean;
  onToggleStart: () => void;
  isListening: boolean;
  onToggleMic: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  currentTheme: ThemeId;
  onChangeTheme: (theme: ThemeId) => void;
  onOpenMobileRemote: () => void;
  cpuUsage: number;
  ramUsage: number;
}

export const StonicTaskbar: React.FC<StonicTaskbarProps> = ({
  activeAppId,
  onSelectApp,
  isStartOpen,
  onToggleStart,
  isListening,
  onToggleMic,
  soundEnabled,
  onToggleSound,
  currentTheme,
  onChangeTheme,
  onOpenMobileRemote,
  cpuUsage,
  ramUsage,
}) => {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const pinnedApps = [
    { id: 'command', label: 'Jarvis Voice', icon: Compass },
    { id: 'browser', label: 'Browser Automator', icon: Globe },
    { id: 'world-events', label: 'World Events', icon: Globe },
    { id: 'memory', label: 'Mind Vault', icon: Brain },
    { id: 'agent-town', label: 'Agent Town', icon: Users },
    { id: 'workflows', label: 'Workflows', icon: Layers },
    { id: 'telemetry', label: 'Telemetry', icon: Activity },
    { id: 'files', label: 'Files', icon: Folder },
  ];

  const themes: Array<{ id: ThemeId; label: string; color: string }> = [
    { id: 'arc-cyan', label: 'Cyan', color: '#00f2ff' },
    { id: 'cyber-amber', label: 'Amber', color: '#ffb703' },
    { id: 'crimson-matrix', label: 'Crimson', color: '#ff2a5f' },
    { id: 'stealth-emerald', label: 'Emerald', color: '#00ff88' },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-12 bg-black/85 backdrop-blur-xl border-t border-[var(--theme-border)] z-40 flex items-center justify-between px-3 select-none">
      {/* Left: Start Button & Active Taskbar Apps */}
      <div className="flex items-center gap-2">
        {/* Start Button */}
        <button
          onClick={() => {
            sound.playClick();
            onToggleStart();
          }}
          className={`h-9 px-3 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
            isStartOpen
              ? 'bg-[var(--theme-primary)] text-black shadow-[0_0_15px_var(--theme-glow)]'
              : 'bg-white/5 border border-[var(--theme-border)] text-gray-200 hover:bg-white/10 hover:border-[var(--theme-primary)]'
          }`}
        >
          <div className="w-3.5 h-3.5 rounded-full border border-current flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
          </div>
          <span className="font-orbitron font-extrabold text-xs tracking-wider">STONIC</span>
        </button>

        {/* Vertical divider */}
        <div className="h-5 w-[1px] bg-white/10 mx-1 hidden sm:block" />

        {/* Pinned / Active App Icons */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-[50vw]">
          {pinnedApps.map((app) => {
            const Icon = app.icon;
            const isActive = activeAppId === app.id;

            return (
              <button
                key={app.id}
                onClick={() => {
                  sound.playClick();
                  onSelectApp(app.id);
                }}
                title={app.label}
                className={`h-9 px-2.5 rounded-xl flex items-center gap-1.5 text-xs font-rajdhani font-semibold transition-all cursor-pointer relative ${
                  isActive
                    ? 'bg-white/15 text-white border border-[var(--theme-border)] shadow-[0_0_10px_var(--theme-glow-soft)]'
                    : 'text-gray-400 hover:text-gray-100 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[var(--theme-primary)]' : ''}`} />
                <span className="hidden md:inline">{app.label}</span>
                {isActive && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-3 h-0.5 rounded-full bg-[var(--theme-primary)] shadow-[0_0_6px_var(--theme-glow)]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: System Tray (Voice, Theme, Volume, Telemetry, Clock) */}
      <div className="flex items-center gap-2 sm:gap-3 text-xs font-code">
        {/* Voice Listening Quick Toggle */}
        <button
          onClick={() => {
            sound.playActivate();
            onToggleMic();
          }}
          title={isListening ? 'Voice listening active' : 'Turn on voice'}
          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
            isListening
              ? 'bg-amber-500 text-black border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.6)] animate-pulse'
              : 'bg-white/5 border-white/10 text-[var(--theme-primary)] hover:bg-white/10'
          }`}
        >
          {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
        </button>

        {/* Theme Dots */}
        <div className="hidden sm:flex items-center gap-1 p-1 bg-black/60 rounded-lg border border-white/10">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                sound.playClick();
                onChangeTheme(t.id);
              }}
              title={`Switch theme: ${t.label}`}
              className={`w-3 h-3 rounded-full cursor-pointer transition-transform ${
                currentTheme === t.id ? 'scale-125 ring-2 ring-white/50' : 'opacity-60 hover:opacity-100'
              }`}
              style={{ backgroundColor: t.color }}
            />
          ))}
        </div>

        {/* Sound FX Toggle */}
        <button
          onClick={() => {
            sound.enabled = !soundEnabled;
            onToggleSound();
          }}
          title={soundEnabled ? 'Mute HUD Audio' : 'Enable HUD Audio'}
          className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white cursor-pointer"
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[var(--theme-primary)]" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>

        {/* Mobile Remote Trigger */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenMobileRemote();
          }}
          title="Mobile Remote Companion"
          className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5" />
        </button>

        {/* Mini CPU/RAM Status */}
        <div className="hidden lg:flex items-center gap-2 px-2 py-1 rounded-lg bg-black/60 border border-white/10 text-[10px]">
          <span>CPU: <strong className="text-[var(--theme-primary)]">{cpuUsage}%</strong></span>
          <span>RAM: <strong className="text-gray-300">{ramUsage}%</strong></span>
        </div>

        {/* Clock */}
        <div className="px-2 py-1 rounded-lg bg-black/60 border border-white/10 font-bold tracking-wider text-[var(--theme-primary)] text-[11px]">
          {timeStr}
        </div>
      </div>
    </footer>
  );
};
