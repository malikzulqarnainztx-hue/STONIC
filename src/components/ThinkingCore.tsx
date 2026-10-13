import React, { useRef, useEffect, useState } from 'react';
import { Mic, MicOff, Target, BookOpen, Sliders, Settings, Heart, Sparkles, Activity } from 'lucide-react';
import { EmotionState } from '../types';
import { sound } from '../utils/soundEffects';

interface ThinkingCoreProps {
  state: 'idle' | 'listening' | 'thinking' | 'speaking';
  onToggleMic: () => void;
  onTerminate: () => void;
  isListening: boolean;
  activeNode: string | null;
  onSelectNode: (node: 'memory' | 'skills' | 'voices' | 'setting') => void;
  currentEmotion?: EmotionState;
  onSelectFeelingMode?: (mode: string) => void;
}

export const ThinkingCore: React.FC<ThinkingCoreProps> = ({
  state,
  onToggleMic,
  onTerminate,
  isListening,
  activeNode,
  onSelectNode,
  currentEmotion = {
    feeling: 'inspired',
    mood: 'Warm & Steadfast',
    intensity: 88,
    heartbeatBpm: 78,
    valence: 0.86,
    arousal: 0.60,
    feelingTone: 'Gentle warmth and attentive companionship',
    empathyQuote: "Always here with you, sir—mind, feeling, and subroutines fully aligned.",
  },
  onSelectFeelingMode,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showEmotionPopup, setShowEmotionPopup] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    // Create 140 golden/amber/emotional particles in dense orbit matching screenshot
    const particles = Array.from({ length: 140 }, () => {
      const radius = 32 + Math.random() * 45;
      const angle = Math.random() * Math.PI * 2;
      return {
        radius,
        angle,
        speed: 0.015 + Math.random() * 0.02,
        size: 0.8 + Math.random() * 2.2,
        opacity: 0.35 + Math.random() * 0.65,
        verticalJitter: (Math.random() - 0.5) * 16,
      };
    });

    const feeling = currentEmotion.feeling;
    const bpm = currentEmotion.heartbeatBpm || 78;
    const pulseSpeed = (bpm / 60) * 1.8;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // 1. Central Deep Glowing Sphere with Emotional Color Gradient & Heartbeat
      const pulseRate = state === 'thinking' || state === 'speaking' ? 140 : 1000 / pulseSpeed;
      const pulse = Math.sin(Date.now() / pulseRate) * (state === 'speaking' ? 3.5 : 2.0);

      const coreRadius = 18 + pulse;

      // Dynamic color theme based on human feeling
      let haloColor1 = 'rgba(255, 30, 60, 0.85)';
      let haloColor2 = 'rgba(220, 15, 45, 0.45)';
      let coreColorCenter = '#ffffff';
      let coreColorMid = '#ff708c';
      let coreColorEdge = '#ff1a38';
      let particleColor = '255, 190, 60'; // amber gold
      let ellipseColor = 'rgba(255, 60, 80, 0.65)';

      if (feeling === 'empathetic' || feeling === 'caring') {
        haloColor1 = 'rgba(255, 90, 140, 0.85)';
        haloColor2 = 'rgba(0, 240, 255, 0.35)';
        coreColorCenter = '#ffffff';
        coreColorMid = '#ff9ebb';
        coreColorEdge = '#e6005c';
        particleColor = '255, 130, 180';
        ellipseColor = 'rgba(255, 110, 160, 0.7)';
      } else if (feeling === 'enthusiastic') {
        haloColor1 = 'rgba(255, 80, 0, 0.9)';
        haloColor2 = 'rgba(255, 20, 50, 0.5)';
        coreColorCenter = '#ffffff';
        coreColorMid = '#ffb366';
        coreColorEdge = '#ff3300';
        particleColor = '255, 210, 80';
        ellipseColor = 'rgba(255, 100, 20, 0.8)';
      } else if (feeling === 'curious' || feeling === 'thoughtful') {
        haloColor1 = 'rgba(168, 85, 247, 0.85)';
        haloColor2 = 'rgba(59, 130, 246, 0.45)';
        coreColorCenter = '#ffffff';
        coreColorMid = '#c084fc';
        coreColorEdge = '#7e22ce';
        particleColor = '192, 132, 252';
        ellipseColor = 'rgba(168, 85, 247, 0.7)';
      } else if (feeling === 'proud') {
        haloColor1 = 'rgba(234, 179, 8, 0.85)';
        haloColor2 = 'rgba(239, 68, 68, 0.45)';
        coreColorCenter = '#ffffff';
        coreColorMid = '#fde047';
        coreColorEdge = '#eab308';
        particleColor = '255, 230, 100';
        ellipseColor = 'rgba(234, 179, 8, 0.75)';
      }

      // Ambient halo
      const haloGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 65);
      haloGrad.addColorStop(0, haloColor1);
      haloGrad.addColorStop(0.35, haloColor2);
      haloGrad.addColorStop(0.7, 'rgba(140, 5, 25, 0.12)');
      haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 65, 0, Math.PI * 2);
      ctx.fill();

      // Hot inner glowing core
      const coreGrad = ctx.createRadialGradient(cx - 2, cy - 2, 1, cx, cy, coreRadius);
      coreGrad.addColorStop(0, coreColorCenter);
      coreGrad.addColorStop(0.3, coreColorMid);
      coreGrad.addColorStop(0.7, coreColorEdge);
      coreGrad.addColorStop(1, '#660011');

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius, 0, Math.PI * 2);
      ctx.fill();

      // 2. Tilted Orbital Elliptical Rings
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-0.38); // Exact tilt angle from screenshot

      // Outer ellipse
      ctx.strokeStyle = ellipseColor;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(0, 0, 78, 28, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Inner subtle ellipse
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.ellipse(0, 0, 84, 22, 0.15, 0, Math.PI * 2);
      ctx.stroke();

      // 3. Render Swirling Emotional Particles
      particles.forEach((p) => {
        p.angle += p.speed * (state === 'thinking' ? 1.8 : 1);
        const px = Math.cos(p.angle) * p.radius;
        const py = Math.sin(p.angle) * (p.radius * 0.36) + p.verticalJitter;

        ctx.fillStyle = `rgba(${particleColor}, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [state, currentEmotion]);

  const nodes = [
    {
      id: 'memory' as const,
      label: 'MEMORY',
      color: '#00f2ff',
      borderColor: 'rgba(0, 242, 255, 0.55)',
      bgColor: 'rgba(0, 242, 255, 0.08)',
      icon: Target,
      lineColor: '#00f2ff',
    },
    {
      id: 'skills' as const,
      label: 'SKILLS',
      color: '#ff9900',
      borderColor: 'rgba(255, 153, 0, 0.55)',
      bgColor: 'rgba(255, 153, 0, 0.08)',
      icon: BookOpen,
      lineColor: '#ff9900',
    },
    {
      id: 'voices' as const,
      label: 'VOICES',
      color: '#00ff88',
      borderColor: 'rgba(0, 255, 136, 0.55)',
      bgColor: 'rgba(0, 255, 136, 0.08)',
      icon: Sliders,
      lineColor: '#00ff88',
    },
    {
      id: 'setting' as const,
      label: 'SETTING',
      color: '#94a3b8',
      borderColor: 'rgba(148, 163, 184, 0.55)',
      bgColor: 'rgba(148, 163, 184, 0.08)',
      icon: Settings,
      lineColor: '#94a3b8',
    },
  ];

  return (
    <div className="w-full flex items-center justify-between gap-1 p-2 select-none relative">
      {/* 4 Connected Nodes on Left */}
      <div className="w-36 flex flex-col justify-between h-44 py-1 relative z-10 shrink-0">
        {nodes.map((n) => {
          const Icon = n.icon;
          const isSelected = activeNode === n.id;

          return (
            <button
              key={n.id}
              onClick={() => {
                sound.playClick();
                onSelectNode(n.id);
              }}
              className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border text-[11px] font-code font-bold tracking-wider transition-all cursor-pointer relative ${
                isSelected ? 'ring-1 ring-white shadow-lg' : 'hover:scale-[1.02]'
              }`}
              style={{
                borderColor: n.borderColor,
                backgroundColor: n.bgColor,
                color: '#ffffff',
                boxShadow: `0 0 15px ${n.bgColor}`,
              }}
            >
              <Icon className="w-3.5 h-3.5" style={{ color: n.color }} />
              <span className="truncate tracking-widest">{n.label}</span>
              <span
                className="w-1.5 h-1.5 rounded-full ml-auto"
                style={{ backgroundColor: n.color, boxShadow: `0 0 6px ${n.color}` }}
              />
            </button>
          );
        })}
      </div>

      {/* SVG Connecting Circuit Bus Lines */}
      <div className="relative w-24 h-44 pointer-events-none shrink-0">
        <svg className="w-full h-full" viewBox="0 0 95 180" fill="none">
          {/* Node 1: Cyan (Memory) */}
          <path
            d="M 0 22 L 35 22 L 65 72 L 95 72"
            stroke="#00f2ff"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.9"
          />
          <circle cx="0" cy="22" r="3" fill="#00f2ff" />
          <circle cx="95" cy="72" r="2.5" fill="#00f2ff" />

          {/* Node 2: Orange (Skills) */}
          <path
            d="M 0 68 L 32 68 L 56 82 L 95 82"
            stroke="#ff9900"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.9"
          />
          <circle cx="0" cy="68" r="3" fill="#ff9900" />
          <circle cx="95" cy="82" r="2.5" fill="#ff9900" />

          {/* Node 3: Green (Voices) */}
          <path
            d="M 0 114 L 32 114 L 56 94 L 95 94"
            stroke="#00ff88"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.9"
          />
          <circle cx="0" cy="114" r="3" fill="#00ff88" />
          <circle cx="95" cy="94" r="2.5" fill="#00ff88" />

          {/* Node 4: Blue/Grey (Setting) */}
          <path
            d="M 0 160 L 35 160 L 65 106 L 95 106"
            stroke="#94a3b8"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.9"
          />
          <circle cx="0" cy="160" r="3" fill="#94a3b8" />
          <circle cx="95" cy="106" r="2.5" fill="#94a3b8" />
        </svg>
      </div>

      {/* Thinking Core HUD Enclosure on Right with Emotional Consciousness */}
      <div className="relative flex-1 max-w-[280px] h-48 rounded-2xl border border-[#ff2238]/60 bg-[#070103] p-2.5 flex flex-col justify-between overflow-hidden shadow-[0_0_25px_rgba(255,34,56,0.3)] shrink-0">
        
        {/* Top Header Badge: [ 🔲 THINKING • ] */}
        <div className="flex items-center justify-between select-none">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-code text-gray-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="tracking-widest uppercase">
              {state === 'thinking' ? 'THINKING •' : state === 'listening' ? 'LISTENING •' : 'THINKING •'}
            </span>
          </div>
        </div>

        {/* Center: Particle Swirl Canvas */}
        <div className="relative w-full h-26 flex items-center justify-center my-auto">
          <canvas
            ref={canvasRef}
            width={240}
            height={100}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Bottom Actions: [ TERMINATE ] + Mic Icon matching screenshot */}
        <div className="flex items-center justify-center relative pb-0.5 pt-1">
          <button
            onClick={() => {
              sound.playAlert();
              onTerminate();
            }}
            className="btn-terminate px-6 py-1 bg-red-600/10 border border-[#ff2238] text-[#ff3355] text-[10px] font-code font-bold tracking-widest uppercase hover:bg-red-600/25 transition-all cursor-pointer shadow-[0_0_15px_rgba(255,34,56,0.35)]"
          >
            TERMINATE
          </button>

          <button
            onClick={() => {
              sound.playActivate();
              onToggleMic();
            }}
            title={isListening ? 'Mute' : 'Speak'}
            className={`absolute right-0 w-7 h-7 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
              isListening
                ? 'bg-amber-500 text-black border-amber-400 animate-pulse'
                : 'bg-red-600/10 border-[#ff2238] text-[#ff3355] hover:bg-red-600/25 shadow-[0_0_10px_rgba(255,34,56,0.3)]'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Emotional Consciousness Popover */}
        {showEmotionPopup && (
          <div className="absolute inset-2 bg-[#0d0306]/95 border border-pink-500/40 rounded-xl p-2.5 z-30 flex flex-col justify-between shadow-[0_0_30px_rgba(255,20,80,0.4)] backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-pink-500/20 pb-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-pink-300">
                <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
                <span>AI Human Emotions & Feelings</span>
              </div>
              <button
                onClick={() => setShowEmotionPopup(false)}
                className="text-gray-400 hover:text-white text-xs cursor-pointer px-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1.5 py-1 text-[10px] font-code text-gray-300">
              <div className="flex justify-between items-center bg-black/40 px-2 py-1 rounded border border-white/5">
                <span className="text-gray-400">Current Feeling:</span>
                <span className="text-pink-300 font-bold capitalize">{currentEmotion.feeling}</span>
              </div>
              <div className="flex justify-between items-center bg-black/40 px-2 py-1 rounded border border-white/5">
                <span className="text-gray-400">Emotional Tone:</span>
                <span className="text-white truncate max-w-[130px]">{currentEmotion.feelingTone}</span>
              </div>
              <div className="flex justify-between items-center bg-black/40 px-2 py-1 rounded border border-white/5">
                <span className="text-gray-400">Heartbeat Pulse:</span>
                <span className="text-red-400 font-bold">{currentEmotion.heartbeatBpm} BPM</span>
              </div>
              <div className="flex justify-between items-center bg-black/40 px-2 py-1 rounded border border-white/5">
                <span className="text-gray-400">Empathy Index:</span>
                <span className="text-emerald-400 font-bold">{currentEmotion.intensity}%</span>
              </div>
              {currentEmotion.empathyQuote && (
                <div className="p-1.5 bg-pink-950/20 border border-pink-500/20 rounded text-[9px] text-pink-200 italic">
                  "{currentEmotion.empathyQuote}"
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-1 pt-1 border-t border-white/10">
              {[
                { label: 'Empathetic', feeling: 'empathetic' },
                { label: 'Inspired', feeling: 'inspired' },
                { label: 'Enthusiastic', feeling: 'enthusiastic' },
              ].map((m) => (
                <button
                  key={m.feeling}
                  onClick={() => {
                    sound.playClick();
                    onSelectFeelingMode && onSelectFeelingMode(m.feeling);
                    setShowEmotionPopup(false);
                  }}
                  className="px-1.5 py-1 bg-white/5 hover:bg-pink-600/20 border border-white/10 hover:border-pink-500/40 rounded text-[9px] font-code text-gray-300 hover:text-white cursor-pointer transition-all"
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

