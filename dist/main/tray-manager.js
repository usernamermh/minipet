"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrayManager = void 0;
const electron_1 = require("electron");
const path_1 = require("path");
class TrayManager {
    actions;
    tray = null;
    iconPath = (0, path_1.join)(__dirname, '../../public/icon.png');
    constructor(actions) {
        this.actions = actions;
        this.createTray();
    }
    createTray() {
        const icon = electron_1.nativeImage.createFromPath(this.iconPath);
        this.tray = new electron_1.Tray(icon.isEmpty() ? electron_1.nativeImage.createEmpty() : icon);
        this.tray.setToolTip('Desktop Pet');
        this.updateContextMenu();
    }
    updateContextMenu() {
        if (!this.tray) {
            return;
        }
        const contextMenu = electron_1.Menu.buildFromTemplate([
            { label: '显示/隐藏宠物', click: () => this.actions.toggleVisibility() },
            { type: 'separator' },
            { label: '喂食', click: () => this.actions.performInteraction('feed') },
            { label: '清洁', click: () => this.actions.performInteraction('clean') },
            { label: '抚摸', click: () => this.actions.performInteraction('pet') },
            { label: '陪玩', click: () => this.actions.performInteraction('play') },
            { label: '睡觉', click: () => this.actions.performInteraction('sleep') },
            { type: 'separator' },
            {
                label: '设置',
                submenu: [
                    {
                        label: '开启音效',
                        type: 'checkbox',
                        checked: true,
                        click: (menuItem) => this.actions.updateSetting('soundEnabled', menuItem.checked),
                    },
                    {
                        label: '开启语音',
                        type: 'checkbox',
                        checked: true,
                        click: (menuItem) => this.actions.updateSetting('voiceEnabled', menuItem.checked),
                    },
                    {
                        label: '低功耗模式',
                        type: 'checkbox',
                        checked: false,
                        click: (menuItem) => this.actions.updateSetting('lowPowerMode', menuItem.checked),
                    },
                ],
            },
            { type: 'separator' },
            { label: '退出', click: () => electron_1.app.quit() },
        ]);
        this.tray.setContextMenu(contextMenu);
    }
    destroy() {
        if (this.tray) {
            this.tray.destroy();
            this.tray = null;
        }
    }
}
exports.TrayManager = TrayManager;
