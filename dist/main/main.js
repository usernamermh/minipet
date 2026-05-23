"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const fs_1 = require("fs");
const path_1 = require("path");
const python_bridge_1 = require("./python-bridge");
const state_persister_1 = require("./state-persister");
const tray_manager_1 = require("./tray-manager");
const window_manager_1 = require("./window-manager");
const TEXT = {
    welcome: '\u6211\u5df2\u7ecf\u5728\u684c\u9762\u4e0a\u7b49\u4f60\u5566\u3002',
    confused: '\u5c0f\u5bb6\u4f19\u6709\u70b9\u8ff7\u7cca\u3002',
    feed: '\u55f7\u545c\uff0c\u597d\u5403\uff0c\u518d\u6765\u4e00\u53e3\u3002',
    clean: '\u6d17\u5f97\u9999\u9999\u7684\uff0c\u4eca\u5929\u72b6\u6001\u771f\u4e0d\u9519\u3002',
    pet: '\u547c\u565c\u547c\u565c\uff0c\u6478\u6478\u6700\u5f00\u5fc3\u4e86\u3002',
    play: '\u8dd1\u4e00\u5708\uff0c\u4eca\u5929\u4e5f\u8d85\u6709\u7cbe\u795e\u3002',
    sleep: '\u5148\u6253\u4e2a\u76f9\uff0c\u9192\u6765\u518d\u966a\u4f60\u3002',
    levelUp: '\u5347\u7ea7\u5566\uff0c\u73b0\u5728\u662f',
    levelSuffix: '\u7ea7\u3002',
    fallbackWake: '\u6211\u521a\u7761\u9192\uff0c\u7b49\u4e00\u4e0b\u518d\u8bf4\u3002',
    hungryReply: '\u6211\u6709\u70b9\u997f\uff0c\u804a\u5b8c\u8bb0\u5f97\u5582\u6211\u5440\u3002',
    tiredReply: '\u56f0\u56f0\u7684\uff0c\u4e0d\u8fc7\u6211\u8fd8\u662f\u5728\u542c\u4f60\u8bf4\u3002',
    helloReply: '\u5728\u5440\uff0c\u6211\u4e00\u76f4\u5728\u684c\u9762\u4e0a\u966a\u7740\u4f60\u3002',
    nameReply: '\u4f60\u53ef\u4ee5\u53eb\u6211\u56e2\u5b50\uff0c\u6211\u4f1a\u8bb0\u4f4f\u4f60\u7684\u3002',
    likeReply: '\u6211\u6700\u559c\u6b22\u4f60\u6765\u70b9\u70b9\u6211\uff0c\u8fd8\u4f1a\u966a\u6211\u804a\u5929\u3002',
    defaultReply: '\u55ef\u55ef\uff0c\u6211\u542c\u5230\u4e86\uff0c\u518d\u548c\u6211\u591a\u8bf4\u4e00\u70b9\u5427\u3002',
    topicHungry: '\u6211\u809a\u5b50\u6709\u70b9\u7a7a\uff0c\u7b49\u4f1a\u8bb0\u5f97\u7ed9\u6211\u627e\u70b9\u5403\u7684\u3002',
    topicSleepy: '\u4eca\u5929\u6709\u70b9\u56f0\uff0c\u6211\u60f3\u5728\u4f60\u684c\u8fb9\u6253\u4e2a\u76f9\u3002',
    topicDirty: '\u6211\u611f\u89c9\u81ea\u5df1\u7070\u6251\u6251\u7684\uff0c\u60f3\u6d17\u9999\u9999\u3002',
    topic1: '\u4f60\u5728\u5fd9\u4ec0\u4e48\u5440\uff0c\u6211\u53ef\u4ee5\u5728\u65c1\u8fb9\u5b89\u9759\u966a\u4f60\u3002',
    topic2: '\u521a\u521a\u98ce\u597d\u50cf\u5439\u8fc7\u6765\u4e86\uff0c\u6211\u60f3\u5728\u684c\u9762\u4e0a\u6563\u6563\u6b65\u3002',
    topic3: '\u8981\u4e0d\u8981\u70b9\u70b9\u6211\uff0c\u6211\u4eca\u5929\u5fc3\u60c5\u8fd8\u4e0d\u9519\u3002',
    topic4: '\u6211\u6709\u8ba4\u771f\u5f85\u673a\u54e6\uff0c\u4f60\u4e00\u56de\u5934\u5c31\u80fd\u770b\u5230\u6211\u3002',
    topic5: '\u5982\u679c\u4f60\u7d2f\u4e86\uff0c\u4e5f\u53ef\u4ee5\u548c\u6211\u968f\u4fbf\u804a\u4e24\u53e5\u3002',
};
class DesktopPet {
    windowManager = null;
    trayManager = null;
    pythonBridge = null;
    statePersister = null;
    idleTopicTimer = null;
    lastActivityAt = Date.now();
    constructor() {
        this.registerIpcHandlers();
        electron_1.app.whenReady()
            .then(() => this.start())
            .catch((error) => {
            console.error('Failed to start application:', error);
            electron_1.app.quit();
        });
        if (!electron_1.app.requestSingleInstanceLock()) {
            electron_1.app.quit();
            return;
        }
        electron_1.app.on('second-instance', () => {
            this.windowManager?.showWindow();
        });
        electron_1.app.on('window-all-closed', () => {
            // Keep running from tray.
        });
        electron_1.app.on('before-quit', () => {
            this.cleanup();
        });
    }
    async start() {
        console.log('[Main] App ready, starting desktop pet');
        const userDataPath = electron_1.app.getPath('userData');
        console.log('[Main] userDataPath:', userDataPath);
        this.statePersister = new state_persister_1.StatePersister((0, path_1.join)(userDataPath, 'data'));
        console.log('[Main] StatePersister initialized');
        this.windowManager = new window_manager_1.WindowManager();
        console.log('[Main] WindowManager initialized');
        this.trayManager = new tray_manager_1.TrayManager({
            toggleVisibility: () => this.windowManager?.toggleWindowVisibility(),
            performInteraction: (command) => {
                this.performInteraction(command);
            },
            updateSetting: (setting, value) => {
                if (!this.statePersister) {
                    return;
                }
                this.statePersister.updateSetting(setting, value);
                this.statePersister.saveState();
                this.broadcastState();
            },
        });
        console.log('[Main] TrayManager initialized');
        this.pythonBridge = new python_bridge_1.PythonBridge();
        await this.pythonBridge.start();
        console.log('[Main] PythonBridge started');
        this.startIdleTopicLoop();
        console.log('[Main] Idle topic loop started');
        this.broadcastState();
        this.emitBubble(TEXT.welcome, 'happy');
        console.log('[Main] Initial state + welcome bubble sent');
    }
    registerIpcHandlers() {
        electron_1.ipcMain.handle('desktop-pet:get-state', () => this.getFreshState());
        electron_1.ipcMain.handle('desktop-pet:get-asset-config', () => this.getAssetConfig());
        electron_1.ipcMain.handle('desktop-pet:perform-interaction', (_event, type) => this.performInteraction(type));
        electron_1.ipcMain.handle('desktop-pet:send-chat', (_event, message) => this.sendChat(message));
        electron_1.ipcMain.handle('desktop-pet:update-setting', (_event, setting, value) => {
            this.statePersister?.updateSetting(setting, value);
            this.statePersister?.saveState();
            this.broadcastState();
            return this.getFreshState();
        });
        electron_1.ipcMain.handle('desktop-pet:window-drag', (_event, deltaX, deltaY) => {
            return this.windowManager?.nudgeWindowBy(deltaX, deltaY) ?? {
                appliedDeltaX: 0,
                appliedDeltaY: 0,
                bouncedX: false,
                bouncedY: false,
            };
        });
        electron_1.ipcMain.handle('desktop-pet:window-drag-start', () => {
            this.windowManager?.startCursorDrag();
            return true;
        });
        electron_1.ipcMain.handle('desktop-pet:window-drag-stop', () => {
            this.windowManager?.stopCursorDrag();
            return true;
        });
        electron_1.ipcMain.handle('desktop-pet:window-drag-to', () => {
            return this.windowManager?.moveWindowToCursor() ?? {
                nextX: 0,
                nextY: 0,
                bouncedX: false,
                bouncedY: false,
            };
        });
        electron_1.ipcMain.handle('desktop-pet:update-pet-viewport-bounds', (_event, bounds) => {
            this.windowManager?.updatePetViewportBounds(bounds);
            return true;
        });
        electron_1.ipcMain.handle('desktop-pet:window-nudge', (_event, deltaX, deltaY) => {
            return this.windowManager?.nudgeWindowBy(deltaX, deltaY) ?? {
                appliedDeltaX: 0,
                appliedDeltaY: 0,
                bouncedX: false,
                bouncedY: false,
            };
        });
        electron_1.ipcMain.handle('desktop-pet:window-toggle', () => {
            this.windowManager?.toggleWindowVisibility();
            return true;
        });
        electron_1.ipcMain.handle('desktop-pet:set-pointer-mode', (_event, interactive) => {
            this.windowManager?.setMousePassthrough(!interactive);
            return true;
        });
        electron_1.ipcMain.handle('desktop-pet:quit', () => {
            electron_1.app.quit();
            return true;
        });
    }
    getAssetConfig() {
        const configPath = (0, path_1.join)(__dirname, '../../config.json');
        try {
            if ((0, fs_1.existsSync)(configPath)) {
                const raw = (0, fs_1.readFileSync)(configPath, 'utf-8');
                const parsed = JSON.parse(raw);
                return {
                    spriteTheme: parsed?.pet?.sprite_theme || 'cat_1',
                    motionSpeedMultiplier: parsed?.animation?.motion_speed_multiplier ?? 1.0,
                    spriteFrameSpeedMultiplier: parsed?.animation?.sprite_frame_speed_multiplier ?? 1.0,
                };
            }
        }
        catch (error) {
            console.error('[Main] Failed to read asset config:', error);
        }
        return {
            spriteTheme: 'cat_1',
            motionSpeedMultiplier: 1.0,
            spriteFrameSpeedMultiplier: 1.0,
        };
    }
    getFreshState() {
        const state = this.statePersister?.getState();
        if (!state || !this.statePersister) {
            console.log('[Main] getFreshState returned empty state');
            return state;
        }
        const now = Date.now();
        const lastUpdate = Date.parse(state.lastUpdate);
        const elapsedMinutes = Math.max(0, (now - lastUpdate) / 60000);
        if (elapsedMinutes > 0) {
            const nextState = { ...state };
            nextState.hunger = Math.max(0, nextState.hunger - elapsedMinutes * 0.1);
            nextState.cleanliness = Math.max(0, nextState.cleanliness - elapsedMinutes * 0.06);
            nextState.energy = Math.max(0, nextState.energy - elapsedMinutes * 0.08);
            nextState.mood = Math.max(0, nextState.mood - elapsedMinutes * 0.05);
            nextState.ageInDays = Math.floor((now - Date.parse(nextState.createdAt)) / 86400000);
            nextState.stage =
                nextState.ageInDays <= 7 ? 'baby' : nextState.ageInDays <= 30 ? 'teen' : 'adult';
            nextState.lastUpdate = new Date(now).toISOString();
            this.statePersister.updateState(nextState);
        }
        return this.statePersister.getState();
    }
    performInteraction(type) {
        this.markActivity();
        const state = this.getFreshState();
        if (!state || !this.statePersister) {
            return null;
        }
        const nextState = { ...state };
        let bubble = TEXT.confused;
        let emotion = 'neutral';
        let valueChange = 0;
        switch (type) {
            case 'feed':
                nextState.hunger = Math.min(100, nextState.hunger + 22);
                nextState.mood = Math.min(100, nextState.mood + 4);
                nextState.exp += 6;
                bubble = TEXT.feed;
                emotion = 'happy';
                valueChange = 22;
                break;
            case 'clean':
                nextState.cleanliness = Math.min(100, nextState.cleanliness + 24);
                nextState.mood = Math.min(100, nextState.mood + 3);
                nextState.exp += 5;
                bubble = TEXT.clean;
                emotion = 'happy';
                valueChange = 24;
                break;
            case 'pet':
                nextState.mood = Math.min(100, nextState.mood + 12);
                nextState.exp += 3;
                bubble = TEXT.pet;
                emotion = 'happy';
                valueChange = 12;
                break;
            case 'play':
                nextState.energy = Math.max(0, nextState.energy - 8);
                nextState.mood = Math.min(100, nextState.mood + 14);
                nextState.exp += 8;
                bubble = TEXT.play;
                emotion = 'happy';
                valueChange = 14;
                break;
            case 'sleep':
                nextState.energy = Math.min(100, nextState.energy + 24);
                nextState.mood = Math.min(100, nextState.mood + 5);
                nextState.exp += 4;
                bubble = TEXT.sleep;
                emotion = 'tired';
                valueChange = 24;
                break;
        }
        const expNeeded = Math.floor(100 * Math.pow(1.2, nextState.level - 1));
        if (nextState.exp >= expNeeded) {
            nextState.level += 1;
            nextState.exp -= expNeeded;
            nextState.mood = Math.min(100, nextState.mood + 10);
            bubble = `${TEXT.levelUp}${nextState.level}${TEXT.levelSuffix}`;
            emotion = 'happy';
        }
        nextState.lastUpdate = new Date().toISOString();
        this.statePersister.updateState(nextState);
        this.statePersister.addInteraction(type, valueChange);
        this.statePersister.saveState();
        this.broadcastState();
        this.emitBubble(bubble, emotion);
        return nextState;
    }
    async sendChat(message) {
        this.markActivity();
        const state = this.getFreshState();
        if (!state || !this.statePersister) {
            return { reply: TEXT.fallbackWake, emotion: 'neutral' };
        }
        this.statePersister.addConversation('user', message);
        let reply = '';
        let emotion = 'neutral';
        try {
            const backendUrl = this.pythonBridge?.getBackendUrl();
            if (!backendUrl) {
                throw new Error('Backend unavailable');
            }
            const response = await fetch(`${backendUrl}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message,
                    pet_name: '团子',
                    pet_stage: state.stage,
                    pet_attributes: {
                        hunger: Math.round(state.hunger),
                        cleanliness: Math.round(state.cleanliness),
                        energy: Math.round(state.energy),
                        mood: Math.round(state.mood),
                    },
                }),
            });
            if (!response.ok) {
                throw new Error(`Backend error: ${response.status}`);
            }
            const payload = (await response.json());
            reply = payload.reply || this.getLocalReply(message, state);
            emotion = payload.emotion || 'neutral';
        }
        catch (_error) {
            reply = this.getLocalReply(message, state);
            emotion = this.inferEmotionFromState(state);
        }
        this.statePersister.addConversation('pet', reply);
        this.statePersister.updateState({
            exp: state.exp + Math.max(2, Math.min(8, Math.ceil(message.length / 8))),
            mood: Math.min(100, state.mood + 2),
        });
        this.statePersister.saveState();
        this.broadcastState();
        this.emitBubble(reply, emotion);
        return { reply, emotion };
    }
    getLocalReply(message, state) {
        if (state.hunger < 30) {
            return TEXT.hungryReply;
        }
        if (state.energy < 30) {
            return TEXT.tiredReply;
        }
        if (message.includes('你好') || message.includes('在吗')) {
            return TEXT.helloReply;
        }
        if (message.includes('名字')) {
            return TEXT.nameReply;
        }
        if (message.includes('喜欢')) {
            return TEXT.likeReply;
        }
        return TEXT.defaultReply;
    }
    startIdleTopicLoop() {
        if (this.idleTopicTimer) {
            clearInterval(this.idleTopicTimer);
        }
        this.idleTopicTimer = setInterval(() => {
            const state = this.getFreshState();
            if (!state) {
                return;
            }
            const idleMs = Date.now() - this.lastActivityAt;
            if (idleMs < 2 * 60 * 1000) {
                return;
            }
            const topic = this.getIdleTopic(state);
            this.emitBubble(topic, this.inferEmotionFromState(state));
            this.lastActivityAt = Date.now() - 60 * 1000;
        }, 30000);
    }
    getIdleTopic(state) {
        const lowNeedTopics = [];
        if (state.hunger < 35) {
            lowNeedTopics.push(TEXT.topicHungry);
        }
        if (state.energy < 35) {
            lowNeedTopics.push(TEXT.topicSleepy);
        }
        if (state.cleanliness < 35) {
            lowNeedTopics.push(TEXT.topicDirty);
        }
        const casualTopics = [
            TEXT.topic1,
            TEXT.topic2,
            TEXT.topic3,
            TEXT.topic4,
            TEXT.topic5,
        ];
        const pool = lowNeedTopics.length > 0 ? lowNeedTopics : casualTopics;
        return pool[Math.floor(Math.random() * pool.length)];
    }
    markActivity() {
        this.lastActivityAt = Date.now();
    }
    inferEmotionFromState(state) {
        if (state.hunger < 30) {
            return 'hungry';
        }
        if (state.energy < 30) {
            return 'tired';
        }
        if (state.mood < 30) {
            return 'sad';
        }
        return 'happy';
    }
    broadcastState() {
        const state = this.getFreshState();
        console.log('[Main] Broadcasting state snapshot:', state ? {
            stage: state.stage,
            level: state.level,
            mood: Math.round(state.mood),
            hunger: Math.round(state.hunger),
            energy: Math.round(state.energy),
            cleanliness: Math.round(state.cleanliness),
        } : null);
        this.windowManager?.send('desktop-pet:state-updated', state);
    }
    emitBubble(text, emotion) {
        console.log('[Main] Emitting bubble:', { text, emotion });
        this.windowManager?.send('desktop-pet:bubble', { text, emotion, timestamp: Date.now() });
    }
    cleanup() {
        if (this.idleTopicTimer) {
            clearInterval(this.idleTopicTimer);
            this.idleTopicTimer = null;
        }
        this.statePersister?.saveState();
        this.statePersister?.destroy();
        this.pythonBridge?.stop();
        this.trayManager?.destroy();
        this.windowManager?.destroy();
    }
}
new DesktopPet();
