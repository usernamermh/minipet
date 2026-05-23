"""
QQ宠物桌面伴侣 - 统一配置文件
所有配置集中管理，包括日志、宠物、LLM、动画、音频、性能、UI等
"""
import json
import os
from pathlib import Path
from typing import Dict, Any, Optional
from dataclasses import dataclass, asdict, field

# ============================================================
# 日志配置
# ============================================================
LOGGER_OUT_DIR = r"E:\proj_pet\logs"
LOG_LEVEL = "DEBUG"
LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
LOG_MAX_BYTES = 10 * 1024 * 1024  # 10MB
LOG_BACKUP_COUNT = 5

# ============================================================
# 路径配置
# ============================================================
PROJECT_ROOT = Path(__file__).parent
RESOURCES_DIR = PROJECT_ROOT / "resources"
ANIMATIONS_DIR = RESOURCES_DIR / "animations"
SOUNDS_DIR = RESOURCES_DIR / "sounds"
DATA_DIR = PROJECT_ROOT / "data"
CONFIG_FILE = PROJECT_ROOT / "config.json"

# ============================================================
# Python虚拟环境
# ============================================================
VENV_PATH = r"D:\codes\venvs\general"
VENV_ACTIVATE = os.path.join(VENV_PATH, "Scripts", "Activate.ps1")

# ============================================================
# 数据类配置
# ============================================================

@dataclass
class PetConfig:
    """宠物配置"""
    name: str = "小乖"
    stage: str = "baby"  # baby, teen, adult
    base_hunger_decay: float = 0.1       # 每分钟饥饿值衰减
    base_cleanliness_decay: float = 0.05  # 每分钟清洁值衰减
    base_energy_decay: float = 0.08       # 每分钟精力值衰减
    base_mood_decay: float = 0.03         # 每分钟心情值衰减

    # 交互效果
    feed_value: int = 30    # 喂食增加饥饿值
    clean_value: int = 25   # 清洁增加清洁值
    pet_value: int = 20     # 抚摸增加心情值
    play_value: int = 15    # 陪玩增加精力值和心情值
    sleep_value: int = 40   # 睡觉增加精力值

    # 成长配置
    exp_per_interaction: int = 10
    exp_per_conversation: int = 5
    level_up_exp: int = 100
    max_level: int = 50

    # 阶段天数和参数
    baby_stage_days: int = 7
    teen_stage_days: int = 30

    stage_configs: Dict[str, Dict[str, Any]] = field(default_factory=lambda: {
        "baby": {
            "size_factor": 0.8, "speed_factor": 0.7,
            "interaction_multiplier": 1.2, "decay_multiplier": 1.5
        },
        "teen": {
            "size_factor": 1.0, "speed_factor": 1.0,
            "interaction_multiplier": 1.0, "decay_multiplier": 1.0
        },
        "adult": {
            "size_factor": 1.2, "speed_factor": 0.9,
            "interaction_multiplier": 0.8, "decay_multiplier": 0.7
        }
    })

    # 主动对话间隔（秒）：用户无交互时随机发起话题
    active_chat_interval_min: int = 300   # 最短间隔 5分钟
    active_chat_interval_max: int = 1200  # 最长间隔 20分钟


@dataclass
class LLMConfig:
    """LLM配置"""
    api_url: str = "http://10.10.20.98:8008/minimax-m2.5-fp8/v1/chat/completions"
    api_key: str = ""
    model: str = "minimax-m2.5-awq"
    temperature: float = 0.7
    max_tokens: int = 500
    timeout: int = 60
    max_retries: int = 3
    retry_delay: float = 1.0

    # 上下文管理
    max_context_messages: int = 20        # 最大保留消息数
    context_compression_threshold: int = 15  # 超过此数量触发压缩
    summary_max_tokens: int = 200         # 摘要最大token


