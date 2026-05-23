export class AnimationEngine {
    animations = new Map();
    currentFrame = 0;
    frameCount = 0;
    lastFrameTime = 0;
    playing = true;
    frameRate = 30;
    priorityQueue = [];
    constructor() {
        this.registerDefaultAnimations();
    }
    registerDefaultAnimations() {
        // 注册默认动画配置（占位动画）
        const defaultAnimations = [
            'idle', 'walk', 'sleep', 'eat', 'bath',
            'happy', 'sad', 'angry', 'tired', 'hungry',
            'play', 'jump', 'fly', 'dance', 'sleep',
            'drag', 'blink', 'look_around', 'stretch',
            'yawn', 'shiver'
        ];
        for (const animName of defaultAnimations) {
            this.registerAnimation({
                name: animName,
                frames: [],
                loop: true,
                priority: this.getDefaultPriority(animName)
            });
        }
    }
    getDefaultPriority(animName) {
        // 设置默认优先级
        const priorityMap = {
            'idle': 1,
            'blink': 2,
            'look_around': 2,
            'walk': 3,
            'jump': 4,
            'drag': 5,
            'happy': 6,
            'sad': 6,
            'angry': 7,
            'tired': 6,
            'hungry': 7,
            'eat': 7,
            'bath': 7,
            'sleep': 8,
            'play': 7,
            'fly': 6,
            'dance': 6,
            'stretch': 3,
            'yawn': 3,
            'shiver': 3
        };
        return priorityMap[animName] || 5;
    }
    registerAnimation(config) {
        this.animations.set(config.name, config);
    }
    removeAnimation(name) {
        this.animations.delete(name);
    }
    getCurrentFrame(animationName) {
        const config = this.animations.get(animationName);
        if (!config || !config.frames || config.frames.length === 0) {
            return null;
        }
        const now = Date.now();
        // 更新帧
        if (now - this.lastFrameTime >= config.frames[this.currentFrame].delay || this.frameCount === 0) {
            this.currentFrame = (this.currentFrame + 1) % config.frames.length;
            this.frameCount++;
            // 如果动画不循环且播放完毕
            if (!config.loop && this.currentFrame === 0 && this.frameCount > 1) {
                if (config.nextAnimation) {
                    this.play(config.nextAnimation);
                }
                else {
                    this.play('idle');
                }
            }
            this.lastFrameTime = now;
        }
        return config.frames[this.currentFrame] || null;
    }
    play(animationName, priority) {
        const config = this.animations.get(animationName);
        if (!config) {
            console.warn(`Animation "${animationName}" not found`);
            return;
        }
        const actualPriority = priority !== undefined ? priority : config.priority;
        // 检查优先级，低优先级动画不能被高优先级动画打断
        const currentAnim = this.getCurrentAnimation();
        if (currentAnim) {
            const currentConfig = this.animations.get(currentAnim);
            if (currentConfig && currentConfig.priority > actualPriority) {
                return; // 不打断更高优先级的动画
            }
        }
        // 重置帧计数器
        this.currentFrame = -1;
        this.frameCount = 0;
        this.lastFrameTime = 0;
        console.log(`Playing animation: ${animationName} (priority: ${actualPriority})`);
    }
    getCurrentAnimation() {
        // 返回当前播放的动画名称
        for (const [name, config] of this.animations.entries()) {
            if (config.frames.length > 0 && this.currentFrame >= 0 && this.currentFrame < config.frames.length) {
                return name;
            }
        }
        return null;
    }
    pause() {
        this.playing = false;
    }
    resume() {
        this.playing = true;
        this.lastFrameTime = Date.now();
    }
    setFrameRate(fps) {
        this.frameRate = fps;
    }
    getFrameRate() {
        return this.frameRate;
    }
    loadAnimationsFromConfig(configData) {
        // 从配置加载动画
        if (!configData || !configData.animations)
            return;
        for (const animData of configData.animations) {
            this.registerAnimation({
                name: animData.name,
                frames: animData.frames || [],
                loop: animData.loop !== undefined ? animData.loop : true,
                priority: animData.priority || this.getDefaultPriority(animData.name),
                nextAnimation: animData.nextAnimation
            });
        }
    }
    getAnimationConfig(name) {
        return this.animations.get(name);
    }
    getAllAnimations() {
        return Array.from(this.animations.keys());
    }
    clearCache() {
        // 清理未使用的动画资源
        for (const [name, config] of this.animations.entries()) {
            if (config.priority <= 3 && name !== 'idle') {
                // 清理低优先级动画的帧数据
                config.frames = [];
            }
        }
    }
    getStats() {
        let totalFrames = 0;
        for (const config of this.animations.values()) {
            totalFrames += config.frames.length;
        }
        return {
            totalAnimations: this.animations.size,
            totalFrames: totalFrames,
            currentAnimation: this.getCurrentAnimation(),
            frameRate: this.frameRate
        };
    }
}
