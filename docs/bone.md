# 透明桌宠骨架设计

更新时间：2026-05-23

## 1. 骨架目标

本次骨架不再服务“大面板应用”，而是服务“透明无边框桌宠”。

目标是先稳定跑通以下结构：

- 一个透明主窗
- 一个宠物 Canvas
- 一个对话气泡层
- 一个底部输入浮层
- 一套主进程状态中心
- 一个可选的 Python 对话后端

## 2. 新主链路

```text
Electron main
  -> create transparent pet window
  -> expose desktopPet API via preload
  -> maintain pet state + tray + python bridge

public/index.html
  -> loads dist/renderer/app.js
  -> contains only pet stage, bubble, and compact input overlay

renderer/app.ts
  -> draws pet
  -> handles drag/click/chat input
  -> subscribes to state updates
```

## 3. 目录职责

### `src/main`

- `main.ts`
  - 应用入口
  - 管理窗口、托盘、状态、聊天代理
- `window-manager.ts`
  - 创建透明无边框主窗
  - 提供显示、隐藏、移动、发送事件能力
- `tray-manager.ts`
  - 托盘菜单
  - 将菜单命令转为状态变更动作
- `python-bridge.ts`
  - 启动和检测 Python 后端
- `state-persister.ts`
  - 读取和保存宠物状态
- `preload.ts`
  - 向渲染层暴露安全 API

### `src/renderer`

- `app.ts`
  - 新的唯一渲染入口
  - 不依赖旧面板脚本
- 其余旧模块暂时保留，但不作为首要启动链路

### `public`

- `index.html`
  - 透明场景容器
  - 宠物舞台
  - 对话气泡
  - 输入浮层

## 4. IPC 设计

统一前缀：`desktop-pet:*`

### invoke

- `desktop-pet:get-state`
- `desktop-pet:perform-interaction`
- `desktop-pet:send-chat`
- `desktop-pet:update-setting`
- `desktop-pet:window-drag`
- `desktop-pet:window-toggle`
- `desktop-pet:quit`

### renderer events

- `desktop-pet:state-updated`
- `desktop-pet:bubble`

## 5. 状态模型

```ts
type PetStage = 'baby' | 'teen' | 'adult';

interface PetState {
  hunger: number;
  cleanliness: number;
  energy: number;
  mood: number;
  level: number;
  exp: number;
  ageInDays: number;
  stage: PetStage;
  lastUpdate: string;
  createdAt: string;
  interactionHistory: Array<{ type: string; timestamp: string; valueChange: number }>;
  conversationMemory: Array<{ role: 'user' | 'pet'; content: string; timestamp: string }>;
  settings: {
    soundEnabled: boolean;
    voiceEnabled: boolean;
    lowPowerMode: boolean;
    autoSaveInterval: number;
  };
}
```

## 6. 主进程职责边界

主进程负责：

- 状态计算
- 状态衰减
- 阶段推导
- 交互结果应用
- JSON 持久化
- 聊天请求代理
- 托盘命令处理

渲染层负责：

- 宠物显示
- 气泡显示
- 鼠标交互
- 输入体验

## 7. 渲染层最小视觉方案

### 宠物

- 先用 Canvas 绘制圆润宠物形象
- 通过颜色、耳朵、表情、轻微浮动动画制造生命感
- 阶段差异先通过尺寸和配色体现

### 气泡

- 显示宠物短句
- 显示当前情绪和提示

### 输入浮层

- 默认隐藏
- 点击宠物后出现
- 输入后回车或按钮发送

## 8. 状态更新策略

- 启动时按 `lastUpdate` 计算离线衰减
- 每次交互前先刷新衰减
- 每次聊天和互动都写入记忆
- 重要状态变更后广播给渲染层

## 9. 托盘策略

托盘菜单保留：

- 显示/隐藏宠物
- 喂食
- 清洁
- 抚摸
- 陪玩
- 睡觉
- 静音切换
- 退出

## 10. 本轮交付定义

本轮“完成”定义为：

- 透明无边框桌宠已替代大面板窗口
- 新主链路已成为唯一有效链路
- 托盘与点击交互都能驱动真实状态变化
- 能完成一次聊天并显示结果
- 项目可构建，可继续增量扩展动画与高级能力
