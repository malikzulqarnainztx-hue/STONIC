import React, { useState } from 'react';
import { Play, CheckCircle2, AlertTriangle, Terminal, RefreshCw, Layers, ShieldCheck } from 'lucide-react';
import { WorkflowItem } from '../types';
import { sound } from '../utils/soundEffects';

interface WorkflowAutomationProps {
  onWorkflowComplete: (workflowName: string) => void;
}

export const WORKFLOWS: WorkflowItem[] = [
  {
    id: 'clean-downloads',
    title: 'Automated Downloads & Cache Sanitation',
    category: 'Files',
    description: 'Scans cluttered directories, archives documents, and removes duplicate temporary artifacts.',
    estimatedTime: '1.2s',
    requiresConfirmation: true,
  },
  {
    id: 'system-diagnostics',
    title: 'Full Hardware & Subsystem Telemetry Audit',
    category: 'System',
    description: 'Executes voltage check on CPU cores, RAM page fault test, SMART SSD health check, and GPU clock verify.',
    estimatedTime: '0.8s',
    requiresConfirmation: false,
  },
  {
    id: 'deep-research',
    title: 'Autonomous Intelligence Reconnaissance',
    category: 'Research',
    description: 'Deploys Research Specialist to crawl scientific papers, extract summaries, and write an executive briefing.',
    estimatedTime: '2.5s',
    requiresConfirmation: false,
  },
  {
    id: 'security-sweep',
    title: 'Perimeter & Port Threat Vulnerability Sweep',
    category: 'Security',
    description: 'Audits open socket connections, verifies process binary signatures, and engages Protocol 0 defenses.',
    estimatedTime: '1.5s',
    requiresConfirmation: true,
  },
];

