export class IdleBehavior {
    lastInteractionTime = Date.now();
    idleTimeout = 5 * 60 * 1000; // 5分钟无交互触发空闲行为
    idleBehaviors = [];
    activeBehavior = null;
    behaviorTimer = 0;
    canvas;
    onActiveBehavior;
    onIdleStateChange;
    constructor(canvas, onActiveBehavior, onIdleStateChange) {
        this.canvas = canvas;
        this.onActiveBehavior = onActiveBehavior;
        this.onIdleStateChange = onIdleStateChange;
        this.initIdleBehaviors();
        this.startIdleDetection();
    }
    initIdleBehaviors() {
        // 初始化空闲行为列表
        this.idleBehaviors = [
            'random_walk', // 随机走动
            'jump', // 跳跃
            'sleep', // 打瞌睡
            'stretch', // 伸懒腰
            'yawn', // 打哈欠
            'look_around', // 东张西望
            'blink', // 眨眼（频繁）
            'shiver', // 抖一抖
            'sit', // 坐下
            'lie_down', // 躺下
        ];
    }
    startIdleDetection() {
        // 定期检查是否进入空闲状态
        setInterval(() => {
            const now = Date.now();
            const timeSinceLastInteraction = now - this.lastInteractionTime;
            if (timeSinceLastInteraction >= this.idleTimeout) {
                this.onIdleStateChange(true);
                this.triggerRandomBehavior();
            }
            else {
                this.onIdleStateChange(false);
            }
        }, 1000); // 每秒检查一次
    }
    notifyInteraction() {
        // 通知有交互发生
        this.lastInteractionTime = Date.now();
        this.cancelActiveBehavior();
        this.onIdleStateChange(false);
    }
    triggerRandomBehavior() {
        if (this.activeBehavior)
            return; // 已有行为在执行
        // 随机选择行为
        const randomIndex = Math.floor(Math.random() * this.idleBehaviors.length);
        const behavior = this.idleBehaviors[randomIndex];
        this.executeBehavior(behavior);
    }
    executeBehavior(behavior) {
        this.activeBehavior = behavior;
        this.onActiveBehavior(behavior);
        // 根据行为类型设置持续时间
        const duration = this.getBehaviorDuration(behavior);
        // 执行行为动画
        this.playBehaviorAnimation(behavior);
        // 设置定时器，行为结束后恢复
        this.behaviorTimer = window.setTimeout(() => {
            this.finishBehavior();
        }, duration);
    }
    getBehaviorDuration(behavior) {
        const durations = {
            'random_walk': 5000,
            'jump': 2000,
            'sleep': 8000,
            'stretch': 3000,
            'yawn': 2500,
            'look_around': 4000,
            'blink': 1000,
            'shiver': 1500,
            'sit': 5000,
            'lie_down': 8000,
        };
        // 添加一些随机变化
        const baseDuration = durations[behavior] || 3000;
        const randomVariation = (Math.random() - 0.5) * 0.3; // +/-15%
        return baseDuration * (1 + randomVariation);
    }
    playBehaviorAnimation(behavior) {
        // 这里应该调用动画引擎播放对应动画
        console.log(`Playing idle behavior animation: ${behavior}`);
        // 实际实现时应该这样：
        // this.animationEngine.play(behavior);
    }
    finishBehavior() {
        this.activeBehavior = null;
        // 随机决定是否立即触发下一个行为
        const shouldContinue = Math.random() > 0.5;
        if (shouldContinue) {
            setTimeout(() => {
                if (!this.activeBehavior) {
                    this.triggerRandomBehavior();
                }
            }, 2000 + Math.random() * 3000); // 2-5秒后再触发
        }
    }
    cancelActiveBehavior() {
        if (this.behaviorTimer) {
            clearTimeout(this.behaviorTimer);
            this.behaviorTimer = 0;
        }
        this.activeBehavior = null;
    }
    getRandomWalkPosition(currentX, currentY) {
        // 生成随机走动目标位置
        // const maxDistance = 100;
        // const newX = currentX + (Math.random() - 0.5) * maxDistance * 2;
        // const newY = currentY + (Math.random() - 0.5) * maxDistance * 2;
        // // 限制在画布内
        // const boundedX = Math.max(30, Math.min(this.canvas.width - 30, newX));
        // const boundedY = Math.max(30, Math.min(this.canvas.height - 30, newY));
        // return { x: boundedX, y: boundedY };
        return { x: currentX, y: currentY };
    }
    setIdleTimeout(minutes) {
        this.idleTimeout = minutes * 60 * 1000;
    }
    getIdleTimeout() {
        return this.idleTimeout / 60000; // 返回分钟数
    }
    setBehaviors(behaviors) {
        this.idleBehaviors = behaviors;
    }
    getBehaviors() {
        return [...this.idleBehaviors];
    }
    isIdle() {
        const now = Date.now();
        return now - this.lastInteractionTime >= this.idleTimeout;
    }
    getLastInteractionTime() {
        return this.lastInteractionTime;
    }
    getActiveBehavior() {
        return this.activeBehavior;
    }
    forceBehavior(behavior) {
        this.cancelActiveBehavior();
        this.executeBehavior(behavior);
    }
    destroy() {
        this.cancelActiveBehavior();
    }
}
