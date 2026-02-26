"""Base agent class for the multi-agent system."""

from typing import Any, Dict, Optional
from abc import ABC, abstractmethod


class BaseAgent(ABC):
    """Abstract base class for all agents."""

    def __init__(self, name: str, description: str):
        self.name = name
        self.description = description
        self.conversation_history = []

    def add_to_history(self, role: str, content: str):
        """Add a message to conversation history."""
        self.conversation_history.append({"role": role, "content": content})

    def clear_history(self):
        """Clear conversation history."""
        self.conversation_history = []

    @abstractmethod
    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process input and return output. Must be implemented by subclasses."""
        pass

    async def execute(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Execute the agent with the given input."""
        self.add_to_history("user", str(input_data))
        result = await self.process(input_data)
        self.add_to_history("assistant", str(result))
        return result

    def get_history(self):
        """Get conversation history."""
        return self.conversation_history
