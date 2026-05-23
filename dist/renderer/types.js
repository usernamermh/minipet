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
};
// 工具函数
export const utils = {
    clamp: (value, min, max) => {
        return Math.max(min, Math.min(max, value));
    },
    randomRange: (min, max) => {
        return Math.random() * (max - min) + min;
    },
    randomInt: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    formatTime: (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    },
    formatDate: (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    },
    calculateAgeInDays: (createdAt) => {
        const created = new Date(createdAt);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - created.getTime());
        return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    },
    getStageByAge: (ageInDays) => {
        if (ageInDays <= CONSTANTS.BABY_STAGE_DAYS) {
            return 'baby';
        }
        else if (ageInDays <= CONSTANTS.TEEN_STAGE_DAYS) {
            return 'teen';
        }
        else {
            return 'adult';
        }
    },
    calculateExpToNextLevel: (currentLevel) => {
        // 经验需求随等级指数增长
        return Math.floor(100 * Math.pow(1.2, currentLevel - 1));
    },
    shouldLevelUp: (currentExp, currentLevel) => {
        return currentExp >= utils.calculateExpToNextLevel(currentLevel);
    },
    getLevelUpRewards: (newLevel) => {
        return {
            hunger: CONSTANTS.ATTRIBUTE_MAX,
            cleanliness: CONSTANTS.ATTRIBUTE_MAX,
            energy: CONSTANTS.ATTRIBUTE_MAX,
            mood: CONSTANTS.ATTRIBUTE_MAX
        };
    }
};
