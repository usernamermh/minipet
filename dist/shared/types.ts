// 宠物状态接口
export interface PetState {
  // 基础属性
  hunger: number;        // 饥饿值 0-100
  cleanliness: number;   // 清洁值 0-100
  energy: number;       // 精力值 0-100
  mood: number;         // 心情值 0-100
  level: number;        // 等级
  exp: number;          // 经验值
  
  // 宠物阶段
  ageInDays: number;    // 年龄（天）
  stage: 'baby' | 'teen' | 'adult'; // 阶段
  
  // 时间戳
  lastUpdate: string;   // 上次更新时间 ISO格式
  createdAt: string;    // 创建时间 ISO格式
  
  // 交互历史
  interactionHistory: Array<{
    type: string;       // 交互类型
    timestamp: string;  // 时间戳
    valueChange: number; // 属性变化值
  }>;
  
  // 对话记忆
  conversationMemory: Array<{
    role: 'user' | 'pet';
    content: string;
    timestamp: string;
  }>;
  
  // 配置
  settings: {
    soundEnabled: boolean;
    voiceEnabled: boolean;
    lowPowerMode: boolean;
    autoSaveInterval: number; // 自动保存间隔（分钟）
  };
}

// 动画配置
export interface AnimationConfig {
  name: string;
  frames: AnimationFrame[];
  loop: boolean;
  priority: number;
  nextAnimation?: string;
}

export interface AnimationFrame {
  image: HTMLImageElement;
  sx: number;
  sy: number;
  sWidth: number;
  sHeight: number;
  delay: number;
}

// 音频配置
export interface AudioConfig {
  enabled: boolean;
  volume: number;
  soundEffects: Record<string, string>;
  voiceEmotions: Record<string, string>;
}

// 性能配置
export interface PerformanceConfig {
  lowPowerMode: boolean;
  idleFrameRate: number;
  activeFrameRate: number;
  maxCpuUsage: number;
  maxMemoryMB: number;
  cacheSizeMB: number;
}

// UI配置
export interface UIConfig {
  windowWidth: number;
  windowHeight: number;
  alwaysOnTop: boolean;
  showTrayIcon: boolean;
  autoHide: boolean;
  hideDelay: number;
  showDialogBubble: boolean;
  bubbleTimeout: number;
}

// 交互类型
export type InteractionType = 
  | 'feed'    // 喂食
  | 'clean'   // 清洁
  | 'pet'     // 抚摸
  | 'play'    // 陪玩
  | 'sleep'   // 睡觉
  | 'special' // 特殊交互
  | 'drag'    // 拖拽
  | 'click';  // 点击

// 情绪类型
export type EmotionType = 
  | 'happy'   // 开心
  | 'sad'     // 难过
  | 'tired'   // 疲劳
  | 'hungry'  // 饥饿
  | 'angry'   // 生气
  | 'neutral' // 中性
  | 'surprised' // 惊讶
  | 'curious';  // 好奇

// 宠物阶段
export type PetStage = 'baby' | 'teen' | 'adult';

// 对话消息
export interface ChatMessage {
  role: 'user' | 'pet';
  content: string;
  timestamp: string;
  emotion?: EmotionType;
}

// 系统事件
export interface SystemEvent {
  type: 'interaction' | 'state_change' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: string;
  data?: any;
}

// 资源加载状态
export interface ResourceLoadStatus {
  images: {
    total: number;
    loaded: number;
    failed: number;
  };
  sounds: {
    total: number;
    loaded: number;
    failed: number;
  };
  animations: {
    total: number;
    loaded: number;
    failed: number;
  };
}

// 性能指标
export interface PerformanceMetrics {
  fps: number;
  cpuUsage: number;
  memoryUsage: number;
  frameTime: number;
  animationCount: number;
  soundCount: number;
}

