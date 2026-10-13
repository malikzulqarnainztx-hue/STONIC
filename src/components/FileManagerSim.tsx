import React, { useState } from 'react';
import { Folder, FileText, Image, Archive, Code, Sparkles, Check, Trash2, ArrowUpDown } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface FileItem {
  id: string;
  name: string;
  size: string;
  type: 'document' | 'image' | 'archive' | 'code';
  folder: string;
  modified: string;
  organized?: boolean;
}

export const FileManagerSim: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([
    { id: '1', name: 'quantum-agent-brief.pdf', size: '2.4 MB', type: 'document', folder: 'Downloads', modified: '2 hours ago' },
    { id: '2', name: 'hud-render-capture.png', size: '4.8 MB', type: 'image', folder: 'Downloads', modified: '4 hours ago' },
    { id: '3', name: 'stonic-backup-v2.zip', size: '18.2 MB', type: 'archive', folder: 'Downloads', modified: 'Yesterday' },
    { id: '4', name: 'neural-dispatcher.ts', size: '14 KB', type: 'code', folder: 'Desktop', modified: 'Today' },
    { id: '5', name: 'system-audit-log.json', size: '128 KB', type: 'code', folder: 'Downloads', modified: '3 hours ago' },
    { id: '6', name: 'ironman-arc-schematic.svg', size: '890 KB', type: 'image', folder: 'Downloads', modified: 'Just now' },
  ]);

  const [isOrganizing, setIsOrganizing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSmartOrganize = () => {
    sound.playActivate();
    setIsOrganizing(true);
    setStatusMessage('Stonic OS Daemon analyzing file taxonomy and destination routes...');

    setTimeout(() => {
      setFiles((prev) =>
        prev.map((f) => {
          let newFolder = f.folder;
          if (f.type === 'document') newFolder = 'Documents/Archive';
          if (f.type === 'image') newFolder = 'Media/Design';
          if (f.type === 'archive') newFolder = 'Vault/Backups';
          if (f.type === 'code') newFolder = 'Projects/Source';
          return { ...f, folder: newFolder, organized: true };
        })
      );
      setIsOrganizing(false);
      sound.playSuccess();
      setStatusMessage('✓ Smart Organization Complete: 6 files re-indexed and moved into categorized hierarchies.');
    }, 1200);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="w-4 h-4 text-sky-400" />;
      case 'image':
        return <Image className="w-4 h-4 text-emerald-400" />;
      case 'archive':
        return <Archive className="w-4 h-4 text-amber-400" />;
      case 'code':
        return <Code className="w-4 h-4 text-purple-400" />;
      default:
        return <Folder className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="w-full hud-panel rounded-2xl p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--theme-border)]">
        <div>
          <div className="flex items-center gap-2">
            <Folder className="w-4 h-4 text-[var(--theme-primary)]" />
            <h2 className="font-orbitron font-bold text-sm tracking-wider text-[var(--theme-primary)]">
              DESKTOP FILE MANAGER & AUTONOMOUS SANITATION
            </h2>
          </div>
          <p className="text-xs text-gray-400 font-rajdhani mt-0.5">
            Demonstrates Stonic AI's ability to autonomously sort folders, catalog documents, and maintain a spotless file system.
          </p>
        </div>

        <button
          onClick={handleSmartOrganize}
          disabled={isOrganizing}
          className="px-4 py-2 rounded-xl bg-[var(--theme-primary)] text-black font-rajdhani font-bold text-xs tracking-wider flex items-center gap-1.5 hover:brightness-110 active:scale-95 disabled:opacity-50 cursor-pointer shadow-[0_0_12px_var(--theme-glow)]"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isOrganizing ? 'ORGANIZING...' : 'AUTONOMOUS SMART ORGANIZE'}</span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-2.5 rounded-lg bg-[var(--theme-primary)]/10 border border-[var(--theme-border)] text-xs font-code text-[var(--theme-primary)] flex items-center gap-2">
          <span>{statusMessage}</span>
        </div>
      )}

      {/* File List */}
      <div className="rounded-xl bg-black/40 border border-[var(--theme-border)] overflow-hidden">
        <div className="grid grid-cols-12 text-[11px] font-code text-gray-400 p-2.5 bg-black/50 border-b border-white/5">
          <div className="col-span-5">NAME</div>
          <div className="col-span-3">LOCATION FOLDER</div>
          <div className="col-span-2">SIZE</div>
          <div className="col-span-2 text-right">STATUS</div>
        </div>

        <div className="divide-y divide-white/5">
          {files.map((file) => (
            <div
              key={file.id}
              className="grid grid-cols-12 items-center text-xs font-code p-2.5 hover:bg-white/5 transition-colors"
            >
              <div className="col-span-5 flex items-center gap-2.5 text-gray-200 truncate">
                {getFileIcon(file.type)}
                <span className="truncate">{file.name}</span>
              </div>
              <div className="col-span-3 text-gray-400 truncate flex items-center gap-1">
                <Folder className="w-3 h-3 text-[var(--theme-primary)] opacity-70 shrink-0" />
                <span>/{file.folder}</span>
              </div>
              <div className="col-span-2 text-gray-400">{file.size}</div>
              <div className="col-span-2 text-right">
                {file.organized ? (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    SORTED
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    UNSORTED
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
