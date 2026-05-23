export class InteractionHandler {
    canvas;
    onInteraction;
    doubleClickTimeout = 0;
    lastClickTime = 0;
    doubleClickDelay = 300; // 双击延迟（毫秒）
    constructor(canvas, onInteraction) {
        this.canvas = canvas;
        this.onInteraction = onInteraction;
        this.setupEventListeners();
    }
    setupEventListeners() {
        // 单击事件
        this.canvas.addEventListener('click', this.handleClick.bind(this));
        // 双击事件
        this.canvas.addEventListener('dblclick', this.handleDoubleClick.bind(this));
        // 鼠标滚轮事件
        this.canvas.addEventListener('wheel', this.handleWheel.bind(this));
        // 键盘事件
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        // 触摸事件
        this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
    }
    handleClick(event) {
        const now = Date.now();
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        // 检查是否是双击的一部分
        if (now - this.lastClickTime < this.doubleClickDelay) {
            clearTimeout(this.doubleClickTimeout);
            return;
        }
        this.lastClickTime = now;
        // 延迟执行单击处理，以区分双击
        this.doubleClickTimeout = window.setTimeout(() => {
            this.processClick(x, y, 'single');
        }, this.doubleClickDelay);
    }
    handleDoubleClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        clearTimeout(this.doubleClickTimeout);
        this.processClick(x, y, 'double');
    }
    handleWheel(event) {
        event.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        if (event.deltaY < 0) {
            // 向上滚动 - 抚摸
            this.onInteraction('pet', 5);
        }
        else {
            // 向下滚动 - 其他交互
            this.onInteraction('play', 3);
        }
    }
    handleKeyDown(event) {
        // 快捷键支持
        switch (event.key.toLowerCase()) {
            case 'f':
                // F键 - 喂食
                this.onInteraction('feed', 20);
                break;
            case 'c':
                // C键 - 清洁
                this.onInteraction('clean', 15);
                break;
            case 'p':
                // P键 - 陪玩
                this.onInteraction('play', 10);
                break;
            case 's':
                // S键 - 睡觉
                this.onInteraction('sleep', 25);
                break;
            case ' ':
                // 空格键 - 抚摸
                this.onInteraction('pet', 8);
                break;
        }
    }
    handleTouchStart(event) {
        event.preventDefault();
        if (event.touches.length === 1) {
            const touch = event.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            // 长按检测
            this.startLongPressDetection(x, y);
        }
    }
    handleTouchMove(event) {
        event.preventDefault();
        if (event.touches.length === 1) {
            const touch = event.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            // 触摸移动 - 抚摸
            this.onInteraction('pet', 2);
        }
    }
    handleTouchEnd(event) {
        event.preventDefault();
        if (event.changedTouches.length === 1) {
            const touch = event.changedTouches[0];
            const rect = this.canvas.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            this.cancelLongPressDetection();
            this.processTouch(x, y);
        }
    }
    longPressTimer = 0;
    longPressX = 0;
    longPressY = 0;
    startLongPressDetection(x, y) {
        this.longPressX = x;
        this.longPressY = y;
        this.longPressTimer = window.setTimeout(() => {
            this.processLongPress(x, y);
        }, 1000); // 1秒长按
    }
    cancelLongPressDetection() {
        clearTimeout(this.longPressTimer);
    }
    processLongPress(x, y) {
        // 长按 - 特殊交互
        this.onInteraction('special', 30);
    }
    processClick(x, y, type) {
        // 根据点击位置判断交互类型
        const interactionType = this.getInteractionTypeByPosition(x, y);
        let value = 0;
        switch (interactionType) {
            case 'feed':
                value = 20;
                break;
            case 'clean':
                value = 15;
                break;
            case 'pet':
                value = type === 'double' ? 15 : 10;
                break;
            case 'play':
                value = type === 'double' ? 20 : 12;
                break;
            case 'sleep':
                value = 25;
                break;
        }
        this.onInteraction(interactionType, value);
    }
    processTouch(x, y) {
        // 触摸结束 - 轻抚
        this.onInteraction('pet', 5);
    }
    getInteractionTypeByPosition(x, y) {
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;
        // 将画布分为5个区域
        const regionWidth = canvasWidth / 5;
        const regionIndex = Math.floor(x / regionWidth);
        const interactionTypes = ['feed', 'clean', 'pet', 'play', 'sleep'];
        return interactionTypes[regionIndex] || 'pet';
    }
    setDoubleClickDelay(delay) {
        this.doubleClickDelay = delay;
    }
    getDoubleClickDelay() {
        return this.doubleClickDelay;
    }
    destroy() {
        // 清理事件监听器
        this.canvas.removeEventListener('click', this.handleClick.bind(this));
        this.canvas.removeEventListener('dblclick', this.handleDoubleClick.bind(this));
        this.canvas.removeEventListener('wheel', this.handleWheel.bind(this));
        document.removeEventListener('keydown', this.handleKeyDown.bind(this));
        this.canvas.removeEventListener('touchstart', this.handleTouchStart.bind(this));
        this.canvas.removeEventListener('touchmove', this.handleTouchMove.bind(this));
        this.canvas.removeEventListener('touchend', this.handleTouchEnd.bind(this));
        clearTimeout(this.doubleClickTimeout);
        this.cancelLongPressDetection();
    }
}
