from pydantic import BaseModel
from typing import Any, Dict


class PredictionCreate(BaseModel):
    type: str
    title: str
    input_data: Dict[str, Any]
    result: str
    confidence: float = 0.0


class PredictionOut(PredictionCreate):
    id: int
    user_id: int
    created_at: str

    class Config:
        from_attributes = True
