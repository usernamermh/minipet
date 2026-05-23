"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('desktopPet', {
    getState: () => electron_1.ipcRenderer.invoke('desktop-pet:get-state'),
    performInteraction: (type) => electron_1.ipcRenderer.invoke('desktop-pet:perform-interaction', type),
    sendChat: (message) => electron_1.ipcRenderer.invoke('desktop-pet:send-chat', message),
    updateSetting: (setting, value) => electron_1.ipcRenderer.invoke('desktop-pet:update-setting', setting, value),
    dragWindowStart: () => electron_1.ipcRenderer.invoke('desktop-pet:window-drag-start'),
    dragWindowStop: () => electron_1.ipcRenderer.invoke('desktop-pet:window-drag-stop'),
    dragWindow: (deltaX, deltaY) => electron_1.ipcRenderer.invoke('desktop-pet:window-drag', deltaX, deltaY),
    dragWindowTo: () => electron_1.ipcRenderer.invoke('desktop-pet:window-drag-to'),
    nudgeWindow: (deltaX, deltaY) => electron_1.ipcRenderer.invoke('desktop-pet:window-nudge', deltaX, deltaY),
    updatePetViewportBounds: (bounds) => electron_1.ipcRenderer.invoke('desktop-pet:update-pet-viewport-bounds', bounds),
    toggleWindow: () => electron_1.ipcRenderer.invoke('desktop-pet:window-toggle'),
    setPointerMode: (interactive) => electron_1.ipcRenderer.invoke('desktop-pet:set-pointer-mode', interactive),
    quit: () => electron_1.ipcRenderer.invoke('desktop-pet:quit'),
    onStateUpdated: (callback) => {
        electron_1.ipcRenderer.on('desktop-pet:state-updated', (_event, state) => callback(state));
    },
    onBubble: (callback) => {
        electron_1.ipcRenderer.on('desktop-pet:bubble', (_event, payload) => callback(payload));
    },
});
