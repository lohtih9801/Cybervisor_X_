"""Data Agent - Handles collected data."""

from typing import Any, Dict
from .base_agent import BaseAgent


class DataAgent(BaseAgent):
    """Agent responsible for handling and validating collected data."""

    def __init__(self):
        super().__init__(
            name="Data Agent",
            description="Handles collected data and prepares it for analysis"
        )

    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process and validate collected data.
        
        Args:
            input_data: Raw data from security scans or logs
            
        Returns:
            Structured and validated data
        """
        # Validate data structure
        if not isinstance(input_data, dict):
            return {
                "status": "error",
                "message": "Input data must be a dictionary",
                "data": None
            }

        # Process data
        processed_data = {
            "status": "success",
            "source": input_data.get("source", "unknown"),
            "timestamp": input_data.get("timestamp"),
            "raw_data": input_data.get("data"),
            "data_type": input_data.get("type", "general"),
            "record_count": len(input_data.get("data", [])) if isinstance(input_data.get("data"), list) else 1,
            "processed": True
        }

        return processed_data
