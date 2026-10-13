import React, { useState, useEffect } from 'react';
import { Activity, Cpu, HardDrive, Wifi, Shield, AlertOctagon, Terminal, Radio } from 'lucide-react';
import { SystemTelemetry } from '../types';
import { sound } from '../utils/soundEffects';

interface TelemetryHUDProps {
  telemetry: SystemTelemetry;
  onToggleProtocol0: () => void;
}

export const TelemetryHUD: React.FC<TelemetryHUDProps> = ({ telemetry, onToggleProtocol0 }) => {
  const [networkPoints, setNetworkPoints] = useState<number[]>([
    20, 35, 45, 60, 40, 55, 75, 40, 30, 65, 85, 45, 60, 70, 50, 65,
  ]);

  // Live fluctuating network data
  useEffect(() => {
    const timer = setInterval(() => {
      setNetworkPoints((prev) => [
        ...prev.slice(1),
        Math.floor(20 + Math.random() * 70),
      ]);
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  const processes = [
    { pid: 1042, name: 'stonic-core-agent.bin', cpu: '4.2%', ram: '512 MB', status: 'CRITICAL_THREAD' },
    { pid: 2184, name: 'gemini-flash-neural.node', cpu: '7.8%', ram: '840 MB', status: 'ACTIVE' },
    { pid: 3891, name: 'agent-town-spatial.sys', cpu: '2.1%', ram: '280 MB', status: 'SYNCHRONIZED' },
    { pid: 4402, name: 'aegis-cyber-sentinel.dll', cpu: '1.4%', ram: '190 MB', status: 'ARMED' },
    { pid: 5120, name: 'tts-audio-synthesizer.pcm', cpu: '0.8%', ram: '140 MB', status: 'STANDBY' },
  ];

  return (
    <div className="w-full hud-panel rounded-2xl p-5 flex flex-col gap-5">
      {/* Top Header with Protocol 0 Emergency Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--theme-border)]">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[var(--theme-primary)]" />
          <h2 className="font-orbitron font-bold text-sm tracking-wider text-[var(--theme-primary)]">
            SYSTEM TELEMETRY & HARDWARE MATRIX
          </h2>
        </div>

        <button
          onClick={() => {
            sound.playAlert();
            onToggleProtocol0();
          }}
          className={`px-4 py-2 rounded-xl text-xs font-code font-bold flex items-center gap-2 transition-all cursor-pointer ${
            telemetry.protocol0Active
              ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.8)] border border-red-400 animate-pulse'
              : 'bg-white/5 border border-red-500/40 text-red-400 hover:bg-red-500/20'
          }`}
        >
          <AlertOctagon className="w-4 h-4" />
          <span>{telemetry.protocol0Active ? 'PROTOCOL 0 ACTIVE [ENGAGED]' : 'ENGAGE PROTOCOL 0 (LOCKDOWN)'}</span>
        </button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* CPU */}
        <div className="p-3.5 rounded-xl bg-black/40 border border-[var(--theme-border)]">
          <div className="flex items-center justify-between text-xs font-code opacity-70 mb-2">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[var(--theme-primary)]" />
              <span>CPU LOAD</span>
            </span>
            <span className="text-[var(--theme-primary)]">{telemetry.cpuTemp}°C</span>
          </div>
          <div className="font-orbitron text-xl font-bold text-white mb-2">
            {telemetry.cpuUsage}%
          </div>
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[var(--theme-primary)] h-full transition-all duration-500"
              style={{ width: `${telemetry.cpuUsage}%` }}
            />
          </div>
          <div className="text-[10px] font-code opacity-50 mt-2">
            8 CORES / 16 THREADS ACTIVE
          </div>
        </div>

        {/* RAM */}
        <div className="p-3.5 rounded-xl bg-black/40 border border-[var(--theme-border)]">
          <div className="flex items-center justify-between text-xs font-code opacity-70 mb-2">
            <span className="flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-[var(--theme-primary)]" />
              <span>RAM USAGE</span>
            </span>
            <span className="text-[var(--theme-primary)]">{telemetry.ramUsage}%</span>
          </div>
          <div className="font-orbitron text-xl font-bold text-white mb-2">
            {telemetry.ramUsedGB} <span className="text-xs font-normal opacity-60">/ {telemetry.ramTotalGB} GB</span>
          </div>
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[var(--theme-accent)] h-full transition-all duration-500"
              style={{ width: `${telemetry.ramUsage}%` }}
            />
          </div>
          <div className="text-[10px] font-code opacity-50 mt-2">
            DDR5 DUAL CHANNEL 6000MHz
          </div>
        </div>

        {/* GPU */}
        <div className="p-3.5 rounded-xl bg-black/40 border border-[var(--theme-border)]">
          <div className="flex items-center justify-between text-xs font-code opacity-70 mb-2">
            <span className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-[var(--theme-primary)]" />
              <span>GPU ENGINE</span>
            </span>
            <span className="text-[var(--theme-primary)]">{telemetry.gpuTemp}°C</span>
          </div>
          <div className="font-orbitron text-xl font-bold text-white mb-2">
            {telemetry.gpuUsage}%
          </div>
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[var(--theme-primary)] h-full transition-all duration-500"
              style={{ width: `${telemetry.gpuUsage}%` }}
            />
          </div>
          <div className="text-[10px] font-code opacity-50 mt-2">
            TENSOR ACCELERATOR READY
          </div>
        </div>

        {/* DISK I/O */}
        <div className="p-3.5 rounded-xl bg-black/40 border border-[var(--theme-border)]">
          <div className="flex items-center justify-between text-xs font-code opacity-70 mb-2">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[var(--theme-primary)]" />
              <span>NVMe STORAGE</span>
            </span>
            <span className="text-emerald-400">99% HEALTH</span>
          </div>
          <div className="font-orbitron text-xl font-bold text-white mb-2">
            {telemetry.diskUsage}% <span className="text-xs font-normal opacity-60">ALLOCATED</span>
          </div>
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-400 h-full transition-all duration-500"
              style={{ width: `${telemetry.diskUsage}%` }}
            />
          </div>
          <div className="text-[10px] font-code opacity-50 mt-2">
            PCIE 4.0 7,400 MB/s READ
          </div>
        </div>
      </div>

      {/* Network Bandwidth Graph */}
      <div className="p-4 rounded-xl bg-black/40 border border-[var(--theme-border)]">
        <div className="flex items-center justify-between mb-3 text-xs font-code">
          <div className="flex items-center gap-2 text-[var(--theme-primary)] font-semibold">
            <Wifi className="w-3.5 h-3.5" />
            <span>REAL-TIME BANDWIDTH TELEMETRY</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] opacity-80">
            <span>DL: {telemetry.networkDownKBps} KB/s</span>
            <span>UL: {telemetry.networkUpKBps} KB/s</span>
          </div>
        </div>

        {/* Sparkline / Bar Graph */}
        <div className="flex items-end gap-1.5 h-16 pt-2">
          {networkPoints.map((val, i) => (
            <div
              key={i}
              className="flex-1 bg-[var(--theme-primary)]/80 rounded-t transition-all duration-300"
              style={{ height: `${val}%` }}
            />
          ))}
        </div>
      </div>

      {/* Process Table */}
      <div className="rounded-xl bg-black/40 border border-[var(--theme-border)] p-3">
        <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-white/5 text-xs font-code text-[var(--theme-primary)] font-semibold">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5" />
            <span>ACTIVE SYSTEM PROCESSES ({telemetry.activeProcessesCount} THREADS)</span>
          </div>
          <span className="text-[10px] font-code opacity-60">SANDBOX INTEGRITY: VERIFIED</span>
        </div>

        <div className="space-y-1.5 overflow-x-auto">
          {processes.map((p) => (
            <div
              key={p.pid}
              className="flex items-center justify-between text-xs font-code p-2 rounded-lg bg-white/5 hover:bg-white/8 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="opacity-40 w-12">PID {p.pid}</span>
                <span className="font-semibold text-gray-200">{p.name}</span>
              </div>
              <div className="flex items-center gap-4 text-[11px]">
                <span className="opacity-70">CPU: {p.cpu}</span>
                <span className="opacity-70">RAM: {p.ram}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {p.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
