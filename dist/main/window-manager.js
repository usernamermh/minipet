"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WindowManager = void 0;
const fs_1 = require("fs");
const electron_1 = require("electron");
const path_1 = require("path");
class WindowManager {
    mainWindow = null;
    windowSize = { width: 360, height: 420 };
    windowPosition = { x: 80, y: 80 };
    fixedPetViewportBounds = { x: 103, y: 103, width: 155, height: 155 };
    debugEnabled = true;
    dragLogFile = (0, path_1.join)(__dirname, '../../logs/drag-debug.log');
    isDragging = false;
    invalidMoveLogCount = 0;
    clampLogCount = 0;
    dragLogCount = 0;
    dragTimer = null;
    dragAnchorOffset = { x: 180, y: 180 };
    dragStartCursorPoint = null;
    dragStartWindowPosition = null;
    lastPolledCursorPoint = null;
    constructor() {
        this.createMainWindow();
    }
    debugLog(message, payload) {
        if (!this.debugEnabled) {
            return;
        }
        if (payload === undefined) {
            console.log(message);
            return;
        }
        console.log(message, payload);
    }
    writeDragLog(tag, payload) {
        try {
            (0, fs_1.mkdirSync)((0, path_1.join)(__dirname, '../../logs'), { recursive: true });
            (0, fs_1.appendFileSync)(this.dragLogFile, `${new Date().toISOString()} ${tag} ${JSON.stringify(payload)}\n`, 'utf8');
        }
        catch (error) {
            console.error('[Window] Failed to write drag log:', error);
        }
    }
    createMainWindow() {
        const entryFile = (0, path_1.join)(__dirname, '../../public/index.html');
        const options = {
            width: this.windowSize.width,
            height: this.windowSize.height,
            x: this.windowPosition.x,
            y: this.windowPosition.y,
            transparent: true,
            frame: false,
            useContentSize: true,
            alwaysOnTop: true,
            skipTaskbar: true,
            resizable: false,
            movable: true,
            focusable: true,
            hasShadow: false,
            backgroundColor: '#00000000',
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                preload: (0, path_1.join)(__dirname, 'preload.js'),
            },
        };
        console.log('[Window] Creating main window with options:', {
            ...options,
            webPreferences: {
                ...options.webPreferences,
                preload: options.webPreferences?.preload,
            },
        });
        this.writeDragLog('window-created', {
            entryFile,
            windowSize: this.windowSize,
            windowPosition: this.windowPosition,
        });
        this.mainWindow = new electron_1.BrowserWindow(options);
        this.mainWindow.setContentSize(this.windowSize.width, this.windowSize.height);
        this.mainWindow.setMenuBarVisibility(false);
        this.mainWindow.webContents.on('did-finish-load', () => {
            const bounds = this.mainWindow?.getBounds();
            console.log('[Window] Renderer finished load. Bounds:', bounds);
            void this.probeRendererState('did-finish-load');
            setTimeout(() => {
                void this.probeRendererState('post-load-250ms');
            }, 250);
            setTimeout(() => {
                void this.probeRendererState('post-load-1500ms');
            }, 1500);
        });
        this.mainWindow.webContents.on('did-fail-load', (_event, code, description, url) => {
            console.error('[Window] Renderer failed to load:', { code, description, url });
        });
        this.mainWindow.webContents.on('render-process-gone', (_event, details) => {
            console.error('[Window] Renderer process gone:', details);
        });
        this.mainWindow.on('ready-to-show', () => {
            console.log('[Window] ready-to-show fired');
            this.mainWindow?.showInactive();
        });
        this.mainWindow.on('show', () => {
            console.log('[Window] show event fired');
        });
        this.mainWindow.on('hide', () => {
            console.log('[Window] hide event fired');
        });
        console.log('[Window] Loading entry file:', entryFile);
        this.mainWindow.loadFile(entryFile);
        this.setupWindowBehavior();
        this.setMousePassthrough(true);
    }
    async probeRendererState(tag) {
        if (!this.mainWindow) {
            return;
        }
        try {
            const snapshot = await this.mainWindow.webContents.executeJavaScript(`
        (() => {
          const stageLabel = document.getElementById('petStageLabel');
          const canvas = document.getElementById('petCanvas');
          const scripts = Array.from(document.scripts).map((script) => script.src || '[inline]');
          const canvasRect = canvas ? canvas.getBoundingClientRect() : null;
          return {
            tag: ${JSON.stringify(tag)},
            readyState: document.readyState,
            title: document.title,
            scriptCount: scripts.length,
            scripts,
            hasDesktopPetApi: Boolean(window.desktopPet),
            rendererLoadedFlag: Boolean(window.__DESKTOP_PET_RENDERER_LOADED__),
            stageLabelText: stageLabel ? stageLabel.textContent : null,
            bodyTextSample: document.body ? document.body.innerText.slice(0, 120) : null,
            canvasRect,
            canvasClientWidth: canvas ? canvas.clientWidth : null,
            canvasClientHeight: canvas ? canvas.clientHeight : null,
          };
        })();
      `, true);
            // this.debugLog('[Window] Renderer probe:', snapshot);
        }
        catch (error) {
            console.error('[Window] Renderer probe failed:', tag, error);
        }
    }
    setupWindowBehavior() {
        if (!this.mainWindow) {
            return;
        }
        this.mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
        this.mainWindow.setAlwaysOnTop(true, 'screen-saver');
        electron_1.screen.on('display-added', () => this.adjustWindowPosition());
        electron_1.screen.on('display-removed', () => this.adjustWindowPosition());
        electron_1.screen.on('display-metrics-changed', () => this.adjustWindowPosition());
    }
    adjustWindowPosition() {
        if (!this.mainWindow) {
            return;
        }
        const [x, y] = this.mainWindow.getPosition();
        const bounds = this.mainWindow.getBounds();
        const displays = electron_1.screen.getAllDisplays();
        const isInAnyDisplay = displays.some((display) => {
            const displayBounds = display.bounds;
            return (x >= displayBounds.x &&
                x + bounds.width <= displayBounds.x + displayBounds.width &&
                y >= displayBounds.y &&
                y + bounds.height <= displayBounds.y + displayBounds.height);
        });
        if (!isInAnyDisplay) {
            const primaryDisplay = electron_1.screen.getPrimaryDisplay();
            const primaryBounds = primaryDisplay.bounds;
            const newX = primaryBounds.x + primaryBounds.width - bounds.width - 60;
            const newY = primaryBounds.y + primaryBounds.height - bounds.height - 80;
            this.mainWindow.setPosition(newX, newY);
        }
    }
    showWindow() {
        console.log('[Window] showWindow called');
        this.mainWindow?.show();
    }
    hideWindow() {
        console.log('[Window] hideWindow called');
        this.mainWindow?.hide();
    }
    toggleWindowVisibility() {
        if (!this.mainWindow) {
            return;
        }
        if (this.mainWindow.isVisible()) {
            this.hideWindow();
        }
        else {
            this.showWindow();
        }
    }
    moveWindowBy(deltaX, deltaY) {
        this.nudgeWindowBy(deltaX, deltaY);
    }
    updatePetViewportBounds(bounds) {
        // this.debugLog('[Window] Ignoring dynamic pet viewport bounds update; using fixed bounds instead:', {
        //     received: bounds,
        //     fixed: this.fixedPetViewportBounds,
        // });
    }
    logDragBounds(tag) {
        if (!this.mainWindow) {
            return;
        }
        const cursorPoint = electron_1.screen.getCursorScreenPoint();
        const display = electron_1.screen.getDisplayNearestPoint(cursorPoint);
        const displayBounds = display.bounds;
        const anchorOffset = this.dragAnchorOffset;
        const intendedWindowRange = {
            minX: displayBounds.x - anchorOffset.x,
            maxX: displayBounds.x + displayBounds.width - anchorOffset.x,
            minY: displayBounds.y - anchorOffset.y,
            maxY: displayBounds.y + displayBounds.height - anchorOffset.y,
        };
        const actualWindowPosition = this.mainWindow.getPosition();
        // this.debugLog('[Window] Drag bounds review:', {
        //     tag,
        //     cursorPoint,
        //     screenBounds: displayBounds,
        //     petAnchorOffset: anchorOffset,
        //     intendedWindowRange,
        //     actualWindowPosition: {
        //         x: actualWindowPosition[0],
        //         y: actualWindowPosition[1],
        //     },
        //     fixedPetViewportBounds: this.fixedPetViewportBounds,
        // });
    }
    clampWindowPosition(targetX, targetY, anchorPoint) {
        if (!this.mainWindow) {
            return {
                nextX: targetX,
                nextY: targetY,
                bouncedX: false,
                bouncedY: false,
            };
        }
        if (!Number.isFinite(targetX) || !Number.isFinite(targetY)) {
            const [currentX, currentY] = this.mainWindow.getPosition();
            if (this.invalidMoveLogCount < 6) {
                console.warn('[Window] Invalid target position received, keeping current position:', {
                    targetX,
                    targetY,
                    currentX,
                    currentY,
                });
                this.invalidMoveLogCount += 1;
            }
            return {
                nextX: currentX,
                nextY: currentY,
                bouncedX: true,
                bouncedY: true,
            };
        }
        const petBounds = this.fixedPetViewportBounds;
        const bounds = {
            x: petBounds.x,
            y: petBounds.y,
            width: petBounds.width,
            height: petBounds.height,
        };
        const display = anchorPoint
            ? electron_1.screen.getDisplayNearestPoint({
                x: Math.round(anchorPoint.x),
                y: Math.round(anchorPoint.y),
            })
            : electron_1.screen.getDisplayNearestPoint({
                x: Math.round(targetX + bounds.width / 2),
                y: Math.round(targetY + bounds.height / 2),
            });
        const displayBounds = display.bounds;
        const minX = displayBounds.x - bounds.x - 200;
        const maxX = Math.max(minX, displayBounds.x + displayBounds.width - (bounds.x + bounds.width));
        const minY = displayBounds.y - bounds.y - 200;
        const maxY = Math.max(minY, displayBounds.y + displayBounds.height - (bounds.y + bounds.height));
        const nextX = Math.max(minX, Math.min(maxX, Math.round(targetX)));
        const nextY = Math.max(minY, Math.min(maxY, Math.round(targetY)));
        const bouncedX = nextX !== Math.round(targetX);
        const bouncedY = nextY !== Math.round(targetY);
        if (this.clampLogCount < 12 || bouncedX || bouncedY) {
            // this.debugLog('[Window] Clamp review:', {
            //     targetX: Math.round(targetX),
            //     targetY: Math.round(targetY),
            //     nextX,
            //     nextY,
            //     bouncedX,
            //     bouncedY,
            //     windowBounds: bounds,
            //     petViewportBounds: this.fixedPetViewportBounds,
            //     screenBounds: displayBounds,
            //     allowedWindowRange: {
            //         minX,
            //         maxX,
            //         minY,
            //         maxY,
            //     },
            //     petReachOnScreen: {
            //         left: nextX,
            //         right: nextX + bounds.width,
            //         top: nextY,
            //         bottom: nextY + bounds.height,
            //     },
            // });
            this.clampLogCount += 1;
        }
        return {
            nextX,
            nextY,
            bouncedX,
            bouncedY,
        };
    }
    moveWindowToCursor() {
        if (!this.mainWindow) {
            return {
                nextX: 0,
                nextY: 0,
                bouncedX: false,
                bouncedY: false,
            };
        }
        const cursorPoint = electron_1.screen.getCursorScreenPoint();
        const [beforeX, beforeY] = this.mainWindow.getPosition();
        const lastCursorPoint = this.lastPolledCursorPoint;
        if (lastCursorPoint && lastCursorPoint.x === cursorPoint.x && lastCursorPoint.y === cursorPoint.y) {
            this.writeDragLog('drag-skip-same-cursor', {
                mouse: cursorPoint,
                window: { x: beforeX, y: beforeY },
            });
            return {
                nextX: beforeX,
                nextY: beforeY,
                bouncedX: false,
                bouncedY: false,
            };
        }
        this.lastPolledCursorPoint = { x: cursorPoint.x, y: cursorPoint.y };
        const startCursorPoint = this.dragStartCursorPoint ?? cursorPoint;
        const startWindowPosition = this.dragStartWindowPosition ?? (() => {
            const [windowX, windowY] = this.mainWindow.getPosition();
            return { x: windowX, y: windowY };
        })();
        const targetX = Math.round(startWindowPosition.x + (cursorPoint.x - startCursorPoint.x));
        const targetY = Math.round(startWindowPosition.y + (cursorPoint.y - startCursorPoint.y));
        const clamped = this.clampWindowPosition(targetX, targetY, cursorPoint);
        this.mainWindow.setPosition(clamped.nextX, clamped.nextY);
        const [actualX, actualY] = this.mainWindow.getPosition();
        this.writeDragLog('drag-move-tick', {
            mouse: {
                x: cursorPoint.x,
                y: cursorPoint.y,
            },
            windowBefore: {
                x: beforeX,
                y: beforeY,
            },
            windowAfter: {
                x: actualX,
                y: actualY,
            },
            startCursorPoint,
            startWindowPosition,
            targetX,
            targetY,
            clampedX: clamped.nextX,
            clampedY: clamped.nextY,
        });
        if (actualX !== beforeX || actualY !== beforeY) {
            // console.log('[Window] Drag move tick:', {
            //     mouse: {
            //         x: cursorPoint.x,
            //         y: cursorPoint.y,
            //     },
            //     windowBefore: {
            //         x: beforeX,
            //         y: beforeY,
            //     },
            //     windowAfter: {
            //         x: actualX,
            //         y: actualY,
            //     },
            //     startCursorPoint,
            //     startWindowPosition,
            //     targetX,
            //     targetY,
            // });
        }
        return {
            nextX: actualX,
            nextY: actualY,
            bouncedX: clamped.bouncedX || actualX !== clamped.nextX,
            bouncedY: clamped.bouncedY || actualY !== clamped.nextY,
        };
    }
    startCursorDrag() {
        if (this.dragTimer) {
            return;
        }
        if (this.mainWindow) {
            const cursorPoint = electron_1.screen.getCursorScreenPoint();
            const [windowX, windowY] = this.mainWindow.getPosition();
            this.dragStartCursorPoint = { x: cursorPoint.x, y: cursorPoint.y };
            this.dragStartWindowPosition = { x: windowX, y: windowY };
            this.lastPolledCursorPoint = null;
            this.writeDragLog('drag-start', {
                mouse: this.dragStartCursorPoint,
                window: this.dragStartWindowPosition,
            });
        }
        this.isDragging = true;
        this.setMousePassthrough(false);
        this.dragLogCount = 0;
        this.logDragBounds('drag-start');
        this.dragTimer = setInterval(() => {
            if (this.dragLogCount < 20) {
                this.logDragBounds(`drag-tick-${this.dragLogCount + 1}`);
                this.dragLogCount += 1;
            }
            this.moveWindowToCursor();
        }, 50);
    }
    stopCursorDrag() {
        this.isDragging = false;
        if (this.dragTimer) {
            clearInterval(this.dragTimer);
            this.dragTimer = null;
        }
        this.writeDragLog('drag-stop', {
            lastMouse: this.lastPolledCursorPoint,
            dragStartCursorPoint: this.dragStartCursorPoint,
            dragStartWindowPosition: this.dragStartWindowPosition,
        });
        this.dragStartCursorPoint = null;
        this.dragStartWindowPosition = null;
        this.lastPolledCursorPoint = null;
    }
    nudgeWindowBy(deltaX, deltaY) {
        if (!this.mainWindow) {
            return {
                appliedDeltaX: 0,
                appliedDeltaY: 0,
                bouncedX: false,
                bouncedY: false,
            };
        }
        if (this.isDragging) {
            // this.debugLog('[Window] Ignoring nudge while dragging', { deltaX, deltaY });
            return {
                appliedDeltaX: 0,
                appliedDeltaY: 0,
                bouncedX: false,
                bouncedY: false,
            };
        }
        const [x, y] = this.mainWindow.getPosition();
        const bounds = this.mainWindow.getBounds();
        const safeDeltaX = Number.isFinite(deltaX) ? deltaX : 0;
        const safeDeltaY = Number.isFinite(deltaY) ? deltaY : 0;
        const targetX = x + safeDeltaX;
        const targetY = y + safeDeltaY;
        const clamped = this.clampWindowPosition(targetX, targetY, {
            x: targetX + bounds.width / 2,
            y: targetY + bounds.height / 2,
        });
        this.mainWindow.setPosition(clamped.nextX, clamped.nextY);
        return {
            appliedDeltaX: clamped.nextX - x,
            appliedDeltaY: clamped.nextY - y,
            bouncedX: clamped.bouncedX,
            bouncedY: clamped.bouncedY,
        };
    }
    send(channel, payload) {
        // this.debugLog('[Window] Sending event to renderer:', channel);
        this.mainWindow?.webContents.send(channel, payload);
    }
    setMousePassthrough(ignore) {
        // this.debugLog('[Window] setMousePassthrough:', ignore);
        this.mainWindow?.setIgnoreMouseEvents(ignore, { forward: true });
    }
    destroy() {
        this.stopCursorDrag();
        if (this.mainWindow) {
            this.mainWindow.destroy();
            this.mainWindow = null;
        }
    }
}
exports.WindowManager = WindowManager;
