export type ThemeId = 'arc-cyan' | 'cyber-amber' | 'crimson-matrix' | 'stealth-emerald';

export type AgentRole = 'core' | 'dev' | 'research' | 'os' | 'security';

export type EmotionType =
  | 'inspired'
  | 'empathetic'
  | 'enthusiastic'
  | 'caring'
  | 'thoughtful'
  | 'proud'
  | 'curious'
  | 'reassured'
  | 'witty';

export interface EmotionState {
  feeling: EmotionType;
  mood: string;
  intensity: number; // 0 - 100
  heartbeatBpm: number; // e.g. 72 - 108
  valence: number; // -1 to 1
  arousal: number; // 0 to 1
  feelingTone: string;
  empathyQuote?: string;
}

export interface SpecialistAgent {
  id: AgentRole;
  name: string;
  codename: string;
  title: string;
  description: string;
  icon: string;
  accentColor: string;
  status: 'active' | 'busy' | 'standby';
  currentTask?: string;
  assignedMemoryMB: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  agent?: AgentRole;
  text: string;
  timestamp: string;
  audioAvailable?: boolean;
  audioBase64?: string;
  emotion?: EmotionState;
  actions?: Array<{ type: string; label: string }>;
  plan?: Array<{ step: number; title: string; status: 'pending' | 'in_progress' | 'completed' }>;
}

export interface SystemTelemetry {
  cpuUsage: number;
  cpuTemp: number;
  ramUsage: number;
  ramUsedGB: number;
  ramTotalGB: number;
  gpuUsage: number;
  gpuTemp: number;
  networkUpKBps: number;
  networkDownKBps: number;
  diskUsage: number;
  activeProcessesCount: number;
  protocol0Active: boolean;
  uptimeSeconds: number;
}

export interface WorkflowItem {
  id: string;
  title: string;
  category: 'System' | 'Files' | 'Research' | 'Security';
  description: string;
  estimatedTime: string;
  requiresConfirmation: boolean;
}

export interface AgentTownNode {
  id: AgentRole;
  name: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  station: string;
  status: 'idle' | 'walking' | 'working' | 'communicating';
  currentThought: string;
  collaboratingWith?: AgentRole;
  avatarColor: string;
}
