import React, { useEffect, useState } from 'react';
import { Mic, MicOff, Volume2, Activity, Cpu, Radio, Sparkles } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface ArcCoreVisualizerProps {
  state: 'idle' | 'listening' | 'processing' | 'speaking';
  onToggleMic: () => void;
  isListening: boolean;
  systemVoiceName?: string;
  latestTranscript?: string;
}

export const ArcCoreVisualizer: React.FC<ArcCoreVisualizerProps> = ({
  state,
  onToggleMic,
  isListening,
  systemVoiceName = 'Kore (Jarvis Mark VII)',
  latestTranscript,
}) => {
  const [frequencies, setFrequencies] = useState<number[]>([
    20, 35, 55, 78, 92, 85, 64, 45, 60, 75, 90, 80, 60, 45, 30, 20,
    30, 50, 70, 85, 95, 80, 65, 45, 55, 70, 85, 75, 50, 35, 25, 15,
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrequencies((prev) =>
        prev.map((val, idx) => {
          if (state === 'speaking' || state === 'listening') {
            return Math.floor(30 + Math.random() * 70);
          } else if (state === 'processing') {
            return Math.floor(40 + Math.sin(Date.now() / 120 + idx) * 35);
          } else {
            return Math.floor(10 + Math.random() * 25);
          }
        })
      );
    }, 90);

    return () => clearInterval(interval);
  }, [state]);

  const stateLabels = {
    idle: 'STONIC CORE · STANDBY',
    listening: 'VOICE RECOGNITION ACTIVE · LISTENING',
    processing: 'NEURAL COGNITION · PROCESSING',
    speaking: 'JARVIS AUDIO SYNTHESIS · TRANSMITTING',
  };

  const stateColors = {
    idle: 'var(--theme-primary)',
    listening: '#fbbf24',
    processing: '#c084fc',
    speaking: '#34d399',
  };

  const degreeMarkers = [
    { deg: 0, label: '0° N' },
    { deg: 45, label: '45° NE' },
    { deg: 90, label: '90° E' },
    { deg: 135, label: '135° SE' },
    { deg: 180, label: '180° S' },
    { deg: 225, label: '225° SW' },
    { deg: 270, label: '270° W' },
    { deg: 315, label: '315° NW' },
  ];

  return (
    <div className="relative flex flex-col items-center justify-center p-6 rounded-3xl hud-panel hud-corner-box overflow-hidden select-none">
      {/* Background radial holographic bloom */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(circle at 50% 50%, var(--theme-glow) 0%, transparent 75%)`,
        }}
      />

      {/* Top Telemetry Header */}
      <div className="w-full flex items-center justify-between text-xs tracking-wider font-code mb-2 px-1 opacity-80">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--theme-primary)] animate-ping" />
          <span className="font-bold">ARC REACTOR · MARK VII</span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span>COHERENCE: 99.8%</span>
          <span>·</span>
          <span>4.82 GHz</span>
        </div>
      </div>

      {/* Holographic Arc Core Rings */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center my-3">
        {/* Outermost Ring with Degree Compass Indicators */}
        <div
          className="absolute inset-0 rounded-full border border-[var(--theme-border)] border-dashed animate-spin-slow opacity-60"
          style={{ borderWidth: '1.5px' }}
        />

        {/* Degree Markers */}
        {degreeMarkers.map((m) => (
          <div
            key={m.deg}
            className="absolute text-[8px] font-code opacity-50 pointer-events-none"
            style={{
              transform: `rotate(${m.deg}deg) translateY(-126px)`,
            }}
          >
            {m.label}
          </div>
        ))}

        {/* Segmented Counter-Rotating Energy Conduit */}
        <div className="absolute inset-3 rounded-full border-2 border-transparent border-t-[var(--theme-primary)] border-b-[var(--theme-accent)] animate-spin-reverse opacity-80" />

        {/* Tick Mark Gauge Ring */}
        <div className="absolute inset-7 rounded-full border border-dotted border-[var(--theme-primary)]/50 animate-spin-slow" />

        {/* Glowing Reactor Boundary */}
        <div
          className="absolute inset-14 rounded-full border-2 transition-all duration-500 flex items-center justify-center animate-pulse-ring backdrop-blur-xl"
          style={{
            borderColor: stateColors[state],
            boxShadow: `0 0 35px ${stateColors[state]}88`,
            backgroundColor: 'rgba(3, 7, 13, 0.85)',
          }}
        >
          {/* Inner Interactive Center Button */}
          <button
            onClick={() => {
              sound.playActivate();
              onToggleMic();
            }}
            title={isListening ? 'Click to deactivate voice' : 'Click to activate voice recognition'}
            className="w-24 h-24 rounded-full flex flex-col items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer relative z-10 group"
          >
            {isListening ? (
              <Mic className="w-9 h-9 text-amber-400 animate-pulse" />
            ) : state === 'speaking' ? (
              <Volume2 className="w-9 h-9 text-emerald-400 animate-bounce" />
            ) : state === 'processing' ? (
              <Activity className="w-9 h-9 text-purple-400 animate-spin" />
            ) : (
              <Cpu className="w-9 h-9 text-[var(--theme-primary)] group-hover:scale-110 transition-transform" />
            )}

            <span className="text-[10px] font-orbitron tracking-widest mt-1 font-bold" style={{ color: stateColors[state] }}>
              {isListening ? 'LISTENING' : state === 'speaking' ? 'JARVIS' : 'PUSH / WAKE'}
            </span>
          </button>
        </div>

        {/* Reticle Lines */}
        <div className="absolute w-full h-[1px] bg-[var(--theme-border)]/30 pointer-events-none" />
        <div className="absolute h-full w-[1px] bg-[var(--theme-border)]/30 pointer-events-none" />
      </div>

      {/* State Text Kicker */}
      <div className="text-xs font-orbitron font-bold tracking-widest text-center mt-1" style={{ color: stateColors[state] }}>
        {stateLabels[state]}
      </div>

      {/* Audio Waveform Equalizer (32 bars) */}
      <div className="w-full mt-3 pt-3 border-t border-[var(--theme-border)]">
        <div className="flex items-end justify-center gap-1 h-8">
          {frequencies.map((h, i) => (
            <div
              key={i}
              className="w-1.5 rounded-t transition-all duration-100"
              style={{
                height: `${Math.max(12, h)}%`,
                backgroundColor: stateColors[state],
                opacity: 0.85,
                boxShadow: `0 0 8px ${stateColors[state]}`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Controls Bar */}
      <div className="mt-3 flex items-center justify-between w-full px-1">
        <button
          onClick={() => {
            sound.playClick();
            onToggleMic();
          }}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-code font-bold transition-all cursor-pointer ${
            isListening
              ? 'bg-amber-500/20 border border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.5)]'
              : 'bg-white/5 border border-[var(--theme-border)] text-gray-200 hover:border-[var(--theme-primary)] hover:bg-[var(--theme-primary)]/10'
          }`}
        >
          {isListening ? <MicOff className="w-3.5 h-3.5 text-amber-400" /> : <Mic className="w-3.5 h-3.5 text-[var(--theme-primary)]" />}
          <span>{isListening ? 'MUTE MIC' : 'ACTIVATE VOICE'}</span>
        </button>

        <div className="text-right">
          <div className="text-[10px] font-code opacity-70">WAKE PROTOCOL</div>
          <div className="text-xs font-orbitron font-bold text-[var(--theme-primary)] tracking-wider">
            "HEY STONIC"
          </div>
        </div>
      </div>
    </div>
  );
};
