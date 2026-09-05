from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.prediction import Prediction
from app.models.user import User
from app.security import get_current_user

router = APIRouter()


@router.get("")
def get_history(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    records = db.query(Prediction).filter(Prediction.user_id == current_user.id).order_by(Prediction.created_at.desc()).all()
    return [
        {
            "id": record.id,
            "type": record.type,
            "title": record.title,
            "input_data": record.input_data,
            "result": record.result,
            "confidence": record.confidence,
            "created_at": record.created_at.isoformat() if record.created_at else None,
        }
        for record in records
    ]
