/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { LeftFeedColumn } from './components/LeftFeedColumn';
import { ThinkingCore } from './components/ThinkingCore';
import { AgentTownRPG, AgentDirectiveInput } from './components/AgentTownRPG';
import { VoiceAgentNotesPanel } from './components/VoiceAgentNotesPanel';
import { ConnectedNodesModal } from './components/ConnectedNodesModal';
import { BrowserAutomator } from './components/BrowserAutomator';
import { FileManagerSim } from './components/FileManagerSim';
import { TelemetryHUD } from './components/TelemetryHUD';
import { WorkflowAutomation } from './components/WorkflowAutomation';
import { StoryModal } from './components/StoryModal';
import { MobileRemoteModal } from './components/MobileRemoteModal';
import { ChatMessage, SystemTelemetry, EmotionState } from './types';
import { sound } from './utils/soundEffects';
import {
  Volume2,
  VolumeX,
  Smartphone,
  Play,
  Maximize2,
  Shield,
  Radio,
  Sliders,
  Sparkles,
  Heart,
  Settings,
  Key,
  AlertCircle,
  Users,
  LayoutGrid,
} from 'lucide-react';

export default function App() {
  // Main view navigation: default to 'dashboard' (3-column workstation matching screenshot)
  const [mainView, setMainView] = useState<'dashboard' | 'agents'>('dashboard');
  const [coreState, setCoreState] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const [isListening, setIsListening] = useState(false);
  const [activeNodeModal, setActiveNodeModal] = useState<'memory' | 'skills' | 'voices' | 'setting' | null>(null);
  const [activeToolModal, setActiveToolModal] = useState<string | null>(null);
  // Strictly female voice (Aoede: Warm & Melodic Female, Kore: Crisp British Female, Zephyr: Soothing Female, Leda: Executive Female)
  const [selectedVoice, setSelectedVoice] = useState('Aoede');
  const [language, setLanguage] = useState<'urdu' | 'english'>('english');
  const [currentSpeakingId, setCurrentSpeakingId] = useState<string | null>(null);

  // Human Emotion & Feelings Core State
  const [currentEmotion, setCurrentEmotion] = useState<EmotionState>({
    feeling: 'inspired',
    mood: 'Warm & Steadfast',
    intensity: 88,
    heartbeatBpm: 78,
    valence: 0.86,
    arousal: 0.60,
    feelingTone: 'Gentle warmth and attentive companionship',
    empathyQuote: "Always here with you, sir—mind, feeling, and subroutines fully aligned.",
  });

  // Workstation controls & branding from video / picture
  const [activeTheme, setActiveTheme] = useState<'crimson-matrix' | 'lime-cyber' | 'arc-cyan' | 'cyber-amber'>('crimson-matrix');
  const [deskHeight, setDeskHeight] = useState(72.5);
  const [clockTime, setClockTime] = useState('11:00:00');
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [isMobileRemoteOpen, setIsMobileRemoteOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const recognitionRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Chat conversation
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [latestAgentDirective, setLatestAgentDirective] = useState<AgentDirectiveInput | null>(null);

  // Telemetry
  const [telemetry, setTelemetry] = useState<SystemTelemetry>({
    cpuUsage: 18,
    cpuTemp: 43,
    ramUsage: 41,
    ramUsedGB: 6.6,
    ramTotalGB: 16.0,
    gpuUsage: 14,
    gpuTemp: 45,
    networkUpKBps: 240,
    networkDownKBps: 1420,
    diskUsage: 38,
    activeProcessesCount: 142,
    protocol0Active: false,
    uptimeSeconds: 9800,
  });

  // Clock ticker matching 11:00 in thumbnail
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setClockTime(
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

  // Preload and prime browser speech synthesis voices for immediate female voice matching
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  // Speech Recognition Web Speech API
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'urdu' ? 'ur-PK' : 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setCoreState('listening');
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        transcript = transcript.trim();
        if (transcript) {
          handleSendMessage(transcript);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        setCoreState((curr) => (curr === 'listening' ? 'idle' : curr));
      };

      recognition.onend = () => {
        setIsListening(false);
        setCoreState((curr) => (curr === 'listening' ? 'idle' : curr));
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  // HUD Toast Notification banner (avoids window.alert)
  const [hudToast, setHudToast] = useState<{ message: string; type?: 'info' | 'warn' | 'error' } | null>(null);

  const showToast = (message: string, type: 'info' | 'warn' | 'error' = 'info') => {
    setHudToast({ message, type });
    setTimeout(() => {
      setHudToast((curr) => (curr?.message === message ? null : curr));
    }, 4500);
  };

  const toggleMic = () => {
    if (!recognitionRef.current) {
      showToast('Speech Recognition is unavailable in this browser environment. You can type commands directly in the prompt!', 'warn');
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
      setIsListening(false);
      setCoreState('idle');
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setCoreState('listening');
        showToast('Microphone active: Speak your command now...', 'info');
      } catch (_) {
        showToast('Microphone access unavailable. Please type your query in the terminal prompt.', 'warn');
      }
    }
  };

  const handleTerminate = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }
    setIsListening(false);
    setCoreState('idle');
    setCurrentSpeakingId(null);
  };

  const speakText = async (text: string, messageId?: string, emotion?: EmotionState) => {
    if (!soundEnabled) return;

    if (messageId) setCurrentSpeakingId(messageId);
    setCoreState('speaking');

    const activeEm = emotion || currentEmotion;

    // Failsafe watchdog timer: ensure speaking state always releases within 4s
    const failsafeWatchdog = setTimeout(() => {
      setCoreState('idle');
      setCurrentSpeakingId(null);
    }, 4000);

    const cleanupSpeaking = () => {
      clearTimeout(failsafeWatchdog);
      setCoreState('idle');
      setCurrentSpeakingId(null);
    };

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: selectedVoice, emotion: activeEm }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.audio) {
          if (audioPlayerRef.current) {
            audioPlayerRef.current.pause();
          }
          const audioBlob = new Audio(`data:${data.mimeType || 'audio/wav'};base64,${data.audio}`);
          audioPlayerRef.current = audioBlob;
          audioBlob.onended = cleanupSpeaking;
          audioBlob.onerror = cleanupSpeaking;
          await audioBlob.play().catch(() => {
            cleanupSpeaking();
          });
          return;
        }
      }
    } catch (_) {}

    if ('speechSynthesis' in window && soundEnabled) {
      try {
        window.speechSynthesis.cancel();
        const clean = text.replace(/[*#_`]/g, '').slice(0, 300);
        const utterance = new SpeechSynthesisUtterance(clean);

        // Strict Female Voice Selection: Filter for female voices in browser speech synthesis
        const voices = window.speechSynthesis.getVoices();
        // Discard any voice with male keywords or identities
        const nonMaleVoices = voices.filter(
          (v) =>
            !/male|david|mark|george|guy|daniel|richard|james|alex|fred|ralph|junior|albert|bruce|stefan|pavel|tom|lee|oliver|william|john|paul|charles|thomas|arthur|edward|henry|harry/i.test(
              v.name
            )
        );

        // Find best matching female voice
        const femaleVoice =
          nonMaleVoices.find((v) =>
            /female|woman|samantha|victoria|karen|zira|jenny|ava|allison|susan|fiona|veena|tessa|serena|yuri|kyoko|moira|hazel|catherine|melina|stephanie|helena|sabina|sin-ji|ting-ting|alice|luciana|paola|monica|amelie|zoe|joana/i.test(
              v.name
            )
          ) ||
          nonMaleVoices.find((v) => v.lang.startsWith('en') || v.lang.startsWith('ur')) ||
          nonMaleVoices[0];

        if (femaleVoice) {
          utterance.voice = femaleVoice;
        }

        // Female pitch baseline (1.22 - 1.35) ensures a distinct, clear feminine vocal tone
        let femalePitch = 1.25;
        let femaleRate = 1.0;

        if (activeEm.feeling === 'empathetic') {
          femalePitch = 1.20;
          femaleRate = 0.95;
        } else if (activeEm.feeling === 'enthusiastic' || activeEm.feeling === 'proud') {
          femalePitch = 1.32;
          femaleRate = 1.06;
        } else if (activeEm.feeling === 'caring') {
          femalePitch = 1.22;
          femaleRate = 0.98;
        } else if (activeEm.feeling === 'curious') {
          femalePitch = 1.28;
          femaleRate = 1.02;
        }

        utterance.pitch = femalePitch;
        utterance.rate = femaleRate;

        utterance.onend = cleanupSpeaking;
        utterance.onerror = cleanupSpeaking;

        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        window.speechSynthesis.speak(utterance);
      } catch (_) {
        cleanupSpeaking();
      }
    } else {
      setTimeout(cleanupSpeaking, 1000);
    }
  };

  const handleSendMessage = async (text: string, skipDirectiveRoute = false) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setCoreState('thinking');

    // Route agent directives directly to Agent Town RPG (only if not originated from within Agent Town)
    if (!skipDirectiveRoute) {
      const lowerText = text.toLowerCase();
      if (lowerText.includes('alex')) {
        setLatestAgentDirective({ target: 'alex', directive: text, timestamp: Date.now() });
      } else if (lowerText.includes('bob')) {
        setLatestAgentDirective({ target: 'bob', directive: text, timestamp: Date.now() });
      } else if (lowerText.includes('stonic') || lowerText.includes('manager') || lowerText.includes('all agent')) {
        setLatestAgentDirective({ target: 'stonic', directive: text, timestamp: Date.now() });
      }
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 14000);

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          message: text,
          activeAgent: 'core',
          systemContext: `Language: ${language}, Voice: ${selectedVoice}, Core: Stonic AI Mark VII, CurrentFeeling: ${currentEmotion.feeling}`,
        }),
      });
      clearTimeout(timeoutId);

      const data = await res.json();
      sound.playAcknowledge();

      const aiMsgId = (Date.now() + 1).toString();
      const aiReplyText = data.reply || (language === 'urdu' ? 'Jee sir, batayein main aapki kya madad kar sakta hoon?' : 'At your service, sir.');

      if (data.emotion) {
        setCurrentEmotion(data.emotion);
      }

      const aiMsg: ChatMessage = {
        id: aiMsgId,
        sender: 'assistant',
        agent: 'core',
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        emotion: data.emotion || currentEmotion,
      };

      setMessages((prev) => [...prev, aiMsg]);
      speakText(aiReplyText, aiMsgId, data.emotion || currentEmotion);
    } catch (_) {
      sound.playAlert();
      setCoreState('idle');
      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        agent: 'core',
        text: 'I felt a momentary signal disturbance, sir, but local neural cores are running steadily. I am right here with you.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        emotion: currentEmotion,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    }
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.enabled = next;
    if (next) sound.playClick();
  };

  const toggleFullscreen = () => {
    sound.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const toggleProtocol0 = () => {
    sound.playAlert();
    setTelemetry((prev) => ({
      ...prev,
      protocol0Active: !prev.protocol0Active,
    }));
  };

  return (
    <div
      data-theme={activeTheme}
      className="w-screen h-screen bg-[#000000] text-gray-100 p-2 sm:p-2.5 overflow-hidden select-none font-rajdhani flex items-center justify-center transition-colors duration-300"
    >
      {/* Outer Border HUD Frame matching picture ditto */}
      <div className="w-full h-full max-w-[1920px] rounded-3xl border border-[#ff2238]/40 p-2 sm:p-2.5 bg-[#000000] shadow-[0_0_40px_rgba(255,34,56,0.2)] flex flex-col justify-between overflow-hidden">
        {/* 3-COLUMN MAIN WORKSPACE GRID MATCHING PICTURE DITTO */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-2.5 items-stretch overflow-hidden min-h-0 h-full">
          {/* COLUMN 1: LEFT FEED (MEDIA LINK, SAT-LINK, TODAY HEADLINES) */}
          <div className="lg:col-span-3 flex flex-col h-full overflow-hidden">
            <LeftFeedColumn
              onSelectHeadline={(headline) => {
                handleSendMessage(`Analyze and brief me on this headline: "${headline}"`);
              }}
            />
          </div>

          {/* COLUMN 2: CENTER (THINKING CORE + AGENT TOWN RPG) */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full gap-2 overflow-hidden">
            {/* Top Half: 4 Connected Nodes + Thinking Core */}
            <div className="stonic-panel p-2 shadow-[0_0_20px_var(--theme-glow-soft)] shrink-0">
              <ThinkingCore
                state={coreState}
                onToggleMic={toggleMic}
                onTerminate={handleTerminate}
                isListening={isListening}
                activeNode={activeNodeModal}
                onSelectNode={(node) => setActiveNodeModal(node)}
                currentEmotion={currentEmotion}
                onSelectFeelingMode={(mode) => {
                  handleSendMessage(`Express your thoughts and feelings in ${mode} mode.`);
                }}
              />
            </div>

            {/* Bottom Half: Agent Town RPG Pixel Art Office */}
            <div id="agent-town-hq" className="flex-1 flex flex-col justify-end overflow-hidden min-h-0 rounded-2xl transition-all duration-300">
              <AgentTownRPG
                incomingDirective={latestAgentDirective}
                onAgentCommand={(agentName, command) => {
                  handleSendMessage(`Directive to ${agentName}: ${command}`, true);
                }}
              />
            </div>
          </div>

          {/* COLUMN 3: RIGHT VOICE / AGENT / NOTES PANEL */}
          <div className="lg:col-span-4 flex flex-col h-full overflow-hidden">
            <VoiceAgentNotesPanel
              messages={messages}
              onSendMessage={handleSendMessage}
              isProcessing={coreState === 'thinking'}
              isListening={isListening}
              onToggleMic={toggleMic}
              onPlayTTS={(text, id, em) => speakText(text, id, em)}
              currentSpeakingId={currentSpeakingId}
              language={language}
              onToggleLanguage={() => setLanguage(language === 'urdu' ? 'english' : 'urdu')}
              onClearMessages={() => {
                sound.playClick();
                setMessages([]);
              }}
              currentEmotion={currentEmotion}
            />
          </div>
        </div>
      </div>

      {/* Modals for Connected Nodes (Memory, Skills, Voices, Setting) */}
      <ConnectedNodesModal
        activeNode={activeNodeModal}
        onClose={() => setActiveNodeModal(null)}
        onOpenSkillTool={(tool) => setActiveToolModal(tool)}
        selectedVoice={selectedVoice}
        onSelectVoice={(v) => setSelectedVoice(v)}
        onSelectNode={(node) => setActiveNodeModal(node)}
      />

      {/* Tool Modal (Browser Automator) */}
      {activeToolModal === 'browser' && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-4xl p-2 relative">
            <button
              onClick={() => setActiveToolModal(null)}
              className="absolute top-4 right-4 z-50 text-white bg-black/80 p-2 rounded-full cursor-pointer hover:bg-red-500"
            >
              ✕
            </button>
            <BrowserAutomator />
          </div>
        </div>
      )}

      {/* Tool Modal (File Sanitizer) */}
      {activeToolModal === 'files' && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-3xl p-2 relative">
            <button
              onClick={() => setActiveToolModal(null)}
              className="absolute top-4 right-4 z-50 text-white bg-black/80 p-2 rounded-full cursor-pointer hover:bg-red-500"
            >
              ✕
            </button>
            <FileManagerSim />
          </div>
        </div>
      )}

      {/* Tool Modal (Autonomous Workflows) */}
      {activeToolModal === 'workflow' && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-3xl p-2 relative">
            <button
              onClick={() => setActiveToolModal(null)}
              className="absolute top-4 right-4 z-50 text-white bg-black/80 p-2 rounded-full cursor-pointer hover:bg-red-500"
            >
              ✕
            </button>
            <WorkflowAutomation
              onWorkflowComplete={(name) => {
                handleSendMessage(`System Workflow "${name}" executed successfully.`);
              }}
            />
          </div>
        </div>
      )}

      {/* Tool Modal (Hardware Telemetry & Protocol 0) */}
      {(activeToolModal === 'telemetry' || activeToolModal === 'lockdown') && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-3xl p-2 relative">
            <button
              onClick={() => setActiveToolModal(null)}
              className="absolute top-4 right-4 z-50 text-white bg-black/80 p-2 rounded-full cursor-pointer hover:bg-red-500"
            >
              ✕
            </button>
            <TelemetryHUD
              telemetry={telemetry}
              onToggleProtocol0={toggleProtocol0}
            />
          </div>
        </div>
      )}

      {/* The Story Behind Stonic AI Modal (with embedded YouTube link https://youtu.be/2tY6ZU-jgF4) */}
      <StoryModal
        isOpen={isStoryModalOpen}
        onClose={() => setIsStoryModalOpen(false)}
      />

      {/* Mobile Remote Companion Simulator */}
      <MobileRemoteModal
        isOpen={isMobileRemoteOpen}
        onClose={() => setIsMobileRemoteOpen(false)}
        onRemoteCommand={(cmd) => handleSendMessage(`[Remote Command]: ${cmd}`)}
      />

      {/* Floating HUD Toast Alert Banner */}
      {hudToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200 pointer-events-none">
          <div
            className={`px-4 py-2.5 rounded-xl border backdrop-blur-md shadow-2xl flex items-center gap-2.5 font-code text-xs max-w-md ${
              hudToast.type === 'error'
                ? 'bg-red-950/90 border-red-500/70 text-red-200 shadow-red-500/20'
                : hudToast.type === 'warn'
                ? 'bg-amber-950/90 border-amber-500/70 text-amber-200 shadow-amber-500/20'
                : 'bg-[#050b14]/95 border-cyan-500/70 text-cyan-200 shadow-cyan-500/20'
            }`}
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>{hudToast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
