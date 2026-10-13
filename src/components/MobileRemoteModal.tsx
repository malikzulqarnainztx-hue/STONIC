import React, { useState } from 'react';
import { Smartphone, X, QrCode, Mic, VolumeX, ShieldAlert, Moon, Power, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface MobileRemoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRemoteCommand: (cmd: string) => void;
}

export const MobileRemoteModal: React.FC<MobileRemoteModalProps> = ({
  isOpen,
  onClose,
  onRemoteCommand,
}) => {
  const [phoneMicActive, setPhoneMicActive] = useState(false);
  const [remoteStatus, setRemoteStatus] = useState('SYNCED · LATENCY 12ms');

  if (!isOpen) return null;

  const handleCommand = (name: string) => {
    sound.playClick();
    setRemoteStatus(`EXECUTING "${name.toUpperCase()}" ON PC...`);
    onRemoteCommand(name);
    setTimeout(() => {
      setRemoteStatus('SYNCED · LATENCY 12ms');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-xl hud-panel rounded-3xl p-6 border border-[var(--theme-border)] shadow-[0_0_40px_var(--theme-glow-soft)] relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6 pb-3 border-b border-[var(--theme-border)]">
          <Smartphone className="w-6 h-6 text-[var(--theme-primary)]" />
          <div>
            <h2 className="font-orbitron font-bold text-base text-[var(--theme-primary)]">
              STONIC AI MOBILE REMOTE COMPANION
            </h2>
            <p className="text-xs text-gray-400 font-rajdhani">
              Turn your smartphone into a pocket JARVIS command station for your desktop PC.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Simulated Mobile Phone Frame */}
          <div className="w-64 mx-auto rounded-[36px] p-3 bg-neutral-900 border-4 border-neutral-700 shadow-2xl flex flex-col items-center">
            {/* Top Phone Notch / Dynamic Island */}
            <div className="w-20 h-4 bg-black rounded-full mb-3 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-emerald-500/80 mr-2" />
            </div>

            {/* Mobile Screen Display */}
            <div className="w-full h-80 rounded-[24px] bg-[#060b13] p-3 flex flex-col justify-between border border-[var(--theme-border)] relative overflow-hidden">
              <div className="text-center">
                <div className="text-[10px] font-code text-[var(--theme-primary)] font-bold tracking-wider">
                  STONIC MOBILE
                </div>
                <div className="text-[9px] font-code text-gray-400 mt-0.5">
                  {remoteStatus}
                </div>
              </div>

              {/* Big Center Push to Talk on Mobile */}
              <div className="flex flex-col items-center my-auto">
                <button
                  onClick={() => {
                    sound.playActivate();
                    setPhoneMicActive(!phoneMicActive);
                    if (!phoneMicActive) {
                      handleCommand('Voice directive from mobile phone');
                    }
                  }}
                  className={`w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer ${
                    phoneMicActive
                      ? 'bg-amber-500 text-black shadow-[0_0_20px_rgba(251,191,36,0.8)]'
                      : 'bg-[var(--theme-primary)]/20 border-2 border-[var(--theme-primary)] text-[var(--theme-primary)] hover:bg-[var(--theme-primary)]/30'
                  }`}
                >
                  <Mic className="w-7 h-7" />
                  <span className="text-[9px] font-code font-bold mt-1">
                    {phoneMicActive ? 'TALK' : 'HOLD'}
                  </span>
                </button>
                <span className="text-[9px] font-code text-gray-400 mt-2">
                  Voice Command Remote
                </span>
              </div>

              {/* Mobile Quick Action Buttons */}
              <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-white/10">
                <button
                  onClick={() => handleCommand('Protocol 0 Lockdown')}
                  className="p-1.5 rounded-lg bg-red-500/20 text-red-300 text-[9px] font-code flex items-center justify-center gap-1 hover:bg-red-500/30 cursor-pointer"
                >
                  <ShieldAlert className="w-3 h-3" />
                  <span>LOCK PC</span>
                </button>
                <button
                  onClick={() => handleCommand('System Diagnostics')}
                  className="p-1.5 rounded-lg bg-white/10 text-gray-200 text-[9px] font-code flex items-center justify-center gap-1 hover:bg-white/20 cursor-pointer"
                >
                  <CheckCircle2 className="w-3 h-3" />
                  <span>DIAGNOSE</span>
                </button>
              </div>
            </div>
          </div>

          {/* Connection Details & QR Code info */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-black/40 border border-[var(--theme-border)] space-y-2">
              <div className="flex items-center gap-2 text-xs font-code text-[var(--theme-primary)] font-bold">
                <QrCode className="w-4 h-4" />
                <span>INSTANT PAIRING LINK</span>
              </div>
              <p className="text-xs text-gray-300 font-rajdhani">
                Pair any iOS or Android phone over local Wi-Fi or WebRTC secure link with zero software install required.
              </p>
              <div className="text-[11px] font-code text-emerald-400 flex items-center gap-1.5 pt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>HOST PC: STONIC-DESKTOP (PORT 3000)</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-code opacity-70">DIRECT REMOTE MACROS:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleCommand('Mute Audio Subsystem')}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-code hover:border-[var(--theme-primary)] hover:bg-white/10 text-left transition-all cursor-pointer"
                >
                  🔇 Mute Audio
                </button>
                <button
                  onClick={() => handleCommand('Sleep Display')}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-code hover:border-[var(--theme-primary)] hover:bg-white/10 text-left transition-all cursor-pointer"
                >
                  🌙 Sleep Display
                </button>
                <button
                  onClick={() => handleCommand('Run Full Disk Clean')}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-code hover:border-[var(--theme-primary)] hover:bg-white/10 text-left transition-all cursor-pointer"
                >
                  🧹 Auto Cleanup
                </button>
                <button
                  onClick={() => handleCommand('Backup Neural Cache')}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-code hover:border-[var(--theme-primary)] hover:bg-white/10 text-left transition-all cursor-pointer"
                >
                  💾 Save Snapshot
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
