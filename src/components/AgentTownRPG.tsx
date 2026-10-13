import React, { useState, useEffect, useRef } from 'react';
import {
  Users,
  RefreshCw,
  MessageSquare,
  List,
  ChevronLeft,
  User,
  Send,
  Cpu,
  Activity,
  ShieldCheck,
  Crown,
  Briefcase,
  CheckCircle2,
  Sparkles,
  Terminal,
  Layout,
  Database,
  ArrowRight,
  Zap,
  Maximize2,
  Minimize2,
  Coffee,
  Shield,
  Layers,
  Sparkle,
  Sliders,
  Check,
  Armchair,
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

export interface AgentCharacter {
  id: string;
  name: string;
  title: string;
  role: string;
  isManager?: boolean;
  color: string;
  dotColor: string;
  deskX: number;
  deskY: number;
  chairX: number;
  chairY: number;
  bubble?: string;
  hairColor: string;
  shirtColor: string;
  task: string;
  feeling?: string;
  domain: string;
  progress: number;
  latestDeliverable: string;
  tools: string[];
  status: 'working_exclusive' | 'working' | 'idle_standby' | 'supervising';
  officeName: string;
}

export interface WorkLogEntry {
  id: string;
  timestamp: string;
  agentName: string;
  action: string;
  tag: 'manager' | 'alex' | 'bob' | 'carol' | 'dave';
  isExclusive?: boolean;
}

export interface AgentDirectiveInput {
  target: 'alex' | 'bob' | 'carol' | 'dave' | 'stonic' | 'all';
  directive: string;
  timestamp: number;
}

interface AgentTownRPGProps {
  onAgentCommand?: (agentName: string, command: string) => void;
  incomingDirective?: AgentDirectiveInput | null;
  isFullView?: boolean;
}

export const AgentTownRPG: React.FC<AgentTownRPGProps> = ({
  onAgentCommand,
  incomingDirective,
  isFullView = false,
}) => {
  const [activeTab, setActiveTab] = useState<'office' | 'management' | 'matrix' | 'work log'>('office');
  const [screenSize, setScreenSize] = useState<'standard' | 'large' | 'cinema'>('standard');
  const [selectedAgent, setSelectedAgent] = useState<string>('Alex');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [activeModel, setActiveModel] = useState('Gemini 3.1 Flash Lite');
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<AgentCharacter | null>(null);
  const [isTypingTick, setIsTypingTick] = useState(0);

  // Exclusive worker state: when active, ONLY this agent works, none other!
  const [exclusiveWorker, setExclusiveWorker] = useState<string | null>('alex');
  const [exclusiveDirective, setExclusiveDirective] = useState<string>(
    "Alex's Exclusive Directive: Crafting reactive glassmorphic UI components & canvas shaders"
  );

  // Management Team: Stonic is Manager, Alex in private executive office (bottom-left), Bob in tech lab (bottom-right), Meeting room with chalkboard (top-center)
  const [agents, setAgents] = useState<AgentCharacter[]>([
    {
      id: 'stonic',
      name: 'Stonic',
      title: 'Executive AI Manager',
      role: 'General Manager of All Agents',
      isManager: true,
      color: '#fed7aa',
      dotColor: '#eab308',
      deskX: 380,
      deskY: 100,
      chairX: 380,
      chairY: 68,
      bubble: 'Manager Stonic: Supervising all agents at Meeting Chalkboard. Alex & Bob do distinct work 👑',
      hairColor: '#f59e0b',
      shirtColor: '#ca8a04',
      task: 'Executive Oversight: Delegating specialized tasks at Meeting Chalkboard, approving deliverables',
      feeling: 'Proud 👑 (Leading management team with precision)',
      domain: 'Executive Direction, Sprint Delegation, Quality Approvals',
      progress: 100,
      latestDeliverable: 'Executive Sprint Plan: 4 Specialized Non-Overlapping Workflows Synchronized',
      tools: ['Executive Neural Core', 'Multi-Agent Mesh Orchestrator', 'Roadmap KPI Radar'],
      status: 'supervising',
      officeName: 'Meeting Room & Executive Chalkboard (Center)',
    },
    {
      id: 'alex',
      name: 'Alice',
      title: 'Lead Frontend & Product Architect',
      role: 'Lead UI/UX Engineer',
      isManager: false,
      color: '#fed7aa',
      dotColor: '#00f2ff',
      deskX: 165,
      deskY: 330,
      chairX: 165,
      chairY: 360,
      bubble: "Alex: In my private office! Only I work on UI shaders & layout ✨",
      hairColor: '#854d0e',
      shirtColor: '#0284c7',
      task: "Alex's Work: Reactive UI layouts, canvas shaders, glassmorphic Tailwind themes & HUD interactions",
      feeling: 'Inspired ✨ (Alex crafted in his private office)',
      domain: "Alex's Work: Frontend, UI/UX, Design Tokens, Visual HUD, Canvas Shaders",
      progress: 88,
      latestDeliverable: 'Alex Private Studio: Holographic Glassmorphic HUD v4.2 Component Pack',
      tools: ['React 18', 'Tailwind CSS', 'HTML5 Canvas', 'Framer Motion', 'Figma Wireframes'],
      status: 'working_exclusive',
      officeName: "Alex's Private Executive Office (Bottom-Left)",
    },
    {
      id: 'bob',
      name: 'Bob',
      title: 'Lead Systems & DevOps Daemon',
      role: 'Lead Systems Daemon',
      isManager: false,
      color: '#fed7aa',
      dotColor: '#fb923c',
      deskX: 550,
      deskY: 330,
      chairX: 550,
      chairY: 360,
      bubble: 'Bob: Sitting in Tech Lab. Standing down while Alex works 🍃',
      hairColor: '#78350f',
      shirtColor: '#ea580c',
      task: "Bob's Work: Linux daemons, memory heap sweep, socket load testing & backend proxy routing",
      feeling: 'Attentive ⚙️ (Standing by at server console)',
      domain: "Bob's Work: Systems, Linux Daemons, Memory Heap, Sockets, Infrastructure",
      progress: 82,
      latestDeliverable: 'Zero-Memory-Leak Express Daemon & Socket Interceptor',
      tools: ['Express Sockets', 'Linux Process Daemon', 'Node GC Watchdog', 'V8 Heap Profiler'],
      status: 'idle_standby',
      officeName: "Bob's Systems & Tech Lab (Bottom-Right)",
    },
    {
      id: 'carol',
      name: 'Carol',
      title: 'AI Research & Intelligence Specialist',
      role: 'Deep Intel Specialist',
      isManager: false,
      color: '#fed7aa',
      dotColor: '#f472b6',
      deskX: 135,
      deskY: 125,
      chairX: 135,
      chairY: 145,
      bubble: 'Carol: Reading arXiv papers at my desk 📚',
      hairColor: '#b45309',
      shirtColor: '#db2777',
      task: "Carol's Work: arXiv paper synthesis, 1-bit BitNet CPU quantization & neural graph embeddings",
      feeling: 'Fascinated 💡 (Absorbing neural architectures)',
      domain: "Carol's Work: arXiv Papers, Neural Benchmarks, Research Digests",
      progress: 68,
      latestDeliverable: 'BitNet 1.58b 1-Bit CPU Quantization Architecture Digest',
      tools: ['arXiv Feed Scanner', 'Semantic Graph Parser', 'BibTeX Compiler'],
      status: 'idle_standby',
      officeName: "Carol's AI Research Alcove (Top-Left)",
    },
    {
      id: 'dave',
      name: 'Dave',
      title: 'Cyber Sentinel & QA Security Guard',
      role: 'Security Sentinel',
      isManager: false,
      color: '#fed7aa',
      dotColor: '#34d399',
      deskX: 625,
      deskY: 125,
      chairX: 625,
      chairY: 145,
      bubble: 'Dave: Sentinel radar active. Standing by 🛡️',
      hairColor: '#475569',
      shirtColor: '#059669',
      task: "Dave's Work: Monitoring active ingress sockets, Protocol 0 firewall, AST code inspection",
      feeling: 'Vigilant 🛡️ (Guarding perimeter from defense desk)',
      domain: "Dave's Work: Protocol 0, Firewall Sweep, Penetration Testing, QA Audits",
      progress: 96,
      latestDeliverable: 'Perimeter Integrity Certificate: 0 Intrusions / 100% Port Health',
      tools: ['Protocol 0 Kernel Lock', 'AST Static Analyzer', 'Port 3000 Sentinel'],
      status: 'idle_standby',
      officeName: "Dave's Cyber Sentinel Post (Top-Right)",
    },
  ]);

  const [workLogs, setWorkLogs] = useState<WorkLogEntry[]>([
    {
      id: '1',
      timestamp: '12:00:05',
      agentName: 'Stonic (Manager)',
      action: 'Executive Standup: Stonic initialized multi-agent governance. Assigned Alex exclusive UI focus.',
      tag: 'manager',
    },
    {
      id: '2',
      timestamp: '12:01:18',
      agentName: 'Alex',
      action: "Alex's Work (Exclusive): Seated in Private Office, compiled holographic glassmorphic shaders.",
      tag: 'alex',
      isExclusive: true,
    },
    {
      id: '3',
      timestamp: '12:02:40',
      agentName: 'Bob',
      action: "Bob's Work: Standing by at workstation, verified zero-latency daemon sockets.",
      tag: 'bob',
    },
    {
      id: '4',
      timestamp: '12:03:55',
      agentName: 'Carol',
      action: "Carol's Work: Seated at research desk, indexed BitNet 1.58b CPU model embeddings.",
      tag: 'carol',
    },
    {
      id: '5',
      timestamp: '12:04:12',
      agentName: 'Dave',
      action: "Dave's Work: Sentinel perimeter verified at defense desk; Protocol 0 active.",
      tag: 'dave',
    },
  ]);

  // Typing animation ticker for agents sitting at their chairs
  useEffect(() => {
    const timer = setInterval(() => {
      setIsTypingTick((prev) => (prev + 1) % 4);
    }, 450);
    return () => clearInterval(timer);
  }, []);

  const lastProcessedDirectiveTs = useRef<number | null>(null);

  // Listen to incoming external directives (from speech or chat)
  useEffect(() => {
    if (!incomingDirective || !incomingDirective.directive) return;
    // Prevent duplicate processing of the exact same directive timestamp
    if (incomingDirective.timestamp && incomingDirective.timestamp === lastProcessedDirectiveTs.current) {
      return;
    }
    lastProcessedDirectiveTs.current = incomingDirective.timestamp || Date.now();
    const msg = incomingDirective.directive.toLowerCase();

    // Never echo incoming external directives back out to parent chat to prevent infinite update loop
    if (incomingDirective.target === 'alex' || msg.includes('alex')) {
      handleAlexOnlyWork(incomingDirective.directive, false);
    } else if (incomingDirective.target === 'bob' || msg.includes('bob')) {
      handleBobOnlyWork(incomingDirective.directive, false);
    } else if (incomingDirective.target === 'stonic' || msg.includes('stonic') || msg.includes('all agent') || msg.includes('manager')) {
      handleStonicCoordinateAll(false);
    }
  }, [incomingDirective]);

  // HANDLER: "ALEX DO THIS" -> ONLY ALEX WORKS, NOT ANY OTHER!
  const handleAlexOnlyWork = (customTask?: string, notifyExternal = false) => {
    sound.playSuccess();
    const tasks = [
      customTask || "Alex's Work: Rendered responsive HUD glassmorphic borders with GPU acceleration",
      "Alex's Work: Designed new glassmorphic HUD panel shaders & custom desktop window frames",
      "Alex's Work: Refactored mobile remote drawer with zero layout shifts and smooth physics",
      "Alex's Work: Built interactive Standing Desk height slider & tactile preset buttons",
    ];
    const task = customTask || tasks[Math.floor(Math.random() * tasks.length)];

    setExclusiveWorker('alex');
    setExclusiveDirective(task);

    setAgents((prev) =>
      prev.map((ag) => {
        if (ag.id === 'alex') {
          const nextProg = Math.min(100, ag.progress >= 95 ? 45 : ag.progress + 15);
          return {
            ...ag,
            status: 'working_exclusive',
            progress: nextProg,
            bubble: 'Alex: On it! Only I am working on this in my private office ✨',
            task,
            latestDeliverable: `${task.replace("Alex's Work: ", '')} (Delivered by Alex)`,
            feeling: 'In The Zone 🚀 (Sole focused worker)',
          };
        }
        if (ag.id === 'bob') {
          return {
            ...ag,
            status: 'idle_standby',
            bubble: 'Bob: Standing by at desk. Alex is working exclusively ☕',
            feeling: 'Relaxed ☕ (Standing down)',
          };
        }
        if (ag.id === 'carol') {
          return {
            ...ag,
            status: 'idle_standby',
            bubble: 'Carol: Standing by at desk. Alex has sole focus 📖',
          };
        }
        if (ag.id === 'dave') {
          return {
            ...ag,
            status: 'idle_standby',
            bubble: 'Dave: Perimeter secure. Alex executing exclusively 🛡️',
          };
        }
        if (ag.id === 'stonic') {
          return {
            ...ag,
            bubble: 'Manager Stonic: Approved! Only Alex is working, all other agents stand down 👑',
          };
        }
        return ag;
      })
    );

    const newLog: WorkLogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      agentName: 'Alex (Exclusive)',
      action: `[EXCLUSIVE DIRECTIVE]: ${task}. Bob, Carol, and Dave standing down at desks.`,
      tag: 'alex',
      isExclusive: true,
    };
    setWorkLogs((prev) => [newLog, ...prev.slice(0, 19)]);

    if (notifyExternal && onAgentCommand) {
      onAgentCommand('Alex', `Alex execute exclusively in private office: ${task}`);
    }
  };

  // HANDLER: "BOB DO THIS" -> ONLY BOB WORKS, NOT ANY OTHER!
  const handleBobOnlyWork = (customTask?: string, notifyExternal = false) => {
    sound.playSuccess();
    const tasks = [
      customTask || "Bob's Work: Optimized Linux daemon threads and purged garbage collection heap",
      "Bob's Work: Benchmarked WebSocket fallback proxy with sub-1ms round-trip",
      "Bob's Work: Indexed local memory vault graph into high-speed binary hash table",
      "Bob's Work: Tuned Express middle-layer sockets with zero connection drops",
    ];
    const task = customTask || tasks[Math.floor(Math.random() * tasks.length)];

    setExclusiveWorker('bob');
    setExclusiveDirective(task);

    setAgents((prev) =>
      prev.map((ag) => {
        if (ag.id === 'bob') {
          const nextProg = Math.min(100, ag.progress >= 95 ? 45 : ag.progress + 15);
          return {
            ...ag,
            status: 'working_exclusive',
            progress: nextProg,
            bubble: 'Bob: On it! Only I am tuning systems and server daemons ⚡',
            task,
            latestDeliverable: `${task.replace("Bob's Work: ", '')} (Delivered by Bob)`,
            feeling: 'Dialed In ⚡ (Sole focused daemon worker)',
          };
        }
        if (ag.id === 'alex') {
          return {
            ...ag,
            status: 'idle_standby',
            bubble: 'Alex: Sitting in private office. Bob is working exclusively ☕',
            feeling: 'Observing 🎨 (Standing down)',
          };
        }
        if (ag.id === 'carol') {
          return {
            ...ag,
            status: 'idle_standby',
            bubble: 'Carol: Standing by at research desk 📖',
          };
        }
        if (ag.id === 'dave') {
          return {
            ...ag,
            status: 'idle_standby',
            bubble: 'Dave: Standing by at defense post 🛡️',
          };
        }
        if (ag.id === 'stonic') {
          return {
            ...ag,
            bubble: 'Manager Stonic: Approved! Only Bob is working, all other agents stand down 👑',
          };
        }
        return ag;
      })
    );

    const newLog: WorkLogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      agentName: 'Bob (Exclusive)',
      action: `[EXCLUSIVE DIRECTIVE]: ${task}. Alex, Carol, and Dave standing down at desks.`,
      tag: 'bob',
      isExclusive: true,
    };
    setWorkLogs((prev) => [newLog, ...prev.slice(0, 19)]);

    if (notifyExternal && onAgentCommand) {
      onAgentCommand('Bob', `Bob execute exclusively in systems lab: ${task}`);
    }
  };

  // HANDLER: "STONIC COORDINATE ALL" -> ALL AGENTS DO DIFFERENT DIFFERENT WORK!
  const handleStonicCoordinateAll = (notifyExternal = false) => {
    sound.playActivate();
    setExclusiveWorker(null);
    setExclusiveDirective('All 4 agents executing distinct, specialized workflows under Manager Stonic');

    setAgents((prev) =>
      prev.map((ag) => {
        if (ag.id === 'stonic') {
          return {
            ...ag,
            status: 'supervising',
            bubble: 'Manager Stonic: Dispatched sprint goals! All agents do different work 👑',
          };
        }
        if (ag.id === 'alex') {
          return {
            ...ag,
            status: 'working',
            progress: Math.min(100, ag.progress + 10),
            bubble: 'Alex: In private office! Doing Alex UI work 🎨',
          };
        }
        if (ag.id === 'bob') {
          return {
            ...ag,
            status: 'working',
            progress: Math.min(100, ag.progress + 10),
            bubble: 'Bob: In systems lab! Doing Bob systems work ⚙️',
          };
        }
        if (ag.id === 'carol') {
          return {
            ...ag,
            status: 'working',
            progress: Math.min(100, ag.progress + 10),
            bubble: 'Carol: In research alcove! Doing Carol paper intel 📚',
          };
        }
        if (ag.id === 'dave') {
          return {
            ...ag,
            status: 'working',
            progress: Math.min(100, ag.progress + 10),
            bubble: 'Dave: At defense post! Doing Dave security sweep 🛡️',
          };
        }
        return ag;
      })
    );

    const newLog: WorkLogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      agentName: 'Stonic (Manager)',
      action: 'Manager Stonic coordinated full team: Alex does UI, Bob does Systems, Carol does Research, Dave does Defense.',
      tag: 'manager',
    };
    setWorkLogs((prev) => [newLog, ...prev.slice(0, 19)]);

    if (notifyExternal && onAgentCommand) {
      onAgentCommand('Stonic', 'Manager Stonic dispatch all agents to their distinct, different work');
    }
  };

  const handleSendCustomDirective = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const input = chatInput.trim();

    if (selectedAgent.toLowerCase() === 'alex' || input.toLowerCase().includes('alex')) {
      handleAlexOnlyWork(input);
    } else if (selectedAgent.toLowerCase() === 'bob' || input.toLowerCase().includes('bob')) {
      handleBobOnlyWork(input);
    } else {
      sound.playSuccess();
      setAgents((prev) =>
        prev.map((ag) =>
          ag.name.toLowerCase() === selectedAgent.toLowerCase()
            ? { ...ag, bubble: `${ag.name}: ${input.slice(0, 24)}...`, task: input }
            : ag
        )
      );
      if (onAgentCommand) {
        onAgentCommand(selectedAgent, input);
      }
    }

    setChatInput('');
    setIsChatOpen(false);
  };

  // Determine container height based on chosen screen size & whether full-view mode is active
  const canvasHeightClass = isFullView
    ? screenSize === 'standard'
      ? 'h-[490px] sm:h-[540px] lg:h-[600px]'
      : screenSize === 'large'
      ? 'h-[600px] sm:h-[680px]'
      : 'h-[740px] sm:h-[840px]'
    : screenSize === 'standard'
    ? 'h-[300px] sm:h-[330px]'
    : screenSize === 'large'
    ? 'h-[440px] sm:h-[480px]'
    : 'h-[540px] sm:h-[600px]';

  return (
    <div className="w-full h-full stonic-panel p-2.5 flex flex-col justify-between overflow-hidden shadow-[0_0_35px_rgba(255,34,56,0.22)] select-none font-rajdhani transition-all duration-300">
      
      {/* 1. UNIFIED SLEEK SCI-FI HUD HEADER BAR (MATCHING SCREENSHOT) */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10 select-none">
        {/* Left: • AGENT TOWN READY */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#ff2238] shadow-[0_0_8px_#ff2238] animate-pulse" />
          <span className="font-orbitron font-bold text-xs tracking-wider text-[#ff3355]">
            AGENT TOWN
          </span>
          <span className="text-[10px] font-code text-gray-500 uppercase font-semibold">
            READY
          </span>
        </div>

        {/* Center: [ agents ] [ visual hub ] [ gesture ] */}
        <div className="flex items-center p-0.5 rounded-xl bg-black/60 border border-white/10 text-[10px] font-code">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('office');
            }}
            className={`px-3 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === 'office'
                ? 'bg-[#181116] text-white border border-white/20 shadow-inner'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            agents
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('management');
            }}
            className={`px-3 py-0.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'management'
                ? 'bg-[#181116] text-white border border-white/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            visual hub
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('matrix');
            }}
            className={`px-3 py-0.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'matrix'
                ? 'bg-[#181116] text-white border border-white/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            gesture
          </button>
        </div>

        {/* Right: Refresh button */}
        <button
          onClick={() => {
            sound.playClick();
            handleStonicCoordinateAll();
          }}
          title="Synchronize Agent Town"
          className="p-1 rounded-lg border border-white/10 bg-black/40 text-gray-400 hover:text-white cursor-pointer hover:border-white/25 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 1.5 AGENT CARDS ROW MATCHING SCREENSHOT */}
      <div className="flex items-center justify-between py-1.5 border-b border-white/5 select-none gap-2">
        <div className="flex items-center gap-2 overflow-x-auto">
          {agents
            .filter((a) => a.id !== 'stonic')
            .map((ag) => {
              const isSelected = selectedAgent === ag.name || selectedAgent === ag.id;
              return (
                <button
                  key={ag.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedAgent(ag.name);
                    setSelectedProfile(ag);
                    if (ag.id === 'alex') handleAlexOnlyWork();
                    else if (ag.id === 'bob') handleBobOnlyWork();
                  }}
                  className={`px-2.5 py-1 rounded-xl border flex items-center gap-1.5 text-xs font-code cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white/10 border-white/40 text-white shadow-sm'
                      : 'bg-black/60 border-white/10 text-gray-300 hover:border-white/25'
                  }`}
                >
                  <span className="w-4 h-4 rounded-md bg-white/10 flex items-center justify-center text-[10px]">
                    {ag.id === 'alex' ? '👩' : ag.id === 'bob' ? '👨' : ag.id === 'carol' ? '👩' : '👮'}
                  </span>
                  <span className="font-semibold">{ag.name}</span>
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: ag.dotColor }}
                  />
                </button>
              );
            })}
        </div>

        <div className="flex items-center gap-1 text-gray-400 shrink-0">
          <button
            onClick={() => sound.playClick()}
            className="p-1 rounded-lg border border-white/10 hover:text-white bg-black/40 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => sound.playClick()}
            className="p-1 rounded-lg border border-white/10 hover:text-white bg-black/40 cursor-pointer"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => sound.playClick()}
            className="p-1 rounded-lg border border-white/10 hover:text-white bg-black/40 cursor-pointer"
          >
            <User className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. VIEW 1: PIXEL ART OFFICE WITH DESKS, CHAIRS, AND ALEX'S PRIVATE OFFICE */}
      {activeTab === 'office' && (
        <div
          className="relative w-full flex-1 min-h-[220px] rounded-xl bg-[#0f1722] border border-white/10 overflow-hidden my-1 select-none shadow-2xl transition-all duration-300"
        >
          {/* Tactical HUD Directive Ribbon (Floating inside top of canvas) */}
          <div className="absolute top-2 inset-x-2 z-20 pointer-events-none flex items-center justify-between px-3 py-1 bg-black/75 backdrop-blur-md border border-white/10 rounded-lg text-[10px] font-code">
            <div className="flex items-center gap-2 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
              <span className="text-gray-400 shrink-0">HQ STATUS:</span>
              <span className="text-white font-bold truncate">
                {exclusiveWorker === 'alex'
                  ? "Alex is seated in Private Executive Office (Bottom-Left) working exclusively. Other agents standing by."
                  : exclusiveWorker === 'bob'
                  ? "Bob is in Systems Lab (Bottom-Right) working exclusively. Other agents standing by."
                  : "Manager Stonic coordinating 4 specialized workflows at Meeting Chalkboard."}
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-[9px] text-gray-400 shrink-0">
              <span className="text-cyan-300">Click any agent desk to command</span>
            </div>
          </div>
          {/* SVG Canvas for Office Floorplan, Glass Walls, Desks, and Chairs */}
          <svg
            className="w-full h-full"
            viewBox="0 0 760 480"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Floor Tiles Pattern (Clean Dark Tactical Retro UI) */}
              <pattern id="officeTiles" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect width="20" height="20" fill="#151e2b" />
                <path d="M 0 0 L 20 0 L 20 20 L 0 20 Z" fill="none" stroke="#101722" strokeWidth="0.8" />
              </pattern>

              {/* Alex's Private Executive Office Carpet (Deep Cyan Geometric Pattern) */}
              <pattern id="alexCarpet" width="16" height="16" patternUnits="userSpaceOnUse">
                <rect width="16" height="16" fill="#082338" />
                <rect width="8" height="8" fill="#051827" />
                <path d="M 0 0 L 16 16 M 16 0 L 0 16" stroke="#0e3852" strokeWidth="0.5" />
              </pattern>

              {/* Meeting Area Executive Carpet (Royal Slate & Amber) */}
              <pattern id="meetingCarpet" width="18" height="18" patternUnits="userSpaceOnUse">
                <rect width="18" height="18" fill="#1e2230" />
                <rect width="9" height="9" fill="#252a3b" />
                <circle cx="9" cy="9" r="1.5" fill="#ca8a04" opacity="0.6" />
              </pattern>

              {/* Bob's Tech Lab Rubber Studded Flooring */}
              <pattern id="bobFloor" width="14" height="14" patternUnits="userSpaceOnUse">
                <rect width="14" height="14" fill="#1c1917" />
                <circle cx="7" cy="7" r="1.8" fill="#292524" />
                <circle cx="7" cy="7" r="0.8" fill="#44403c" />
              </pattern>

              {/* Carol's Library Carpet Pattern */}
              <pattern id="carolCarpet" width="14" height="14" patternUnits="userSpaceOnUse">
                <rect width="14" height="14" fill="#143126" />
                <rect width="7" height="7" fill="#0d231b" />
                <path d="M 0 0 L 14 14" stroke="#064e3b" strokeWidth="0.5" />
              </pattern>

              {/* Dave's Carbon Fiber Armor Pattern */}
              <pattern id="daveCarbon" width="12" height="12" patternUnits="userSpaceOnUse">
                <rect width="12" height="12" fill="#111827" />
                <rect width="6" height="6" fill="#1f2937" />
                <circle cx="6" cy="6" r="1" fill="#374151" />
              </pattern>

              {/* Cyan Glow Filter for Alex's Executive Office */}
              <filter id="alexCyanGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Overall Dark Office Floor */}
            <rect width="760" height="480" fill="url(#officeTiles)" />

            {/* OUTER WALL PERIMETERS WITH TACTICAL CORNERS */}
            <rect x="15" y="15" width="730" height="450" fill="none" stroke="#2a384c" strokeWidth="4" rx="10" />

            {/* ======================================================== */}
            {/* 1. MEETING AREA WITH TABLES, CHAIRS, AND CHALKBOARD (Top Center) */}
            {/* ======================================================== */}
            <g id="meetingAreaWithChalkboard">
              {/* Meeting Area Carpet */}
              <rect
                x="255"
                y="18"
                width="250"
                height="215"
                fill="url(#meetingCarpet)"
                stroke="#ca8a04"
                strokeWidth="1.2"
                strokeDasharray="4 2"
                rx="6"
              />

              {/* Meeting Area Header Banner */}
              <rect x="265" y="20" width="230" height="13" fill="#17120e" rx="2" stroke="#eab308" strokeWidth="0.8" />
              <text
                x="380"
                y="29"
                fill="#facc15"
                fontSize="7.5"
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor="middle"
              >
                👑 EXECUTIVE MEETING & STRATEGY HQ // MANAGER: STONIC
              </text>

              {/* -------------------------------------------------------- */}
              {/* WALL CHALKBOARD WITH CHALK DIAGRAMS, NOTES, AND ERASER */}
              {/* -------------------------------------------------------- */}
              <g id="chalkboardOnWall">
                {/* Outer Mahogany Wood Frame */}
                <rect x="272" y="34" width="216" height="44" fill="#3b1d11" rx="3" stroke="#5c2b18" strokeWidth="1" />
                {/* Brass Corner Reinforcements */}
                <rect x="272" y="34" width="5" height="5" fill="#ca8a04" />
                <rect x="483" y="34" width="5" height="5" fill="#ca8a04" />
                <rect x="272" y="73" width="5" height="5" fill="#ca8a04" />
                <rect x="483" y="73" width="5" height="5" fill="#ca8a04" />

                {/* Chalkboard Green Slate Board */}
                <rect x="276" y="37" width="208" height="38" fill="#132b1e" rx="2" />
                {/* Faint chalk smudge overlay */}
                <rect x="278" y="39" width="204" height="34" fill="#173525" opacity="0.4" />

                {/* Chalk Drawings & Writing on Chalkboard */}
                {/* 1. Chalk Title Header */}
                <text x="380" y="45" fill="#fef08a" fontSize="6.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  ✎ AGENT TOWN SPRINT GOALS · MANAGER: STONIC
                </text>
                <line x1="290" y1="47" x2="470" y2="47" stroke="#ca8a04" strokeWidth="0.5" strokeDasharray="2 1" />

                {/* 2. Chalk Architecture Flowchart */}
                {/* Node: Manager Stonic */}
                <rect x="282" y="50" width="38" height="12" fill="#1b3d2b" stroke="#facc15" strokeWidth="0.7" rx="1" />
                <text x="301" y="58" fill="#fef08a" fontSize="5" fontFamily="monospace" textAnchor="middle">STONIC</text>

                {/* Chalk Arrows */}
                <line x1="320" y1="56" x2="334" y2="56" stroke="#ffffff" strokeWidth="0.8" />
                <polyline points="331,54 334,56 331,58" fill="none" stroke="#ffffff" strokeWidth="0.8" />

                {/* Node: Alex UI Work */}
                <rect x="335" y="50" width="46" height="12" fill="#1b3d2b" stroke="#38bdf8" strokeWidth="0.7" rx="1" />
                <text x="358" y="58" fill="#38bdf8" fontSize="5" fontFamily="monospace" textAnchor="middle">ALEX: UI</text>

                {/* Node: Bob Systems Work */}
                <line x1="381" y1="56" x2="395" y2="56" stroke="#ffffff" strokeWidth="0.8" />
                <polyline points="392,54 395,56 392,58" fill="none" stroke="#ffffff" strokeWidth="0.8" />
                <rect x="396" y="50" width="48" height="12" fill="#1b3d2b" stroke="#fb923c" strokeWidth="0.7" rx="1" />
                <text x="420" y="58" fill="#fdba74" fontSize="5" fontFamily="monospace" textAnchor="middle">BOB: DEV</text>

                {/* Formulas & Sprint Target in Chalk */}
                <text x="462" y="54" fill="#a7f3d0" fontSize="4.5" fontFamily="monospace">O(1) Mesh</text>
                <text x="460" y="60" fill="#a7f3d0" fontSize="4.5" fontFamily="monospace">PASS: 100%</text>

                {/* Chalk Tray at Base of Board */}
                <rect x="272" y="74" width="216" height="4" fill="#2b1408" stroke="#1f0d05" strokeWidth="0.5" />
                {/* Chalk Sticks in Tray (White, Yellow, Cyan) */}
                <rect x="285" y="73" width="7" height="2" fill="#ffffff" rx="0.5" />
                <rect x="294" y="73" width="7" height="2" fill="#facc15" rx="0.5" />
                <rect x="303" y="73" width="7" height="2" fill="#38bdf8" rx="0.5" />
                {/* Wooden Felt Chalk Eraser in Tray */}
                <rect x="460" y="72" width="16" height="3" fill="#78350f" rx="0.5" />
                <rect x="461" y="71" width="14" height="1.5" fill="#9ca3af" rx="0.3" />
              </g>

              {/* -------------------------------------------------------- */}
              {/* LARGE CONFERENCE MEETING TABLE WITH CHAIRS ALL AROUND IT */}
              {/* -------------------------------------------------------- */}
              <g id="conferenceTableAndChairs">
                {/* Solid Wood Conference Table */}
                <rect
                  x="285"
                  y="88"
                  width="190"
                  height="52"
                  rx="10"
                  fill="#2b150c"
                  stroke="#ca8a04"
                  strokeWidth="1.6"
                />
                {/* Inlaid Table Top Surface */}
                <rect
                  x="290"
                  y="92"
                  width="180"
                  height="44"
                  rx="7"
                  fill="#3d1f11"
                />

                {/* Central Holographic Projector Disc on Table */}
                <circle cx="380" cy="114" r="8" fill="#1c1917" stroke="#eab308" strokeWidth="1" />
                <circle cx="380" cy="114" r="4" fill="#eab308" className="animate-pulse" />
                <line x1="368" y1="114" x2="392" y2="114" stroke="#fef08a" strokeWidth="0.6" />

                {/* Meeting Accessories on Conference Table */}
                {/* Meeting Tablet Left */}
                <rect x="312" y="96" width="20" height="14" fill="#0f172a" rx="1.5" stroke="#38bdf8" strokeWidth="0.8" />
                <line x1="316" y1="101" x2="328" y2="101" stroke="#38bdf8" strokeWidth="0.8" />
                <line x1="316" y1="104" x2="326" y2="104" stroke="#0284c7" strokeWidth="0.8" />

                {/* Meeting Tablet Right */}
                <rect x="428" y="96" width="20" height="14" fill="#0f172a" rx="1.5" stroke="#fb923c" strokeWidth="0.8" />
                <line x1="432" y1="101" x2="444" y2="101" stroke="#fb923c" strokeWidth="0.8" />
                <line x1="432" y1="104" x2="442" y2="104" stroke="#ea580c" strokeWidth="0.8" />

                {/* Water Carafe & Glasses */}
                <circle cx="355" cy="114" r="3" fill="#38bdf8" opacity="0.8" />
                <circle cx="405" cy="114" r="3" fill="#38bdf8" opacity="0.8" />

                {/* ---------------------------------------------------- */}
                {/* CONFERENCE CHAIRS SURROUNDING THE TABLE */}
                {/* ---------------------------------------------------- */}

                {/* STONIC'S EXECUTIVE HEAD CHAIR (Stonic Sits Here!) */}
                <g id="stonicHeadChair">
                  <circle cx="380" cy="68" r="14" fill="none" stroke="#ca8a04" strokeWidth="1.2" strokeDasharray="3 3" />
                  {/* Leather Cushion */}
                  <rect x="367" y="58" width="26" height="18" fill="#78350f" rx="3" stroke="#eab308" strokeWidth="1.2" />
                  {/* High-Back Leather Headrest */}
                  <rect x="369" y="54" width="22" height="6" fill="#92400e" rx="2" stroke="#facc15" strokeWidth="0.8" />
                  {/* Gold Armrests */}
                  <rect x="364" y="60" width="3" height="13" fill="#b45309" rx="1" />
                  <rect x="393" y="60" width="3" height="13" fill="#b45309" rx="1" />
                </g>

                {/* Additional Conference Chairs Around Meeting Table */}
                {/* Left End Chair */}
                <g id="chairLeft">
                  <rect x="268" y="103" width="14" height="22" fill="#1e293b" rx="2" stroke="#64748b" strokeWidth="0.8" />
                  <rect x="265" y="105" width="3" height="18" fill="#334155" rx="1" />
                </g>

                {/* Right End Chair */}
                <g id="chairRight">
                  <rect x="478" y="103" width="14" height="22" fill="#1e293b" rx="2" stroke="#64748b" strokeWidth="0.8" />
                  <rect x="492" y="105" width="3" height="18" fill="#334155" rx="1" />
                </g>

                {/* Bottom Row Conference Chairs */}
                {/* Bottom Chair 1 */}
                <g id="chairBottom1">
                  <rect x="307" y="142" width="24" height="16" fill="#1e293b" rx="2" stroke="#64748b" strokeWidth="0.8" />
                  <rect x="309" y="155" width="20" height="5" fill="#334155" rx="1.5" />
                </g>
                {/* Bottom Chair 2 (Center) */}
                <g id="chairBottom2">
                  <rect x="368" y="142" width="24" height="16" fill="#1e293b" rx="2" stroke="#64748b" strokeWidth="0.8" />
                  <rect x="370" y="155" width="20" height="5" fill="#334155" rx="1.5" />
                </g>
                {/* Bottom Chair 3 */}
                <g id="chairBottom3">
                  <rect x="429" y="142" width="24" height="16" fill="#1e293b" rx="2" stroke="#64748b" strokeWidth="0.8" />
                  <rect x="431" y="155" width="20" height="5" fill="#334155" rx="1.5" />
                </g>
              </g>

              {/* Status Badge in Meeting Area */}
              <rect x="290" y="172" width="180" height="14" fill="#17120e" rx="3" stroke="#eab308" strokeWidth="0.8" />
              <text x="380" y="182" fill="#facc15" fontSize="7" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                STANDUP · STONIC COORDINATING ALL AGENTS
              </text>
            </g>

            {/* ======================================================== */}
            {/* 2. CAROL'S AI RESEARCH ALCOVE (Top Left) */}
            {/* ======================================================== */}
            <g id="carolResearchAlcove">
              <rect
                x="20"
                y="20"
                width="230"
                height="215"
                fill="url(#carolCarpet)"
                rx="6"
              />
              <line x1="250" y1="20" x2="250" y2="235" stroke="#059669" strokeWidth="2.5" strokeOpacity="0.8" />

              {/* Plaque */}
              <rect x="25" y="24" width="220" height="16" fill="#064e3b" rx="3" stroke="#34d399" strokeWidth="1" />
              <text x="135" y="35" fill="#6ee7b7" fontSize="7.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                📚 CAROL'S AI RESEARCH ALCOVE // ARXIV INTEL
              </text>

              {/* Bookshelves with research papers */}
              <rect x="28" y="46" width="50" height="180" fill="#1e293b" rx="3" stroke="#047857" strokeWidth="1" />
              {[54, 84, 114, 144, 174, 204].map((by) => (
                <g key={by}>
                  <rect x="31" y={by} width="44" height="24" fill="#064e3b" rx="1" />
                  <line x1="35" y1={by + 3} x2="35" y2={by + 21} stroke="#ec4899" strokeWidth="3" />
                  <line x1="41" y1={by + 3} x2="41" y2={by + 21} stroke="#38bdf8" strokeWidth="3" />
                  <line x1="47" y1={by + 3} x2="47" y2={by + 21} stroke="#facc15" strokeWidth="3" />
                  <line x1="53" y1={by + 3} x2="53" y2={by + 21} stroke="#34d399" strokeWidth="3" />
                  <line x1="59" y1={by + 3} x2="59" y2={by + 21} stroke="#a855f7" strokeWidth="3" />
                </g>
              ))}

              {/* Carol Desk */}
              <rect x="85" y="105" width="125" height="46" fill="#064e3b" rx="4" stroke="#f472b6" strokeWidth="1.4" />
              <rect x="90" y="109" width="115" height="38" fill="#065f46" rx="3" />

              {/* Dual Research Monitors (arXiv paper + neural graph) */}
              <rect x="98" y="113" width="46" height="22" fill="#090d16" rx="2" stroke="#f472b6" strokeWidth="1" />
              <text x="121" y="126" fill="#f472b6" fontSize="6" fontFamily="monospace" textAnchor="middle">arXiv 1-BIT</text>

              <rect x="148" y="113" width="46" height="22" fill="#090d16" rx="2" stroke="#a78bfa" strokeWidth="1" />
              <text x="171" y="126" fill="#c084fc" fontSize="6" fontFamily="monospace" textAnchor="middle">NEURAL GRAPH</text>

              {/* Carol Chair (Carol sits here!) */}
              <circle cx="135" cy="145" r="13" fill="none" stroke="#db2777" strokeWidth="1.2" strokeDasharray="3 3" />
              <rect x="123" y="136" width="24" height="18" fill="#1c1917" rx="4" stroke="#f472b6" strokeWidth="1.2" />
              <rect x="124" y="146" width="22" height="7" fill="#831843" rx="3" />
            </g>

            {/* ======================================================== */}
            {/* 3. DAVE'S CYBER SENTINEL DEFENSE POST (Top Right) */}
            {/* ======================================================== */}
            <g id="daveSecurityStation">
              <rect
                x="510"
                y="20"
                width="235"
                height="215"
                fill="url(#daveCarbon)"
                rx="6"
              />
              <line x1="510" y1="20" x2="510" y2="235" stroke="#059669" strokeWidth="2.5" strokeOpacity="0.8" />

              {/* Plaque */}
              <rect x="515" y="24" width="225" height="16" fill="#064e3b" rx="3" stroke="#34d399" strokeWidth="1" />
              <text x="627" y="35" fill="#34d399" fontSize="7.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                🛡️ DAVE'S CYBER SENTINEL STATION // PROTOCOL 0
              </text>

              {/* Radar Perimeter Screen */}
              <g id="radarDisplay">
                <circle cx="680" cy="120" r="42" fill="#022c22" stroke="#34d399" strokeWidth="1.8" />
                <circle cx="680" cy="120" r="28" fill="none" stroke="#059669" strokeWidth="0.8" />
                <circle cx="680" cy="120" r="14" fill="none" stroke="#059669" strokeWidth="0.8" />
                <line x1="638" y1="120" x2="722" y2="120" stroke="#10b981" strokeWidth="0.8" />
                <line x1="680" y1="78" x2="680" y2="162" stroke="#10b981" strokeWidth="0.8" />
                <line x1="680" y1="120" x2="708" y2="96" stroke="#34d399" strokeWidth="1.5" className="animate-spin origin-[680px_120px]" />
                <text x="680" y="174" fill="#34d399" fontSize="6" fontFamily="monospace" textAnchor="middle">RADAR 3000 ACTIVE</text>
              </g>

              {/* Dave Desk */}
              <rect x="540" y="105" width="115" height="46" fill="#1e293b" rx="4" stroke="#34d399" strokeWidth="1.4" />
              <rect x="545" y="109" width="105" height="38" fill="#334155" rx="3" />

              {/* Security Shield Consoles */}
              <rect x="552" y="113" width="42" height="22" fill="#022c22" rx="2" stroke="#34d399" strokeWidth="1" />
              <text x="573" y="126" fill="#34d399" fontSize="6" fontFamily="monospace" textAnchor="middle">FIREWALL</text>

              <rect x="600" y="113" width="42" height="22" fill="#064e3b" rx="2" stroke="#10b981" strokeWidth="1" />
              <text x="621" y="126" fill="#6ee7b7" fontSize="6" fontFamily="monospace" textAnchor="middle">PROTOCOL 0</text>

              {/* Dave Chair (Dave sits here!) */}
              <circle cx="625" cy="145" r="13" fill="none" stroke="#059669" strokeWidth="1.2" strokeDasharray="3 3" />
              <rect x="613" y="136" width="24" height="18" fill="#111827" rx="4" stroke="#34d399" strokeWidth="1.2" />
              <rect x="614" y="146" width="22" height="7" fill="#064e3b" rx="3" />
            </g>

            {/* ======================================================== */}
            {/* 4. ALEX'S PRIVATE EXECUTIVE OFFICE (Bottom Left - Per User Media) */}
            {/* ======================================================== */}
            <g id="alexPrivateOffice">
              {/* Private Office Floor Carpet */}
              <rect
                x="20"
                y="240"
                width="350"
                height="225"
                fill="url(#alexCarpet)"
                stroke="#00f2ff"
                strokeWidth="1.5"
                rx="6"
              />

              {/* Glass Frosted Partition Walls */}
              <line x1="20" y1="240" x2="370" y2="240" stroke="#00f2ff" strokeWidth="3.5" strokeOpacity="0.8" />
              <line x1="370" y1="240" x2="370" y2="465" stroke="#00f2ff" strokeWidth="3.5" strokeOpacity="0.8" />

              {/* Private Glass Door with Header Plaque */}
              <g id="alexOfficeDoor">
                {/* Door Frame at Top-Right of Office */}
                <rect x="285" y="238" width="80" height="5" fill="#0284c7" />
                {/* Doorway Entrance Mat */}
                <rect x="290" y="244" width="70" height="12" fill="#082f49" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 2" rx="2" />
                <text x="325" y="253" fill="#38bdf8" fontSize="6.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  🚪 ENTRANCE
                </text>
              </g>

              {/* Private Office Door / Wall Plaque */}
              <rect x="26" y="246" width="245" height="16" fill="#071b29" rx="3" stroke="#00f2ff" strokeWidth="1.2" />
              <text
                x="148"
                y="257"
                fill="#38bdf8"
                fontSize="7.5"
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor="middle"
              >
                🚪 ALEX'S PRIVATE EXECUTIVE OFFICE // LEAD UI ARCHITECT
              </text>

              {/* Wall Decorations inside Alex's Office */}
              {/* 1. Trophy on wall */}
              <rect x="30" y="268" width="50" height="18" fill="#0f293a" rx="2" stroke="#38bdf8" strokeWidth="0.8" />
              <text x="55" y="277" fill="#facc15" fontSize="6" fontFamily="monospace" textAnchor="middle">🏆 LEAD UI</text>
              <text x="55" y="283" fill="#38bdf8" fontSize="5" fontFamily="monospace" textAnchor="middle">ARCHITECT</text>

              {/* 2. Design Moodboard / Swatches on wall */}
              <rect x="88" y="268" width="60" height="18" fill="#0f293a" rx="2" stroke="#38bdf8" strokeWidth="0.8" />
              <rect x="93" y="272" width="10" height="9" fill="#00f2ff" rx="1" />
              <rect x="106" y="272" width="10" height="9" fill="#a855f7" rx="1" />
              <rect x="119" y="272" width="10" height="9" fill="#f59e0b" rx="1" />
              <rect x="132" y="272" width="10" height="9" fill="#10b981" rx="1" />

              {/* 3. Potted Office Plant (Monstera) in Corner */}
              <circle cx="36" cy="442" r="10" fill="#064e3b" stroke="#10b981" strokeWidth="1" />
              <circle cx="36" cy="442" r="5" fill="#047857" />
              <line x1="36" y1="442" x2="42" y2="434" stroke="#34d399" strokeWidth="1.5" />
              <line x1="36" y1="442" x2="30" y2="436" stroke="#34d399" strokeWidth="1.5" />

              {/* 4. Design Bookshelf on Wall */}
              <rect x="280" y="325" width="80" height="45" fill="#0c1e2d" rx="2" stroke="#0284c7" strokeWidth="0.8" />
              <text x="320" y="337" fill="#38bdf8" fontSize="5.5" fontFamily="monospace" textAnchor="middle">UI DESIGN SYSTEM</text>
              <line x1="285" y1="345" x2="355" y2="345" stroke="#38bdf8" strokeWidth="0.8" />
              <text x="320" y="358" fill="#94a3b8" fontSize="5" fontFamily="monospace" textAnchor="middle">SHADERS & TOKENS</text>

              {/* ALEX'S EXECUTIVE DESK (Walnut & Beveled Chrome) */}
              <g id="alexDesk">
                <rect x="90" y="325" width="150" height="52" fill="#1e293b" rx="4" stroke="#00f2ff" strokeWidth="1.6" />
                <rect x="95" y="329" width="140" height="44" fill="#334155" rx="3" />

                {/* Desk Neon Ambient Strip (Cyan) */}
                <line x1="93" y1="375" x2="237" y2="375" stroke="#00f2ff" strokeWidth="2" filter="url(#alexCyanGlow)" />

                {/* Dual Ultra-Wide Curved UI Monitors */}
                {/* Monitor 1: Figma / Canvas UI */}
                <rect x="101" y="333" width="55" height="26" fill="#090d16" rx="2" stroke="#00f2ff" strokeWidth="1.2" />
                <rect x="104" y="336" width="49" height="20" fill="#0284c7" />
                <rect x="107" y="339" width="20" height="6" fill="#ffffff" rx="1" />
                <rect x="130" y="339" width="20" height="6" fill="#38bdf8" rx="1" />
                <rect x="107" y="348" width="43" height="5" fill="#075985" rx="1" />

                {/* Monitor 2: React Code / Tailwind Shaders */}
                <rect x="162" y="333" width="55" height="26" fill="#090d16" rx="2" stroke="#38bdf8" strokeWidth="1.2" />
                <rect x="165" y="336" width="49" height="20" fill="#0f172a" />
                <line x1="168" y1="340" x2="198" y2="340" stroke="#00f2ff" strokeWidth="1.2" />
                <line x1="168" y1="344" x2="208" y2="344" stroke="#38bdf8" strokeWidth="1.2" />
                <line x1="168" y1="348" x2="192" y2="348" stroke="#a855f7" strokeWidth="1.2" />
                <line x1="168" y1="352" x2="202" y2="352" stroke="#22c55e" strokeWidth="1.2" />

                {/* Mechanical Keyboard with Cyan RGB */}
                <rect x="142" y="362" width="38" height="11" fill="#0f172a" rx="1" stroke="#38bdf8" strokeWidth="0.8" />
                <line x1="145" y1="366" x2="177" y2="366" stroke="#00f2ff" strokeWidth="1" strokeDasharray="2 1" />

                {/* Mousepad & Precision Mouse */}
                <rect x="185" y="362" width="16" height="11" fill="#0284c7" rx="1" />
                <circle cx="193" cy="367" r="3" fill="#ffffff" />

                {/* Coffee Mug with "UI KING" */}
                <rect x="99" y="362" width="8" height="9" fill="#0284c7" rx="1" stroke="#ffffff" strokeWidth="0.5" />
                <path d="M 107 364 Q 110 366 107 368" stroke="#ffffff" strokeWidth="0.8" fill="none" />
              </g>

              {/* ALEX'S ERGONOMIC CHAIR (Alex Sits in this chair!) */}
              <g id="alexChair">
                {/* 5-point Caster Base */}
                <circle cx="165" cy="360" r="13" fill="none" stroke="#0284c7" strokeWidth="1.2" strokeDasharray="3 3" />
                {/* Mesh Seat Cushion */}
                <rect x="153" y="351" width="24" height="18" fill="#0f172a" rx="4" stroke="#00f2ff" strokeWidth="1.2" />
                {/* Contoured Ergonomic Backrest */}
                <rect x="154" y="361" width="22" height="7" fill="#0284c7" rx="3" stroke="#38bdf8" strokeWidth="1" />
                {/* Armrests */}
                <rect x="149" y="352" width="3.5" height="13" fill="#38bdf8" rx="1.5" />
                <rect x="177" y="352" width="3.5" height="13" fill="#38bdf8" rx="1.5" />
              </g>

              {/* Status Badge in Alex Office */}
              <rect x="90" y="380" width="150" height="14" fill="#082f49" rx="3" stroke="#00f2ff" strokeWidth="0.8" />
              <text x="165" y="390" fill="#38bdf8" fontSize="7" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                {exclusiveWorker === 'alex'
                  ? '⚡ ALEX WORKING (EXCLUSIVE DIRECTIVE)'
                  : 'ALEX PRIVATE OFFICE · SEATED AT DESK'}
              </text>
            </g>

            {/* ======================================================== */}
            {/* 5. BOB'S SYSTEMS & TECH LAB (Bottom Right - Per User Media) */}
            {/* ======================================================== */}
            <g id="bobSystemsLab">
              {/* Lab Floor */}
              <rect
                x="385"
                y="240"
                width="360"
                height="225"
                fill="url(#bobFloor)"
                stroke="#fb923c"
                strokeWidth="1.5"
                rx="6"
              />

              {/* Steel Partition Walls */}
              <line x1="385" y1="240" x2="745" y2="240" stroke="#fb923c" strokeWidth="3.5" strokeOpacity="0.8" />
              <line x1="385" y1="240" x2="385" y2="465" stroke="#fb923c" strokeWidth="3.5" strokeOpacity="0.8" />

              {/* Wall Header Plaque */}
              <rect x="395" y="246" width="250" height="16" fill="#1c1917" rx="3" stroke="#fb923c" strokeWidth="1.2" />
              <text
                x="520"
                y="257"
                fill="#fdba74"
                fontSize="7.5"
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor="middle"
              >
                ⚙️ BOB'S SYSTEMS & SERVERS TECH LAB // DEVOPS
              </text>

              {/* Hardware Diagnostic Toolkit Bench on Left */}
              <rect x="395" y="270" width="60" height="40" fill="#292524" rx="2" stroke="#ea580c" strokeWidth="0.8" />
              <text x="425" y="282" fill="#fdba74" fontSize="5.5" fontFamily="monospace" textAnchor="middle">DAEMON BENCH</text>
              <line x1="400" y1="290" x2="450" y2="290" stroke="#78350f" strokeWidth="1" />
              <circle cx="410" cy="298" r="2" fill="#22c55e" />
              <circle cx="420" cy="298" r="2" fill="#38bdf8" />
              <circle cx="430" cy="298" r="2" fill="#fb923c" />

              {/* Server Racks on Right Wall with Blinking LED Lights */}
              <g id="serverRacks">
                <rect x="692" y="255" width="48" height="195" fill="#0c0a09" rx="3" stroke="#78350f" strokeWidth="1.5" />
                {/* Rack Units */}
                {[262, 284, 306, 328, 350, 372, 394, 416, 438].map((ry, idx) => (
                  <g key={ry}>
                    <rect x="695" y={ry} width="42" height="18" fill="#1c1917" rx="1" stroke="#44403c" strokeWidth="0.8" />
                    <line x1="699" y1={ry + 4} x2="725" y2={ry + 4} stroke="#292524" strokeWidth="1" />
                    <circle cx="728" cy={ry + 9} r="1.5" fill={idx % 2 === 0 ? '#22c55e' : '#fb923c'} className="animate-pulse" />
                    <circle cx="732" cy={ry + 9} r="1.5" fill="#38bdf8" />
                  </g>
                ))}
              </g>

              {/* BOB'S HEAVY-DUTY SYSTEMS DESK */}
              <g id="bobDesk">
                <rect x="470" y="325" width="160" height="52" fill="#292524" rx="4" stroke="#fb923c" strokeWidth="1.6" />
                <rect x="475" y="329" width="150" height="44" fill="#44403c" rx="3" />

                {/* Triple Terminal Monitors */}
                {/* Monitor 1: Linux Daemon Logs (htop style) */}
                <rect x="480" y="333" width="42" height="26" fill="#090d16" rx="2" stroke="#22c55e" strokeWidth="1" />
                <rect x="482" y="335" width="38" height="22" fill="#052e16" />
                <line x1="485" y1="340" x2="510" y2="340" stroke="#4ade80" strokeWidth="1" />
                <line x1="485" y1="344" x2="515" y2="344" stroke="#22c55e" strokeWidth="1" />
                <line x1="485" y1="348" x2="505" y2="348" stroke="#86efac" strokeWidth="1" />

                {/* Monitor 2: Socket Latency & Ping */}
                <rect x="528" y="333" width="42" height="26" fill="#090d16" rx="2" stroke="#fb923c" strokeWidth="1" />
                <rect x="530" y="335" width="38" height="22" fill="#431407" />
                <text x="549" y="347" fill="#fdba74" fontSize="6.5" fontFamily="monospace" textAnchor="middle">0ms PING</text>
                <line x1="533" y1="352" x2="565" y2="352" stroke="#fb923c" strokeWidth="1" />

                {/* Monitor 3: V8 Memory Heap Sweep */}
                <rect x="576" y="333" width="42" height="26" fill="#090d16" rx="2" stroke="#eab308" strokeWidth="1" />
                <rect x="578" y="335" width="38" height="22" fill="#1c1917" />
                <text x="597" y="347" fill="#facc15" fontSize="6.5" fontFamily="monospace" textAnchor="middle">HEAP OK</text>

                {/* Keyboard & Mouse */}
                <rect x="530" y="362" width="38" height="11" fill="#0c0a09" rx="1" stroke="#fb923c" strokeWidth="0.8" />
                <rect x="574" y="362" width="16" height="11" fill="#78350f" rx="1" />

                {/* Coffee Mug with "ROOT" */}
                <rect x="478" y="362" width="8" height="9" fill="#ea580c" rx="1" stroke="#ffffff" strokeWidth="0.5" />
              </g>

              {/* BOB'S CHAIR (Bob Sits in this chair!) */}
              <g id="bobChair">
                <circle cx="550" cy="360" r="13" fill="none" stroke="#ea580c" strokeWidth="1.2" strokeDasharray="3 3" />
                <rect x="538" y="351" width="24" height="18" fill="#1c1917" rx="4" stroke="#fb923c" strokeWidth="1.2" />
                <rect x="539" y="361" width="22" height="7" fill="#78350f" rx="3" stroke="#ea580c" strokeWidth="1" />
                <rect x="534" y="352" width="3.5" height="13" fill="#ea580c" rx="1.5" />
                <rect x="562" y="352" width="3.5" height="13" fill="#ea580c" rx="1.5" />
              </g>

              {/* Status Badge in Bob Lab */}
              <rect x="470" y="380" width="160" height="14" fill="#431407" rx="3" stroke="#fb923c" strokeWidth="0.8" />
              <text x="550" y="390" fill="#fdba74" fontSize="7" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                {exclusiveWorker === 'bob'
                  ? '⚡ BOB WORKING (EXCLUSIVE DIRECTIVE)'
                  : 'BOB SYSTEMS LAB · SEATED AT DESK'}
              </text>
            </g>

            {/* Central Corridor Walkway / Tactical Decals */}
            <line x1="20" y1="237" x2="740" y2="237" stroke="#38bdf8" strokeWidth="1" strokeDasharray="6 4" strokeOpacity="0.4" />
            <text x="380" y="241" fill="#64748b" fontSize="6.5" fontFamily="monospace" textAnchor="middle">
              CENTRAL SYNC CORRIDOR · MULTI-AGENT MESH HIGHWAY
            </text>
          </svg>

          {/* ======================================================== */}
          {/* RENDER AGENT CHARACTERS SITTING AT THEIR DESKS & CHAIRS  */}
          {/* ======================================================== */}
          {agents.map((ag) => {
            const isAlex = ag.id === 'alex';
            const isBob = ag.id === 'bob';
            const isManager = ag.id === 'stonic';
            const isWorkingExclusive = ag.status === 'working_exclusive';
            const isIdle = ag.status === 'idle_standby';

            // Coordinates on 760x480 canvas
            const leftPercent = (ag.chairX / 760) * 100;
            const topPercent = (ag.chairY / 480) * 100;

            return (
              <div
                key={ag.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer transition-all duration-500 z-20"
                style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                onClick={() => {
                  sound.playClick();
                  setSelectedAgent(ag.name);
                  setSelectedProfile(ag);
                }}
              >
                {/* 1. DIALOGUE / THOUGHT BUBBLE */}
                {ag.bubble && (
                  <div
                    className={`mb-1 px-2 py-0.5 rounded-lg font-code font-bold text-[8.5px] sm:text-[9.5px] whitespace-nowrap shadow-xl pointer-events-none border transition-all duration-300 ${
                      isManager
                        ? 'bg-yellow-400 text-black border-yellow-600 animate-pulse'
                        : isWorkingExclusive && isAlex
                        ? 'bg-cyan-950 text-cyan-200 border-cyan-400 ring-2 ring-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.5)] animate-pulse'
                        : isWorkingExclusive && isBob
                        ? 'bg-amber-950 text-amber-200 border-amber-400 ring-2 ring-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.5)] animate-pulse'
                        : isIdle
                        ? 'bg-black/85 text-gray-400 border-white/20'
                        : 'bg-black/90 text-white border-white/40'
                    }`}
                  >
                    {ag.bubble}
                  </div>
                )}

                {/* 2. AGENT SEATED CHARACTER SPRITE */}
                <div className="relative flex flex-col items-center">
                  {/* Crown for Manager Stonic */}
                  {isManager && (
                    <Crown className="w-4 h-4 text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.9)] -mb-1 z-30 animate-bounce" />
                  )}

                  {/* Character Head & Hair */}
                  <div className="w-6 h-6 rounded-sm bg-[#fed7aa] border border-black/70 flex flex-col items-center overflow-hidden shadow-md">
                    <div className="w-full h-2.5" style={{ backgroundColor: ag.hairColor }} />
                    <div className="w-full h-3.5 flex items-center justify-around px-0.5">
                      <span className="w-0.5 h-0.5 bg-black rounded-full" />
                      <span className="w-0.5 h-0.5 bg-black rounded-full" />
                    </div>
                  </div>

                  {/* Character Torso & Shirt */}
                  <div
                    className="w-5 h-4 rounded-sm -mt-0.5 flex justify-between px-0.5 items-end"
                    style={{ backgroundColor: ag.shirtColor }}
                  >
                    {/* Animated Typing Hands when working at desk! */}
                    {isWorkingExclusive ? (
                      <>
                        <span
                          className={`w-1 h-1.5 rounded-full bg-[#fed7aa] transition-transform ${
                            isTypingTick % 2 === 0 ? '-translate-y-1' : 'translate-y-0'
                          }`}
                        />
                        <span
                          className={`w-1 h-1.5 rounded-full bg-[#fed7aa] transition-transform ${
                            isTypingTick % 2 === 1 ? '-translate-y-1' : 'translate-y-0'
                          }`}
                        />
                      </>
                    ) : (
                      <>
                        <span className="w-1 h-1 rounded-full bg-[#fed7aa]" />
                        <span className="w-1 h-1 rounded-full bg-[#fed7aa]" />
                      </>
                    )}
                  </div>

                  {/* Sitting Legs on Chair Cushion */}
                  <div className="w-4 h-2 bg-slate-900 rounded-b-sm flex justify-between px-0.5">
                    <span className="w-1.5 h-full bg-slate-700 rounded-sm" />
                    <span className="w-1.5 h-full bg-slate-700 rounded-sm" />
                  </div>
                </div>

                {/* 3. NAME TAG & STATUS BADGE */}
                <div
                  className={`flex items-center gap-1 mt-1 px-1.5 py-0.2 rounded border drop-shadow-md text-[8px] font-code font-bold ${
                    isManager
                      ? 'bg-yellow-950/80 border-yellow-500/50 text-yellow-300'
                      : isWorkingExclusive && isAlex
                      ? 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                      : isWorkingExclusive && isBob
                      ? 'bg-amber-950 border-amber-400 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.4)]'
                      : 'bg-black/80 border-white/20 text-gray-300'
                  }`}
                >
                  <span>{ag.name}</span>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ag.dotColor }} />
                </div>

                {/* Frame 7 tooltip matching screenshot */}
                {ag.id === 'bob' && (
                  <div className="absolute -top-3 -right-7 px-1 py-0.2 rounded bg-yellow-400 text-black font-code font-bold text-[7.5px] shadow-sm pointer-events-none select-none">
                    Frame 7
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 4. VIEW 2: MANAGEMENT TEAM EXECUTIVE HUB (STONIC IS MANAGER, ALL AGENTS DO DIFFERENT WORK) */}
      {activeTab === 'management' && (
        <div className={`w-full ${canvasHeightClass} rounded-xl bg-black/70 border border-white/10 p-3 my-1 overflow-y-auto space-y-3 font-rajdhani`}>
          {/* Executive Manager Stonic Card */}
          <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-950/50 via-black/90 to-yellow-950/40 border border-yellow-500/60 flex items-center justify-between shadow-[0_0_20px_rgba(234,179,8,0.2)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/20 border border-yellow-500/60 flex items-center justify-center">
                <Crown className="w-6 h-6 text-yellow-400 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-orbitron font-bold text-sm text-yellow-300">
                    STONIC (EXECUTIVE GENERAL MANAGER)
                  </span>
                  <span className="text-[9px] font-code px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 font-bold">
                    MANAGER OF ALL AGENTS
                  </span>
                </div>
                <p className="text-[11px] text-gray-300 font-code mt-0.5">
                  Directs the entire team: Alex has a dedicated private office for UI, Bob manages server daemons, Carol scans arXiv, and Dave guards security.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleStonicCoordinateAll()}
                className="px-3 py-1.5 rounded-lg bg-yellow-500 text-black font-code font-bold text-[11px] hover:bg-yellow-400 cursor-pointer transition-colors shadow-md flex items-center gap-1.5"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>DISPATCH ALL DIFFERENT WORK</span>
              </button>
            </div>
          </div>

          {/* Specialized Work Cards for Alex & Bob & Others */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
            
            {/* Alex's Work Card (Private Office) */}
            <div className="p-3 rounded-xl bg-cyan-950/25 border border-cyan-500/50 flex flex-col justify-between space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layout className="w-4 h-4 text-cyan-400" />
                  <div>
                    <span className="font-orbitron font-bold text-cyan-300 text-xs">
                      ALEX (PRIVATE OFFICE)
                    </span>
                    <div className="text-[9px] font-code text-cyan-400">Lead UI/UX Architect</div>
                  </div>
                </div>
                <span className="text-[9px] font-code px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold">
                  ALEX'S WORK ONLY
                </span>
              </div>
              
              <p className="text-[11px] text-gray-300 font-code leading-relaxed">
                {agents.find((a) => a.id === 'alex')?.task}
              </p>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-code text-gray-400">
                  <span>Sprint Progress:</span>
                  <span className="text-cyan-300 font-bold">{agents.find((a) => a.id === 'alex')?.progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 transition-all duration-500"
                    style={{ width: `${agents.find((a) => a.id === 'alex')?.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => handleAlexOnlyWork()}
                  className="flex-1 py-1.5 rounded-lg bg-cyan-500 text-black hover:bg-cyan-400 font-code font-bold text-[10px] cursor-pointer transition-colors flex items-center justify-center gap-1.5 shadow"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>ALEX WORK IT (ONLY ALEX)</span>
                </button>
              </div>
            </div>

            {/* Bob's Work Card (Systems Lab) */}
            <div className="p-3 rounded-xl bg-amber-950/25 border border-amber-500/50 flex flex-col justify-between space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-amber-400" />
                  <div>
                    <span className="font-orbitron font-bold text-amber-300 text-xs">
                      BOB (SYSTEMS LAB)
                    </span>
                    <div className="text-[9px] font-code text-amber-400">Lead Systems Daemon</div>
                  </div>
                </div>
                <span className="text-[9px] font-code px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/40 font-bold">
                  BOB'S WORK ONLY
                </span>
              </div>

              <p className="text-[11px] text-gray-300 font-code leading-relaxed">
                {agents.find((a) => a.id === 'bob')?.task}
              </p>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-code text-gray-400">
                  <span>Daemon Health:</span>
                  <span className="text-amber-300 font-bold">{agents.find((a) => a.id === 'bob')?.progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-amber-400 transition-all duration-500"
                    style={{ width: `${agents.find((a) => a.id === 'bob')?.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => handleBobOnlyWork()}
                  className="flex-1 py-1.5 rounded-lg bg-amber-500 text-black hover:bg-amber-400 font-code font-bold text-[10px] cursor-pointer transition-colors flex items-center justify-center gap-1.5 shadow"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>BOB WORK IT (ONLY BOB)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. VIEW 3: DIFFERENT WORK MATRIX (CLEAR PROOF ALL AGENTS DO DIFFERENT DIFFERENT WORK) */}
      {activeTab === 'matrix' && (
        <div className={`w-full ${canvasHeightClass} rounded-xl bg-black/70 border border-white/10 p-3 my-1 overflow-y-auto space-y-2.5 text-xs font-code`}>
          <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
            <div>
              <span className="font-orbitron font-bold text-white text-xs">
                ALL AGENTS DO DIFFERENT DIFFERENT WORK · STONIC IS MANAGER
              </span>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Zero task overlap: Alex does UI, Bob does Systems, Carol does Research, Dave does Defense.
              </p>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded">
              4 DISTINCT SPECIALTIES
            </span>
          </div>

          <div className="space-y-2">
            {agents.map((ag) => (
              <div
                key={ag.id}
                className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                  ag.isManager
                    ? 'bg-yellow-950/30 border-yellow-500/50 text-yellow-200'
                    : ag.id === 'alex'
                    ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-200'
                    : ag.id === 'bob'
                    ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                    : 'bg-white/5 border-white/10 text-gray-200'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-[140px]">
                  {ag.isManager ? (
                    <Crown className="w-4 h-4 text-yellow-400 shrink-0" />
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: ag.dotColor }} />
                  )}
                  <div>
                    <div className="font-bold text-[12px] flex items-center gap-1">
                      <span>{ag.name}</span>
                      {ag.isManager && <span className="text-[9px] text-yellow-400 font-bold">(MANAGER)</span>}
                    </div>
                    <div className="text-[9.5px] text-gray-400">{ag.role}</div>
                  </div>
                </div>

                <div className="flex-1 px-3 border-l border-white/10 text-[10px] space-y-0.5">
                  <div className="text-gray-200 font-bold">{ag.domain}</div>
                  <div className="text-[9px] text-gray-400 truncate">{ag.officeName}</div>
                  <div className="text-[8.5px] text-gray-500 truncate">{ag.tools.join(' · ')}</div>
                </div>

                <div className="text-right shrink-0">
                  {ag.id === 'alex' ? (
                    <button
                      onClick={() => handleAlexOnlyWork()}
                      className="px-2.5 py-1 rounded-lg bg-cyan-500 text-black font-bold text-[10px] cursor-pointer hover:bg-cyan-400 transition-colors"
                    >
                      ONLY ALEX WORK
                    </button>
                  ) : ag.id === 'bob' ? (
                    <button
                      onClick={() => handleBobOnlyWork()}
                      className="px-2.5 py-1 rounded-lg bg-amber-500 text-black font-bold text-[10px] cursor-pointer hover:bg-amber-400 transition-colors"
                    >
                      ONLY BOB WORK
                    </button>
                  ) : ag.isManager ? (
                    <button
                      onClick={() => handleStonicCoordinateAll()}
                      className="px-2.5 py-1 rounded-lg bg-yellow-500 text-black font-bold text-[10px] cursor-pointer hover:bg-yellow-400 transition-colors"
                    >
                      COORDINATE ALL
                    </button>
                  ) : (
                    <span className="text-[9px] text-gray-400">{ag.progress}% DONE</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. VIEW 4: LIVE WORK LOG */}
      {activeTab === 'work log' && (
        <div className={`w-full ${canvasHeightClass} rounded-xl bg-black/70 border border-white/10 p-3 my-1 overflow-y-auto space-y-2 font-code text-xs`}>
          <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
            <span className="font-orbitron font-bold text-white text-xs">
              MANAGEMENT TEAM REAL-TIME EXECUTION LOG
            </span>
            <span className="text-[10px] text-gray-400">ACTIVE TELEMETRY</span>
          </div>

          <div className="space-y-1.5">
            {workLogs.map((log) => (
              <div
                key={log.id}
                className={`p-2 rounded-lg border flex items-start gap-2 text-[10.5px] ${
                  log.isExclusive
                    ? 'bg-cyan-950/40 border-cyan-400/50'
                    : 'bg-white/5 border-white/5'
                }`}
              >
                <span className="text-gray-500 shrink-0">{log.timestamp}</span>
                <span
                  className={`font-bold shrink-0 ${
                    log.tag === 'manager'
                      ? 'text-yellow-400'
                      : log.tag === 'alex'
                      ? 'text-cyan-300'
                      : log.tag === 'bob'
                      ? 'text-amber-300'
                      : log.tag === 'carol'
                      ? 'text-pink-300'
                      : 'text-emerald-300'
                  }`}
                >
                  [{log.agentName}]
                </span>
                <span className="text-gray-200">{log.action}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. DITTO BOTTOM STATUS BAR MATCHING SCREENSHOT */}
      <div className="pt-2 border-t border-white/10 select-none flex flex-col gap-1.5">
        <div className="flex flex-wrap items-center justify-between gap-1.5 text-[10px] font-code">
          <div className="flex flex-wrap items-center gap-1.5">
            {/* 1. Online Indicator */}
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-black/60 border border-white/10 text-gray-300">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>Online</span>
            </div>

            {/* 2. No model yet */}
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/60 border border-white/10 text-gray-400">
              <Zap className="w-2.5 h-2.5 text-cyan-400" />
              <span>No model yet</span>
            </div>

            {/* 3. CTX Indicator */}
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-black/60 border border-white/10 text-gray-400">
              <span className="text-gray-500 font-bold">CTX</span>
              <div className="w-12 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="w-5 h-full bg-cyan-400 rounded-full" />
              </div>
              <span className="text-gray-500">--?</span>
            </div>

            {/* 4. Seat Indicator */}
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/60 border border-white/10 text-gray-400">
              <Users className="w-2.5 h-2.5 text-gray-400" />
              <span>4/7 seat</span>
            </div>

            {/* 5. Busy Indicator */}
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/60 border border-white/10 text-gray-400">
              <Briefcase className="w-2.5 h-2.5 text-gray-400" />
              <span>0/4 busy</span>
            </div>
          </div>

          {/* Right: [ ✉ CHAT ] button */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setIsChatOpen(!isChatOpen);
            }}
            className="px-2.5 py-0.5 rounded-lg bg-black/80 border border-white/15 hover:border-cyan-400 text-gray-300 hover:text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
          >
            <MessageSquare className="w-2.5 h-2.5 text-amber-300" />
            <span>CHAT</span>
          </button>
        </div>

        {/* Collapsible Chat & Directives Drawer */}
        {isChatOpen && (
          <form onSubmit={handleSendCustomDirective} className="flex items-center gap-2 pt-1 animate-in fade-in">
            <div className="flex-1 flex items-center bg-black/80 border border-white/15 focus-within:border-cyan-400 rounded-xl px-3 py-1.5 text-xs transition-colors shadow-inner">
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400 mr-2 shrink-0" />
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={`Directive to ${selectedAgent}: e.g. "Work on UI components"`}
                className="bg-transparent text-white placeholder-gray-500 text-xs focus:outline-none flex-1 font-rajdhani"
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-code cursor-pointer transition-all flex items-center gap-1 shrink-0"
            >
              <Send className="w-3 h-3" />
              <span>SEND</span>
            </button>
          </form>
        )}
      </div>

      {/* PROFILE DETAIL MODAL */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-88 rounded-2xl border border-white/20 bg-[#0c0f18] p-4 text-xs font-rajdhani space-y-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                {selectedProfile.isManager ? (
                  <Crown className="w-5 h-5 text-yellow-400" />
                ) : (
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedProfile.dotColor }} />
                )}
                <span className="font-orbitron font-bold text-white text-sm">{selectedProfile.name}</span>
                <span className="text-[9px] font-code text-gray-400">({selectedProfile.role})</span>
              </div>
              <button
                onClick={() => setSelectedProfile(null)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 font-code text-[11px] space-y-1">
              <div className="text-gray-400 font-bold">Office & Station:</div>
              <div className="text-cyan-300">{selectedProfile.officeName}</div>
            </div>

            <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 font-code text-[10.5px] space-y-1">
              <div className="text-gray-400 font-bold">Specialized Work (Non-Overlapping):</div>
              <div className="text-gray-200">{selectedProfile.domain}</div>
            </div>

            <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 font-code text-[10.5px] space-y-1">
              <div className="text-gray-400 font-bold">Latest Output Deliverable:</div>
              <div className="text-emerald-300">{selectedProfile.latestDeliverable}</div>
            </div>

            <div className="pt-2 border-t border-white/10 flex justify-between items-center gap-2">
              {selectedProfile.id === 'alex' ? (
                <button
                  onClick={() => {
                    handleAlexOnlyWork();
                    setSelectedProfile(null);
                  }}
                  className="flex-1 py-1.5 rounded-lg bg-cyan-500 text-black font-bold text-xs cursor-pointer hover:bg-cyan-400"
                >
                  ONLY ALEX WORK
                </button>
              ) : selectedProfile.id === 'bob' ? (
                <button
                  onClick={() => {
                    handleBobOnlyWork();
                    setSelectedProfile(null);
                  }}
                  className="flex-1 py-1.5 rounded-lg bg-amber-500 text-black font-bold text-xs cursor-pointer hover:bg-amber-400"
                >
                  ONLY BOB WORK
                </button>
              ) : selectedProfile.isManager ? (
                <button
                  onClick={() => {
                    handleStonicCoordinateAll();
                    setSelectedProfile(null);
                  }}
                  className="flex-1 py-1.5 rounded-lg bg-yellow-500 text-black font-bold text-xs cursor-pointer hover:bg-yellow-400"
                >
                  DISPATCH ALL WORK
                </button>
              ) : null}

              <button
                onClick={() => {
                  setSelectedProfile(null);
                  setIsChatOpen(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-white/15 text-white font-bold text-xs cursor-pointer hover:bg-white/25"
              >
                Send Directive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
