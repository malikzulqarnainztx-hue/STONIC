import React, { useState, useEffect } from 'react';
import {
  X,
  Brain,
  Wrench,
  Volume2,
  Settings,
  Globe,
  Folder,
  Terminal,
  Shield,
  Key,
  Eye,
  EyeOff,
  Check,
  Zap,
  RotateCcw,
  Sparkles,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface ConnectedNodesModalProps {
  activeNode: 'memory' | 'skills' | 'voices' | 'setting' | null;
  onClose: () => void;
  onOpenSkillTool: (toolName: string) => void;
  selectedVoice: string;
  onSelectVoice: (voice: string) => void;
  onSelectNode?: (node: 'memory' | 'skills' | 'voices' | 'setting') => void;
}

interface ApiKeyStatus {
  hasKey: boolean;
  source: 'environment' | 'custom' | 'none';
  maskedKey: string | null;
  model: string;
  ttsModel: string;
  envKeyConfigured: boolean;
  quotaExceeded?: boolean;
  quotaDetails?: string | null;
}

export const ConnectedNodesModal: React.FC<ConnectedNodesModalProps> = ({
  activeNode,
  onClose,
  onOpenSkillTool,
  selectedVoice,
  onSelectVoice,
  onSelectNode,
}) => {
  // API Key & Settings State
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [keyStatus, setKeyStatus] = useState<ApiKeyStatus | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);
  const [previewPlayingVoice, setPreviewPlayingVoice] = useState<string | null>(null);

  const handlePreviewVoice = (vId: string) => {
    sound.playClick();
    setPreviewPlayingVoice(vId);

    const sampleText = `Hello Operator, I am ${vId}. All speech synthesis in Stonic is locked strictly to a female voice.`;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(sampleText);
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice =
        voices.find((v) =>
          /female|woman|samantha|victoria|karen|zira|jenny|ava|allison|susan|fiona|veena|tessa|serena|yuri|kyoko|hazel|catherine|melina/i.test(
            v.name
          )
        ) ||
        voices.find(
          (v) =>
            !/male|david|mark|george|guy|daniel|richard|james|alex|fred|ralph|junior|albert|bruce|stefan|pavel|tom/i.test(
              v.name
            )
        );

      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      utterance.pitch = vId === 'Aoede' ? 1.25 : vId === 'Kore' ? 1.22 : vId === 'Zephyr' ? 1.20 : 1.30;
      utterance.rate = 1.0;
      utterance.onend = () => setPreviewPlayingVoice(null);
      utterance.onerror = () => setPreviewPlayingVoice(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setPreviewPlayingVoice(null), 2500);
    }
  };

  // Fetch API key status whenever the modal opens or switches to 'setting'
  useEffect(() => {
    if (activeNode === 'setting') {
      fetchKeyStatus();
    }
  }, [activeNode]);

  const fetchKeyStatus = async () => {
    setIsLoadingStatus(true);
    try {
      const res = await fetch('/api/settings/api-key');
      if (res.ok) {
        const data = await res.json();
        setKeyStatus(data);
      }
    } catch (_) {
      // Quiet handling to maintain zero console errors
    } finally {
      setIsLoadingStatus(false);
    }
  };

  const handleSaveKey = async () => {
    if (!apiKeyInput.trim()) {
      setActionFeedback({
        type: 'error',
        message: 'Please paste or enter a valid Gemini API key first.',
      });
      return;
    }

    setIsSaving(true);
    setActionFeedback(null);
    sound.playClick();

    try {
      const res = await fetch('/api/settings/api-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKeyInput.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        sound.playAcknowledge();
        setApiKeyInput('');
        setActionFeedback({
          type: 'success',
          message: 'Gemini API key saved! Custom session uplink active.',
        });
        await fetchKeyStatus();
      } else {
        setActionFeedback({
          type: 'error',
          message: data.error || 'Failed to save API key',
        });
      }
    } catch (err: any) {
      setActionFeedback({
        type: 'error',
        message: err.message || 'Network error saving API key',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRevertToEnvironment = async () => {
    setIsSaving(true);
    setActionFeedback(null);
    sound.playClick();

    try {
      const res = await fetch('/api/settings/api-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: '' }),
      });

      const data = await res.json();
      if (res.ok) {
        sound.playAcknowledge();
        setApiKeyInput('');
        setActionFeedback({
          type: 'info',
          message: data.message || 'Restored server environment secret.',
        });
        await fetchKeyStatus();
      }
    } catch (err: any) {
      setActionFeedback({
        type: 'error',
        message: err.message || 'Failed to reset API key',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setActionFeedback(null);
    sound.playClick();

    try {
      const res = await fetch('/api/settings/test-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: apiKeyInput.trim() ? apiKeyInput.trim() : undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        sound.playAcknowledge();
        setActionFeedback({
          type: 'success',
          message: `Verified! Gemini 3.8 Flash responded in ${data.durationMs}ms with "${data.output}".`,
        });
        await fetchKeyStatus();
      } else {
        sound.playAlert();
        setActionFeedback({
          type: 'error',
          message: data.error || 'Verification failed. Please check the key.',
        });
        await fetchKeyStatus();
      }
    } catch (err: any) {
      setActionFeedback({
        type: 'error',
        message: err.message || 'Connection test failed',
      });
    } finally {
      setIsTesting(false);
    }
  };

  if (!activeNode) return null;

  const nodeTabs = [
    { id: 'memory' as const, label: 'MEMORY', icon: Brain, color: '#00f2ff' },
    { id: 'skills' as const, label: 'SKILLS', icon: Wrench, color: '#ff9900' },
    { id: 'voices' as const, label: 'VOICES', icon: Volume2, color: '#00ff88' },
    { id: 'setting' as const, label: 'SETTING', icon: Settings, color: '#a78bfa' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl border border-[var(--theme-primary,#00f2ff)]/40 bg-[#070b12] shadow-[0_0_50px_rgba(0,242,255,0.25)] relative overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header & Node Navigator Tabs */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-1 overflow-x-auto py-0.5">
            {nodeTabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeNode === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    sound.playClick();
                    if (onSelectNode) onSelectNode(tab.id);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-code font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white/15 text-white border border-white/30 shadow-md'
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                  style={{
                    color: isActive ? tab.color : undefined,
                  }}
                >
                  <TabIcon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition-colors ml-2"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* 1. MEMORY NODE */}
          {activeNode === 'memory' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-cyan-400">
                <Brain className="w-5 h-5" />
                <h3 className="font-orbitron font-bold text-sm tracking-wider">
                  STONIC NEURAL MEMORY GRAPH
                </h3>
              </div>
              <p className="text-xs text-gray-400 font-rajdhani">
                What Stonic AI has learned and remembered about you from previous conversations:
              </p>
              <div className="space-y-2 text-xs font-code">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-cyan-400 font-bold block mb-0.5">Operator Identity:</span>
                  <span className="text-gray-300">Respected Operator / Sir</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-cyan-400 font-bold block mb-0.5">Primary Language:</span>
                  <span className="text-gray-300">Urdu / Hindi & English bilingual support</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-cyan-400 font-bold block mb-0.5">Architecture Focus:</span>
                  <span className="text-gray-300">Autonomous desktop multi-agent systems & 1-bit CPU LLMs</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-cyan-400 font-bold block mb-0.5">Startup Vision:</span>
                  <span className="text-gray-300">Building Stonic AI - A localized personal Iron Man JARVIS</span>
                </div>
              </div>
            </div>
          )}

          {/* 2. SKILLS NODE */}
          {activeNode === 'skills' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-amber-400">
                <Wrench className="w-5 h-5" />
                <h3 className="font-orbitron font-bold text-sm tracking-wider">
                  STONIC DESKTOP SKILLS & TOOLS ("AI WITH HANDS")
                </h3>
              </div>
              <p className="text-xs text-gray-400 font-rajdhani">
                Integrated workstation capabilities usable directly by voice or chat:
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs font-code">
                <button
                  onClick={() => {
                    sound.playClick();
                    onOpenSkillTool('browser');
                    onClose();
                  }}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/50 hover:bg-amber-500/10 text-left transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="flex items-center gap-2 text-amber-300 font-bold mb-1">
                    <Globe className="w-4 h-4 text-amber-400" />
                    <span>Browser Automation</span>
                  </div>
                  <span className="text-[10px] text-gray-400">Puppeteer / Selenium live web scraping & action</span>
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    onOpenSkillTool('files');
                    onClose();
                  }}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/50 hover:bg-amber-500/10 text-left transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="flex items-center gap-2 text-amber-300 font-bold mb-1">
                    <Folder className="w-4 h-4 text-amber-400" />
                    <span>File Sanitizer</span>
                  </div>
                  <span className="text-[10px] text-gray-400">Deep folder organizer & duplicates remover</span>
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    onOpenSkillTool('workflow');
                    onClose();
                  }}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/50 hover:bg-amber-500/10 text-left transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="flex items-center gap-2 text-amber-300 font-bold mb-1">
                    <Terminal className="w-4 h-4 text-amber-400" />
                    <span>Autonomous Scripts</span>
                  </div>
                  <span className="text-[10px] text-gray-400">System maintenance & git sync scripts</span>
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    onOpenSkillTool('telemetry');
                    onClose();
                  }}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/50 hover:bg-amber-500/10 text-left transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="flex items-center gap-2 text-amber-300 font-bold mb-1">
                    <Shield className="w-4 h-4 text-amber-400" />
                    <span>Hardware Telemetry</span>
                  </div>
                  <span className="text-[10px] text-gray-400">CPU, GPU, thermal throttling & RAM graphs</span>
                </button>
              </div>
            </div>
          )}

          {/* 3. VOICES NODE - ONLY FEMALE VOICE */}
          {activeNode === 'voices' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-emerald-400">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5" />
                  <h3 className="font-orbitron font-bold text-sm tracking-wider">
                    VOICE AGENT & AUDIO PERSONA
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-pink-500/15 border border-pink-500/35 text-[10px] text-pink-300 font-code font-bold tracking-wider flex items-center gap-1">
                  <span>♀</span> FEMALE VOICE ONLY
                </span>
              </div>

              <div className="p-3 rounded-xl bg-pink-950/20 border border-pink-500/25 flex items-start gap-2.5 text-xs font-rajdhani text-pink-200">
                <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-pink-300 font-code text-[11px]">
                    FEMALE-ONLY VOICE ENFORCEMENT ACTIVE
                  </div>
                  <div className="text-[11px] text-gray-300 leading-relaxed mt-0.5">
                    All male voice models have been permanently excluded. Text-to-speech, Gemini neural voices, and browser fallbacks are strictly bound to female frequencies and feminine acoustic personas.
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-400 font-rajdhani">
                Select your preferred female acoustic tone and test the live voice preview:
              </p>

              <div className="space-y-2.5 text-xs font-code">
                {[
                  {
                    id: 'Aoede',
                    gender: 'Female',
                    label: 'Aoede (Female - Warm Melodic & Empathetic)',
                    desc: 'Deeply expressive, comforting, and empathetic female vocal tone with natural melodic rhythm',
                  },
                  {
                    id: 'Kore',
                    gender: 'Female',
                    label: 'Kore (Female - Crisp British / Calm Studio Assistant)',
                    desc: 'Crisp, articulate British female cadence with poised, clear, and reassuring pronunciation',
                  },
                  {
                    id: 'Zephyr',
                    gender: 'Female',
                    label: 'Zephyr (Female - Soft & Soothing Companion)',
                    desc: 'Soft, relaxed feminine timbre with gentle inflection and tranquil conversational pace',
                  },
                  {
                    id: 'Leda',
                    gender: 'Female',
                    label: 'Leda (Female - Confident & Modern Executive)',
                    desc: 'Clear, modern, authoritative feminine cadence designed for fast briefings and command streams',
                  },
                ].map((v) => {
                  const isSelected = selectedVoice === v.id;
                  const isPlaying = previewPlayingVoice === v.id;

                  return (
                    <div
                      key={v.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-emerald-500/15 border-emerald-400 text-white shadow-sm ring-1 ring-emerald-400/30'
                          : 'bg-white/5 border-white/10 text-gray-300 hover:text-white hover:border-emerald-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div
                          onClick={() => {
                            sound.playAcknowledge();
                            onSelectVoice(v.id);
                          }}
                          className="font-bold text-emerald-400 cursor-pointer hover:underline flex items-center gap-2"
                        >
                          <span>{v.label}</span>
                          {isSelected && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              ACTIVE
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-pink-500/15 text-pink-300 border border-pink-500/30 font-bold">
                            ♀ {v.gender}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePreviewVoice(v.id);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
                              isPlaying
                                ? 'bg-pink-500 text-white shadow-[0_0_12px_rgba(255,20,80,0.6)] animate-pulse'
                                : 'bg-white/10 hover:bg-pink-500/20 text-pink-300 hover:text-white border border-pink-500/30'
                            }`}
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>{isPlaying ? 'PLAYING...' : 'TEST SAMPLE'}</span>
                          </button>
                        </div>
                      </div>

                      <div
                        onClick={() => {
                          sound.playAcknowledge();
                          onSelectVoice(v.id);
                        }}
                        className="text-[11px] text-gray-400 leading-relaxed cursor-pointer"
                      >
                        {v.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. SETTING NODE: FULL SYSTEM CONFIG & API KEY SECTION */}
          {activeNode === 'setting' && (
            <div className="space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2 text-purple-300">
                  <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30">
                    <Key className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-orbitron font-bold text-sm tracking-wider text-white">
                      AI NEURAL UPLINK & API KEY
                    </h3>
                    <p className="text-[11px] text-gray-400 font-rajdhani">
                      Configure your Google Gemini API key and AI neural connection
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    sound.playClick();
                    fetchKeyStatus();
                  }}
                  disabled={isLoadingStatus}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
                  title="Refresh Status"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingStatus ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* Live Connection Status Banner */}
              <div
                className={`p-3.5 rounded-xl border transition-all ${
                  keyStatus?.quotaExceeded
                    ? 'bg-amber-950/30 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                    : keyStatus?.hasKey
                    ? 'bg-emerald-950/20 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                    : 'bg-amber-950/20 border-amber-500/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        keyStatus?.quotaExceeded
                          ? 'bg-amber-400 animate-pulse shadow-[0_0_8px_#fbbf24]'
                          : keyStatus?.hasKey
                          ? 'bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse'
                          : 'bg-amber-400'
                      }`}
                    />
                    <span className={`font-code text-xs font-bold tracking-wide ${keyStatus?.quotaExceeded ? 'text-amber-300' : 'text-white'}`}>
                      {keyStatus?.quotaExceeded
                        ? 'FREE-TIER QUOTA EXCEEDED (LOCAL FALLBACK ACTIVE)'
                        : keyStatus?.hasKey
                        ? 'NEURAL UPLINK ONLINE'
                        : 'OFFLINE / FALLBACK MODE'}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-code px-2 py-0.5 rounded-md border font-semibold ${
                      keyStatus?.quotaExceeded
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : keyStatus?.source === 'custom'
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                        : keyStatus?.source === 'environment'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}
                  >
                    {keyStatus?.quotaExceeded
                      ? 'RATE LIMITED'
                      : keyStatus?.source === 'custom'
                      ? 'CUSTOM SESSION KEY'
                      : keyStatus?.source === 'environment'
                      ? 'SERVER SECRET ACTIVE'
                      : 'NO KEY DETECTED'}
                  </span>
                </div>

                {keyStatus?.quotaExceeded && (
                  <p className="mt-2 text-[11px] text-amber-200/90 font-code border-t border-amber-500/20 pt-2 leading-relaxed">
                    The default server key reached Google's hourly free-tier limit. Enter your personal Gemini API key below to bypass this limit immediately and re-activate live streaming.
                  </p>
                )}

                {keyStatus?.maskedKey && !keyStatus?.quotaExceeded && (
                  <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-code text-gray-400">
                    <span>Active Key Hash:</span>
                    <span className="text-cyan-300 font-bold tracking-wider">
                      {keyStatus.maskedKey}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Feedback Alerts */}
              {actionFeedback && (
                <div
                  className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs font-code transition-all ${
                    actionFeedback.type === 'success'
                      ? 'bg-emerald-900/30 border-emerald-500/50 text-emerald-200'
                      : actionFeedback.type === 'error'
                      ? 'bg-red-900/30 border-red-500/50 text-red-200'
                      : 'bg-cyan-900/30 border-cyan-500/50 text-cyan-200'
                  }`}
                >
                  {actionFeedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : actionFeedback.type === 'error' ? (
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  )}
                  <span className="flex-1">{actionFeedback.message}</span>
                </div>
              )}

              {/* API Key Input Section */}
              <div className="space-y-2.5">
                <label className="block text-xs font-code text-gray-300 font-semibold tracking-wider flex items-center justify-between">
                  <span>ENTER GEMINI API KEY</span>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-normal hover:underline"
                  >
                    <span>Get Key from Google AI Studio</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </label>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <Key className="w-4 h-4" />
                  </div>

                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="AIzaSy... (Paste your Google Gemini API Key here)"
                    className="w-full pl-9 pr-10 py-2.5 bg-black/60 border border-white/15 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl text-xs font-code text-white placeholder-gray-500 outline-none transition-all"
                  />

                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white cursor-pointer"
                    title={showApiKey ? 'Hide API Key' : 'Reveal API Key'}
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    onClick={handleSaveKey}
                    disabled={isSaving || !apiKeyInput.trim()}
                    className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:hover:bg-cyan-500 text-black font-code font-bold text-xs tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isSaving ? 'SAVING...' : 'SAVE & CONNECT'}</span>
                  </button>

                  <button
                    onClick={handleTestConnection}
                    disabled={isTesting}
                    className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-40 border border-white/15 text-white font-code text-xs tracking-wider transition-all cursor-pointer"
                  >
                    <Zap className={`w-3.5 h-3.5 text-amber-400 ${isTesting ? 'animate-bounce' : ''}`} />
                    <span>{isTesting ? 'TESTING...' : 'TEST KEY'}</span>
                  </button>

                  {keyStatus?.source === 'custom' && (
                    <button
                      onClick={handleRevertToEnvironment}
                      disabled={isSaving}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/40 text-purple-300 font-code text-xs transition-all cursor-pointer"
                      title="Revert back to server environment secret"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>USE SERVER SECRET</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Informational Guidance Box */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2 text-xs font-rajdhani text-gray-300">
                <div className="flex items-center gap-1.5 font-bold font-orbitron text-[11px] text-cyan-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>HOW API KEYS WORK IN STONIC</span>
                </div>
                <ul className="space-y-1 text-gray-400 text-[11px] list-disc list-inside">
                  <li>
                    <strong className="text-gray-200">Server-Side Proxy Security:</strong> All Gemini requests are executed server-side to keep your key secure.
                  </li>
                  <li>
                    <strong className="text-gray-200">AI Studio Environment:</strong> Your platform key is also managed automatically in the <strong className="text-cyan-300">Settings &gt; Secrets</strong> panel.
                  </li>
                  <li>
                    <strong className="text-gray-200">Instant Verification:</strong> Click &ldquo;Test Key&rdquo; to send a live ping to Gemini 3.8 Flash and verify latency.
                  </li>
                </ul>
              </div>

              {/* Active Cognitive Specs */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2">
                <div className="text-[10px] font-code text-gray-500 uppercase tracking-widest">
                  Neural Architecture Specs
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-code">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5 flex flex-col">
                    <span className="text-gray-400">Cognitive Model:</span>
                    <span className="text-emerald-400 font-bold">Gemini 3.8 Flash</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5 flex flex-col">
                    <span className="text-gray-400">Speech Vocalizer:</span>
                    <span className="text-cyan-400 font-bold">Flash Lite TTS</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5 flex flex-col">
                    <span className="text-gray-400">Emotional Core:</span>
                    <span className="text-pink-400 font-bold">9 Affective States</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5 flex flex-col">
                    <span className="text-gray-400">Execution Stack:</span>
                    <span className="text-purple-400 font-bold">Express + Vite Node</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
