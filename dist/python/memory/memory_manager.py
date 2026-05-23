import json
import os
from typing import List, Dict, Any, Optional
from datetime import datetime
from collections import OrderedDict

from config import config

class MemoryManager:
    """宠物记忆管理器"""
    
    def __init__(self):
        self.config = config
        self.memories: List[Dict[str, Any]] = []
        self.short_term_limit = 10  # 短期记忆限制
        self.long_term_limit = 100  # 长期记忆限制
        self._load_memories()
    
    def _load_memories(self):
        """从文件加载记忆"""
        try:
            memory_file = os.path.join(
                self.config.data_dir if hasattr(self.config, 'data_dir') else 'data',
                'memories.json'
            )
            
            if os.path.exists(memory_file):
                with open(memory_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    self.memories = data.get('memories', [])
        except Exception as e:
            print(f"Error loading memories: {e}")
            self.memories = []
    
    def _save_memories(self):
        """保存记忆到文件"""
        try:
            memory_dir = self.config.data_dir if hasattr(self.config, 'data_dir') else 'data'
            os.makedirs(memory_dir, exist_ok=True)
            
            memory_file = os.path.join(memory_dir, 'memories.json')
            data = {'memories': self.memories[-self.long_term_limit:]}
            
            with open(memory_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"Error saving memories: {e}")
    
    def add_memory(
        self,
        content: str,
        role: str = "user",
        metadata: Optional[Dict[str, Any]] = None
    ) -> None:
        """
        添加记忆
        
        Args:
            content: 记忆内容
            role: 角色 (user/assistant)
            metadata: 元数据
        """
        memory = {
            'content': content,
            'role': role,
            'timestamp': datetime.now().isoformat(),
            'metadata': metadata or {},
            'importance': self._calculate_importance(content)
        }
        
        self.memories.append(memory)
        
        # 限制记忆数量
        if len(self.memories) > self.long_term_limit:
            # 保留最重要的记忆和最新的记忆
            self.memories.sort(key=lambda x: (x['importance'], x['timestamp']), reverse=True)
            self.memories = self.memories[:self.long_term_limit]
        
        self._save_memories()
    
    def get_relevant_memories(
        self,
        query: str,
        limit: int = 5
    ) -> List[Dict[str, Any]]:
        """
        获取相关记忆
        
        Args:
            query: 查询文本
            limit: 返回数量
            
        Returns:
            相关记忆列表
        """
        if not self.memories:
            return []
        
        # 简单的相关性计算（基于关键词匹配）
        scored_memories = []
        query_terms = set(query)
        
        for memory in self.memories:
            score = 0
            
            # 基于内容匹配
            content = memory['content']
            content_terms = set(content)
            
            # 计算共同字符数
            common_chars = query_terms & content_terms
            score += len(common_chars) * 2
            
            # 基于记忆重要性
            score += memory.get('importance', 0) * 1
            
            # 基于时间衰减（越近的越重要）
            try:
                timestamp = datetime.fromisoformat(memory['timestamp'])
                time_diff = (datetime.now() - timestamp).total_seconds()
                time_weight = max(0, 1 - time_diff / (7 * 24 * 3600))  # 一周内的时间衰减
                score += time_weight * 3
            except:
                pass
            
            scored_memories.append((score, memory))
        
        # 按分数排序
        scored_memories.sort(key=lambda x: x[0], reverse=True)
        
        # 返回前limit条
        return [memory for score, memory in scored_memories[:limit]]
    
    def get_recent_memories(self, limit: int = 10) -> List[Dict[str, Any]]:
        """
        获取最近记忆
        
        Args:
            limit: 返回数量
            
        Returns:
            最近记忆列表
        """
        return sorted(
            self.memories,
            key=lambda x: x['timestamp'],
            reverse=True
        )[:limit]
    
    def _calculate_importance(self, content: str) -> int:
        """
        计算记忆重要性
        
        Args:
            content: 记忆内容
            
        Returns:
            重要性分数 0-10
        """
        importance = 5  # 默认中等重要性
        
        # 包含问号的记忆更重要（可能是重要的问答）
        if '?' in content or '？' in content:
            importance += 2
        
        # 包含情感词汇的记忆更重要
        emotion_words = ['喜欢', '讨厌', '开心', '难过', '爱', '恨', '想']
        for word in emotion_words:
            if word in content:
                importance += 1
        
        # 较长的记忆可能包含更多信息
        if len(content) > 50:
            importance += 1
        
        return min(importance, 10)
    
    def search_memories(
        self,
        keyword: str,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """
        搜索记忆
        
        Args:
            keyword: 搜索关键词
            limit: 返回数量
            
        Returns:
            匹配的记忆列表
        """
        results = []
        for memory in self.memories:
            if keyword in memory['content']:
                results.append(memory)
                if len(results) >= limit:
                    break
        return results
    
    def get_context_string(
        self,
        max_memories: int = 10
    ) -> str:
        """
        获取格式化上下文字符串
        
        Args:
            max_memories: 最大记忆数量
            
        Returns:
            格式化的上下文字符串
        """
        recent_memories = self.get_recent_memories(max_memories)
        
        context_parts = ["最近的互动记录："]
        
        for memory in reversed(recent_memories):
            role_name = "主人" if memory['role'] == 'user' else "宠物"
            context_parts.append(f"{role_name}: {memory['content']}")
        
        return "\n".join(context_parts)
    
    def clear_old_memories(self, days: int = 30) -> None:
        """
        清除旧记忆
        
        Args:
            days: 保留天数
        """
        cutoff = datetime.now().timestamp() - (days * 24 * 3600)
        
        self.memories = [
            m for m in self.memories
            if datetime.fromisoformat(m['timestamp']).timestamp() > cutoff
        ]
        
        self._save_memories()
    
    def clear_all(self) -> None:
        """清除所有记忆"""
        self.memories = []
        self._save_memories()
    
    def get_statistics(self) -> Dict[str, Any]:
        """
        获取记忆统计信息
        
        Returns:
            统计信息
        """
        user_count = sum(1 for m in self.memories if m['role'] == 'user')
        assistant_count = sum(1 for m in self.memories if m['role'] == 'assistant')
        
        avg_importance = 0
        if self.memories:
            avg_importance = sum(m.get('importance', 5) for m in self.memories) / len(self.memories)
        
        return {
            'total_memories': len(self.memories),
            'user_memories': user_count,
            'pet_memories': assistant_count,
            'average_importance': round(avg_importance, 2),
            'oldest_memory': self.memories[0]['timestamp'] if self.memories else None,
            'newest_memory': self.memories[-1]['timestamp'] if self.memories else None
        }