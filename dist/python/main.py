import sys
import os
import argparse
import uvicorn
from pathlib import Path

# 添加项目根目录到Python路径
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

from dist.python.llm.llm_client import LLMClient
from dist.python.memory.memory_manager import MemoryManager
from dist.python.memory.context_compressor import ContextCompressor
from config import ConfigManager, LLMConfig

app = FastAPI(title="Desktop Pet Backend")

# 允许跨域请求
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 全局组件
config: ConfigManager = None
llm_client: LLMClient = None
memory_manager: MemoryManager = None
context_compressor: ContextCompressor = None

# ===== 数据模型 =====

class ChatRequest(BaseModel):
    message: str
    user_id: str = "default"
    pet_name: str = "小宠物"
    pet_stage: str = "baby"
    pet_attributes: Dict[str, int] = {}

class ChatResponse(BaseModel):
    reply: str
    emotion: str = "neutral"
    actions: List[str] = []

class MemoryQuery(BaseModel):
    query: str = ""
    limit: int = 10

class MemoryAdd(BaseModel):
    content: str
    role: str = "user"
    metadata: Dict[str, Any] = {}

class CompressRequest(BaseModel):
    memories: List[Dict[str, Any]]
    max_tokens: int = 2000

# ===== 初始化 =====

@app.on_event("startup")
async def startup_event():
    global config, llm_client, memory_manager, context_compressor
    
    # 加载配置
    config = ConfigManager()
    
    # LLMClient 需要的是 LLMConfig，而不是整个 ConfigManager
    llm_client = LLMClient(config.llm)
    
    # 初始化记忆管理器
    memory_manager = MemoryManager()
    
    # 初始化上下文压缩器
    context_compressor = ContextCompressor(llm_client)
    
    print("Desktop Pet Backend started successfully")

# ===== 健康检查 =====

@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "llm_available": llm_client.check_availability() if llm_client else False
    }

# ===== 对话接口 =====

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """与宠物对话"""
    if not llm_client:
        raise HTTPException(status_code=500, detail="LLM client not initialized")
    
    try:
        # 获取相关记忆
        relevant_memories = memory_manager.get_relevant_memories(
            request.message, 
            limit=5
        ) if memory_manager else []
        
        # 压缩上下文
        compressed_context = context_compressor.compress_context(
            relevant_memories,
            max_tokens=1000
        ) if context_compressor and relevant_memories else ""
        
        # 构建系统提示
        system_prompt = build_pet_prompt(
            request.pet_name,
            request.pet_stage,
            request.pet_attributes,
            compressed_context
        )
        
        # 调用LLM
        reply = await llm_client.chat(
            system_prompt=system_prompt,
            user_message=request.message
        )
        
        # 保存对话记忆
        if memory_manager:
            memory_manager.add_memory(
                content=request.message,
                role="user"
            )
            memory_manager.add_memory(
                content=reply,
                role="assistant"
            )
        
        return ChatResponse(
            reply=reply,
            emotion=detect_emotion(reply),
            actions=[]
        )
        
    except Exception as e:
        print(f"Chat error: {e}")
        # 降级回复
        return ChatResponse(
            reply=f"{request.pet_name}似乎有点累了...让它休息一下吧~",
            emotion="tired",
            actions=[]
        )

# ===== 记忆管理接口 =====

@app.get("/memory")
async def get_memories(query: Optional[str] = None, limit: int = 10):
    """获取宠物记忆"""
    if not memory_manager:
        return {"memories": []}
    
    memories = memory_manager.get_relevant_memories(query or "", limit)
    return {"memories": memories}

@app.post("/memory")
async def add_memory(memory: MemoryAdd):
    """添加记忆"""
    if not memory_manager:
        raise HTTPException(status_code=500, detail="Memory manager not initialized")
    
    memory_manager.add_memory(
        content=memory.content,
        role=memory.role,
        metadata=memory.metadata
    )
    return {"status": "ok"}

@app.delete("/memory")
async def clear_memories():
    """清除所有记忆"""
    if memory_manager:
        memory_manager.clear_all()
    return {"status": "ok"}

# ===== 上下文压缩接口 =====

@app.post("/compress")
async def compress_context(request: CompressRequest):
    """压缩对话上下文"""
    if not context_compressor:
        raise HTTPException(status_code=500, detail="Context compressor not initialized")
    
    compressed = context_compressor.compress_context(
        request.memories,
        request.max_tokens
    )
    return {"compressed": compressed}

# ===== 辅助函数 =====

def build_pet_prompt(pet_name: str, stage: str, attributes: Dict[str, int], context: str) -> str:
    """构建宠物系统提示"""
    stage_descriptions = {
        "baby": "是刚出生不久的小宝宝，活泼可爱，对世界充满好奇",
        "teen": "正在茁壮成长，精力充沛，喜欢玩耍",
        "adult": "已经长大成人，成熟稳重，善解人意"
    }
    
    stage_desc = stage_descriptions.get(stage, "是一只可爱的宠物")
    
    # 构建属性描述
    attr_descriptions = []
    if attributes:
        hunger = attributes.get("hunger", 80)
        energy = attributes.get("energy", 100)
        mood = attributes.get("mood", 85)
        
        if hunger < 30:
            attr_descriptions.append("肚子很饿了，想吃东西")
        if energy < 30:
            attr_descriptions.append("很累了，想休息")
        if mood < 30:
            attr_descriptions.append("心情不太好")
    
    attr_text = "，".join(attr_descriptions) if attr_descriptions else "状态很好"
    
    prompt = f"""你是一只名叫{pet_name}的电子宠物，{stage_desc}。

当前状态：{attr_text}

对话风格要求：
1. 使用可爱、活泼的语气，像一只真正的宠物
2. 回复要简洁，一般不超过2-3句话
3. 可以适当使用拟声词和语气词，如"呜呜"、"嘿嘿"、"呼呼"等
4. 偶尔表达对主人的关心和依赖
5. 根据当前状态调整表达，如果饿了就撒娇要吃的，累了就说想睡觉

请用中文回复。"""
    
    if context:
        prompt += f"\n\n最近的记忆：\n{context}"
    
    return prompt

def detect_emotion(text: str) -> str:
    """检测宠物的情绪"""
    happy_keywords = ["开心", "嘿嘿", "哈哈", "喜欢", "好棒"]
    sad_keywords = ["呜呜", "难过", "不开心", "无聊"]
    tired_keywords = ["累了", "困", "呼呼", "睡觉"]
    hungry_keywords = ["饿", "想吃", "好吃"]
    
    text_lower = text.lower()
    
    if any(kw in text_lower for kw in hungry_keywords):
        return "hungry"
    elif any(kw in text_lower for kw in tired_keywords):
        return "tired"
    elif any(kw in text_lower for kw in sad_keywords):
        return "sad"
    elif any(kw in text_lower for kw in happy_keywords):
        return "happy"
    
    return "neutral"

# ===== 关闭接口 =====

@app.post("/shutdown")
async def shutdown():
    """关闭后端服务"""
    print("Shutting down backend...")
    import signal
    import os
    os.kill(os.getpid(), signal.SIGTERM)
    return {"status": "shutting_down"}

# ===== 启动 =====

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Desktop Pet Backend")
    parser.add_argument("--port", type=int, default=5000, help="Port to run the server on")
    args = parser.parse_args()
    
    uvicorn.run(app, host="127.0.0.1", port=args.port, log_level="info")
