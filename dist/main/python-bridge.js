"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PythonBridge = void 0;
const child_process_1 = require("child_process");
const path_1 = require("path");
const events_1 = require("events");
class PythonBridge extends events_1.EventEmitter {
    pythonProcess = null;
    port = 5000;
    retryCount = 0;
    maxRetriesPerHour = 3;
    retryWindow = 3600000; // 1小时
    retryTimestamps = [];
    pythonPath;
    backendPath;
    constructor() {
        super();
        this.pythonPath = (0, path_1.join)('D:', 'codes', 'venvs', 'general', 'Scripts', 'python.exe');
        this.backendPath = (0, path_1.join)(__dirname, '../python/main.py');
    }
    routePythonMessage(message) {
        const normalized = message.trim();
        if (!normalized) {
            return;
        }
        const isError = normalized.includes(' - ERROR -') ||
            normalized.includes('Traceback') ||
            normalized.startsWith('ERROR:');
        const isWarn = normalized.includes(' - WARNING -') ||
            normalized.includes('DeprecationWarning') ||
            normalized.startsWith('WARNING:');
        if (isError) {
            console.error('[Python Error]', normalized);
        }
        else if (isWarn) {
            console.warn('[Python Warn]', normalized);
        }
        else {
            console.log('[Python]', normalized);
        }
    }
    async start() {
        try {
            if (this.pythonProcess) {
                console.log('Python process is already running');
                return true;
            }
            console.log('Starting Python backend...');
            console.log(`Python path: ${this.pythonPath}`);
            console.log(`Backend path: ${this.backendPath}`);
            // 检查Python路径是否存在
            try {
                (0, child_process_1.execSync)(`"${this.pythonPath}" --version`, { encoding: 'utf-8' });
            }
            catch (error) {
                console.error('Python executable not found:', error);
                this.emit('error', new Error('Python executable not found. Please check the Python path.'));
                return false;
            }
            // 启动Python子进程
            this.pythonProcess = (0, child_process_1.spawn)(this.pythonPath, [this.backendPath, '--port', String(this.port)], {
                cwd: (0, path_1.join)(__dirname, '../../'),
                env: {
                    ...process.env,
                    PYTHONUNBUFFERED: '1'
                },
                windowsHide: true
            });
            // 监听标准输出
            if (this.pythonProcess.stdout) {
                this.pythonProcess.stdout.on('data', (data) => {
                    const message = data.toString().trim();
                    this.routePythonMessage(message);
                    this.emit('stdout', message);
                });
            }
            // 监听标准错误
            if (this.pythonProcess.stderr) {
                this.pythonProcess.stderr.on('data', (data) => {
                    const message = data.toString().trim();
                    this.routePythonMessage(message);
                    this.emit('stderr', message);
                });
            }
            // 监听进程退出
            this.pythonProcess.on('exit', (code, signal) => {
                console.log(`Python process exited with code ${code}, signal ${signal}`);
                this.pythonProcess = null;
                this.emit('exit', { code, signal });
                // 自动重启
                if (code !== 0 && this.shouldRetry()) {
                    console.log('Attempting to restart Python backend...');
                    setTimeout(() => this.start(), 2000);
                }
            });
            // 监听进程错误
            this.pythonProcess.on('error', (error) => {
                console.error('Failed to start Python process:', error);
                this.pythonProcess = null;
                this.emit('error', error);
                // 自动重启
                if (this.shouldRetry()) {
                    console.log('Attempting to restart Python backend after error...');
                    setTimeout(() => this.start(), 2000);
                }
            });
            // 等待后端启动完成
            await this.waitForBackend();
            return true;
        }
        catch (error) {
            console.error('Error starting Python backend:', error);
            this.emit('error', error);
            return false;
        }
    }
    async waitForBackend(maxRetries = 10, delayMs = 100) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                const response = await fetch(`http://127.0.0.1:${this.port}/health`);
                if (response.ok) {
                    console.log('Python backend is ready');
                    this.emit('ready');
                    return;
                }
            }
            catch (error) {
                // 后端还没启动，继续等待
            }
            await new Promise(resolve => setTimeout(resolve, delayMs));
        }
        throw new Error('Python backend failed to start within the expected time');
    }
    shouldRetry() {
        const now = Date.now();
        // 清理过期的重试记录
        this.retryTimestamps = this.retryTimestamps.filter(timestamp => now - timestamp < this.retryWindow);
        if (this.retryTimestamps.length >= this.maxRetriesPerHour) {
            console.error('Max retries per hour exceeded');
            return false;
        }
        this.retryTimestamps.push(now);
        return true;
    }
    async stop() {
        if (this.pythonProcess) {
            console.log('Stopping Python backend...');
            try {
                // 发送关闭信号
                await fetch(`http://127.0.0.1:${this.port}/shutdown`, { method: 'POST' });
            }
            catch (error) {
                // 如果API调用失败，直接kill进程
                console.log('Shutdown API failed, killing process directly');
            }
            // 给进程一些时间优雅关闭
            setTimeout(() => {
                if (this.pythonProcess) {
                    this.pythonProcess.kill('SIGTERM');
                }
            }, 2000);
            // 如果5秒后还没关闭，强制kill
            setTimeout(() => {
                if (this.pythonProcess) {
                    this.pythonProcess.kill('SIGKILL');
                    this.pythonProcess = null;
                }
            }, 7000);
        }
    }
    async restart() {
        await this.stop();
        return this.start();
    }
    getPort() {
        return this.port;
    }
    getBackendUrl() {
        return `http://127.0.0.1:${this.port}`;
    }
    isRunning() {
        return this.pythonProcess !== null;
    }
}
exports.PythonBridge = PythonBridge;
