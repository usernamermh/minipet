export class AudioManager {
    audioContext = null;
    soundBuffers = new Map();
    voiceBuffers = new Map();
    masterVolume = 0.7;
    soundEnabled = true;
    voiceEnabled = true;
    maxSounds = 5;
    constructor() {
        // AudioContext需要在用户交互后创建
        this.initializeAudioContext();
    }
    initializeAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            // 加载默认音效
            this.loadDefaultSounds();
            this.loadDefaultVoices();
        }
        catch (error) {
            console.error('Failed to initialize AudioContext:', error);
        }
    }
    async loadDefaultSounds() {
        // 默认音效映射
        const defaultSounds = {
            'click': '../resources/sounds/click.wav',
            'pickup': '../resources/sounds/pickup.wav',
            'drop': '../resources/sounds/drop.wav',
            'eat': '../resources/sounds/eat.wav',
            'bath': '../resources/sounds/bath.wav',
            'play': '../resources/sounds/play.wav',
            'sleep': '../resources/sounds/sleep.wav',
        };
        for (const [name, path] of Object.entries(defaultSounds)) {
            try {
                await this.loadSound(name, path);
            }
            catch (error) {
                console.warn(`Failed to load sound "${name}" from ${path}:`, error);
                // 创建占位缓冲
                this.createPlaceholderBuffer(name);
            }
        }
    }
    async loadDefaultVoices() {
        // 默认语音映射
        const defaultVoices = {
            'happy': '../resources/sounds/happy_voice.wav',
            'sad': '../resources/sounds/sad_voice.wav',
            'tired': '../resources/sounds/tired_voice.wav',
            'hungry': '../resources/sounds/hungry_voice.wav',
            'angry': '../resources/sounds/angry_voice.wav',
            'surprised': '../resources/sounds/surprised_voice.wav',
            'curious': '../resources/sounds/curious_voice.wav',
            'petted': '../resources/sounds/petted_voice.wav',
        };
        for (const [name, path] of Object.entries(defaultVoices)) {
            try {
                await this.loadVoice(name, path);
            }
            catch (error) {
                console.warn(`Failed to load voice "${name}" from ${path}:`, error);
                this.createPlaceholderVoice(name);
            }
        }
    }
    createPlaceholderBuffer(name) {
        // 创建简单的占位音频缓冲
        const sampleRate = this.audioContext?.sampleRate || 44100;
        const duration = 0.1; // 0.1秒
        const length = sampleRate * duration;
        const buffer = this.audioContext?.createBuffer(1, length, sampleRate);
        if (buffer && this.soundBuffers) {
            this.soundBuffers.set(name, buffer);
        }
        return buffer;
    }
    createPlaceholderVoice(name) {
        const buffer = this.createPlaceholderBuffer(name);
        if (this.voiceBuffers) {
            this.voiceBuffers.set(name, buffer);
        }
        return buffer;
    }
    async loadSound(name, path) {
        if (!this.audioContext)
            return null;
        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`Failed to load sound: ${response.statusText}`);
            }
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            this.soundBuffers.set(name, audioBuffer);
            return audioBuffer;
        }
        catch (error) {
            console.error(`Error loading sound "${name}" from ${path}:`, error);
            return null;
        }
    }
    async loadVoice(name, path) {
        if (!this.audioContext)
            return null;
        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`Failed to load voice: ${response.statusText}`);
            }
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            this.voiceBuffers.set(name, audioBuffer);
            return audioBuffer;
        }
        catch (error) {
            console.error(`Error loading voice "${name}" from ${path}:`, error);
            return null;
        }
    }
    playSound(name, volume) {
        if (!this.audioContext || !this.soundEnabled)
            return;
        const buffer = this.soundBuffers.get(name);
        if (!buffer) {
            console.warn(`Sound "${name}" not loaded`);
            return;
        }
        this.playBuffer(buffer, volume || 1.0);
    }
    playVoice(name, volume) {
        if (!this.audioContext || !this.voiceEnabled)
            return;
        const buffer = this.voiceBuffers.get(name);
        if (!buffer) {
            console.warn(`Voice "${name}" not loaded`);
            return;
        }
        this.playBuffer(buffer, volume || 1.0);
    }
    playBuffer(buffer, volume) {
        if (!this.audioContext)
            return;
        // 确保AudioContext处于运行状态
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();
        source.buffer = buffer;
        gainNode.gain.value = volume * this.masterVolume;
        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        source.start(0);
    }
    async playTTS(text) {
        // 使用浏览器内置TTS API
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'zh-CN';
            utterance.pitch = 0.8; // 稍低音调，更像宠物
            utterance.rate = 0.9; // 稍慢语速
            // 设置音量
            if (this.voiceEnabled) {
                utterance.volume = this.masterVolume;
            }
            else {
                utterance.volume = 0;
            }
            window.speechSynthesis.speak(utterance);
        }
    }
    stopAll() {
        if (this.audioContext) {
            this.audioContext.close().then(() => {
                this.audioContext = null;
                this.initializeAudioContext();
            });
        }
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    }
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
    }
    getMasterVolume() {
        return this.masterVolume;
    }
    toggleSound(enabled) {
        this.soundEnabled = enabled;
    }
    toggleVoice(enabled) {
        this.voiceEnabled = enabled;
    }
    isSoundEnabled() {
        return this.soundEnabled;
    }
    isVoiceEnabled() {
        return this.voiceEnabled;
    }
    async preloadSounds(soundList) {
        const loadPromises = soundList.map(({ name, path }) => this.loadSound(name, path));
        await Promise.allSettled(loadPromises);
    }
    async preloadVoices(voiceList) {
        const loadPromises = voiceList.map(({ name, path }) => this.loadVoice(name, path));
        await Promise.allSettled(loadPromises);
    }
    getLoadedSounds() {
        return Array.from(this.soundBuffers.keys());
    }
    getLoadedVoices() {
        return Array.from(this.voiceBuffers.keys());
    }
    getStats() {
        return {
            loadedSounds: this.soundBuffers.size,
            loadedVoices: this.voiceBuffers.size,
            soundEnabled: this.soundEnabled,
            voiceEnabled: this.voiceEnabled,
            masterVolume: this.masterVolume
        };
    }
}
