import React, { useState, useRef, useEffect } from 'react';
import { Bot, Plus, History, ChevronRight, Maximize2, Paperclip, ArrowUp, Volume2, Mic, FileText, Send, Trash2, Heart, Sparkles, Smile, ShieldAlert } from 'lucide-react';
import { ChatMessage, EmotionState } from '../types';
import { sound } from '../utils/soundEffects';

interface VoiceAgentNotesPanelProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isProcessing: boolean;
  isListening: boolean;
  onToggleMic: () => void;
  onPlayTTS: (text: string, id?: string, emotion?: EmotionState) => void;
  currentSpeakingId: string | null;
  language: 'urdu' | 'english';
  onToggleLanguage: () => void;
  onClearMessages: () => void;
  currentEmotion?: EmotionState;
}

export const VoiceAgentNotesPanel: React.FC<VoiceAgentNotesPanelProps> = ({
  messages,
  onSendMessage,
  isProcessing,
  isListening,
  onToggleMic,
  onPlayTTS,
  currentSpeakingId,
  language,
  onToggleLanguage,
  onClearMessages,
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
}) => {
  const [activeTab, setActiveTab] = useState<'VOICE' | 'AGENT' | 'NOTES'>('VOICE');
  const [inputText, setInputText] = useState('');
  const [notes, setNotes] = useState<string[]>([
    'Stonic AI Core v3.4 initialized on local thread.',
    'Memory Vault active: bilingual Urdu/Hindi + English.',
    'Affective empathy neural core synchronized: 78 BPM.',
    'Sat-Link synchronized with 14 ground stations.',
  ]);
  const [newNoteInput, setNewNoteInput] = useState('');
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isProcessing) return;
    sound.playClick();
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteInput.trim()) return;
    sound.playSuccess();
    setNotes((prev) => [newNoteInput.trim(), ...prev]);
    setNewNoteInput('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      sound.playSuccess();
      onSendMessage(`[Uploaded File: ${file.name}] Please analyze this document and summarize key insights.`);
    }
  };

  const toggleFullscreen = () => {
    sound.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="w-full h-full stonic-panel p-4 flex flex-col justify-between overflow-hidden shadow-[0_0_30px_rgba(255,34,56,0.2)] select-none font-rajdhani">
      {/* Top Header: VOICE | AGENT | NOTES */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 select-none">
        <div className="flex items-center gap-3 text-xs font-code font-bold tracking-wider">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('VOICE');
            }}
            className={`cursor-pointer transition-colors ${
              activeTab === 'VOICE' ? 'text-[#ff3355]' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            VOICE
          </button>
          <span className="text-gray-600">|</span>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('AGENT');
            }}
            className={`cursor-pointer transition-colors ${
              activeTab === 'AGENT' ? 'text-[#ff3355]' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            AGENT
          </button>
          <span className="text-gray-600">|</span>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('NOTES');
            }}
            className={`cursor-pointer transition-colors ${
              activeTab === 'NOTES' ? 'text-[#ff3355]' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            NOTES
          </button>
        </div>

        {/* Right Action Icons: +, history, chevron, fullscreen */}
        <div className="flex items-center gap-2.5 text-gray-500">
          <button
            onClick={onToggleLanguage}
            title="Toggle Urdu / English"
            className="text-[10px] font-code px-1.5 py-0.5 rounded border border-white/10 text-gray-400 hover:text-white cursor-pointer"
          >
            {language === 'urdu' ? 'UR' : 'EN'}
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onClearMessages();
            }}
            title="New Chat Session"
            className="hover:text-white cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setShowHistoryModal(true);
            }}
            title="Conversation History"
            className="hover:text-white cursor-pointer"
          >
            <History className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setShowShortcuts(!showShortcuts);
            }}
            title="Quick Shortcuts"
            className="hover:text-white cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            className="hover:text-white cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Shortcuts Drawer if opened */}
      {showShortcuts && (
        <div className="p-2 my-1 rounded-xl bg-black/80 border border-white/10 text-[10px] font-code grid grid-cols-2 gap-1 animate-in fade-in">
          {['Diagnostics check', 'Protocol 0 engage', 'Clear workspace', 'Translate to Urdu'].map((s, i) => (
            <button
              key={i}
              onClick={() => {
                setShowShortcuts(false);
                onSendMessage(s);
              }}
              className="p-1.5 rounded hover:bg-white/10 text-gray-300 text-left"
            >
              ❯ {s}
            </button>
          ))}
        </div>
      )}

      {/* Middle Content Area depending on Active Tab */}
      <div className="flex-1 overflow-y-auto py-2 px-1 space-y-3 flex flex-col justify-between">
        {activeTab === 'VOICE' && (
          <>
            {!hasMessages ? (
              /* Empty State Matching Screenshot Ditto */
              <div className="flex flex-col items-center justify-center my-auto text-center px-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 mb-3 shadow-md">
                  <Bot className="w-6 h-6 text-gray-300" />
                </div>

                <h3 className="font-orbitron font-bold text-sm tracking-widest text-white mb-2">
                  SYSTEM READY
                </h3>

                <p className="text-xs text-gray-400 font-rajdhani leading-relaxed max-w-xs">
                  Aapka personal AI assistant. Bataye<br />
                  main kaise madad kar sakta hoon?
                </p>
              </div>
            ) : (
              /* Active Chat Timeline */
              <div className="space-y-3">
                {messages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  const isSpeakingThis = currentSpeakingId === msg.id;

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-full`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 text-[10px] font-code text-gray-500">
                        <span>{isUser ? 'OPERATOR' : 'STONIC'}</span>
                        <span>·</span>
                        <span>{msg.timestamp}</span>
                        {!isUser && msg.emotion && (
                          <span className="text-pink-400 ml-1">[{msg.emotion.feeling}]</span>
                        )}
                      </div>

                      <div
                        className={`px-3.5 py-2 rounded-2xl max-w-[90%] text-xs leading-relaxed select-text ${
                          isUser
                            ? 'bg-white/10 text-white rounded-tr-none border border-white/20'
                            : 'bg-[#120508] text-gray-200 rounded-tl-none border border-[#ff2238]/40 shadow-[0_0_12px_rgba(255,34,56,0.2)]'
                        }`}
                      >
                        {isSpeakingThis && (
                          <div className="flex items-center gap-1.5 mb-1.5 text-[10px] font-code text-emerald-400">
                            <Volume2 className="w-3 h-3 animate-bounce" />
                            <span>SPEAKING WITH EMOTION...</span>
                          </div>
                        )}

                        {/* Human Feeling & Emotional State Badge on AI response */}
                        {!isUser && msg.emotion && (
                          <div className="flex items-center gap-1.5 mb-2 px-2 py-0.5 rounded-lg bg-pink-950/40 border border-pink-500/30 text-[9px] font-code text-pink-300 w-fit">
                            <Heart className="w-2.5 h-2.5 text-pink-400 fill-pink-400" />
                            <span>Feeling: <strong className="text-white capitalize">{msg.emotion.feeling}</strong> ({msg.emotion.mood})</span>
                            <span className="text-gray-500">·</span>
                            <span className="text-red-300">{msg.emotion.heartbeatBpm} BPM</span>
                          </div>
                        )}

                        <p className="whitespace-pre-wrap">{msg.text}</p>

                        {!isUser && (
                          <div className="mt-2 pt-1 border-t border-white/10 flex items-center justify-between text-[10px] font-code text-gray-500">
                            {msg.emotion?.empathyQuote ? (
                              <span className="italic text-pink-300/80 text-[9px] truncate max-w-[180px]">
                                "{msg.emotion.empathyQuote}"
                              </span>
                            ) : <span />}

                            <button
                              onClick={() => onPlayTTS(msg.text, msg.id, msg.emotion)}
                              className="flex items-center gap-1 text-[#ff3355] hover:underline cursor-pointer ml-auto"
                            >
                              <Volume2 className="w-3 h-3" />
                              <span>REPLAY</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {isProcessing && (
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-black/40 border border-pink-500/30 text-xs font-code text-pink-300">
                    <Heart className="w-3 h-3 text-pink-500 animate-pulse" />
                    <span>Synthesizing empathetic emotional response...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </>
        )}

        {/* AGENT TAB: Live Agent Stream */}
        {activeTab === 'AGENT' && (
          <div className="space-y-3 font-code text-xs">
            <div className="flex items-center justify-between text-[11px] font-bold text-yellow-400 border-b border-white/10 pb-1">
              <span className="flex items-center gap-1.5">
                <span>MANAGEMENT TEAM STREAM:</span>
                <span className="text-[9px] text-gray-400 font-normal">MANAGER: STONIC</span>
              </span>
              <button
                onClick={() => {
                  sound.playClick();
                  const el = document.getElementById('agent-town-hq');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    el.classList.add('ring-4', 'ring-cyan-400', 'shadow-[0_0_50px_rgba(6,182,212,0.9)]');
                    setTimeout(() => {
                      el.classList.remove('ring-4', 'ring-cyan-400', 'shadow-[0_0_50px_rgba(6,182,212,0.9)]');
                    }, 3500);
                  }
                }}
                className="px-2 py-0.5 rounded bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-400/50 text-cyan-300 text-[10px] cursor-pointer flex items-center gap-1 transition-all"
                title="Scroll & focus Agent Town HQ in center column"
              >
                <span>🏢 VIEW OFFICE</span>
              </button>
            </div>
            {[
              { agent: 'Stonic (Manager)', action: 'Coordinated Alex & Bob: Sprint roadmap aligned to $1M goal', time: 'Just now', tag: 'manager' },
              { agent: "Alex (Frontend)", action: "Alex's Work: Rendered responsive HUD glassmorphism component", time: '12:02', tag: 'frontend' },
              { agent: "Bob (Systems)", action: "Bob's Work: Purged garbage collection heap & tuned Linux sockets", time: '12:01', tag: 'systems' },
              { agent: "Carol (Research)", action: "Carol's Work: Extracted 12 citations on 1-bit CPU BitNet models", time: '11:59', tag: 'research' },
              { agent: "Dave (Security)", action: "Dave's Work: Protocol 0 port-3000 firewall perimeter locked", time: '11:58', tag: 'security' },
            ].map((item, idx) => (
              <div key={idx} className="p-2 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between text-[10px] text-gray-400 mb-0.5">
                  <span className={`font-bold ${item.tag === 'manager' ? 'text-yellow-400' : item.tag === 'frontend' ? 'text-cyan-300' : item.tag === 'systems' ? 'text-amber-300' : 'text-pink-300'}`}>
                    {item.agent}
                  </span>
                  <span>{item.time}</span>
                </div>
                <div className="text-gray-300 text-[11px]">{item.action}</div>
              </div>
            ))}
          </div>
        )}

        {/* NOTES TAB: Personal Scratchpad */}
        {activeTab === 'NOTES' && (
          <div className="space-y-3 flex flex-col h-full">
            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                value={newNoteInput}
                onChange={(e) => setNewNoteInput(e.target.value)}
                placeholder="Add a new note to scratchpad..."
                className="flex-1 bg-black/60 border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
              />
              <button type="submit" className="px-3 py-1 bg-amber-500 text-black text-xs font-bold rounded-xl cursor-pointer">
                Save
              </button>
            </form>

            <div className="space-y-2 overflow-y-auto max-h-80">
              {notes.map((note, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs flex items-center justify-between text-gray-200">
                  <span>{note}</span>
                  <button
                    onClick={() => setNotes((prev) => prev.filter((_, i) => i !== idx))}
                    className="text-gray-500 hover:text-red-400 ml-2"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Floating Input Bar Matching Screenshot */}
      <form onSubmit={handleSubmit} className="pt-2">
        {/* Subtle red indicator dot on bottom right matching screenshot */}
        <div className="flex justify-end pr-2 pb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff2238] shadow-[0_0_6px_#ff2238]" />
        </div>

        <div className="relative flex items-center bg-[#140609] border border-white/15 rounded-2xl px-3.5 py-2.5 text-xs font-rajdhani focus-within:border-[#ff2238] transition-all shadow-inner">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isListening ? 'Listening to voice...' : 'Type to Assistant (Gemini Live)...'}
            className="flex-1 bg-transparent text-gray-100 placeholder-gray-500 focus:outline-none text-xs"
          />

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            className="hidden"
          />

          <div className="flex items-center gap-2.5 text-gray-500 ml-2">
            {/* Paperclip attachment icon */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Attach Document or Image"
              className="hover:text-white cursor-pointer"
            >
              <Paperclip className="w-3.5 h-3.5" />
            </button>
            {/* Mic trigger */}
            <button
              type="button"
              onClick={onToggleMic}
              title={isListening ? 'Stop Listening' : 'Speak'}
              className={`hover:text-white cursor-pointer ${isListening ? 'text-amber-400' : ''}`}
            >
              <Mic className="w-3.5 h-3.5" />
            </button>
            {/* Circular upward arrow send button */}
            <button
              type="submit"
              disabled={!inputText.trim() || isProcessing}
              className="w-6 h-6 rounded-lg bg-white/15 text-white flex items-center justify-center hover:bg-white/25 disabled:opacity-30 cursor-pointer transition-colors"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </form>

      {/* Conversation History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-80 rounded-2xl border border-[#ff2238] bg-[#0c0407] p-4 text-xs font-rajdhani space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-orbitron font-bold text-white text-sm">CHAT SESSIONS</span>
              <button onClick={() => setShowHistoryModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-1.5 max-h-60 overflow-y-auto font-code text-[11px]">
              <div className="p-2 rounded bg-white/5 border border-white/10 text-cyan-300">
                Session 1 (Active): {messages.length} messages
              </div>
              <div className="p-2 rounded bg-white/5 border border-white/5 text-gray-400">
                Session Archive: System Health Pass
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
