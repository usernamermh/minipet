import { PetRenderer } from './pet-renderer';
import { AnimationEngine } from './animation/engine';
import { AudioManager } from './audio/audio-manager';
import { InteractionHandler } from './interaction/interaction-handler';
import { IdleBehavior } from './interaction/idle-behavior';
export class PetRendererMain {
    canvas;
    ctx;
    petRenderer;
    animationEngine;
    audioManager;
    interactionHandler;
    idleBehavior;
    currentState;
    isInitialized = false;
    animationFrameId = 0;
    lastUpdateTime = 0;
    updateInterval = 100; // 100ms更新一次
    onStateChange;
    onInteraction;
    constructor(canvas, initialState, onStateChange, onInteraction) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.currentState = initialState;
        this.onStateChange = onStateChange;
        this.onInteraction = onInteraction;
        // 初始化各个模块
        this.animationEngine = new AnimationEngine();
        this.audioManager = new AudioManager();
        this.petRenderer = new PetRenderer(canvas, this.animationEngine, this.audioManager);
        this.interactionHandler = new InteractionHandler(canvas, this.handleInteraction.bind(this));
        this.idleBehavior = new IdleBehavior(canvas, this.handleIdleBehavior.bind(this), this.handleIdleStateChange.bind(this));
        this.setupCanvas();
        this.startAnimationLoop();
    }
    setupCanvas() {
        // 设置画布大小
        this.canvas.width = 400;
        this.canvas.height = 400;
        // 设置画布样式
        this.canvas.style.backgroundColor = 'transparent';
        this.canvas.style.cursor = 'pointer';
        // 添加CSS样式
        const style = document.createElement('style');
        style.textContent = `
      .pet-canvas {
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
      }
      .pet-canvas:hover {
        box-shadow: 0 6px 30px rgba(0, 0, 0, 0.15);
      }
    `;
        document.head.appendChild(style);
        this.canvas.classList.add('pet-canvas');
    }
    startAnimationLoop() {
        const animate = () => {
            this.update();
            this.render();
            this.animationFrameId = requestAnimationFrame(animate);
        };
        animate();
    }
    update() {
        const now = Date.now();
        // 定期更新状态
        if (now - this.lastUpdateTime >= this.updateInterval) {
            this.updatePetState();
            this.lastUpdateTime = now;
        }
        // 更新渲染器状态
        this.petRenderer.updateState(this.currentState);
    }
    updatePetState() {
        const oldState = { ...this.currentState };
        const now = new Date().toISOString();
        // 属性自然衰减
        const decayRate = 0.1; // 每100ms衰减0.1%
        this.currentState.hunger = Math.max(0, this.currentState.hunger - decayRate);
        this.currentState.cleanliness = Math.max(0, this.currentState.cleanliness - decayRate);
        this.currentState.energy = Math.max(0, this.currentState.energy - decayRate);
        this.currentState.mood = Math.max(0, this.currentState.mood - decayRate * 0.5);
        // 更新最后更新时间
        this.currentState.lastUpdate = now;
        // 检查状态变化
        if (oldState.hunger !== this.currentState.hunger ||
            oldState.cleanliness !== this.currentState.cleanliness ||
            oldState.energy !== this.currentState.energy ||
            oldState.mood !== this.currentState.mood) {
            this.onStateChange?.(oldState, this.currentState);
        }
        // 检查是否需要升级
        this.checkLevelUp();
    }
    checkLevelUp() {
        const expNeeded = 100 * Math.pow(1.2, this.currentState.level - 1);
        if (this.currentState.exp >= expNeeded) {
            this.currentState.level++;
            this.currentState.exp -= expNeeded;
            // 升级奖励
            this.currentState.hunger = Math.min(100, this.currentState.hunger + 20);
            this.currentState.cleanliness = Math.min(100, this.currentState.cleanliness + 20);
            this.currentState.energy = Math.min(100, this.currentState.energy + 20);
            this.currentState.mood = Math.min(100, this.currentState.mood + 20);
            // 播放升级音效
            this.audioManager.playSound('click');
            console.log(`宠物升级到 ${this.currentState.level} 级！`);
        }
    }
    render() {
        // 清空画布（透明背景）
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // 绘制背景（可选）
        this.drawBackground();
        // 宠物渲染器负责绘制宠物
        // 注意：PetRenderer内部有自己的绘制循环
    }
    drawBackground() {
        // 绘制简单的渐变背景
        const gradient = this.ctx.createRadialGradient(this.canvas.width / 2, this.canvas.height / 2, 0, this.canvas.width / 2, this.canvas.height / 2, this.canvas.width / 2);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    handleInteraction(type, value) {
        // 通知空闲行为模块有交互发生
        this.idleBehavior.notifyInteraction();
        // 更新状态
        const oldState = { ...this.currentState };
        const now = new Date().toISOString();
        // 根据交互类型更新状态
        switch (type) {
            case 'feed':
                this.currentState.hunger = Math.min(100, this.currentState.hunger + value);
                this.currentState.exp += 5;
                this.petRenderer.setAnimation('eat');
                this.audioManager.playSound('eat');
                break;
            case 'clean':
                this.currentState.cleanliness = Math.min(100, this.currentState.cleanliness + value);
                this.currentState.exp += 3;
                this.petRenderer.setAnimation('bath');
                this.audioManager.playSound('bath');
                break;
            case 'pet':
                this.currentState.mood = Math.min(100, this.currentState.mood + value);
                this.currentState.exp += 2;
                this.petRenderer.setAnimation('happy');
                this.audioManager.playVoice('happy');
                break;
            case 'play':
                this.currentState.energy = Math.max(0, this.currentState.energy - value * 0.5);
                this.currentState.mood = Math.min(100, this.currentState.mood + value);
                this.currentState.exp += 4;
                this.petRenderer.setAnimation('play');
                this.audioManager.playSound('play');
                break;
            case 'sleep':
                this.currentState.energy = Math.min(100, this.currentState.energy + value);
                this.currentState.mood = Math.min(100, this.currentState.mood + value * 0.5);
                this.currentState.exp += 6;
                this.petRenderer.setAnimation('sleep');
                this.audioManager.playSound('sleep');
                break;
            case 'special':
                this.currentState.mood = Math.min(100, this.currentState.mood + value);
                this.currentState.exp += 8;
                this.petRenderer.setAnimation('jump');
                this.audioManager.playVoice('surprised');
                break;
        }
        // 记录交互历史
        this.currentState.interactionHistory.push({
            type,
            timestamp: now,
            valueChange: value
        });
        // 限制历史记录长度
        if (this.currentState.interactionHistory.length > 100) {
            this.currentState.interactionHistory.shift();
        }
        // 更新最后更新时间
        this.currentState.lastUpdate = now;
        // 触发回调
        this.onStateChange?.(oldState, this.currentState);
        this.onInteraction?.(type, value);
        // 播放交互音效
        this.audioManager.playSound('click');
    }
    handleIdleBehavior(behavior) {
        console.log(`Idle behavior: ${behavior}`);
        // 根据空闲行为设置动画
        this.petRenderer.setAnimation(behavior);
        // 如果是随机走动，更新位置
        // if (behavior === 'random_walk') {
        //     const currentPos = this.petRenderer.getPosition();
        //     const newPos = this.idleBehavior.getRandomWalkPosition(currentPos.x, currentPos.y);
        //     this.petRenderer.setPosition(newPos.x, newPos.y);
        // }
    }
    handleIdleStateChange(isIdle) {
        if (isIdle) {
            console.log('Pet is now idle');
            // 进入空闲状态
            this.petRenderer.setAnimation('idle');
        }
        else {
            console.log('Pet is active');
            // 恢复活动状态
            this.petRenderer.setAnimation('idle');
        }
    }
    updateState(newState) {
        const oldState = { ...this.currentState };
        this.currentState = newState;
        this.onStateChange?.(oldState, newState);
    }
    getState() {
        return { ...this.currentState };
    }
    setEmotion(emotion) {
        this.petRenderer.setEmotion(emotion);
    }
    setAnimation(animation) {
        this.petRenderer.setAnimation(animation);
    }
    setVolume(volume) {
        this.audioManager.setMasterVolume(volume);
    }
    toggleSound(enabled) {
        this.audioManager.toggleSound(enabled);
    }
    toggleVoice(enabled) {
        this.audioManager.toggleVoice(enabled);
    }
    getStats() {
        return {
            animation: this.animationEngine.getStats(),
            audio: this.audioManager.getStats(),
            idle: {
                isIdle: this.idleBehavior.isIdle(),
                activeBehavior: this.idleBehavior.getActiveBehavior(),
                lastInteraction: this.idleBehavior.getLastInteractionTime()
            }
        };
    }
    destroy() {
        // 停止动画循环
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        // 销毁各个模块
        this.petRenderer.destroy();
        this.interactionHandler.destroy();
        this.idleBehavior.destroy();
        this.audioManager.stopAll();
        // 清理画布
        this.canvas.width = 0;
        this.canvas.height = 0;
    }
}