@dataclass
class AnimationConfig:
    """动画配置"""
    frame_rate: int = 30          # 活动帧率
    idle_frame_rate: int = 10     # 闲置帧率
    idle_animations: list = field(default_factory=lambda: [
        "idle", "blink", "look_around", "stretch", "yawn", "shiver", "sit", "lie_down"
    ])
    walk_animations: list = field(default_factory=lambda: ["walk_left", "walk_right"])
    interaction_animations: Dict[str, str] = field(default_factory=lambda: {
        "feed": "eat", "clean": "bath", "pet": "happy",
        "play": "play", "sleep": "sleep", "drag": "drag",
        "dance": "dance", "jump": "jump", "fly": "fly"
    })
    emotion_animations: Dict[str, str] = field(default_factory=lambda: {
        "happy": "happy", "sad": "sad", "tired": "tired",
        "hungry": "hungry", "angry": "angry", "surprised": "surprised",
        "curious": "curious", "neutral": "idle"
    })
    # 所有动画列表（>=20种）
    all_animations: list = field(default_factory=lambda: [
        "idle", "walk", "sleep", "eat", "bath", "happy", "sad",
        "angry", "tired", "hungry", "play", "jump", "fly", "dance",
        "blink", "look_around", "stretch", "yawn", "shiver", "sit",
        "lie_down", "drag", "surprised", "curious"
    ])
    animation_frame_counts: Dict[str, int] = field(default_factory=lambda: {
        "idle": 4, "walk": 8, "sleep": 4, "eat": 6, "bath": 6,
        "happy": 4, "sad": 4, "angry": 4, "tired": 4, "hungry": 4,
        "play": 6, "jump": 6, "fly": 6, "dance": 8, "blink": 2,
        "look_around": 4, "stretch": 4, "yawn": 3, "shiver": 3,
        "sit": 1, "lie_down": 1, "drag": 2, "surprised": 2, "curious": 2
    })


@dataclass
class AudioConfig:
    """音频配置"""
    enabled: bool = True
    volume: float = 0.7
    voice_enabled: bool = True
    sound_effects: Dict[str, str] = field(default_factory=lambda: {
        "feed": "eat.wav", "clean": "bath.wav", "pet": "pet.wav",
        "play": "play.wav", "sleep": "sleep.wav", "click": "click.wav",
        "pickup": "pickup.wav", "drop": "drop.wav"
    })
    voice_emotions: Dict[str, str] = field(default_factory=lambda: {
        "happy": "happy.wav", "sad": "sad.wav", "tired": "tired.wav",
        "hungry": "hungry.wav", "angry": "angry.wav",
        "surprised": "surprised.wav", "curious": "curious.wav",
        "petted": "petted.wav"
    })


@dataclass
class PerformanceConfig:
    """性能配置"""
    low_power_mode: bool = False
    idle_frame_rate: int = 10       # 闲置帧率
    active_frame_rate: int = 30     # 活动帧率
    max_cpu_usage: float = 1.0      # 最大CPU占用率（%），闲置时目标<1%
    max_memory_mb: int = 50         # 最大内存使用（MB）
    cache_size_mb: int = 20         # 缓存大小（MB）
    resource_cache_limit_mb: int = 50  # 资源缓存总大小不超过50MB


@dataclass
class UIConfig:
    """UI配置"""
    window_width: int = 200
    window_height: int = 200
    always_on_top: bool = True
    show_tray_icon: bool = True
    auto_hide: bool = False
    hide_delay: int = 300           # 自动隐藏延迟（秒）
    show_dialog_bubble: bool = True
    bubble_timeout: int = 10        # 对话气泡显示时间（秒）
    transparent_bg: bool = True     # 透明背景


# ============================================================
# 配置管理器
# ============================================================

