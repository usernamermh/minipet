export class PetRenderer {
    canvas;
    ctx;
    animationEngine;
    audioManager;
    currentAnimation = 'idle';
    currentEmotion = 'neutral';
    position = { x: 0, y: 0 };
    size = 100;
    isDragging = false;
    dragOffset = { x: 0, y: 0 };
    constructor(canvas, animationEngine, audioManager) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.animationEngine = animationEngine;
        this.audioManager = audioManager;
        this.setupEventListeners();
        this.startAnimationLoop();
    }
    setupEventListeners() {
        // 鼠标按下开始拖拽
        this.canvas.addEventListener('mousedown', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            // 检查是否点击在宠物上
            const petX = this.position.x;
            const petY = this.position.y;
            const petSize = this.size;
            if (mouseX >= petX - petSize / 2 &&
                mouseX <= petX + petSize / 2 &&
                mouseY >= petY - petSize / 2 &&
                mouseY <= petY + petSize / 2) {
                this.isDragging = true;
                this.dragOffset.x = mouseX - petX;
                this.dragOffset.y = mouseY - petY;
                this.currentAnimation = 'drag';
                this.audioManager.playSound('pickup');
            }
        });
        // 鼠标移动拖拽
        this.canvas.addEventListener('mousemove', (e) => {
            if (!this.isDragging)
                return;
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            this.position.x = mouseX - this.dragOffset.x;
            this.position.y = mouseY - this.dragOffset.y;
            // 限制在画布内
            this.position.x = Math.max(this.size / 2, Math.min(this.canvas.width - this.size / 2, this.position.x));
            this.position.y = Math.max(this.size / 2, Math.min(this.canvas.height - this.size / 2, this.position.y));
        });
        // 鼠标释放结束拖拽
        this.canvas.addEventListener('mouseup', () => {
            if (this.isDragging) {
                this.isDragging = false;
                this.currentAnimation = 'idle';
                this.audioManager.playSound('drop');
            }
        });
        // 鼠标离开画布也结束拖拽
        this.canvas.addEventListener('mouseleave', () => {
            if (this.isDragging) {
                this.isDragging = false;
                this.currentAnimation = 'idle';
                this.audioManager.playSound('drop');
            }
        });
        // 点击交互
        this.canvas.addEventListener('click', (e) => {
            if (this.isDragging)
                return; // 拖拽时不触发点击
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const petX = this.position.x;
            const petY = this.position.y;
            const petSize = this.size;
            if (mouseX >= petX - petSize / 2 &&
                mouseX <= petX + petSize / 2 &&
                mouseY >= petY - petSize / 2 &&
                mouseY <= petY + petSize / 2) {
                this.handlePetClick();
            }
        });
        // 右键菜单
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const petX = this.position.x;
            const petY = this.position.y;
            const petSize = this.size;
            if (mouseX >= petX - petSize / 2 &&
                mouseX <= petX + petSize / 2 &&
                mouseY >= petY - petSize / 2 &&
                mouseY <= petY + petSize / 2) {
                this.showContextMenu(e);
            }
        });
    }
    handlePetClick() {
        // 播放点击音效
        this.audioManager.playSound('click');
        // 切换动画
        this.currentAnimation = 'happy';
        this.audioManager.playVoice('happy');
        // 发送交互事件到主进程
        window.electronAPI.sendInteraction('pet', 10);
        // 3秒后恢复空闲状态
        setTimeout(() => {
            if (!this.isDragging && this.currentAnimation === 'happy') {
                this.currentAnimation = 'idle';
            }
        }, 3000);
    }
    showContextMenu(e) {
        // 这里应该显示自定义的右键菜单
        // 暂时用console.log代替
        console.log('Show context menu at:', e.clientX, e.clientY);
        // 实际实现时应该这样：
        // const menu = document.createElement('div');
        // menu.className = 'pet-context-menu';
        // menu.innerHTML = `
        //   <button onclick="feed()">喂食</button>
        //   <button onclick="clean()">清洁</button>
        //   <button onclick="play()">陪玩</button>
        //   <button onclick="sleep()">睡觉</button>
        // `;
        // document.body.appendChild(menu);
        // menu.style.left = e.clientX + 'px';
        // menu.style.top = e.clientY + 'px';
    }
    startAnimationLoop() {
        const animate = () => {
            this.clearCanvas();
            this.updateAnimation();
            this.drawPet();
            requestAnimationFrame(animate);
        };
        animate();
    }
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    updateAnimation() {
        // 更新当前动画帧
        const currentFrame = this.animationEngine.getCurrentFrame(this.currentAnimation);
        // 根据情绪调整动画
        if (this.currentEmotion !== 'neutral') {
            // 如果有情绪动画，优先使用情绪动画
            const emotionAnimation = this.getEmotionAnimation(this.currentEmotion);
            if (emotionAnimation && emotionAnimation !== this.currentAnimation) {
                this.currentAnimation = emotionAnimation;
            }
        }
    }
    drawPet() {
        const currentFrame = this.animationEngine.getCurrentFrame(this.currentAnimation);
        if (!currentFrame) {
            // 如果没有动画帧，绘制一个简单的圆形作为占位
            this.drawPlaceholder();
            return;
        }
        // 绘制动画帧
        const { image, sx, sy, sWidth, sHeight } = currentFrame;
        const drawX = this.position.x - this.size / 2;
        const drawY = this.position.y - this.size / 2;
        this.ctx.save();
        // 添加阴影效果
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        this.ctx.shadowBlur = 5;
        this.ctx.shadowOffsetY = 2;
        // 绘制宠物
        this.ctx.drawImage(image, sx, sy, sWidth, sHeight, drawX, drawY, this.size, this.size);
        this.ctx.restore();
        // 绘制拖拽时的效果
        if (this.isDragging) {
            this.drawDragEffect();
        }
        // 绘制情绪气泡
        if (this.currentEmotion !== 'neutral') {
            this.drawEmotionBubble();
        }
    }
    drawPlaceholder() {
        this.ctx.save();
        // 绘制身体
        this.ctx.fillStyle = '#4CAF50';
        this.ctx.beginPath();
        this.ctx.arc(this.position.x, this.position.y, this.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
        // 绘制眼睛
        this.ctx.fillStyle = 'white';
        this.ctx.beginPath();
        this.ctx.arc(this.position.x - 15, this.position.y - 10, 8, 0, Math.PI * 2);
        this.ctx.arc(this.position.x + 15, this.position.y - 10, 8, 0, Math.PI * 2);
        this.ctx.fill();
        // 绘制瞳孔
        this.ctx.fillStyle = 'black';
        this.ctx.beginPath();
        this.ctx.arc(this.position.x - 15, this.position.y - 10, 4, 0, Math.PI * 2);
        this.ctx.arc(this.position.x + 15, this.position.y - 10, 4, 0, Math.PI * 2);
        this.ctx.fill();
        // 绘制嘴巴
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(this.position.x, this.position.y + 10, 15, 0, Math.PI);
        this.ctx.stroke();
        this.ctx.restore();
    }
    drawDragEffect() {
        this.ctx.save();
        // 绘制拖拽光环
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.lineWidth = 3;
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.arc(this.position.x, this.position.y, this.size / 2 + 5, 0, Math.PI * 2);
        this.ctx.stroke();
        // 绘制拖拽阴影
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.beginPath();
        this.ctx.arc(this.position.x + 3, this.position.y + 3, this.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }
    drawEmotionBubble() {
        const bubbleSize = 30;
        const bubbleX = this.position.x;
        const bubbleY = this.position.y - this.size / 2 - bubbleSize - 5;
        this.ctx.save();
        // 绘制气泡背景
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.strokeStyle = '#ddd';
        this.ctx.lineWidth = 1;
        // 绘制圆角矩形
        const radius = 5;
        this.ctx.beginPath();
        this.ctx.moveTo(bubbleX + radius, bubbleY);
        this.ctx.lineTo(bubbleX + bubbleSize - radius, bubbleY);
        this.ctx.quadraticCurveTo(bubbleX + bubbleSize, bubbleY, bubbleX + bubbleSize, bubbleY + radius);
        this.ctx.lineTo(bubbleX + bubbleSize, bubbleY + bubbleSize - radius);
        this.ctx.quadraticCurveTo(bubbleX + bubbleSize, bubbleY + bubbleSize, bubbleX + bubbleSize - radius, bubbleY + bubbleSize);
        this.ctx.lineTo(bubbleX + radius, bubbleY + bubbleSize);
        this.ctx.quadraticCurveTo(bubbleX, bubbleY + bubbleSize, bubbleX, bubbleY + bubbleSize - radius);
        this.ctx.lineTo(bubbleX, bubbleY + radius);
        this.ctx.quadraticCurveTo(bubbleX, bubbleY, bubbleX + radius, bubbleY);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        // 绘制情绪图标
        const emoji = this.getEmotionEmoji(this.currentEmotion);
        this.ctx.font = '20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillStyle = '#333';
        this.ctx.fillText(emoji, bubbleX + bubbleSize / 2, bubbleY + bubbleSize / 2);
        this.ctx.restore();
    }
    getEmotionAnimation(emotion) {
        const emotionAnimations = {
            happy: 'happy',
            sad: 'sad',
            tired: 'tired',
            hungry: 'hungry',
            angry: 'angry'
        };
        return emotionAnimations[emotion] || null;
    }
    getEmotionEmoji(emotion) {
        const emotionEmojis = {
            happy: '😊',
            sad: '😢',
            tired: '😴',
            hungry: '🍖',
            angry: '😠',
            neutral: '😐'
        };
        return emotionEmojis[emotion] || '😐';
    }
    updateState(state) {
        // 根据状态更新情绪
        this.updateEmotion(state);
        // 根据状态调整大小
        this.updateSize(state);
    }
    updateEmotion(state) {
        const { hunger, energy, mood } = state;
        if (hunger < 30) {
            this.currentEmotion = 'hungry';
        }
        else if (energy < 30) {
            this.currentEmotion = 'tired';
        }
        else if (mood < 30) {
            this.currentEmotion = 'sad';
        }
        else if (mood > 80) {
            this.currentEmotion = 'happy';
        }
        else {
            this.currentEmotion = 'neutral';
        }
    }
    updateSize(state) {
        const { stage, level } = state;
        let sizeMultiplier = 1.0;
        // 根据阶段调整大小
        switch (stage) {
            case 'baby':
                sizeMultiplier = 0.8;
                break;
            case 'teen':
                sizeMultiplier = 1.0;
                break;
            case 'adult':
                sizeMultiplier = 1.2;
                break;
        }
        // 根据等级微调
        const levelBonus = (level - 1) * 0.01;
        sizeMultiplier += levelBonus;
        this.size = 100 * sizeMultiplier;
    }
    setAnimation(animation) {
        this.currentAnimation = animation;
    }
    setEmotion(emotion) {
        this.currentEmotion = emotion;
    }
    getPosition() {
        return { ...this.position };
    }
    setPosition(x, y) {
        this.position.x = x;
        this.position.y = y;
    }
    getSize() {
        return this.size;
    }
    setSize(size) {
        this.size = size;
    }
    getCurrentAnimation() {
        return this.currentAnimation;
    }
    getCurrentEmotion() {
        return this.currentEmotion;
    }
    isBeingDragged() {
        return this.isDragging;
    }
    destroy() {
        // 清理事件监听器
        this.canvas.replaceWith(this.canvas.cloneNode(true));
    }
}
