"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatePersister = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
class StatePersister {
    stateFilePath;
    backupDir;
    state;
    autoSaveTimer = null;
    constructor(dataDir) {
        this.stateFilePath = (0, path_1.join)(dataDir, 'pet_state.json');
        this.backupDir = (0, path_1.join)(dataDir, 'backups');
        this.ensureDirectories();
        this.state = this.loadState();
        this.startAutoSave();
    }
    ensureDirectories() {
        if (!(0, fs_1.existsSync)(this.backupDir)) {
            (0, fs_1.mkdirSync)(this.backupDir, { recursive: true });
        }
    }
    getDefaultState() {
        const now = new Date().toISOString();
        return {
            hunger: 80,
            cleanliness: 90,
            energy: 100,
            mood: 85,
            level: 1,
            exp: 0,
            ageInDays: 0,
            stage: 'baby',
            lastUpdate: now,
            createdAt: now,
            interactionHistory: [],
            conversationMemory: [],
            settings: {
                soundEnabled: true,
                voiceEnabled: true,
                lowPowerMode: false,
                autoSaveInterval: 5,
            },
        };
    }
    loadState() {
        try {
            if ((0, fs_1.existsSync)(this.stateFilePath)) {
                const data = (0, fs_1.readFileSync)(this.stateFilePath, 'utf-8');
                const loadedState = JSON.parse(data);
                return this.validateAndRepairState(loadedState);
            }
        }
        catch (error) {
            console.error('Error loading state:', error);
            this.createBackup();
        }
        return this.getDefaultState();
    }
    validateAndRepairState(state) {
        const defaultState = this.getDefaultState();
        const repairedState = {
            ...defaultState,
            ...state,
            interactionHistory: state.interactionHistory || [],
            conversationMemory: state.conversationMemory || [],
            settings: {
                ...defaultState.settings,
                ...(state.settings || {}),
            },
        };
        repairedState.hunger = this.clampValue(repairedState.hunger, 0, 100);
        repairedState.cleanliness = this.clampValue(repairedState.cleanliness, 0, 100);
        repairedState.energy = this.clampValue(repairedState.energy, 0, 100);
        repairedState.mood = this.clampValue(repairedState.mood, 0, 100);
        repairedState.level = Math.max(1, repairedState.level);
        repairedState.exp = Math.max(0, repairedState.exp);
        repairedState.ageInDays = Math.max(0, repairedState.ageInDays);
        repairedState.stage =
            repairedState.ageInDays <= 7 ? 'baby' : repairedState.ageInDays <= 30 ? 'teen' : 'adult';
        if (!repairedState.createdAt || Number.isNaN(Date.parse(repairedState.createdAt))) {
            repairedState.createdAt = defaultState.createdAt;
        }
        if (!repairedState.lastUpdate || Number.isNaN(Date.parse(repairedState.lastUpdate))) {
            repairedState.lastUpdate = new Date().toISOString();
        }
        return repairedState;
    }
    clampValue(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }
    saveState() {
        try {
            this.state.lastUpdate = new Date().toISOString();
            this.createBackup();
            (0, fs_1.writeFileSync)(this.stateFilePath, JSON.stringify(this.state, null, 2), 'utf-8');
        }
        catch (error) {
            console.error('Error saving state:', error);
        }
    }
    createBackup() {
        try {
            if ((0, fs_1.existsSync)(this.stateFilePath)) {
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const backupPath = (0, path_1.join)(this.backupDir, `pet_state_${timestamp}.json`);
                const data = (0, fs_1.readFileSync)(this.stateFilePath, 'utf-8');
                (0, fs_1.writeFileSync)(backupPath, data, 'utf-8');
            }
        }
        catch (error) {
            console.error('Error creating backup:', error);
        }
    }
    startAutoSave() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
        }
        const interval = this.state.settings.autoSaveInterval * 60 * 1000;
        this.autoSaveTimer = setInterval(() => this.saveState(), interval);
    }
    getState() {
        return {
            ...this.state,
            interactionHistory: [...this.state.interactionHistory],
            conversationMemory: [...this.state.conversationMemory],
            settings: { ...this.state.settings },
        };
    }
    updateState(updates) {
        this.state = this.validateAndRepairState({
            ...this.state,
            ...updates,
            lastUpdate: new Date().toISOString(),
        });
    }
    addInteraction(type, valueChange) {
        this.state.interactionHistory.push({
            type,
            timestamp: new Date().toISOString(),
            valueChange,
        });
        if (this.state.interactionHistory.length > 100) {
            this.state.interactionHistory = this.state.interactionHistory.slice(-100);
        }
    }
    addConversation(role, content) {
        this.state.conversationMemory.push({
            role,
            content,
            timestamp: new Date().toISOString(),
        });
        if (this.state.conversationMemory.length > 50) {
            this.state.conversationMemory = this.state.conversationMemory.slice(-50);
        }
    }
    updateSetting(setting, value) {
        this.state.settings[setting] = value;
        if (setting === 'autoSaveInterval') {
            this.startAutoSave();
        }
    }
    destroy() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
            this.autoSaveTimer = null;
        }
        this.saveState();
    }
    cleanupOldBackups(maxBackups = 10) {
        try {
            if (!(0, fs_1.existsSync)(this.backupDir)) {
                return;
            }
            const files = (0, fs_1.readdirSync)(this.backupDir)
                .filter((file) => file.endsWith('.json'))
                .map((file) => ({
                path: (0, path_1.join)(this.backupDir, file),
                mtime: (0, fs_1.statSync)((0, path_1.join)(this.backupDir, file)).mtimeMs,
            }))
                .sort((a, b) => b.mtime - a.mtime);
            if (files.length > maxBackups) {
                for (let i = maxBackups; i < files.length; i += 1) {
                    (0, fs_1.unlinkSync)(files[i].path);
                }
            }
        }
        catch (error) {
            console.error('Error cleaning up old backups:', error);
        }
    }
}
exports.StatePersister = StatePersister;
