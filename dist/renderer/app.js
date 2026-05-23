window.__DESKTOP_PET_RENDERER_LOADED__ = true;
const TEXT = {
    stageBaby: '\u5e7c\u5e74',
    stageTeen: '\u6210\u957f\u671f',
    stageAdult: '\u6210\u5e74',
    moodPrefix: '\u5fc3\u60c5',
    welcome: '\u6211\u5df2\u7ecf\u5728\u684c\u9762\u4e0a\u7b49\u4f60\u5566\u3002',
    wandering: '\u6211\u5728\u684c\u9762\u4e0a\u6563\u6563\u6b65\u3002',
};
const SPRITE_FRAME_SIZE = 50;
const THEME_LIBRARY = {
    cat_1: {
        mode: 'sheet',
        renderScale: {
            baby: 3.1,
            teen: 3.5,
            adult: 3.9,
        },
        root: '../../resources/animations/luizmelo_pet_cats/Pet Cats Pack/Cat-1/',
        animations: {
            idle: ['Cat-1-Idle.png'],
            walk: ['Cat-1-Walk.png'],
            sleep: ['Cat-1-Sleeping1.png', 'Cat-1-Sleeping2.png'],
            playful: ['Cat-1-Run.png'],
            content: ['Cat-1-Meow.png'],
            needy: ['Cat-1-Meow.png'],
            pet: ['Cat-1-Licking 1.png'],
        },
    },
    cat_2: {
        mode: 'sheet',
        renderScale: {
            baby: 3.1,
            teen: 3.5,
            adult: 3.9,
        },
        root: '../../resources/animations/luizmelo_pet_cats/Pet Cats Pack/Cat-2/',
        animations: {
            idle: ['Cat-2-Idle.png'],
            walk: ['Cat-2-Walk.png'],
            sleep: ['Cat-2-Sleeping1.png', 'Cat-2-Sleeping2.png'],
            playful: ['Cat-2-Run.png'],
            content: ['Cat-2-Meow.png'],
            needy: ['Cat-2-Meow.png'],
            pet: ['Cat-2-Licking 1.png'],
        },
    },
    cat_3: {
        mode: 'sheet',
        renderScale: {
            baby: 3.1,
            teen: 3.5,
            adult: 3.9,
        },
        root: '../../resources/animations/luizmelo_pet_cats/Pet Cats Pack/Cat-3/',
        animations: {
            idle: ['Cat-3-Idle.png'],
            walk: ['Cat-3-Walk.png'],
            sleep: ['Cat-3-Sleeping1.png', 'Cat-3-Sleeping2.png'],
            playful: ['Cat-3-Run.png'],
            content: ['Cat-3-Meow.png'],
            needy: ['Cat-3-Meow.png'],
            pet: ['Cat-3-Licking 1.png'],
        },
    },
    cat_4: {
        mode: 'sheet',
        renderScale: {
            baby: 3.1,
            teen: 3.5,
            adult: 3.9,
        },
        root: '../../resources/animations/luizmelo_pet_cats/Pet Cats Pack/Cat-4/',
        animations: {
            idle: ['Cat-4-Idle.png'],
            walk: ['Cat-4-Walk.png'],
            sleep: ['Cat-4-Sleeping1.png', 'Cat-4-Sleeping2.png'],
            playful: ['Cat-4-Run.png'],
            content: ['Cat-4-Meow.png'],
            needy: ['Cat-4-Meow.png'],
            pet: ['Cat-4-Licking 1.png'],
        },
    },
    cat_5: {
        mode: 'sheet',
        renderScale: {
            baby: 3.1,
            teen: 3.5,
            adult: 3.9,
        },
        root: '../../resources/animations/luizmelo_pet_cats/Pet Cats Pack/Cat-5/',
        animations: {
            idle: ['Cat-5-Idle.png'],
            walk: ['Cat-5-Walk.png'],
            sleep: ['Cat-5-Sleeping1.png', 'Cat-5-Sleeping2.png'],
            playful: ['Cat-5-Run.png'],
            content: ['Cat-5-Meow.png'],
            needy: ['Cat-5-Meow.png'],
            pet: ['Cat-5-Licking 1.png'],
        },
    },
    cat_6: {
        mode: 'sheet',
        renderScale: {
            baby: 3.1,
            teen: 3.5,
            adult: 3.9,
        },
        root: '../../resources/animations/luizmelo_pet_cats/Pet Cats Pack/Cat-6/',
        animations: {
            idle: ['Cat-6-Idle.png'],
            walk: ['Cat-6-Walk.png'],
            sleep: ['Cat-6-Sleeping1.png', 'Cat-6-Sleeping2.png'],
            playful: ['Cat-6-Run.png'],
            content: ['Cat-6-Meow.png'],
            needy: ['Cat-6-Meow.png'],
            pet: ['Cat-6-Licking 1.png'],
        },
    },
    tiny_cat: {
        mode: 'frames',
        renderScale: {
            baby: 0.34,
            teen: 0.38,
            adult: 0.42,
        },
        root: '../../resources/animations/external_packs/extracted/tiny-cat/TINY CAT SPRITE/',
        animations: {
            idle: [
                '01_Idle/__Cat_Idle_000.png',
                '01_Idle/__Cat_Idle_001.png',
                '01_Idle/__Cat_Idle_002.png',
                '01_Idle/__Cat_Idle_003.png',
                '01_Idle/__Cat_Idle_004.png',
                '01_Idle/__Cat_Idle_005.png',
                '01_Idle/__Cat_Idle_006.png',
                '01_Idle/__Cat_Idle_007.png',
                '01_Idle/__Cat_Idle_008.png',
                '01_Idle/__Cat_Idle_009.png',
                '01_Idle/__Cat_Idle_010.png',
                '01_Idle/__Cat_Idle_011.png',
            ],
            walk: [
                '02_Run/__Cat_Run_000.png',
                '02_Run/__Cat_Run_001.png',
                '02_Run/__Cat_Run_002.png',
                '02_Run/__Cat_Run_003.png',
                '02_Run/__Cat_Run_004.png',
                '02_Run/__Cat_Run_005.png',
                '02_Run/__Cat_Run_006.png',
                '02_Run/__Cat_Run_007.png',
                '02_Run/__Cat_Run_008.png',
                '02_Run/__Cat_Run_009.png',
            ],
            sleep: [
                '01_Idle/__Cat_Idle_000.png',
                '01_Idle/__Cat_Idle_001.png',
                '01_Idle/__Cat_Idle_002.png',
            ],
            playful: [
                '02_Run/__Cat_Run_000.png',
                '02_Run/__Cat_Run_001.png',
                '02_Run/__Cat_Run_002.png',
                '02_Run/__Cat_Run_003.png',
                '02_Run/__Cat_Run_004.png',
                '02_Run/__Cat_Run_005.png',
                '02_Run/__Cat_Run_006.png',
                '02_Run/__Cat_Run_007.png',
                '02_Run/__Cat_Run_008.png',
                '02_Run/__Cat_Run_009.png',
            ],
            content: [
                '01_Idle/__Cat_Idle_003.png',
                '01_Idle/__Cat_Idle_004.png',
                '01_Idle/__Cat_Idle_005.png',
            ],
            needy: [
                '01_Idle/__Cat_Idle_006.png',
                '01_Idle/__Cat_Idle_007.png',
                '01_Idle/__Cat_Idle_008.png',
            ],
            pet: [
                '01_Idle/__Cat_Idle_009.png',
                '01_Idle/__Cat_Idle_010.png',
                '01_Idle/__Cat_Idle_011.png',
            ],
        },
    },
    blue_bird: {
        mode: 'frames',
        renderScale: {
            baby: 0.17,
            teen: 0.19,
            adult: 0.21,
        },
        root: '../../resources/animations/external_packs/extracted/blue-bird/Transparent PNG/',
        animations: {
            idle: ['frame-1.png', 'frame-2.png', 'frame-3.png', 'frame-4.png'],
            walk: ['frame-1.png', 'frame-2.png', 'frame-3.png', 'frame-4.png', 'frame-5.png', 'frame-6.png', 'frame-7.png', 'frame-8.png'],
            sleep: ['frame-1.png', 'frame-2.png'],
            playful: ['frame-1.png', 'frame-2.png', 'frame-3.png', 'frame-4.png', 'frame-5.png', 'frame-6.png', 'frame-7.png', 'frame-8.png'],
            content: ['frame-3.png', 'frame-4.png', 'frame-5.png'],
            needy: ['frame-6.png', 'frame-7.png', 'frame-8.png'],
            pet: ['frame-2.png', 'frame-3.png', 'frame-4.png'],
        },
    },
};
let currentSpriteThemeId = 'cat_1';
const stage = document.getElementById('stage');
const canvas = document.getElementById('petCanvas');
const bubble = document.getElementById('bubble');
const bubbleText = document.getElementById('bubbleText');
const inputDock = document.getElementById('inputDock');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const petMenu = document.getElementById('petMenu');
const dockHint = document.getElementById('dockHint');
const hud = document.getElementById('hud');
const petStageLabel = document.getElementById('petStageLabel');
const petLevelLabel = document.getElementById('petLevelLabel');
const petMoodLabel = document.getElementById('petMoodLabel');
const ctx = canvas.getContext('2d');
let state = null;
let bubbleTimer = 0;
let animationTick = 0;
let pendingDrag = false;
let dragging = false;
let movedDuringDrag = false;
let suppressNextClick = false;
let activePointerId = null;
let pointerPressed = false;
let dragStartScreenX = 0;
let dragStartScreenY = 0;
let lastPointerX = 0;
let lastPointerY = 0;
let lastUserActionAt = Date.now();
let walkDirectionX = 1;
let walkDirectionY = 0;
let walkSpeed = 0.8;
let walkTick = 0;
let walkPauseUntil = 0;
let walkInFlight = false;
let pointerInteractive = true;
let recentInteractionType = null;
let recentInteractionUntil = 0;
let lastInteractionSignature = '';
let inputHintTimer = 0;
let frameCount = 0;
let drawErrorLogged = false;
let spriteAssetsReady = false;
let spriteAssetsFailed = false;
let spriteLoadStarted = false;
let spriteAnimations = {};
let lastRenderedPetBounds = null;
let sendingChat = false;
let lastReportedViewportSignature = '';
let motionSpeedMultiplier = 1;
let spriteFrameSpeedMultiplier = 1;
const DEBUG_RENDERER = false;
function debugLog(message, payload) {
    if (!DEBUG_RENDERER) {
        return;
    }
    if (payload === undefined) {
        console.log(`[Renderer] ${message}`);
        return;
    }
    console.log(`[Renderer] ${message}`, payload);
}
function getCurrentTheme() {
    return THEME_LIBRARY[currentSpriteThemeId] ?? THEME_LIBRARY.cat_1;
}
function createSingleImageFrame(image) {
    return {
        image,
        sx: 0,
        sy: 0,
        sw: image.width,
        sh: image.height,
    };
}
function applySpriteTheme(themeId) {
    currentSpriteThemeId = THEME_LIBRARY[themeId] ? themeId : 'cat_1';
    spriteAssetsReady = false;
    spriteAssetsFailed = false;
    spriteLoadStarted = false;
    spriteAnimations = {};
    debugLog('sprite theme applied', { themeId: currentSpriteThemeId });
}
function setAnimationConfig(config) {
    const motionSpeed = Number(config?.motionSpeedMultiplier);
    const spriteSpeed = Number(config?.spriteFrameSpeedMultiplier);
    motionSpeedMultiplier = Number.isFinite(motionSpeed) && motionSpeed > 0 ? motionSpeed : 1;
    spriteFrameSpeedMultiplier = Number.isFinite(spriteSpeed) && spriteSpeed > 0 ? spriteSpeed : 1;
}
function pauseAutoWalk(durationMs = 12000) {
    lastUserActionAt = Date.now();
    walkPauseUntil = Math.max(walkPauseUntil, lastUserActionAt + durationMs);
}
function buildSpriteUrl(fileName) {
    return new URL(`${getCurrentTheme().root}${fileName}`, import.meta.url).href;
}
function loadImage(url) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error(`Failed to load image: ${url}`));
        image.src = url;
    });
}
function sliceSpriteSheet(image) {
    const frameWidth = image.height > 0 ? image.height : SPRITE_FRAME_SIZE;
    const frameCount = Math.max(1, Math.floor(image.width / frameWidth));
    const frames = [];
    for (let index = 0; index < frameCount; index += 1) {
        frames.push({
            image,
            sx: index * frameWidth,
            sy: 0,
            sw: frameWidth,
            sh: image.height,
        });
    }
    return frames;
}
async function ensureSpriteAssets() {
    if (spriteAssetsReady || spriteAssetsFailed || spriteLoadStarted) {
        return;
    }
    spriteLoadStarted = true;
    const theme = getCurrentTheme();
    debugLog('loading sprite assets', { theme: currentSpriteThemeId, root: buildSpriteUrl('') });
    try {
        const uniqueFiles = Array.from(new Set(Object.values(theme.animations).flat()));
        const imageEntries = await Promise.all(uniqueFiles.map(async (fileName) => [fileName, await loadImage(buildSpriteUrl(fileName))]));
        const imageMap = new Map(imageEntries);
        const nextAnimations = {};
        Object.keys(theme.animations).forEach((motion) => {
            const frames = theme.animations[motion].flatMap((fileName) => {
                const image = imageMap.get(fileName);
                if (!image) {
                    return [];
                }
                return theme.mode === 'frames' ? [createSingleImageFrame(image)] : sliceSpriteSheet(image);
            });
            nextAnimations[motion] = frames;
        });
        spriteAnimations = nextAnimations;
        spriteAssetsReady = true;
        debugLog('sprite assets ready', Object.fromEntries(Object.keys(nextAnimations).map((motion) => [motion, nextAnimations[motion]?.length ?? 0])));
    }
    catch (error) {
        spriteAssetsFailed = true;
        console.error('[Renderer] Failed to load sprite assets, using procedural pet:', error);
    }
}
window.addEventListener('error', (event) => {
    console.error('[Renderer] Unhandled error:', event.message, event.error);
});
window.addEventListener('unhandledrejection', (event) => {
    console.error('[Renderer] Unhandled rejection:', event.reason);
});
function showBubble(text) {
    bubbleText.textContent = text;
    bubble.classList.add('show');
    if (bubbleTimer) {
        window.clearTimeout(bubbleTimer);
    }
    bubbleTimer = window.setTimeout(() => {
        bubble.classList.remove('show');
    }, 4200);
}
function isElementVisible(element) {
    return element.classList.contains('show');
}
function isPointInsideRect(x, y, rect) {
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}
function isPointInsideEllipse(x, y, centerX, centerY, radiusX, radiusY) {
    const dx = (x - centerX) / radiusX;
    const dy = (y - centerY) / radiusY;
    return dx * dx + dy * dy <= 1;
}
function isPointOnPetShape(x, y) {
    const rect = stage.getBoundingClientRect();
    const localX = ((x - rect.left) / rect.width) * canvas.width;
    const localY = ((y - rect.top) / rect.height) * canvas.height;
    if (localX < 0 || localY < 0 || localX > canvas.width || localY > canvas.height) {
        return false;
    }
    if (!state) {
        return isPointInsideEllipse(localX, localY, canvas.width / 2, canvas.height / 2 + 18, 88, 96);
    }
    if (lastRenderedPetBounds) {
        const hitPaddingX = 18;
        const hitPaddingY = 18;
        if (localX >= lastRenderedPetBounds.x - hitPaddingX &&
            localX <= lastRenderedPetBounds.x + lastRenderedPetBounds.width + hitPaddingX &&
            localY >= lastRenderedPetBounds.y - hitPaddingY &&
            localY <= lastRenderedPetBounds.y + lastRenderedPetBounds.height + hitPaddingY) {
            return true;
        }
    }
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2 + 18;
    const stageScale = state.stage === 'baby' ? 0.9 : state.stage === 'teen' ? 1 : 1.12;
    const radius = 58 * stageScale;
    const motion = getCurrentMotion();
    const walkLean = motion === 'walk' ? walkDirectionX * 6 : motion === 'playful' ? Math.sin(animationTick * 1.3) * 4 : 0;
    const bobAmount = motion === 'sleep' ? 2.2 : motion === 'walk' ? 5.2 : motion === 'playful' ? 4.8 : 3.4;
    const bob = Math.sin(animationTick) * bobAmount;
    const bodyHit = isPointInsideEllipse(localX, localY, centerX + walkLean, centerY + bob, radius + 8, radius + 10);
    const faceHit = isPointInsideEllipse(localX, localY, centerX + walkLean, centerY + 8 + bob, radius * 0.76, radius * 0.68);
    const leftEarHit = isPointInsideEllipse(localX, localY, centerX - 34 + walkLean, centerY - 48 + bob, 24, 40);
    const rightEarHit = isPointInsideEllipse(localX, localY, centerX + 34 + walkLean, centerY - 48 + bob, 24, 40);
    const pawBandHit = localY >= centerY + radius - 12 + bob &&
        localY <= centerY + radius + 28 + bob &&
        localX >= centerX - 48 + walkLean &&
        localX <= centerX + 48 + walkLean;
    return bodyHit || faceHit || leftEarHit || rightEarHit || pawBandHit;
}
function setPointerInteractive(interactive) {
    if (pointerInteractive === interactive) {
        return;
    }
    pointerInteractive = interactive;
    void window.desktopPet.setPointerMode(interactive);
}
function setHudVisible(visible) {
    hud.classList.toggle('show', visible);
}
function updatePointerModeFromPoint(x, y) {
    const overPet = isPointOnPetShape(x, y);
    const overInput = isElementVisible(inputDock) && isPointInsideRect(x, y, inputDock.getBoundingClientRect());
    const overMenu = isElementVisible(petMenu) && isPointInsideRect(x, y, petMenu.getBoundingClientRect());
    setHudVisible(overPet);
    setPointerInteractive(dragging || overPet || overInput || overMenu);
}
function reportPetViewportBounds(force = false) {
    const stageRect = stage.getBoundingClientRect();
    const scaleX = stageRect.width / canvas.width;
    const scaleY = stageRect.height / canvas.height;
    const localBounds = lastRenderedPetBounds ?? {
        x: 22,
        y: 18,
        width: 216,
        height: 220,
    };
    const bounds = {
        x: Math.round(stageRect.left + localBounds.x * scaleX),
        y: Math.round(stageRect.top + localBounds.y * scaleY),
        width: Math.round(localBounds.width * scaleX),
        height: Math.round(localBounds.height * scaleY),
    };
    const signature = `${bounds.x}:${bounds.y}:${bounds.width}:${bounds.height}`;
    if (!force && signature === lastReportedViewportSignature) {
        return;
    }
    lastReportedViewportSignature = signature;
    void window.desktopPet.updatePetViewportBounds(bounds);
    debugLog('reported pet viewport bounds', bounds);
}
function stopDragging(pointerId) {
    const releasePointerId = pointerId ?? activePointerId ?? undefined;
    if (releasePointerId !== undefined && stage.hasPointerCapture(releasePointerId)) {
        stage.releasePointerCapture(releasePointerId);
    }
    if (!pendingDrag && !dragging) {
        return;
    }
    pendingDrag = false;
    dragging = false;
    activePointerId = null;
    stage.classList.remove('dragging');
    setPointerInteractive(true);
    pauseAutoWalk(15000);
    if (movedDuringDrag) {
        suppressNextClick = true;
    }
    void window.desktopPet.dragWindowStop().catch((error) => {
        console.error('[Renderer] dragWindowStop failed:', error);
    });
}
function showInput() {
    hideMenu();
    inputDock.classList.add('show');
    chatInput.disabled = false;
    sendBtn.disabled = false;
    sendBtn.textContent = 'Send';
    dockHint.textContent = '\u6211\u6b63\u5728\u542c\u54e6';
    if (inputHintTimer) {
        window.clearTimeout(inputHintTimer);
    }
    inputHintTimer = window.setTimeout(() => {
        dockHint.textContent = '\u8f7b\u8f7b\u6559\u6211\u4e00\u53e5\u8bdd';
    }, 2600);
    setPointerInteractive(true);
    window.setTimeout(() => chatInput.focus(), 30);
}
function hideInput() {
    inputDock.classList.remove('show');
    if (inputHintTimer) {
        window.clearTimeout(inputHintTimer);
        inputHintTimer = 0;
    }
}
function showMenu(x, y) {
    hideInput();
    petMenu.style.left = `${x}px`;
    petMenu.style.top = `${y}px`;
    petMenu.classList.add('show');
    setPointerInteractive(true);
}
function hideMenu() {
    petMenu.classList.remove('show');
}
function stageLabel(stageName) {
    if (stageName === 'baby') {
        return TEXT.stageBaby;
    }
    if (stageName === 'teen') {
        return TEXT.stageTeen;
    }
    return TEXT.stageAdult;
}
function renderHud() {
    if (!state) {
        return;
    }
    petStageLabel.textContent = stageLabel(state.stage);
    petLevelLabel.textContent = `Lv.${state.level}`;
    petMoodLabel.textContent = `${TEXT.moodPrefix} ${Math.round(state.mood)}`;
}
function syncRecentInteraction() {
    if (!state || state.interactionHistory.length === 0) {
        return;
    }
    const latest = state.interactionHistory[state.interactionHistory.length - 1];
    const signature = `${latest.timestamp}:${latest.type}`;
    if (signature === lastInteractionSignature) {
        return;
    }
    lastInteractionSignature = signature;
    recentInteractionType = latest.type;
    recentInteractionUntil = Date.now() + 5200;
}
function markUserAction() {
    pauseAutoWalk();
}
function getCurrentMotion() {
    if (!state) {
        return 'idle';
    }
    if (Date.now() < recentInteractionUntil && recentInteractionType) {
        if (recentInteractionType === 'sleep') {
            return 'sleep';
        }
        if (recentInteractionType === 'pet') {
            return 'pet';
        }
        if (recentInteractionType === 'play') {
            return 'playful';
        }
        return 'content';
    }
    if (isAutoWalking()) {
        return 'walk';
    }
    if (state.energy < 28) {
        return 'sleep';
    }
    if (state.hunger < 30 || state.cleanliness < 28) {
        return 'needy';
    }
    if (state.mood > 78) {
        return 'content';
    }
    return 'idle';
}
function drawPet() {
    if (!state) {
        return;
    }
    const motion = getCurrentMotion();
    if (spriteAssetsReady && drawSpritePet(motion)) {
        return;
    }
    animationTick += (state.settings.lowPowerMode ? 0.02 : 0.04) * motionSpeedMultiplier;
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2 + 18;
    const stageScale = state.stage === 'baby' ? 0.9 : state.stage === 'teen' ? 1 : 1.12;
    const radius = 58 * stageScale;
    const bobAmount = motion === 'sleep' ? 2.2 : motion === 'walk' ? 5.2 : motion === 'playful' ? 4.8 : 3.4;
    const bob = Math.sin(animationTick) * bobAmount;
    const moodTint = Math.max(0, Math.min(1, state.mood / 100));
    const walkLean = motion === 'walk' ? walkDirectionX * 6 : motion === 'playful' ? Math.sin(animationTick * 1.3) * 4 : 0;
    const pawLift = motion === 'walk' ? Math.sin(animationTick * 2.4) * 7 : 0;
    const cheekAlpha = motion === 'content' || motion === 'pet' ? 0.4 : state.hunger < 30 ? 0.45 : 0.28;
    const eyeOffsetY = motion === 'sleep' ? 3 : state.energy < 30 ? 2 : 0;
    const eyeOpen = motion === 'sleep' ? 1.2 : motion === 'pet' ? 11 : motion === 'playful' ? 10 : state.energy < 30 ? 2 : 9;
    const earTilt = motion === 'sleep' ? 0.24 : motion === 'playful' ? 0.62 : 0.45;
    const mouthY = motion === 'sleep' ? 18 : motion === 'pet' ? 12 : motion === 'needy' ? 26 : 16;
    const sleepyCap = motion === 'sleep';
    lastRenderedPetBounds = {
        x: centerX - radius - 42 + walkLean,
        y: centerY - radius - 88 + bob,
        width: radius * 2 + 84,
        height: radius * 2 + 128,
    };
    ctx.clearRect(0, 0, width, height);
    const shadow = ctx.createRadialGradient(centerX, height - 24, 12, centerX, height - 24, 60);
    shadow.addColorStop(0, 'rgba(66, 44, 25, 0.24)');
    shadow.addColorStop(1, 'rgba(66, 44, 25, 0)');
    ctx.fillStyle = shadow;
    ctx.beginPath();
    ctx.ellipse(centerX, height - 24, 62, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    const bodyGradient = ctx.createRadialGradient(centerX - 18 + walkLean, centerY - 34 + bob, 18, centerX, centerY + bob, radius + 10);
    bodyGradient.addColorStop(0, `rgba(${255 - Math.round((1 - moodTint) * 40)}, 213, 142, 0.98)`);
    bodyGradient.addColorStop(1, `rgba(242, ${160 + Math.round(moodTint * 30)}, 93, 0.98)`);
    ctx.fillStyle = bodyGradient;
    ctx.beginPath();
    ctx.arc(centerX + walkLean, centerY + bob, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#c96a35';
    ctx.beginPath();
    ctx.ellipse(centerX - 34 + walkLean, centerY - 48 + bob, 18, 34, -earTilt, 0, Math.PI * 2);
    ctx.ellipse(centerX + 34 + walkLean, centerY - 48 + bob, 18, 34, earTilt, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffe9cf';
    ctx.beginPath();
    ctx.arc(centerX + walkLean, centerY + 8 + bob, radius * 0.72, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#2d1a0d';
    ctx.beginPath();
    ctx.ellipse(centerX - 22 + walkLean, centerY - 14 + bob + eyeOffsetY, 7, eyeOpen, 0, 0, Math.PI * 2);
    ctx.ellipse(centerX + 22 + walkLean, centerY - 14 + bob + eyeOffsetY, 7, eyeOpen, 0, 0, Math.PI * 2);
    ctx.fill();
    if (sleepyCap) {
        ctx.strokeStyle = 'rgba(78, 53, 34, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX + 46, centerY - 74 + bob, 13, Math.PI * 0.2, Math.PI * 1.1);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(centerX + 60, centerY - 92 + bob, 8, Math.PI * 0.15, Math.PI * 1.05);
        ctx.stroke();
    }
    ctx.fillStyle = '#8b4623';
    ctx.beginPath();
    ctx.ellipse(centerX + walkLean, centerY + 2 + bob, motion === 'pet' ? 8 : 9, motion === 'sleep' ? 5 : 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#8b4623';
    ctx.lineWidth = 3;
    ctx.beginPath();
    if (motion === 'sleep') {
        ctx.moveTo(centerX - 10 + walkLean, centerY + mouthY + bob);
        ctx.quadraticCurveTo(centerX + walkLean, centerY + mouthY + 4 + bob, centerX + 10 + walkLean, centerY + mouthY + bob);
    }
    else if (motion === 'content' || motion === 'pet' || state.mood >= 60) {
        ctx.arc(centerX + walkLean, centerY + mouthY + bob, 18, 0.2, Math.PI - 0.2);
    }
    else if (motion === 'needy' || state.mood < 30) {
        ctx.arc(centerX + walkLean, centerY + mouthY + bob, 18, Math.PI + 0.2, Math.PI * 2 - 0.2);
    }
    else {
        ctx.moveTo(centerX - 12 + walkLean, centerY + 20 + bob);
        ctx.lineTo(centerX + 12 + walkLean, centerY + 20 + bob);
    }
    ctx.stroke();
    ctx.fillStyle = `rgba(255, 150, 150, ${cheekAlpha})`;
    ctx.beginPath();
    ctx.ellipse(centerX - 38 + walkLean, centerY + 12 + bob, 12, 7, 0, 0, Math.PI * 2);
    ctx.ellipse(centerX + 38 + walkLean, centerY + 12 + bob, 12, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#8b4623';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(centerX - 34 + walkLean, centerY + radius - 4 + bob - pawLift);
    ctx.lineTo(centerX - 18 + walkLean, centerY + radius + 15 + bob - pawLift);
    ctx.moveTo(centerX + 18 + walkLean, centerY + radius + 6 + bob + pawLift);
    ctx.lineTo(centerX + 34 + walkLean, centerY + radius + 25 + bob + pawLift);
    ctx.stroke();
}
function drawSpritePet(motion) {
    if (!state) {
        return false;
    }
    const theme = getCurrentTheme();
    const frames = spriteAnimations[motion] ?? spriteAnimations.idle;
    if (!frames || frames.length === 0) {
        return false;
    }
    animationTick += (state.settings.lowPowerMode ? 0.018 : 0.04) * motionSpeedMultiplier;
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2 + 18;
    const bobAmount = motion === 'sleep' ? 2 : motion === 'walk' ? 3.2 : motion === 'playful' ? 4.2 : 2.4;
    const bob = Math.sin(animationTick) * bobAmount;
    const shadowWidth = motion === 'sleep' ? 54 : motion === 'walk' ? 64 : 58;
    const frameStep = (motion === 'walk' ? 8.5 : motion === 'playful' ? 10.5 : motion === 'pet' ? 7.5 : 6.5) * spriteFrameSpeedMultiplier;
    const frameIndex = Math.floor(animationTick * frameStep) % frames.length;
    const frame = frames[frameIndex];
    const stageScale = theme.renderScale?.[state.stage] ?? (state.stage === 'baby' ? 3.1 : state.stage === 'teen' ? 3.5 : 3.9);
    const drawWidth = frame.sw * stageScale;
    const drawHeight = frame.sh * stageScale;
    const drawX = centerX - drawWidth / 2;
    const drawY = centerY - drawHeight / 2 + 4 + bob;
    const shouldFlip = motion === 'walk' || motion === 'playful' ? walkDirectionX < 0 : false;
    lastRenderedPetBounds = {
        x: drawX,
        y: drawY,
        width: drawWidth,
        height: drawHeight,
    };
    ctx.clearRect(0, 0, width, height);
    const shadow = ctx.createRadialGradient(centerX, height - 28, 10, centerX, height - 28, 68);
    shadow.addColorStop(0, 'rgba(56, 39, 25, 0.22)');
    shadow.addColorStop(1, 'rgba(56, 39, 25, 0)');
    ctx.fillStyle = shadow;
    ctx.beginPath();
    ctx.ellipse(centerX, height - 28, shadowWidth, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    if (shouldFlip) {
        ctx.translate(width, 0);
        ctx.scale(-1, 1);
    }
    ctx.drawImage(frame.image, frame.sx, frame.sy, frame.sw, frame.sh, shouldFlip ? width - drawX - drawWidth : drawX, drawY, drawWidth, drawHeight);
    ctx.restore();
    return true;
}
function drawFallbackPet() {
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    lastRenderedPetBounds = {
        x: centerX - 64,
        y: centerY - 64,
        width: 128,
        height: 128,
    };
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(255, 120, 80, 0.92)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 56, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#2d1a0d';
    ctx.beginPath();
    ctx.arc(centerX - 18, centerY - 10, 6, 0, Math.PI * 2);
    ctx.arc(centerX + 18, centerY - 10, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#2d1a0d';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(centerX, centerY + 10, 18, 0.2, Math.PI - 0.2);
    ctx.stroke();
}
function isAutoWalking() {
    if (pointerPressed || pendingDrag || dragging || activePointerId !== null) {
        return false;
    }
    return Date.now() - lastUserActionAt > 18000 && Date.now() > walkPauseUntil;
}
function maybeChangeDirection(force = false) {
    if (!force && Math.random() < 0.985) {
        return;
    }
    const angle = Math.random() * Math.PI * 2;
    walkDirectionX = Math.cos(angle);
    walkDirectionY = Math.sin(angle) * 0.45;
    walkSpeed = state?.settings.lowPowerMode ? 0.45 : 0.8;
}
async function updateAutoWalk() {
    if (!isAutoWalking() || walkInFlight) {
        return;
    }
    walkInFlight = true;
    walkTick += 1;
    maybeChangeDirection(walkTick % 240 === 0);
    if (!Number.isFinite(walkDirectionX) || !Number.isFinite(walkDirectionY) || !Number.isFinite(walkSpeed)) {
        console.warn('[Renderer] Invalid auto-walk state detected, resetting direction', {
            walkDirectionX,
            walkDirectionY,
            walkSpeed,
        });
        walkDirectionX = 1;
        walkDirectionY = 0;
        walkSpeed = state?.settings.lowPowerMode ? 0.45 : 0.8;
    }
    if (Math.random() < 0.002) {
        showBubble(TEXT.wandering);
    }
    try {
        console.log('[Renderer] Random walk animation tick:', {
            x: window.screenX,
            y: window.screenY,
            directionX: walkDirectionX,
            directionY: walkDirectionY,
            speed: walkSpeed,
        });
    }
    finally {
        walkInFlight = false;
    }
}
function loop() {
    frameCount += 1;
    if (frameCount <= 3 || frameCount % 180 === 0) {
        debugLog(`Animation frame ${frameCount}`, {
            hasState: Boolean(state),
            canvasSize: { width: canvas.width, height: canvas.height },
            stageRect: stage.getBoundingClientRect().toJSON(),
            computedDisplay: window.getComputedStyle(canvas).display,
        });
    }
    try {
        drawPet();
    }
    catch (error) {
        if (!drawErrorLogged) {
            console.error('[Renderer] drawPet failed, switching to fallback pet:', error);
            drawErrorLogged = true;
        }
        drawFallbackPet();
    }
    if (frameCount <= 3 || frameCount % 240 === 0) {
        reportPetViewportBounds(frameCount <= 3);
    }
    void updateAutoWalk().catch((error) => {
        console.error('[Renderer] updateAutoWalk failed:', error);
    });
    requestAnimationFrame(loop);
}
async function sendChat() {
    if (sendingChat) {
        return;
    }
    const message = chatInput.value.trim();
    if (!message) {
        return;
    }
    sendingChat = true;
    chatInput.value = '';
    chatInput.disabled = true;
    sendBtn.disabled = true;
    sendBtn.textContent = '...';
    markUserAction();
    dockHint.textContent = '\u6211\u5728\u60f3\u60f3\u600e\u4e48\u56de\u4f60';
    try {
        const response = await window.desktopPet.sendChat(message);
        showBubble(response.reply);
        recentInteractionType = 'chat';
        recentInteractionUntil = Date.now() + 3600;
        hideInput();
    }
    catch (error) {
        console.error('[Renderer] sendChat failed:', error);
        dockHint.textContent = 'Chat failed';
        chatInput.disabled = false;
        sendBtn.disabled = false;
        sendBtn.textContent = 'Send';
    }
    finally {
        sendingChat = false;
    }
}
function bindEvents() {
    stage.addEventListener('pointerdown', (event) => {
        if (event.button !== 0) {
            return;
        }
        if (!isPointOnPetShape(event.clientX, event.clientY)) {
            return;
        }
        hideMenu();
        markUserAction();
        pointerPressed = true;
        pendingDrag = true;
        activePointerId = event.pointerId;
        movedDuringDrag = false;
        pauseAutoWalk(15000);
        stage.setPointerCapture(event.pointerId);
        dragStartScreenX = event.screenX;
        dragStartScreenY = event.screenY;
        lastPointerX = event.screenX;
        lastPointerY = event.screenY;
    });
    window.addEventListener('pointermove', (event) => {
        updatePointerModeFromPoint(event.clientX, event.clientY);
        if (activePointerId !== event.pointerId) {
            return;
        }
        pauseAutoWalk(15000);
        if (pendingDrag) {
            const dragDistanceX = event.screenX - dragStartScreenX;
            const dragDistanceY = event.screenY - dragStartScreenY;
            if (Math.abs(dragDistanceX) >= 4 || Math.abs(dragDistanceY) >= 4) {
                pendingDrag = false;
                dragging = true;
                stage.classList.add('dragging');
                setPointerInteractive(true);
                void window.desktopPet.dragWindowStart().catch((error) => {
                    console.error('[Renderer] dragWindowStart failed:', error);
                });
            }
        }
        if (!dragging) {
            return;
        }
        const deltaX = event.screenX - lastPointerX;
        const deltaY = event.screenY - lastPointerY;
        if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
            movedDuringDrag = true;
        }
        lastPointerX = event.screenX;
        lastPointerY = event.screenY;
    });
    window.addEventListener('pointerup', (event) => {
        pointerPressed = false;
        stopDragging(event.pointerId);
    });
    window.addEventListener('pointercancel', (event) => {
        pointerPressed = false;
        stopDragging(event.pointerId);
    });
    stage.addEventListener('click', async () => {
        if (dragging || suppressNextClick) {
            suppressNextClick = false;
            movedDuringDrag = false;
            return;
        }
        markUserAction();
        await window.desktopPet.performInteraction('pet');
        showInput();
    });
    stage.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        markUserAction();
        hideInput();
        showMenu(event.clientX, event.clientY);
    });
    sendBtn.addEventListener('click', () => {
        void sendChat();
    });
    petMenu.addEventListener('click', async (event) => {
        const target = event.target;
        const action = target.dataset.action;
        if (!action) {
            return;
        }
        hideMenu();
        if (action === 'chat') {
            markUserAction();
            showInput();
            return;
        }
        markUserAction();
        await window.desktopPet.performInteraction(action);
    });
    chatInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            void sendChat();
        }
        if (event.key === 'Escape') {
            hideInput();
            hideMenu();
        }
    });
    window.addEventListener('click', (event) => {
        const target = event.target;
        if (!petMenu.contains(target) && !stage.contains(target)) {
            hideMenu();
        }
    });
}
async function init() {
    debugLog('init start', {
        hasDesktopPetApi: Boolean(window.desktopPet),
        hasCanvasContext: Boolean(ctx),
    });
    try {
        const assetConfig = await window.desktopPet.getAssetConfig();
        applySpriteTheme(assetConfig?.spriteTheme || 'cat_1');
        setAnimationConfig(assetConfig);
    }
    catch (error) {
        console.error('[Renderer] Failed to load asset config, using default theme:', error);
        applySpriteTheme('cat_1');
        setAnimationConfig(null);
    }
    void ensureSpriteAssets();
    bindEvents();
    window.desktopPet.onStateUpdated((nextState) => {
        state = nextState;
        syncRecentInteraction();
        renderHud();
        debugLog('state-updated event received', {
            stage: nextState.stage,
            level: nextState.level,
            mood: Math.round(nextState.mood),
        });
    });
    window.desktopPet.onBubble((payload) => {
        debugLog('bubble event received', payload);
        showBubble(payload.text);
    });
    state = await window.desktopPet.getState();
    debugLog('initial state loaded', {
        stage: state.stage,
        level: state.level,
        mood: Math.round(state.mood),
        canvasRect: canvas.getBoundingClientRect().toJSON(),
    });
    syncRecentInteraction();
    setPointerInteractive(false);
    renderHud();
    showBubble(TEXT.welcome);
    reportPetViewportBounds(true);
    debugLog('starting animation loop');
    loop();
}
void init();
export {};
