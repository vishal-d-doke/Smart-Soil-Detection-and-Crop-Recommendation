import ast
import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.prediction import Prediction
from app.models.user import User
from app.security import get_current_user

router = APIRouter()


def safe_json_parse(raw_value):
    if not raw_value:
        return {}
    if isinstance(raw_value, dict):
        return raw_value
    try:
        return json.loads(raw_value)
    except Exception:
        try:
            return ast.literal_eval(raw_value)
        except Exception:
            return {"raw": raw_value}


@router.get("")
def get_history(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    records = db.query(Prediction).filter(Prediction.user_id == current_user.id).order_by(Prediction.created_at.desc()).all()
    return [
        {
            "id": record.id,
            "type": record.type,
            "title": record.title,
            "input_data": safe_json_parse(record.input_data),
            "result": safe_json_parse(record.result),
            "confidence": record.confidence,
            "created_at": record.created_at.isoformat() if record.created_at else None,
        }
        for record in records
    ]


@router.get("/{prediction_id}")
def get_prediction_by_id(prediction_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    record = db.query(Prediction).filter(Prediction.id == prediction_id, Prediction.user_id == current_user.id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Prediction record not found")

    return {
        "id": record.id,
        "type": record.type,
        "title": record.title,
        "input_data": safe_json_parse(record.input_data),
        "result": safe_json_parse(record.result),
        "confidence": record.confidence,
        "created_at": record.created_at.isoformat() if record.created_at else None,
    }
