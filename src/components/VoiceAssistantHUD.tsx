import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Volume2, Sparkles, CheckCircle2, Terminal, AlertCircle } from 'lucide-react';
import { ChatMessage, AgentRole } from '../types';
import { sound } from '../utils/soundEffects';

interface VoiceAssistantHUDProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isProcessing: boolean;
  activeAgent: AgentRole;
  isListening: boolean;
  onToggleMic: () => void;
  onPlayTTS: (text: string, messageId?: string) => void;
  currentSpeakingId: string | null;
}

export const VoiceAssistantHUD: React.FC<VoiceAssistantHUDProps> = ({
  messages,
  onSendMessage,
  isProcessing,
  activeAgent,
  isListening,
  onToggleMic,
  onPlayTTS,
  currentSpeakingId,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isProcessing) return;
    sound.playClick();
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const quickPrompts = [
    'Stonic, execute full hardware & sensor diagnostics',
    'Organize /Downloads folder and archive old files',
    'Deploy Research Specialist to brief me on quantum algorithms',
    'Engage Cyber Sentinel Protocol 0 Threat Sweep',
    'Write a Node.js automation script for file indexing',
  ];

  return (
    <div className="flex flex-col h-full hud-panel rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--theme-border)] bg-black/20">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--theme-primary)] animate-ping" />
          <span className="font-orbitron font-bold text-xs tracking-wider text-[var(--theme-primary)]">
            STONIC AI · COMMAND CHANNEL
          </span>
          <span className="px-2 py-0.5 rounded-full bg-pink-500/15 border border-pink-500/30 text-[10px] text-pink-300 font-code font-bold">
            ♀ FEMALE VOICE
          </span>
        </div>
        <div className="text-[11px] font-code opacity-70 flex items-center gap-2">
          <span>LATENCY: 42ms</span>
          <span>·</span>
          <span>STREAM: ACTIVE</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isSpeakingThis = currentSpeakingId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-full`}
            >
              <div className="flex items-center gap-2 mb-1 text-[11px] font-code opacity-70">
                <span>{isUser ? 'OPERATOR' : `STONIC · ${(msg.agent || activeAgent).toUpperCase()}`}</span>
                <span>·</span>
                <span>{msg.timestamp}</span>
              </div>

              <div
                className={`relative px-4 py-3 rounded-2xl max-w-[90%] sm:max-w-[85%] text-sm leading-relaxed ${
                  isUser
                    ? 'bg-white/10 border border-white/20 text-white rounded-tr-none'
                    : 'bg-black/50 border border-[var(--theme-border)] text-gray-100 rounded-tl-none shadow-[0_0_15px_var(--theme-glow-soft)]'
                }`}
              >
                {/* Visual speaker indicator */}
                {isSpeakingThis && (
                  <div className="flex items-center gap-2 mb-2 text-xs font-code text-emerald-400">
                    <Volume2 className="w-4 h-4 animate-bounce" />
                    <span>AUDIO STREAMING...</span>
                  </div>
                )}

                <p className="whitespace-pre-wrap select-text">{msg.text}</p>

                {/* Structured Plan if available */}
                {msg.plan && msg.plan.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-white/10 space-y-1.5 font-code text-xs">
                    <div className="text-[10px] text-[var(--theme-primary)] font-bold tracking-widest uppercase">
                      Autonomous Execution Plan:
                    </div>
                    {msg.plan.map((step) => (
                      <div key={step.step} className="flex items-center gap-2 opacity-85">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Step {step.step}: {step.title}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions generated */}
                {msg.actions && msg.actions.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {msg.actions.map((act, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-code px-2 py-0.5 rounded bg-[var(--theme-primary)]/15 border border-[var(--theme-primary)]/30 text-[var(--theme-primary)]"
                      >
                        ⚡ {act.label}
                      </span>
                    ))}
                  </div>
                )}

                {/* Listen again button for AI messages */}
                {!isUser && (
                  <div className="mt-2 pt-2 flex items-center justify-end">
                    <button
                      onClick={() => onPlayTTS(msg.text, msg.id)}
                      className="flex items-center gap-1.5 text-[11px] font-code text-[var(--theme-primary)] hover:underline opacity-80 hover:opacity-100 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isSpeakingThis ? 'REPLAY AUDIO' : 'SPEAK (FEMALE VOICE)'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isProcessing && (
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2 mb-1 text-[11px] font-code text-[var(--theme-primary)]">
              <span>STONIC NEURAL MATRIX</span>
              <span>·</span>
              <span>THINKING</span>
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-black/50 border border-[var(--theme-border)] text-sm flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[var(--theme-primary)] animate-ping" />
              <span className="font-code text-xs text-gray-300">
                Synthesizing response & verifying subroutines...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Commands */}
      <div className="px-4 py-2 border-t border-[var(--theme-border)] bg-black/30 overflow-x-auto">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="text-[10px] font-code text-[var(--theme-primary)] font-bold">
            QUICK DIRECTIVES:
          </span>
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => {
                sound.playClick();
                onSendMessage(prompt);
              }}
              className="text-[11px] font-code px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 hover:border-[var(--theme-primary)] hover:bg-[var(--theme-primary)]/10 text-gray-300 hover:text-white transition-all cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-[var(--theme-border)] bg-black/40">
        <div className="relative flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              sound.playActivate();
              onToggleMic();
            }}
            title={isListening ? 'Stop listening' : 'Start voice input'}
            className={`p-3 rounded-xl transition-all cursor-pointer ${
              isListening
                ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(251,191,36,0.6)] animate-pulse'
                : 'bg-white/5 border border-[var(--theme-border)] text-[var(--theme-primary)] hover:bg-[var(--theme-primary)]/15'
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isListening
                ? 'Listening to your voice command in real-time...'
                : 'Enter voice command or prompt for Stonic (Female Voice)... (e.g. "Run diagnostics", "Organize files")'
            }
            className="flex-1 bg-black/60 border border-[var(--theme-border)] rounded-xl px-4 py-3 text-sm font-rajdhani text-white placeholder-gray-500 focus:outline-none focus:border-[var(--theme-primary)] focus:ring-1 focus:ring-[var(--theme-primary)] tracking-wide"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isProcessing}
            className="px-5 py-3 rounded-xl bg-[var(--theme-primary)] text-black font-rajdhani font-bold text-sm tracking-wider flex items-center gap-1.5 transition-all hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-[0_0_15px_var(--theme-glow)]"
          >
            <span>TRANSMIT</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
