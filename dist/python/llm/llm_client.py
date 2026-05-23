import aiohttp
import json
import asyncio
from typing import List, Dict, Any, Optional
from datetime import datetime
import time
import logging

from config import LLMConfig

logger = logging.getLogger(__name__)

class LLMClient:
    """LLM客户端"""
    
    def __init__(self, config: LLMConfig):
        self.config = config
        self.session: Optional[aiohttp.ClientSession] = None
        self._setup_logging()
    
    def _setup_logging(self):
        """设置日志"""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
    
    async def _ensure_session(self):
        """确保会话存在"""
        if self.session is None or self.session.closed:
            self.session = aiohttp.ClientSession(
                timeout=aiohttp.ClientTimeout(total=self.config.timeout)
            )
    
    async def chat(
        self,
        system_prompt: str,
        user_message: str,
        history: Optional[List[Dict[str, str]]] = None
    ) -> str:
        """
        与LLM对话
        
        Args:
            system_prompt: 系统提示
            user_message: 用户消息
            history: 对话历史
            
        Returns:
            LLM回复
        """
        await self._ensure_session()
        
        # 构建消息列表
        messages = [{"role": "system", "content": system_prompt}]
        
        # 添加历史消息
        if history:
            messages.extend(history)
        
        # 添加当前用户消息
        messages.append({"role": "user", "content": user_message})
        
        # 构建请求数据
        data = {
            "model": self.config.model,
            "messages": messages,
            "temperature": self.config.temperature,
            "max_tokens": self.config.max_tokens,
            "stream": False
        }
        
        # 添加API密钥（如果需要）
        headers = {"Content-Type": "application/json"}
        if self.config.api_key:
            headers["Authorization"] = f"Bearer {self.config.api_key}"
        
        # 重试逻辑
        for attempt in range(self.config.max_retries):
            try:
                started_at = time.perf_counter()
                logger.info(
                    "Calling LLM API (attempt %s/%s, timeout=%ss, url=%s)",
                    attempt + 1,
                    self.config.max_retries,
                    self.config.timeout,
                    self.config.api_url,
                )
                
                async with self.session.post(
                    self.config.api_url,
                    headers=headers,
                    json=data
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        reply = result.get("choices", [{}])[0].get("message", {}).get("content", "")
                        
                        if reply:
                            logger.info("LLM reply received in %.2fs: %s...", time.perf_counter() - started_at, reply[:50])
                            if "</think>" in reply:
                                reply = reply.split("</think>")[-1]
                            return reply.strip()
                        else:
                            logger.warning("Empty reply from LLM")
                            return "（宠物似乎没有理解你说的话...）"
                    else:
                        error_text = await response.text()
                        logger.error(
                            "LLM API error after %.2fs: %s - %s",
                            time.perf_counter() - started_at,
                            response.status,
                            error_text,
                        )
                        
                        if attempt < self.config.max_retries - 1:
                            await asyncio.sleep(self.config.retry_delay * (attempt + 1))
                            continue
                        else:
                            return self._get_fallback_reply()
                            
            except asyncio.TimeoutError:
                logger.error(
                    "LLM API timeout (attempt %s/%s, timeout=%ss, url=%s)",
                    attempt + 1,
                    self.config.max_retries,
                    self.config.timeout,
                    self.config.api_url,
                )
                if attempt < self.config.max_retries - 1:
                    await asyncio.sleep(self.config.retry_delay * (attempt + 1))
                    continue
                else:
                    return self._get_fallback_reply()
                    
            except Exception as e:
                logger.error(
                    "LLM API exception (attempt %s/%s): %s",
                    attempt + 1,
                    self.config.max_retries,
                    e,
                )
                if attempt < self.config.max_retries - 1:
                    await asyncio.sleep(self.config.retry_delay * (attempt + 1))
                    continue
                else:
                    return self._get_fallback_reply()
        
        return self._get_fallback_reply()
    
    def _get_fallback_reply(self) -> str:
        """获取降级回复"""
        fallback_replies = [
            "（宠物正在打盹，暂时无法回应...）",
            "（宠物似乎有点累了，让它休息一下吧~）",
            "（网络好像不太稳定，宠物有点困惑...）",
            "（宠物正在思考，请稍后再试...）"
        ]
        import random
        return random.choice(fallback_replies)
    
    async def chat_with_context(
        self,
        system_prompt: str,
        user_message: str,
        context: str = "",
        max_context_tokens: int = 1000
    ) -> str:
        """
        带上下文的对话
        
        Args:
            system_prompt: 系统提示
            user_message: 用户消息
            context: 上下文文本
            max_context_tokens: 最大上下文token数
            
        Returns:
            LLM回复
        """
        # 如果上下文太长，进行截断
        if context and len(context) > max_context_tokens * 4:  # 粗略估计：1 token ≈ 4字符
            context = context[:max_context_tokens * 4] + "..."
        
        # 构建带上下文的系统提示
        enhanced_system_prompt = system_prompt
        if context:
            enhanced_system_prompt += f"\n\n相关上下文：\n{context}"
        
        return await self.chat(enhanced_system_prompt, user_message)
    
    async def summarize(
        self,
        text: str,
        max_length: int = 200
    ) -> str:
        """
        文本摘要
        
        Args:
            text: 要摘要的文本
            max_length: 摘要最大长度
            
        Returns:
            摘要文本
        """
        system_prompt = f"请将以下文本摘要为不超过{max_length}字的内容："
        
        return await self.chat(system_prompt, text)
    
    async def extract_keywords(
        self,
        text: str,
        max_keywords: int = 5
    ) -> List[str]:
        """
        提取关键词
        
        Args:
            text: 文本
            max_keywords: 最大关键词数量
            
        Returns:
            关键词列表
        """
        system_prompt = f"请从以下文本中提取最多{max_keywords}个关键词，用逗号分隔："
        
        reply = await self.chat(system_prompt, text)
        
        # 解析回复
        keywords = [kw.strip() for kw in reply.split(",") if kw.strip()]
        return keywords[:max_keywords]
    
    def check_availability(self) -> bool:
        """
        检查LLM服务是否可用
        
        Returns:
            是否可用
        """
        # 这里可以添加更复杂的检查逻辑
        # 暂时返回True，假设服务可用
        return True
    
    async def close(self):
        """关闭客户端"""
        if self.session and not self.session.closed:
            await self.session.close()
            self.session = None
    
    async def __aenter__(self):
        await self._ensure_session()
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.close()

# 测试函数
async def test_llm_client():
    """测试LLM客户端"""
    config = LLMConfig(
        api_url="http://172.31.72.29:31444/v1/chat/completions",
        timeout=10
    )
    
    client = LLMClient(config)
    
    try:
        # 测试对话
        system_prompt = "你是一只可爱的电子宠物，名叫小乖。"
        user_message = "你好呀！"
        
        reply = await client.chat(system_prompt, user_message)
        print(f"Test reply: {reply}")
        
        # 测试摘要
        text = "今天天气很好，阳光明媚，我决定去公园散步。公园里有很多人在锻炼，孩子们在玩耍。我坐在长椅上看着这一切，心情很愉快。"
        
        summary = await client.summarize(text, max_length=50)
        print(f"Summary: {summary}")
        
        # 测试关键词提取
        keywords = await client.extract_keywords(text, max_keywords=3)
        print(f"Keywords: {keywords}")
        
    except Exception as e:
        print(f"Test failed: {e}")
    finally:
        await client.close()

if __name__ == "__main__":
    asyncio.run(test_llm_client())
