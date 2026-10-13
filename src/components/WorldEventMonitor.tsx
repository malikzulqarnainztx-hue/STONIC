import React, { useState, useEffect } from 'react';
import { Globe, Radio, AlertCircle, RefreshCw, Zap, Shield, Search, ArrowUpRight } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface WorldEvent {
  id: string;
  title: string;
  category: string;
  location: string;
  coordinates: [number, number];
  severity: string;
  timestamp: string;
  summary: string;
}

export const WorldEventMonitor: React.FC = () => {
  const [events, setEvents] = useState<WorldEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<WorldEvent | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/world-events');
      const data = await res.json();
      if (data.events) {
        setEvents(data.events);
        setSelectedEvent(data.events[0]);
      }
    } catch (_) {
      // Fallback local data
      const defaultEvts: WorldEvent[] = [
        {
          id: 'evt-1',
          title: 'Microsoft BitNet 1-Bit LLM CPU Breakthrough',
          category: 'AI & NEURAL',
          location: 'Redmond, WA',
          coordinates: [-122.12, 47.67],
          severity: 'breakthrough',
          timestamp: '14 mins ago',
          summary: 'Ternary quantization (-1, 0, 1) enables 100B parameter models to run at reading speed on single CPUs without dedicated GPUs.',
        },
        {
          id: 'evt-2',
          title: 'Global Autonomous Agent Protocols Ratified',
          category: 'AUTONOMY',
          location: 'Geneva, Switzerland',
          coordinates: [6.14, 46.2],
          severity: 'nominal',
          timestamp: '42 mins ago',
          summary: 'Consortium agrees on sandboxed local execution standards for PC-level automation daemons.',
        },
      ];
      setEvents(defaultEvts);
      setSelectedEvent(defaultEvts[0]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = categoryFilter === 'ALL'
    ? events
    : events.filter((e) => e.category.toLowerCase().includes(categoryFilter.toLowerCase()));

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--theme-border)]">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[var(--theme-primary)]" />
            <h2 className="font-orbitron font-bold text-sm tracking-wider text-[var(--theme-primary)]">
              STONIC WORLD EVENT & INTELLIGENCE RADAR
            </h2>
          </div>
          <p className="text-xs text-gray-400 font-rajdhani mt-0.5">
            Real-time planetary telemetry monitor tracking breakthroughs, autonomy milestones, and global events.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Segmented Filter */}
          <div className="flex items-center gap-1 p-1 bg-black/50 rounded-xl border border-[var(--theme-border)] text-[10px] font-code">
            {['ALL', 'AI & NEURAL', 'AUTONOMY', 'PHYSICS'].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  sound.playClick();
                  setCategoryFilter(cat);
                }}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-white/15 text-white font-bold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              sound.playClick();
              fetchEvents();
            }}
            title="Refresh Intelligence Feed"
            className="p-2 rounded-xl bg-white/5 border border-[var(--theme-border)] text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Grid: Interactive Holographic Globe Radar on Left, Event Stream on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Holographic Radar Simulation Display (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-black/60 border border-[var(--theme-border)] p-4 relative overflow-hidden flex flex-col justify-between cyber-grid min-h-[320px]">
          {/* Top Status */}
          <div className="flex items-center justify-between text-[11px] font-code opacity-75 z-10">
            <span className="flex items-center gap-2 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              GLOBAL SATELLITE LINK ACTIVE
            </span>
            <span>BEARING: 042° · ELEVATION: 18.4°</span>
          </div>

          {/* Central Globe Rings & Coordinates Animation */}
          <div className="relative w-64 h-64 mx-auto my-auto flex items-center justify-center">
            {/* Concentric Radar Rings */}
            <div className="absolute inset-0 rounded-full border border-[var(--theme-border)]/50 animate-pulse-ring" />
            <div className="absolute inset-8 rounded-full border border-dashed border-[var(--theme-primary)]/40 animate-spin-slow" />
            <div className="absolute inset-16 rounded-full border border-[var(--theme-border)]/30" />
            <div className="absolute inset-24 rounded-full border border-[var(--theme-primary)]/60 animate-spin-reverse" />

            {/* Crosshairs */}
            <div className="absolute w-full h-[1px] bg-[var(--theme-border)]/40" />
            <div className="absolute h-full w-[1px] bg-[var(--theme-border)]/40" />

            {/* Sweep Beam */}
            <div className="absolute top-1/2 left-1/2 w-32 h-32 origin-top-left -translate-x-full -translate-y-full rounded-tl-full bg-gradient-to-br from-[var(--theme-glow-soft)] to-transparent pointer-events-none animate-radar opacity-40" />

            {/* Simulated Geographic Pulsing Pins */}
            {events.map((evt, idx) => {
              const angles = [35, 120, 210, 315];
              const dists = [70, 85, 60, 95];
              const angle = angles[idx % angles.length];
              const dist = dists[idx % dists.length];
              const rad = (angle * Math.PI) / 180;
              const x = Math.cos(rad) * dist;
              const y = Math.sin(rad) * dist;
              const isSelected = selectedEvent?.id === evt.id;

              return (
                <button
                  key={evt.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedEvent(evt);
                  }}
                  className="absolute cursor-pointer group z-20"
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border transition-transform group-hover:scale-150 ${
                      isSelected
                        ? 'bg-[var(--theme-primary)] border-white shadow-[0_0_12px_var(--theme-glow)]'
                        : 'bg-amber-400 border-black'
                    }`}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-black" />
                  </div>
                  <span className="absolute left-4 top-0 text-[10px] font-code whitespace-nowrap bg-black/80 px-1.5 py-0.5 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                    {evt.location}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bottom Telemetry Bar */}
          <div className="flex items-center justify-between text-[10px] font-code text-gray-400 pt-2 border-t border-white/5 z-10">
            <span>NODES MONITORED: 18,420</span>
            <span className="text-[var(--theme-primary)]">COVERAGE: 100% PLANETARY</span>
          </div>
        </div>

        {/* Selected Event Briefing & Feed (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {selectedEvent && (
            <div className="p-4 rounded-2xl bg-black/50 border border-[var(--theme-primary)]/40 shadow-[0_0_15px_var(--theme-glow-soft)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-code px-2 py-0.5 rounded bg-[var(--theme-primary)]/15 text-[var(--theme-primary)] font-bold">
                  {selectedEvent.category}
                </span>
                <span className="text-[10px] font-code opacity-60">
                  {selectedEvent.timestamp}
                </span>
              </div>
              <h3 className="font-rajdhani font-bold text-base text-white leading-snug">
                {selectedEvent.title}
              </h3>
              <div className="text-[11px] font-code text-gray-400 mt-1 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[var(--theme-primary)]" />
                <span>LOCATION: {selectedEvent.location}</span>
              </div>
              <p className="text-xs text-gray-300 font-rajdhani mt-2.5 leading-relaxed">
                {selectedEvent.summary}
              </p>
            </div>
          )}

          {/* Events List */}
          <div className="rounded-2xl bg-black/40 border border-[var(--theme-border)] p-3 flex-1 flex flex-col">
            <span className="text-[11px] font-code text-gray-400 mb-2 font-semibold">
              INCOMING INTELLIGENCE FEED ({filteredEvents.length})
            </span>
            <div className="space-y-2 overflow-y-auto max-h-56">
              {filteredEvents.map((evt) => {
                const isSelected = selectedEvent?.id === evt.id;
                return (
                  <div
                    key={evt.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedEvent(evt);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white/10 border-[var(--theme-primary)] text-white shadow-sm'
                        : 'bg-white/5 border-white/5 hover:bg-white/8 hover:border-white/15 text-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-code mb-1">
                      <span className="font-semibold text-[var(--theme-primary)]">{evt.category}</span>
                      <span className="opacity-60">{evt.timestamp}</span>
                    </div>
                    <div className="text-xs font-bold font-rajdhani truncate text-gray-100">
                      {evt.title}
                    </div>
                    <div className="text-[10px] font-code text-gray-400 truncate mt-0.5">
                      📍 {evt.location}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
