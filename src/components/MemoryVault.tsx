import React, { useState, useEffect } from 'react';
import { Brain, Heart, Plus, Sparkles, Check, Trash2, Cpu, ShieldAlert, Award } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface Memory {
  id: string;
  category: 'preference' | 'work_pattern' | 'personal' | 'goal';
  key: string;
  value: string;
  confidence: number;
  updatedAt: string;
}

export const MemoryVault: React.FC = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newCategory, setNewCategory] = useState<'preference' | 'work_pattern' | 'personal' | 'goal'>('preference');
  const [isAdding, setIsAdding] = useState(false);

  const fetchMemories = async () => {
    try {
      const res = await fetch('/api/memory');
      const data = await res.json();
      if (data.memories) {
        setMemories(data.memories);
      }
    } catch (_) {
      // Fallback
    }
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  const handleAddMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newValue.trim()) return;

    sound.playSuccess();
    try {
      const res = await fetch('/api/memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: newCategory,
          key: newKey.trim(),
          value: newValue.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMemories((prev) => [data.memory, ...prev]);
        setNewKey('');
        setNewValue('');
        setIsAdding(false);
      }
    } catch (_) {
      sound.playAlert();
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Header with Emotional Connection Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--theme-border)]">
        <div>
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-[var(--theme-primary)]" />
            <h2 className="font-orbitron font-bold text-sm tracking-wider text-[var(--theme-primary)]">
              STONIC MIND · MEMORY-BASED LEARNING VAULT
            </h2>
          </div>
          <p className="text-xs text-gray-400 font-rajdhani mt-0.5">
            "A PC that gets to know you." Stonic AI learns your work patterns, habits, and preferences to provide movie-grade emotional companionship.
          </p>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            setIsAdding(!isAdding);
          }}
          className="px-4 py-2 rounded-xl bg-[var(--theme-primary)] text-black font-rajdhani font-bold text-xs tracking-wider flex items-center gap-1.5 hover:brightness-110 active:scale-95 cursor-pointer shadow-[0_0_12px_var(--theme-glow)]"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? 'CANCEL' : 'TEACH STONIC NEW MEMORY'}</span>
        </button>
      </div>

      {/* Metrics Bar: Personal Connection & Learning Depth */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-black/40 border border-[var(--theme-border)] flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-pink-500/15 text-pink-400 border border-pink-500/30">
            <Heart className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] font-code text-gray-400">EMOTIONAL CONNECTION</div>
            <div className="font-orbitron font-bold text-sm text-pink-400">JARVIS LEVEL: 98.6%</div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-black/40 border border-[var(--theme-border)] flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[var(--theme-primary)]/15 text-[var(--theme-primary)] border border-[var(--theme-border)]">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-code text-gray-400">ACTIVE MEMORY NODES</div>
            <div className="font-orbitron font-bold text-sm text-[var(--theme-primary)]">{memories.length} LEARNED</div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-black/40 border border-[var(--theme-border)] flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-code text-gray-400">PRIVACY ASSURANCE</div>
            <div className="font-orbitron font-bold text-sm text-emerald-400">100% LOCAL & ON-DEVICE</div>
          </div>
        </div>
      </div>

      {/* Add Memory Form */}
      {isAdding && (
        <form onSubmit={handleAddMemory} className="p-4 rounded-xl bg-black/60 border border-[var(--theme-primary)] space-y-3">
          <div className="text-xs font-orbitron font-bold text-[var(--theme-primary)]">
            TEACH YOUR PC A NEW ATTRIBUTE OR HABIT
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-code text-gray-400 mb-1 block">CATEGORY</label>
              <select
                value={newCategory}
                onChange={(e: any) => setNewCategory(e.target.value)}
                className="w-full bg-black/80 border border-[var(--theme-border)] rounded-lg p-2 text-xs font-code text-white focus:outline-none"
              >
                <option value="preference">Preference</option>
                <option value="work_pattern">Work Pattern</option>
                <option value="goal">Goal / Objective</option>
                <option value="personal">Personal Trait</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-code text-gray-400 mb-1 block">ATTRIBUTE NAME</label>
              <input
                type="text"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="e.g. Favorite Language, Sleep Schedule..."
                className="w-full bg-black/80 border border-[var(--theme-border)] rounded-lg p-2 text-xs font-code text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-code text-gray-400 mb-1 block">WHAT STONIC SHOULD REMEMBER</label>
              <input
                type="text"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="e.g. Likes TypeScript, Works at 2 AM..."
                className="w-full bg-black/80 border border-[var(--theme-border)] rounded-lg p-2 text-xs font-code text-white focus:outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-[var(--theme-primary)] text-black text-xs font-code font-bold hover:brightness-110 cursor-pointer"
            >
              COMMIT TO PERSISTENT NEURAL CACHE
            </button>
          </div>
        </form>
      )}

      {/* Memory Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {memories.map((mem) => {
          const categoryColors = {
            preference: 'text-sky-400 border-sky-400/30 bg-sky-400/10',
            work_pattern: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
            goal: 'text-purple-400 border-purple-400/30 bg-purple-400/10',
            personal: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
          };

          return (
            <div
              key={mem.id}
              className="p-4 rounded-xl bg-black/40 border border-[var(--theme-border)] hover:border-[var(--theme-primary)] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[9px] font-code px-2 py-0.5 rounded border uppercase font-bold ${
                      categoryColors[mem.category] || categoryColors.preference
                    }`}
                  >
                    {mem.category.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-code opacity-50">
                    {mem.updatedAt}
                  </span>
                </div>
                <div className="text-xs font-bold font-orbitron text-gray-100 mb-1">
                  {mem.key}
                </div>
                <p className="text-xs text-gray-300 font-rajdhani leading-relaxed">
                  "{mem.value}"
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] font-code opacity-70">
                <span>CONFIDENCE: {(mem.confidence * 100).toFixed(0)}%</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>ACTIVE IN DIALOGUE</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