export const WorkflowAutomation: React.FC<WorkflowAutomationProps> = ({ onWorkflowComplete }) => {
  const [runningWorkflowId, setRunningWorkflowId] = useState<string | null>(null);
  const [confirmationWorkflow, setConfirmationWorkflow] = useState<WorkflowItem | null>(null);
  const [activeLogs, setActiveLogs] = useState<string[]>([]);
  const [lastMetrics, setLastMetrics] = useState<any | null>(null);

  const executeWorkflow = async (workflow: WorkflowItem) => {
    sound.playClick();
    if (workflow.requiresConfirmation) {
      sound.playAlert();
      setConfirmationWorkflow(workflow);
      return;
    }
    await runWorkflowDirectly(workflow);
  };

  const runWorkflowDirectly = async (workflow: WorkflowItem) => {
    setRunningWorkflowId(workflow.id);
    setActiveLogs([`[STONIC OS] Commencing workflow: "${workflow.title}"...`]);

    try {
      const res = await fetch('/api/system/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowId: workflow.id }),
      });
      const data = await res.json();

      if (data.success && data.workflow) {
        // Stream logs one by one
        for (let i = 0; i < data.workflow.logs.length; i++) {
          await new Promise((r) => setTimeout(r, 220));
          setActiveLogs((prev) => [...prev, data.workflow.logs[i]]);
        }
        setLastMetrics(data.workflow.metrics);
        sound.playSuccess();
        onWorkflowComplete(workflow.title);
      }
    } catch (err) {
      setActiveLogs((prev) => [...prev, '[ERROR] Subroutine execution interrupted.']);
    } finally {
      setRunningWorkflowId(null);
    }
  };

  const handleConfirm = async () => {
    if (!confirmationWorkflow) return;
    const wf = confirmationWorkflow;
    setConfirmationWorkflow(null);
    await runWorkflowDirectly(wf);
  };

  return (
    <div className="w-full hud-panel rounded-2xl p-5 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--theme-border)]">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[var(--theme-primary)]" />
          <h2 className="font-orbitron font-bold text-sm tracking-wider text-[var(--theme-primary)]">
            AUTONOMOUS WORKFLOWS & SYSTEM ENGINE
          </h2>
        </div>
        <span className="text-[11px] font-code opacity-70">
          SAFETY GUARANTEE: HUMAN-IN-THE-LOOP ACTIVE
        </span>
      </div>

      {/* Grid of Workflows */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {WORKFLOWS.map((wf) => {
          const isRunning = runningWorkflowId === wf.id;

          return (
            <div
              key={wf.id}
              className="p-4 rounded-xl bg-black/40 border border-[var(--theme-border)] hover:border-[var(--theme-primary)]/80 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-code px-2 py-0.5 rounded bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] border border-[var(--theme-border)] uppercase font-semibold">
                    {wf.category}
                  </span>
                  <span className="text-[10px] font-code opacity-60">
                    EST: {wf.estimatedTime}
                  </span>
                </div>
                <h3 className="font-rajdhani font-bold text-sm text-gray-100">
                  {wf.title}
                </h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed font-rajdhani">
                  {wf.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-code opacity-60 flex items-center gap-1">
                  {wf.requiresConfirmation ? (
                    <>
                      <AlertTriangle className="w-3 h-3 text-amber-400" />
                      <span>Requires Confirmation</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>Autonomous Execution</span>
                    </>
                  )}
                </span>

                <button
                  onClick={() => executeWorkflow(wf)}
                  disabled={Boolean(runningWorkflowId)}
                  className="px-3.5 py-1.5 rounded-lg bg-[var(--theme-primary)] text-black font-rajdhani font-bold text-xs tracking-wider flex items-center gap-1.5 transition-all hover:brightness-110 active:scale-95 disabled:opacity-40 cursor-pointer shadow-[0_0_10px_var(--theme-glow)]"
                >
                  {isRunning ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>EXECUTING...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>EXECUTE</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Terminal Output Console */}
      <div className="rounded-xl bg-black/70 border border-[var(--theme-border)] p-3">
        <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-white/10">
          <div className="flex items-center gap-2 text-xs font-code text-[var(--theme-primary)]">
            <Terminal className="w-3.5 h-3.5" />
            <span>EXECUTION CONSOLE OUTPUT</span>
          </div>
          {lastMetrics && (
            <div className="text-[10px] font-code text-emerald-400">
              METRICS: {JSON.stringify(lastMetrics)}
            </div>
          )}
        </div>

        <div className="font-code text-xs text-gray-300 min-h-20 max-h-36 overflow-y-auto space-y-1">
          {activeLogs.length === 0 ? (
            <div className="opacity-40 italic">
              Awaiting workflow trigger. Select any routine above to execute autonomous desktop automation.
            </div>
          ) : (
            activeLogs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-[var(--theme-primary)]">❯</span>
                <span>{log}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Human In The Loop Safety Confirmation Modal */}
      {confirmationWorkflow && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md hud-panel rounded-2xl p-6 border-2 border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.5)]">
            <div className="flex items-center gap-3 text-amber-400 mb-3">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-orbitron font-bold text-base">
                HUMAN-IN-THE-LOOP AUTHORIZATION
              </h3>
            </div>

            <p className="text-sm text-gray-200 mb-2 font-rajdhani">
              Stonic AI is requesting administrative approval before running high-impact workflow:
            </p>
            <div className="p-3 rounded-lg bg-black/50 border border-amber-400/30 text-xs font-code mb-4 text-amber-200">
              {confirmationWorkflow.title}
              <div className="text-gray-400 mt-1">{confirmationWorkflow.description}</div>
            </div>

            <p className="text-xs text-gray-400 mb-5 font-code">
              Permission check: All changes are locally sandboxed with complete audit log history.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setConfirmationWorkflow(null)}
                className="px-4 py-2 rounded-xl bg-white/10 text-gray-300 text-xs font-code hover:bg-white/20 cursor-pointer"
              >
                ABORT / CANCEL
              </button>
              <button
                onClick={handleConfirm}
                className="px-5 py-2 rounded-xl bg-amber-400 text-black font-bold text-xs font-code hover:bg-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.6)] cursor-pointer"
              >
                AUTHORIZE EXECUTION
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
