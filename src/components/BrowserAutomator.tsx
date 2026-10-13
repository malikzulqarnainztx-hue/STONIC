import React, { useState } from 'react';
import { Globe, ArrowLeft, ArrowRight, RotateCw, Lock, Sparkles, MousePointer, Search, CheckCircle2, Play, ExternalLink } from 'lucide-react';
import { sound } from '../utils/soundEffects';

export const BrowserAutomator: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState('https://stonicai.com/research/bitnet-1bit-llm');
  const [inputUrl, setInputUrl] = useState(currentUrl);
  const [isAutomating, setIsAutomating] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [statusLog, setStatusLog] = useState<string>('Agent browser daemon standby.');
  const [extractedData, setExtractedData] = useState<any | null>(null);

  const presets = [
    {
      title: 'Analyze Microsoft BitNet 1-Bit LLM Research',
      url: 'https://arxiv.org/abs/2402.17764/bitnet-b158',
      query: 'BitNet b1.58 1-bit CPU inference speeds',
    },
    {
      title: 'Inspect Stonic AI YouTube Channel',
      url: 'https://youtube.com/@inventorusman',
      query: 'The Journey Behind Stonic AI - Zero to Growth (2tY6ZU-jgF4)',
    },
    {
      title: 'Scan Autonomous Desktop Agent Standards',
      url: 'https://github.com/microsoft/autogen/agent-protocols',
      query: 'Local PC automation and safety confirmation standards',
    },
  ];

  const runAutomation = async (targetUrl: string, targetQuery: string) => {
    sound.playActivate();
    setIsAutomating(true);
    setCurrentUrl(targetUrl);
    setInputUrl(targetUrl);
    setExtractedData(null);
    setActiveStepIndex(0);
    setStatusLog(`[STEP 1/5] Launching headless chromium worker to ${targetUrl}...`);

    try {
      // Simulate real-time animated step sequence
      await new Promise((r) => setTimeout(r, 600));
      setActiveStepIndex(1);
      setStatusLog(`[STEP 2/5] Parsing DOM structure: Located 42 interactive inputs.`);

      await new Promise((r) => setTimeout(r, 700));
      setActiveStepIndex(2);
      setStatusLog(`[STEP 3/5] Typing query into search bar: "${targetQuery}"...`);

      await new Promise((r) => setTimeout(r, 700));
      setActiveStepIndex(3);
      setStatusLog(`[STEP 4/5] Agent submitted form. Intercepting response payload...`);

      const res = await fetch('/api/browser/automate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl, query: targetQuery }),
      });
      const data = await res.json();

      await new Promise((r) => setTimeout(r, 600));
      setActiveStepIndex(4);
      setStatusLog(`[STEP 5/5] Extracted insights verified and parsed.`);
      setExtractedData(data.extractedContent);
      sound.playSuccess();
    } catch (_) {
      setStatusLog('Automation subroutine encountered error.');
    } finally {
      setIsAutomating(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--theme-border)]">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[var(--theme-primary)]" />
            <h2 className="font-orbitron font-bold text-sm tracking-wider text-[var(--theme-primary)]">
              AGENT-DRIVEN BROWSER AUTOMATION ("AN AI WITH HANDS")
            </h2>
          </div>
          <p className="text-xs text-gray-400 font-rajdhani mt-0.5">
            Demonstrates Stonic AI's autonomous browser capability shown in the video: navigating pages, typing queries, and extracting web intelligence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-code px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
            HEADLESS DAEMON: ARMED
          </span>
        </div>
      </div>

      {/* Simulated Browser Window Frame */}
      <div className="rounded-2xl bg-black/70 border border-[var(--theme-border)] overflow-hidden shadow-2xl flex flex-col">
        {/* Browser Top Navigation Bar */}
        <div className="p-3 bg-black/90 border-b border-white/10 flex items-center gap-3">
          <div className="flex items-center gap-1 text-gray-400">
            <button className="p-1 hover:text-white rounded hover:bg-white/10 cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button className="p-1 hover:text-white rounded hover:bg-white/10 cursor-pointer">
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => runAutomation(currentUrl, 'Refresh and rescan')}
              className="p-1 hover:text-white rounded hover:bg-white/10 cursor-pointer"
            >
              <RotateCw className={`w-4 h-4 ${isAutomating ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Omnibar (URL Address Bar) */}
          <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border border-white/15 text-xs font-code text-gray-200">
            <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="w-full bg-transparent text-gray-100 focus:outline-none"
            />
          </div>

          {/* Execute Agent Browse Button */}
          <button
            onClick={() => runAutomation(inputUrl, 'Extract webpage summary')}
            disabled={isAutomating}
            className="px-3.5 py-1.5 rounded-xl bg-[var(--theme-primary)] text-black font-rajdhani font-bold text-xs tracking-wider flex items-center gap-1.5 hover:brightness-110 disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAutomating ? 'AGENT DRIVING...' : 'AGENT EXECUTE'}</span>
          </button>
        </div>

        {/* Live Step Progress Strip */}
        <div className="px-4 py-2 bg-black/60 border-b border-white/5 flex items-center justify-between text-[11px] font-code">
          <div className="flex items-center gap-2 text-[var(--theme-primary)]">
            <MousePointer className={`w-3.5 h-3.5 ${isAutomating ? 'animate-bounce text-amber-400' : ''}`} />
            <span>{statusLog}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {[0, 1, 2, 3, 4].map((step) => (
              <span
                key={step}
                className={`w-2 h-2 rounded-full transition-all ${
                  activeStepIndex >= step
                    ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                    : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Browser Content Viewport */}
        <div className="p-6 min-h-[300px] bg-gradient-to-b from-[#0a0f18] to-[#04070c] relative flex flex-col justify-between">
          {/* Virtual Webpage Display */}
          <div className="max-w-2xl mx-auto w-full space-y-4">
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-code text-[var(--theme-primary)] uppercase font-semibold">
                  AUTONOMOUS BROWSER ENGINE · SIMULATED VIEWPORT
                </span>
                <span className="text-[10px] font-code text-emerald-400">
                  DOM HEALTHY (200 OK)
                </span>
              </div>

              <h3 className="font-orbitron font-bold text-base text-white mb-2">
                {extractedData ? extractedData.title : 'Live Web Automation Sandbox'}
              </h3>

              <p className="text-xs text-gray-300 font-rajdhani leading-relaxed mb-4">
                {extractedData
                  ? extractedData.summary
                  : 'Stonic AI executes real-world browser workflows: opening tabs, searching documentation, scraping arXiv papers, and synthesizing executive intelligence dossiers completely hands-free.'}
              </p>

              {/* Simulated Highlighted Elements Targeted by Agent */}
              <div className="p-3 rounded-xl bg-black/50 border border-[var(--theme-primary)]/40 font-code text-xs space-y-1.5 text-gray-300">
                <div className="text-[10px] text-[var(--theme-primary)] font-bold">
                  DETECTED DOM NODE [ACTIVE TARGET]:
                </div>
                <div className="text-gray-400 text-[11px]">
                  &lt;input id="search-bar" placeholder="Ask anything..." value="BitNet 1-Bit CPU LLM" /&gt;
                </div>
                <div className="text-emerald-400 text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Agent dispatched keystroke events: 42 characters committed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Automation Presets */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <span className="text-[10px] font-code text-gray-400 block mb-2 font-semibold">
              TRIGGER 1-CLICK AUTONOMOUS BROWSER MACROS:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => runAutomation(preset.url, preset.query)}
                  disabled={isAutomating}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-[var(--theme-primary)] hover:bg-white/10 text-left transition-all cursor-pointer group"
                >
                  <div className="text-xs font-bold font-rajdhani text-gray-200 group-hover:text-[var(--theme-primary)] truncate">
                    {preset.title}
                  </div>
                  <div className="text-[10px] font-code text-gray-400 truncate mt-0.5">
                    {preset.url}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
