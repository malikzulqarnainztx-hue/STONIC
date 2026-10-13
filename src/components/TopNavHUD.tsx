import React, { useState, useEffect } from 'react';
import { ThemeId } from '../types';
import { Volume2, VolumeX, Smartphone, Info, Shield, Radio, Sparkles, Maximize2 } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface TopNavHUDProps {
  currentTheme: ThemeId;
  onChangeTheme: (theme: ThemeId) => void;
  onOpenMobileRemote: () => void;
  onOpenStory: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const TopNavHUD: React.FC<TopNavHUDProps> = ({
  currentTheme,
  onChangeTheme,
  onOpenMobileRemote,
  onOpenStory,
  soundEnabled,
  onToggleSound,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const themes: Array<{ id: ThemeId; label: string; color: string }> = [
    { id: 'arc-cyan', label: 'ARC CYAN', color: '#00f2ff' },
    { id: 'cyber-amber', label: 'SOLAR AMBER', color: '#ffb703' },
    { id: 'crimson-matrix', label: 'CRIMSON RED', color: '#ff2a5f' },
    { id: 'stealth-emerald', label: 'TACTICAL EMERALD', color: '#00ff88' },
  ];

  const toggleFullscreen = () => {
    sound.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <header className="w-full hud-panel rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
      {/* Brand & Status */}
      <div className="flex items-center gap-4">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-black/60 border border-[var(--theme-border)] shadow-[0_0_15px_var(--theme-glow)]">
          <div className="w-3.5 h-3.5 rounded-full bg-[var(--theme-primary)] animate-pulse" />
          <div className="absolute inset-0 rounded-xl border border-[var(--theme-primary)]/40 animate-ping opacity-25" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-orbitron font-extrabold text-base tracking-wider text-white flex items-center gap-2">
              <span>STONIC</span>
              <span className="text-[var(--theme-primary)]">AI</span>
            </h1>
            <span className="text-[10px] font-code px-1.5 py-0.5 rounded bg-[var(--theme-primary)]/20 text-[var(--theme-primary)] border border-[var(--theme-border)] font-semibold">
              OS v3.4
            </span>
          </div>
          <div className="text-[11px] font-code opacity-70 flex items-center gap-2">
            <span>JARVIS SCI-FI DESKTOP INTELLIGENCE</span>
            <span>·</span>
            <span className="text-emerald-400">STATUS: NOMINAL</span>
          </div>
        </div>
      </div>

      {/* Center Clock & Telemetry */}
      <div className="hidden lg:flex items-center gap-6 font-code text-xs px-4 py-1.5 rounded-xl bg-black/40 border border-white/5">
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-[var(--theme-primary)] animate-pulse" />
          <span className="opacity-70">SYSTEM TIME:</span>
          <span className="font-bold text-[var(--theme-primary)] tracking-widest">{timeStr}</span>
        </div>
        <div className="h-4 w-[1px] bg-white/10" />
        <div className="opacity-80">
          CORE: <span className="text-white font-bold">ONLINE</span>
        </div>
      </div>

      {/* Right Controls: Themes, Audio, Remote, Story */}
      <div className="flex items-center flex-wrap gap-2.5">
        {/* Theme Segmented Switcher */}
        <div className="flex items-center gap-1 p-1 bg-black/50 rounded-xl border border-[var(--theme-border)]">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                sound.playClick();
                onChangeTheme(t.id);
              }}
              title={`Switch to ${t.label} theme`}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-code transition-all cursor-pointer flex items-center gap-1.5 ${
                currentTheme === t.id
                  ? 'bg-white/15 text-white font-bold shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: t.color }}
              />
              <span className="hidden sm:inline">{t.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Audio FX Toggle */}
        <button
          onClick={() => {
            sound.enabled = !soundEnabled;
            onToggleSound();
          }}
          title={soundEnabled ? 'Mute HUD Audio FX' : 'Enable HUD Audio FX'}
          className={`p-2 rounded-xl border transition-all cursor-pointer ${
            soundEnabled
              ? 'bg-white/10 border-[var(--theme-border)] text-[var(--theme-primary)]'
              : 'bg-white/5 border-white/10 text-gray-400'
          }`}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Mobile Remote Trigger */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenMobileRemote();
          }}
          className="px-3 py-2 rounded-xl bg-white/5 border border-[var(--theme-border)] text-xs font-code flex items-center gap-1.5 text-gray-200 hover:border-[var(--theme-primary)] hover:bg-[var(--theme-primary)]/10 transition-all cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5 text-[var(--theme-primary)]" />
          <span className="hidden sm:inline">MOBILE REMOTE</span>
        </button>

        {/* The Journey Behind Stonic AI Modal Trigger */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenStory();
          }}
          className="px-3 py-2 rounded-xl bg-[var(--theme-primary)]/15 border border-[var(--theme-primary)] text-xs font-code font-bold flex items-center gap-1.5 text-[var(--theme-primary)] hover:bg-[var(--theme-primary)]/25 transition-all cursor-pointer shadow-[0_0_10px_var(--theme-glow-soft)]"
        >
          <Info className="w-3.5 h-3.5" />
          <span>INVENTOR USMAN'S STORY</span>
        </button>

        {/* Fullscreen */}
        <button
          onClick={toggleFullscreen}
          title="Toggle Fullscreen"
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
