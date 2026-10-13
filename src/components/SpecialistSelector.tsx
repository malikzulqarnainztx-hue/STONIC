import React from 'react';
import { AgentRole, SpecialistAgent } from '../types';
import { Cpu, Terminal, Search, FolderTree, ShieldAlert, Sparkles } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface SpecialistSelectorProps {
  activeAgent: AgentRole;
  onSelectAgent: (role: AgentRole) => void;
}

export const SPECIALIST_AGENTS: SpecialistAgent[] = [
  {
    id: 'core',
    name: 'Stonic Core',
    codename: 'JARVIS-01',
    title: 'Executive AI Orchestrator',
    description: 'Voice interface, natural language reasoning, workflow dispatch.',
    icon: 'Cpu',
    accentColor: 'var(--theme-primary)',
    status: 'active',
    assignedMemoryMB: 2048,
  },
  {
    id: 'dev',
    name: 'Dev Specialist',
    codename: 'NEO-COMPILER',
    title: 'Code & Systems Architect',
    description: 'Generates scripts, refactors codebases, terminal execution.',
    icon: 'Terminal',
    accentColor: '#38bdf8',
    status: 'active',
    assignedMemoryMB: 1536,
  },
  {
    id: 'research',
    name: 'Research Specialist',
    codename: 'DEEP-INDEX',
    title: 'Intelligence & Web Recon',
    description: 'Synthesizes knowledge graphs, web recon, and executive briefs.',
    icon: 'Search',
    accentColor: '#a78bfa',
    status: 'active',
    assignedMemoryMB: 1280,
  },
  {
    id: 'os',
    name: 'OS Automation',
    codename: 'DAEMON-FLOW',
    title: 'Desktop & File Automator',
    description: 'Manages disk files, batch processes, folder reorganization.',
    icon: 'FolderTree',
    accentColor: '#34d399',
    status: 'active',
    assignedMemoryMB: 896,
  },
  {
    id: 'security',
    name: 'Cyber Sentinel',
    codename: 'AEGIS-WALL',
    title: 'Security & Diagnostics',
    description: 'Hardware telemetry, threat scanning, memory protection, Protocol 0.',
    icon: 'ShieldAlert',
    accentColor: '#f87171',
    status: 'active',
    assignedMemoryMB: 1024,
  },
];

export const SpecialistSelector: React.FC<SpecialistSelectorProps> = ({
  activeAgent,
  onSelectAgent,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu className="w-4 h-4" />;
      case 'Terminal':
        return <Terminal className="w-4 h-4" />;
      case 'Search':
        return <Search className="w-4 h-4" />;
      case 'FolderTree':
        return <FolderTree className="w-4 h-4" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full hud-panel rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-code font-bold tracking-widest text-[var(--theme-primary)]">
            SPECIALIST AGENTS
          </span>
          <span className="text-[10px] font-code px-1.5 py-0.5 rounded bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] border border-[var(--theme-border)]">
            5 LOADED
          </span>
        </div>
        <span className="text-[11px] font-code opacity-70">
          MULTI-AGENT PARALLEL THREADS
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {SPECIALIST_AGENTS.map((agent) => {
          const isSelected = activeAgent === agent.id;
          return (
            <button
              key={agent.id}
              onClick={() => {
                sound.playClick();
                onSelectAgent(agent.id);
              }}
              className={`p-3 rounded-xl text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between h-28 ${
                isSelected
                  ? 'bg-white/10 border-2 border-[var(--theme-primary)] shadow-[0_0_15px_var(--theme-glow)]'
                  : 'bg-white/5 border border-[var(--theme-border)] hover:bg-white/8 hover:border-[var(--theme-primary)]/60'
              }`}
            >
              {/* Corner accent if selected */}
              {isSelected && (
                <div className="absolute top-0 right-0 w-3 h-3 bg-[var(--theme-primary)] [clip-path:polygon(100%_0,0_0,100%_100%)]" />
              )}

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div
                    className="p-1.5 rounded-lg bg-black/40 border border-white/10"
                    style={{ color: agent.accentColor }}
                  >
                    {getIcon(agent.icon)}
                  </div>
                  <span className="text-[10px] font-code opacity-60">
                    {agent.assignedMemoryMB} MB
                  </span>
                </div>
                <div className="text-xs font-bold tracking-wide font-rajdhani text-gray-100 truncate">
                  {agent.name}
                </div>
                <div className="text-[10px] font-code opacity-70 truncate">
                  {agent.codename}
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] font-code pt-1 border-t border-white/5">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: isSelected ? 'var(--theme-primary)' : '#10b981',
                  }}
                />
                <span className="opacity-80">
                  {isSelected ? 'ENGAGED' : 'STANDBY'}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
