import React from 'react';
import { X, ExternalLink, Play, Sparkles, User, Award, Shield } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface StoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StoryModal: React.FC<StoryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl hud-panel rounded-3xl p-6 sm:p-8 border border-[var(--theme-border)] shadow-[0_0_50px_var(--theme-glow-soft)] relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-5 right-5 text-gray-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6 pb-3 border-b border-[var(--theme-border)]">
          <div className="p-2.5 rounded-xl bg-[var(--theme-primary)]/10 border border-[var(--theme-border)] text-[var(--theme-primary)]">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-orbitron font-bold text-lg text-[var(--theme-primary)]">
              THE JOURNEY BEHIND STONIC AI
            </h2>
            <p className="text-xs text-gray-400 font-code">
              Inspired by Inventor Usman · Zero to Growth
            </p>
          </div>
        </div>

        {/* Video Card Banner */}
        <div className="relative rounded-2xl bg-black/60 border border-[var(--theme-border)] p-4 mb-6 flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full sm:w-48 h-28 rounded-xl bg-gradient-to-br from-cyan-950 to-black border border-[var(--theme-border)] flex flex-col items-center justify-center relative overflow-hidden shrink-0 group">
            <div className="absolute inset-0 bg-[var(--theme-primary)]/10 group-hover:bg-[var(--theme-primary)]/20 transition-colors" />
            <Play className="w-8 h-8 text-[var(--theme-primary)] mb-1" />
            <span className="text-[10px] font-code text-gray-300">YOUTUBE DOCUMENTARY</span>
          </div>

          <div className="flex-1">
            <span className="text-[10px] font-code px-2 py-0.5 rounded bg-[var(--theme-primary)]/15 text-[var(--theme-primary)] font-semibold">
              ORIGINAL CREATOR INSPIRATION
            </span>
            <h3 className="font-rajdhani font-bold text-base text-white mt-1">
              "The Journey Behind Stonic AI - Zero to Growth"
            </h3>
            <p className="text-xs text-gray-300 font-rajdhani mt-1 leading-relaxed">
              Created by Usman ("Inventor Usman"), Stonic AI transforms a standard desktop computer into a futuristic Jarvis-like operating experience with voice control, multi-agent collaboration, and local task automation.
            </p>
            <a
              href="https://youtu.be/2tY6ZU-jgF4"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-2.5 text-xs font-code text-[var(--theme-primary)] hover:underline"
            >
              <span>Watch on YouTube (2tY6ZU-jgF4)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Core Pillars of Stonic AI */}
        <div className="space-y-4 text-xs font-rajdhani text-gray-300 leading-relaxed">
          <h4 className="font-orbitron font-bold text-sm text-[var(--theme-primary)] tracking-wide">
            STONIC AI ARCHITECTURAL PILLARS
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-code">
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[var(--theme-primary)] font-bold text-xs mb-1">
                1. Cinematic Jarvis Interface
              </div>
              <div className="text-[11px] text-gray-400">
                Transforms desktop screens with holographic HUD rings, reactive voice audio equalizers, and customizable sci-fi themes (Cyan, Amber, Crimson, Emerald).
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[var(--theme-primary)] font-bold text-xs mb-1">
                2. Voice-Driven Orchestration
              </div>
              <div className="text-[11px] text-gray-400">
                Natural conversational dialogue with real-time speech recognition and speech synthesis powered by Gemini Flash Lite.
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[var(--theme-primary)] font-bold text-xs mb-1">
                3. Specialist Agents & Agent Town
              </div>
              <div className="text-[11px] text-gray-400">
                Multi-agent spatial simulation where Dev, Research, OS, and Security specialist agents collaborate in real-time.
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[var(--theme-primary)] font-bold text-xs mb-1">
                4. Safe Local Automation
              </div>
              <div className="text-[11px] text-gray-400">
                Autonomous multi-step desktop workflows (organizing downloads, running diagnostics, research) protected by Human-in-the-Loop confirmations.
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[var(--theme-border)] flex items-center justify-between">
          <span className="text-[11px] font-code text-gray-500">
            STONIC OS BUILD 3.4.0 · IRON MAN JARVIS EXPERIENCE
          </span>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-[var(--theme-primary)] text-black font-rajdhani font-bold text-xs hover:brightness-110 cursor-pointer"
          >
            RETURN TO COMMAND CENTER
          </button>
        </div>
      </div>
    </div>
  );
};
