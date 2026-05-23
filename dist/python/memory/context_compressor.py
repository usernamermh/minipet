from typing import List, Dict, Any, Optional
from collections import OrderedDict
import json

from config import config

class ContextCompressor:
    """上下文压缩器"""
    
    def __init__(self, llm_client=None):
        self.config = config
        self.llm_client = llm_client
        self.max_tokens = 2000  # 默认最大token数
        self.safety_margin = 0.9  # 安全边际，保留10%空间
        
    def compress_context(
        self,
        memories: List[Dict[str, Any]],
        max_tokens: int = 2000
    ) -> str:
        """
        压缩对话上下文
        
        Args:
            memories: 记忆列表
            max_tokens: 最大token数
            
        Returns:
            压缩后的上下文字符串
        """
        if not memories:
            return ""
        
        self.max_tokens = int(max_tokens * self.safety_margin)
        
        # 估算当前token数
        current_text = self._format_memories(memories)
        current_tokens = self._estimate_tokens(current_text)
        
        if current_tokens <= self.max_tokens:
            # 不需要压缩
            return current_text
        
        # 需要压缩
        return self._perform_compression(memories)
    
    def _perform_compression(self, memories: List[Dict[str, Any]]) -> str:
        """
        执行上下文压缩
        
        Args:
            memories: 记忆列表
            
        Returns:
            压缩后的上下文字符串
        """
        # 策略1：按重要性排序，保留最重要的记忆
        sorted_memories = sorted(
            memories,
            key=lambda x: (x.get('importance', 5), x.get('timestamp', '')),
            reverse=True
        )
        
        compressed_parts = []
        current_tokens = 0
        
        for memory in sorted_memories:
            memory_text = self._format_single_memory(memory)
            memory_tokens = self._estimate_tokens(memory_text)
            
            if current_tokens + memory_tokens > self.max_tokens:
                break
            
            compressed_parts.append(memory_text)
            current_tokens += memory_tokens
        
        # 策略2：如果还有空间，尝试摘要模式
        if current_tokens < self.max_tokens * 0.7 and len(sorted_memories) > len(compressed_parts):
            summary = self._generate_summary(sorted_memories[len(compressed_parts):])
            if summary:
                compressed_parts.append(f"[摘要] {summary}")
        
        return "\n".join(compressed_parts)
    
    def _format_memories(self, memories: List[Dict[str, Any]]) -> str:
        """
        格式化记忆列表
        
        Args:
            memories: 记忆列表
            
        Returns:
            格式化的文本
        """
        parts = []
        for memory in memories:
            parts.append(self._format_single_memory(memory))
        return "\n".join(parts)
    
    def _format_single_memory(self, memory: Dict[str, Any]) -> str:
        """
        格式化单条记忆
        
        Args:
            memory: 单条记忆
            
        Returns:
            格式化的文本
        """
        role = memory.get('role', 'unknown')
        content = memory.get('content', '')
        timestamp = memory.get('timestamp', '')
        
        if role == 'user':
            return f"主人: {content}"
        elif role == 'assistant':
            return f"宠物: {content}"
        else:
            return f"{role}: {content}"
    
    def _estimate_tokens(self, text: str) -> int:
        """
        估算文本的token数量
        
        使用简单估算：中文字符按1.5 tokens，英文单词按1.3 tokens
        
        Args:
            text: 文本
            
        Returns:
            估算的token数量
        """
        if not text:
            return 0
        
        # 分别计算中文字符和英文单词
        chinese_chars = sum(1 for c in text if '\u4e00' <= c <= '\u9fff')
        english_words = len(text.split()) - chinese_chars
        
        # 估算token数
        tokens = chinese_chars * 1.5 + max(0, english_words) * 1.3
        
        return int(tokens)
    
    def _generate_summary(self, memories: List[Dict[str, Any]]) -> Optional[str]:
        """
        生成记忆摘要
        
        Args:
            memories: 要摘要的记忆列表
            
        Returns:
            摘要文本
        """
        if not memories or not self.llm_client:
            return None
        
        try:
            # 构建摘要文本
            text = self._format_memories(memories[-5:])  # 只摘要最近5条
            summary = self.llm_client.summarize(text, max_length=100)
            return summary
        except Exception as e:
            print(f"Summary generation failed: {e}")
            return None
    
    def sliding_window_compress(
        self,
        memories: List[Dict[str, Any]],
        window_size: int = 5,
        overlap: int = 2
    ) -> str:
        """
        滑动窗口压缩
        
        Args:
            memories: 记忆列表
            window_size: 窗口大小
            overlap: 重叠大小
            
        Returns:
            压缩后的上下文字符串
        """
        if len(memories) <= window_size:
            return self._format_memories(memories)
        
        # 保留最近的窗口
        recent_window = memories[-window_size:]
        
        # 对更早的记忆进行压缩
        earlier_memories = memories[:-window_size]
        compressed_earlier = self.compress_context(
            earlier_memories,
            max_tokens=self.max_tokens // 2
        )
        
        # 组合结果
        parts = []
        if compressed_earlier:
            parts.append("[早期记忆]")
            parts.append(compressed_earlier)
        
        parts.append("[近期记忆]")
        parts.append(self._format_memories(recent_window))
        
        return "\n".join(parts)
    
    def importance_based_compress(
        self,
        memories: List[Dict[str, Any]],
        importance_threshold: float = 5.0
    ) -> str:
        """
        基于重要性的压缩
        
        Args:
            memories: 记忆列表
            importance_threshold: 重要性阈值
            
        Returns:
            压缩后的上下文字符串
        """
        # 保留重要性高的记忆
        important_memories = [
            m for m in memories
            if m.get('importance', 0) >= importance_threshold
        ]
        
        # 保留最近的记忆
        recent_memories = sorted(
            memories,
            key=lambda x: x.get('timestamp', ''),
            reverse=True
        )[:5]
        
        # 合并并去重
        all_selected = []
        seen_content = set()
        
        for memory in important_memories + recent_memories:
            content = memory.get('content', '')
            if content not in seen_content:
                all_selected.append(memory)
                seen_content.add(content)
        
        return self._format_memories(all_selected)
    
    def compress_for_storage(
        self,
        memories: List[Dict[str, Any]],
        max_percent: float = 0.5
    ) -> List[Dict[str, Any]]:
        """
        压缩用于存储
        
        Args:
            memories: 记忆列表
            max_percent: 最大保留比例
            
        Returns:
            压缩后的记忆列表
        """
        if not memories:
            return []
        
        max_keep = max(20, int(len(memories) * max_percent))
        
        # 按重要性排序
        sorted_memories = sorted(
            memories,
            key=lambda x: (x.get('importance', 5), x.get('timestamp', '')),
            reverse=True
        )
        
        return sorted_memories[:max_keep]
    
    def get_compression_stats(
        self,
        original_memories: List[Dict[str, Any]],
        compressed_memories: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        获取压缩统计信息
        
        Args:
            original_memories: 原始记忆列表
            compressed_memories: 压缩后记忆列表
            
        Returns:
            压缩统计信息
        """
        original_text = self._format_memories(original_memories)
        compressed_text = self._format_memories(compressed_memories)
        
        original_tokens = self._estimate_tokens(original_text)
        compressed_tokens = self._estimate_tokens(compressed_text)
        
        return {
            'original_count': len(original_memories),
            'compressed_count': len(compressed_memories),
            'original_tokens': original_tokens,
            'compressed_tokens': compressed_tokens,
            'compression_ratio': round(
                (1 - compressed_tokens / original_tokens) * 100, 2
            ) if original_tokens > 0 else 0
        }