// 配置管理
export interface AppConfig {
  pet: {
    name: string;
    stage: PetStage;
    baseHungerDecay: number;
    baseCleanlinessDecay: number;
    baseEnergyDecay: number;
    baseMoodDecay: number;
    feedValue: number;
    cleanValue: number;
    petValue: number;
    playValue: number;
    sleepValue: number;
    expPerInteraction: number;
    expPerConversation: number;
    levelUpExp: number;
    maxLevel: number;
  };
  llm: {
    apiUrl: string;
    apiKey: string;
    model: string;
    temperature: number;
    maxTokens: number;
    timeout: number;
    maxRetries: number;
    retryDelay: number;
  };
  animation: {
    frameRate: number;
    idleAnimations: string[];
    walkAnimations: string[];
    interactionAnimations: Record<InteractionType, string>;
    emotionAnimations: Record<EmotionType, string>;
  };
  audio: AudioConfig;
  performance: PerformanceConfig;
  ui: UIConfig;
}

// 工具函数类型
export type ValueClampFunction = (value: number, min: number, max: number) => number;
export type RandomRangeFunction = (min: number, max: number) => number;
export type FormatTimeFunction = (timestamp: string) => string;

// 事件回调类型
export type InteractionCallback = (type: InteractionType, value: number) => void;
export type StateChangeCallback = (oldState: PetState, newState: PetState) => void;
export type ErrorCallback = (error: Error, context?: string) => void;
export type LoadProgressCallback = (progress: number, total: number, current: string) => void;

// 常量定义
export const CONSTANTS = {
  // 属性范围
  ATTRIBUTE_MIN: 0,
  ATTRIBUTE_MAX: 100,
  
  // 默认值
  DEFAULT_HUNGER: 80,
  DEFAULT_CLEANLINESS: 90,
  DEFAULT_ENERGY: 100,
  DEFAULT_MOOD: 85,
  DEFAULT_LEVEL: 1,
  DEFAULT_EXP: 0,
  
  // 阶段天数
  BABY_STAGE_DAYS: 7,
  TEEN_STAGE_DAYS: 30,
  
  // 交互值范围
  MIN_INTERACTION_VALUE: 5,
  MAX_INTERACTION_VALUE: 30,
  
  // 动画帧率
  MIN_FRAME_RATE: 10,
  MAX_FRAME_RATE: 60,
  DEFAULT_FRAME_RATE: 30,
  
  // 音频
  MIN_VOLUME: 0,
  MAX_VOLUME: 1,
  DEFAULT_VOLUME: 0.7,
  
  // 性能限制
  MAX_CPU_USAGE: 1.0,
  MAX_MEMORY_MB: 50,
  MAX_CACHE_MB: 20,
} as const;

// 工具函数
export const utils = {
  clamp: (value: number, min: number, max: number): number => {
    return Math.max(min, Math.min(max, value));
  },
  
  randomRange: (min: number, max: number): number => {
    return Math.random() * (max - min) + min;
  },
  
  randomInt: (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  
  formatTime: (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  },
  
  formatDate: (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  },
  
  calculateAgeInDays: (createdAt: string): number => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  },
  
  getStageByAge: (ageInDays: number): PetStage => {
    if (ageInDays <= CONSTANTS.BABY_STAGE_DAYS) {
      return 'baby';
    } else if (ageInDays <= CONSTANTS.TEEN_STAGE_DAYS) {
      return 'teen';
    } else {
      return 'adult';
    }
  },
  
  calculateExpToNextLevel: (currentLevel: number): number => {
    // 经验需求随等级指数增长
    return Math.floor(100 * Math.pow(1.2, currentLevel - 1));
  },
  
  shouldLevelUp: (currentExp: number, currentLevel: number): boolean => {
    return currentExp >= utils.calculateExpToNextLevel(currentLevel);
  },
  
  getLevelUpRewards: (newLevel: number): Partial<PetState> => {
    return {
      hunger: CONSTANTS.ATTRIBUTE_MAX,
      cleanliness: CONSTANTS.ATTRIBUTE_MAX,
      energy: CONSTANTS.ATTRIBUTE_MAX,
      mood: CONSTANTS.ATTRIBUTE_MAX
    };
  }
};

// Electron API 声明
declare global {
  interface Window {
    electronAPI: {
      sendInteraction: (type: string, value: number) => void;
      getState: () => Promise<PetState>;
      updateState: (updates: Partial<PetState>) => Promise<void>;
    };
  }
}