const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // 窗口管理
    hideWindow: () => ipcRenderer.invoke('window:hide'),
    showWindow: () => ipcRenderer.invoke('window:show'),
    getPosition: () => ipcRenderer.invoke('window:getPosition'),
    setPosition: (x, y) => ipcRenderer.invoke('window:setPosition', x, y),

    // 状态管理
    getState: () => ipcRenderer.invoke('state:get'),
    updateState: (updates) => ipcRenderer.invoke('state:update', updates),
    resetState: () => ipcRenderer.invoke('state:reset'),

    // 交互记录
    addInteraction: (type, valueChange) => ipcRenderer.invoke('interaction:add', type, valueChange),

    // 对话记忆
    addConversation: (role, content) => ipcRenderer.invoke('conversation:add', role, content),
    getConversation: () => ipcRenderer.invoke('conversation:get'),

    // 设置管理
    getSettings: () => ipcRenderer.invoke('settings:get'),
    updateSetting: (setting, value) => ipcRenderer.invoke('settings:update', setting, value),

    // 后端通信
    getBackendUrl: () => ipcRenderer.invoke('backend:getUrl'),
    isBackendRunning: () => ipcRenderer.invoke('backend:isRunning'),
    restartBackend: () => ipcRenderer.invoke('backend:restart'),

    // 应用控制
    quitApp: () => ipcRenderer.invoke('app:quit'),

    // 聊天
    sendChat: (message, state) => ipcRenderer.invoke('chat-message', { message, state }),

    // 事件监听
    onStateUpdated: (callback) => {
        ipcRenderer.on('state-updated', (_event, state) => callback(state));
    },
    onInteractionCommand: (callback) => {
        ipcRenderer.on('interaction-command', (_event, command) => callback(command));
    },
    onSettingChanged: (callback) => {
        ipcRenderer.on('setting-changed', (_event, data) => callback(data));
    },
});