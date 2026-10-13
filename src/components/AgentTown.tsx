import React, { useState, useEffect } from 'react';
import { AgentRole, AgentTownNode } from '../types';
import { Users, Play, RefreshCw, MessageSquareCode, ShieldCheck, Sparkles, MapPin } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface AgentTownProps {
  onDispatchTaskToAgent: (agentId: AgentRole, task: string) => void;
}

export const AgentTown: React.FC<AgentTownProps> = ({ onDispatchTaskToAgent }) => {
  const [nodes, setNodes] = useState<AgentTownNode[]>([
    {
      id: 'core',
      name: 'Stonic Core (JARVIS)',
      x: 50,
      y: 48,
      targetX: 50,
      targetY: 48,
      station: 'Central Command Core',
      status: 'working',
      currentThought: 'Monitoring multi-agent synchronization & user directives',
      avatarColor: 'var(--theme-primary)',
    },
    {
      id: 'dev',
      name: 'Dev Specialist',
      x: 22,
      y: 28,
      targetX: 22,
      targetY: 28,
      station: 'Code & Systems Lab',
      status: 'working',
      currentThought: 'Compiling real-time system scripts without heap leaks',
      collaboratingWith: 'core',
      avatarColor: '#38bdf8',
    },
    {
      id: 'research',
      name: 'Research Specialist',
      x: 78,
      y: 28,
      targetX: 78,
      targetY: 28,
      station: 'Deep Knowledge Vault',
      status: 'working',
      currentThought: 'Synthesizing verified arXiv intelligence papers',
      collaboratingWith: 'core',
      avatarColor: '#a78bfa',
    },
    {
      id: 'os',
      name: 'OS Automation',
      x: 24,
      y: 72,
      targetX: 24,
      targetY: 72,
      station: 'File System Daemons',
      status: 'working',
      currentThought: 'Indexing directory tree & preparing automated purge',
      avatarColor: '#34d399',
    },
    {
      id: 'security',
      name: 'Cyber Sentinel',
      x: 76,
      y: 72,
      targetX: 76,
      targetY: 72,
      station: 'Aegis Defense Perimeter',
      status: 'working',
      currentThought: 'Active port sweep on localhost:3000. Firewall intact.',
      avatarColor: '#f87171',
    },
  ]);

  const [simulationLogs, setSimulationLogs] = useState<Array<{ id: string; time: string; text: string }>>([
    { id: '1', time: '12:00:02', text: 'Stonic Core dispatched telemetry handshake to all 5 agents.' },
    { id: '2', time: '12:00:14', text: 'Dev Specialist verified Node.js environment integrity.' },
    { id: '3', time: '12:00:28', text: 'Research Specialist pulled updated cognitive embeddings.' },
    { id: '4', time: '12:00:45', text: 'Cyber Sentinel reported: 0 intrusion threats detected.' },
  ]);

  const [activeMission, setActiveMission] = useState<string | null>(null);

  // Periodic random idle thought movement for the agents to feel alive
  useEffect(() => {
    const interval = setInterval(() => {
      setNodes((prevNodes) =>
        prevNodes.map((agent) => {
          // slight wandering around station
          const offsetX = (Math.random() - 0.5) * 6;
          const offsetY = (Math.random() - 0.5) * 6;
          const thoughts: Record<AgentRole, string[]> = {
            core: [
              'Routing incoming voice telemetry packet',
              'Calibrating Arc Core resonance at 99.8%',
              'Optimizing task priority queue for Operator',
            ],
            dev: [
              'Benchmarking AST parser performance',
              'Testing sandbox script execution',
              'Running ESLint on local memory buffer',
            ],
            research: [
              'Indexing neural graph vectors',
              'Re-verifying citation confidence scores',
              'Aggregating knowledge on autonomous OS models',
            ],
            os: [
              'Monitoring disk I/O throughput (142 MB/s)',
              'Inspecting cache longevity in /tmp',
              'Indexing file modification signatures',
            ],
            security: [
              'Protocol 0 integrity verified (Green)',
              'Scanning outbound socket handshakes',
              'Generating SHA-256 process digest',
            ],
          };
          const agentThoughts = thoughts[agent.id] || thoughts.core;
          const newThought =
            agentThoughts[Math.floor(Math.random() * agentThoughts.length)];

          return {
            ...agent,
            x: Math.min(88, Math.max(12, agent.targetX + offsetX)),
            y: Math.min(88, Math.max(12, agent.targetY + offsetY)),
            currentThought: Math.random() > 0.4 ? newThought : agent.currentThought,
          };
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const triggerCollaborationMission = () => {
    sound.playSuccess();
    setActiveMission('Autonomous Deep System & Intel Overhaul');
    const newLog = {
      id: Date.now().toString(),
      time: new Date().toLocaleTimeString(),
      text: '🚀 OPERATOR INITIATED AGENT TOWN COLLABORATIVE PROTOCOL: All agents converging on cross-functional task execution.',
    };
    setSimulationLogs((prev) => [newLog, ...prev.slice(0, 15)]);

    setTimeout(() => {
      const devLog = {
        id: (Date.now() + 1).toString(),
        time: new Date().toLocaleTimeString(),
        text: 'Dev Specialist paired with Research Specialist: Code synthesis completed.',
      };
      setSimulationLogs((prev) => [devLog, ...prev]);
    }, 1500);
  };

  return (
    <div className="w-full hud-panel rounded-2xl p-5 flex flex-col gap-4">
      {/* Title bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--theme-border)]">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[var(--theme-primary)]" />
            <h2 className="font-orbitron font-bold text-sm tracking-wider text-[var(--theme-primary)]">
              AGENT TOWN · SPATIAL MULTI-AGENT ENVIRONMENT
            </h2>
          </div>
          <p className="text-xs text-gray-400 font-rajdhani mt-0.5">
            Inspired by Stonic AI's spatial RPG multi-agent simulation. Watch local AI agents collaborate, exchange thoughts, and execute workflows in real-time.
          </p>
        </div>

        <button
          onClick={triggerCollaborationMission}
          className="px-4 py-2 rounded-xl bg-[var(--theme-primary)]/20 border border-[var(--theme-primary)] text-[var(--theme-primary)] text-xs font-code font-bold flex items-center gap-2 hover:bg-[var(--theme-primary)]/30 cursor-pointer shadow-[0_0_12px_var(--theme-glow-soft)]"
        >
          <Play className="w-3.5 h-3.5" />
          <span>TRIGGER ALL-AGENT SYNC</span>
        </button>
      </div>

      {/* Spatial Map View */}
      <div className="relative w-full h-80 sm:h-96 rounded-xl bg-black/60 border border-[var(--theme-border)] overflow-hidden cyber-grid select-none">
        {/* Holographic Radar Sweep */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="w-full h-full rounded-full border border-[var(--theme-primary)]/40 scale-90" />
          <div className="w-full h-full rounded-full border border-[var(--theme-primary)]/20 scale-50" />
          <div className="w-full h-full rounded-full border border-[var(--theme-primary)]/10 scale-20" />
          <div className="absolute top-1/2 left-1/2 w-48 h-48 -translate-x-1/2 -translate-y-1/2 rounded-full border-t border-[var(--theme-primary)] animate-spin" />
        </div>

        {/* Station Markers */}
        <div className="absolute top-4 left-6 text-[10px] font-code opacity-40">
          STATION A: DEV_LAB (x:22, y:28)
        </div>
        <div className="absolute top-4 right-6 text-[10px] font-code opacity-40 text-right">
          STATION B: RECON_VAULT (x:78, y:28)
        </div>
        <div className="absolute bottom-4 left-6 text-[10px] font-code opacity-40">
          STATION C: DAEMON_STORAGE (x:24, y:72)
        </div>
        <div className="absolute bottom-4 right-6 text-[10px] font-code opacity-40 text-right">
          STATION D: AEGIS_FIREWALL (x:76, y:72)
        </div>

        {/* Connecting Telemetry lines between Core and others */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {nodes
            .filter((n) => n.id !== 'core')
            .map((agent) => (
              <line
                key={agent.id}
                x1="50%"
                y1="48%"
                x2={`${agent.x}%`}
                y2={`${agent.y}%`}
                stroke="var(--theme-border)"
                strokeDasharray="4 4"
                strokeWidth="1.5"
                opacity="0.6"
              />
            ))}
        </svg>

        {/* Agents on Canvas */}
        {nodes.map((agent) => (
          <div
            key={agent.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 flex flex-col items-center group cursor-pointer z-10"
            style={{ left: `${agent.x}%`, top: `${agent.y}%` }}
            onClick={() => {
              sound.playClick();
              onDispatchTaskToAgent(agent.id, `Execute dedicated workflow on ${agent.station}`);
            }}
          >
            {/* Thought Bubble floating above */}
            <div className="mb-1.5 px-2.5 py-1 rounded-md bg-black/85 border border-[var(--theme-border)] text-[10px] font-code text-gray-200 max-w-[160px] truncate shadow-lg pointer-events-none group-hover:max-w-[260px] group-hover:whitespace-normal transition-all">
              💭 {agent.currentThought}
            </div>

            {/* Agent Avatar Badge */}
            <div
              className={`relative w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-lg transition-transform group-hover:scale-125 ${
                agent.id === 'core'
                  ? 'border-[var(--theme-primary)] bg-[var(--theme-primary)]/20 shadow-[0_0_15px_var(--theme-glow)]'
                  : 'bg-black/80'
              }`}
              style={{
                borderColor: agent.avatarColor,
                boxShadow: `0 0 10px ${agent.avatarColor}66`,
              }}
            >
              <span className="text-xs font-orbitron font-bold" style={{ color: agent.avatarColor }}>
                {agent.name.slice(0, 2).toUpperCase()}
              </span>

              {/* Status indicator dot */}
              <span
                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-black"
                title="Active Daemon"
              />
            </div>

            {/* Agent Label */}
            <div className="mt-1 text-[11px] font-bold font-rajdhani tracking-wide text-white drop-shadow">
              {agent.name}
            </div>
            <div className="text-[9px] font-code opacity-70" style={{ color: agent.avatarColor }}>
              {agent.station}
            </div>
          </div>
        ))}
      </div>

      {/* Live Agent Communication Log */}
      <div className="rounded-xl bg-black/40 border border-[var(--theme-border)] p-3">
        <div className="flex items-center justify-between mb-2 pb-1 border-b border-white/5">
          <div className="flex items-center gap-2 text-xs font-code text-[var(--theme-primary)] font-semibold">
            <MessageSquareCode className="w-3.5 h-3.5" />
            <span>AGENT TOWN INTER-PROCESS TELEMETRY LOG</span>
          </div>
          <span className="text-[10px] font-code opacity-60">LIVE BROADCAST</span>
        </div>

        <div className="space-y-1.5 max-h-24 overflow-y-auto font-code text-[11px]">
          {simulationLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-2 text-gray-300">
              <span className="text-gray-500 shrink-0">[{log.time}]</span>
              <span>{log.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