class ConfigManager:
    """统一配置管理器"""

    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return
        self._initialized = True

        self.pet = PetConfig()
        self.llm = LLMConfig()
        self.animation = AnimationConfig()
        self.audio = AudioConfig()
        self.performance = PerformanceConfig()
        self.ui = UIConfig()
        self.data_dir = str(DATA_DIR)
        self.resources_dir = str(RESOURCES_DIR)
        self.animations_dir = str(ANIMATIONS_DIR)
        self.sounds_dir = str(SOUNDS_DIR)

        os.makedirs(str(DATA_DIR), exist_ok=True)
        os.makedirs(str(RESOURCES_DIR), exist_ok=True)
        os.makedirs(str(ANIMATIONS_DIR), exist_ok=True)
        os.makedirs(str(SOUNDS_DIR), exist_ok=True)
        os.makedirs(str(LOGGER_OUT_DIR), exist_ok=True)

        self.load()

    def load(self) -> None:
        try:
            if CONFIG_FILE.exists():
                with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                self._update_dataclass(self.pet, data.get('pet', {}))
                self._update_dataclass(self.llm, data.get('llm', {}))
                self._update_dataclass(self.animation, data.get('animation', {}))
                self._update_dataclass(self.audio, data.get('audio', {}))
                self._update_dataclass(self.performance, data.get('performance', {}))
                self._update_dataclass(self.ui, data.get('ui', {}))
            else:
                self.save()
        except Exception as e:
            print(f"Error loading config: {e}, using defaults")
            self.save()

    def save(self) -> None:
        try:
            data = {
                'pet': asdict(self.pet),
                'llm': asdict(self.llm),
                'animation': asdict(self.animation),
                'audio': asdict(self.audio),
                'performance': asdict(self.performance),
                'ui': asdict(self.ui),
            }
            with open(CONFIG_FILE, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"Error saving config: {e}")

    def _update_dataclass(self, obj, data: Dict[str, Any]) -> None:
        for key, value in data.items():
            if hasattr(obj, key):
                current = getattr(obj, key)
                if isinstance(current, dict) and isinstance(value, dict):
                    current.update(value)
                elif isinstance(current, list) and isinstance(value, list):
                    setattr(obj, key, value)
                else:
                    setattr(obj, key, value)

    def get(self, section: str, key: str, default: Any = None) -> Any:
        sections = {
            'pet': self.pet, 'llm': self.llm,
            'animation': self.animation, 'audio': self.audio,
            'performance': self.performance, 'ui': self.ui
        }
        obj = sections.get(section)
        return getattr(obj, key, default) if obj and hasattr(obj, key) else default

    def set(self, section: str, key: str, value: Any) -> None:
        sections = {
            'pet': self.pet, 'llm': self.llm,
            'animation': self.animation, 'audio': self.audio,
            'performance': self.performance, 'ui': self.ui
        }
        obj = sections.get(section)
        if obj and hasattr(obj, key):
            setattr(obj, key, value)
            self.save()
        else:
            raise ValueError(f"Invalid section '{section}' or key '{key}'")

    def get_all(self) -> Dict[str, Any]:
        return {s: asdict(getattr(self, s)) for s in
                ['pet', 'llm', 'animation', 'audio', 'performance', 'ui']}

    def reset_to_defaults(self) -> None:
        self.pet = PetConfig()
        self.llm = LLMConfig()
        self.animation = AnimationConfig()
        self.audio = AudioConfig()
        self.performance = PerformanceConfig()
        self.ui = UIConfig()
        self.data_dir = str(DATA_DIR)
        self.resources_dir = str(RESOURCES_DIR)
        self.animations_dir = str(ANIMATIONS_DIR)
        self.sounds_dir = str(SOUNDS_DIR)
        self.save()


# 全局单例
config = ConfigManager()


# ============================================================
# 导出所有配置常量给外部模块直接 import
# ============================================================
__all__ = [
    'config', 'ConfigManager',
    'PetConfig', 'LLMConfig', 'AnimationConfig', 'AudioConfig',
    'PerformanceConfig', 'UIConfig',
    'LOGGER_OUT_DIR', 'LOG_LEVEL', 'LOG_FORMAT',
    'PROJECT_ROOT', 'RESOURCES_DIR', 'ANIMATIONS_DIR', 'SOUNDS_DIR',
    'DATA_DIR', 'VENV_PATH', 'VENV_ACTIVATE',
]
