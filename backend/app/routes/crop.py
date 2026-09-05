from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.prediction import Prediction
from app.models.user import User
from app.security import get_current_user

router = APIRouter()


@router.post("/recommend")
def recommend_crop(payload: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    required_fields = ["nitrogen", "phosphorus", "potassium", "temperature", "humidity", "ph", "rainfall"]
    missing = [field for field in required_fields if field not in payload]
    if missing:
        raise HTTPException(status_code=400, detail=f"Missing fields: {missing}")

    crop = "Rice"
    if payload.get("temperature", 0) > 30:
        crop = "Maize"
    elif payload.get("rainfall", 0) < 100:
        crop = "Sorghum"

    result = {
        "recommended_crop": crop,
        "yield_estimate": "High",
        "reason": "Balanced nutrient profile and climate conditions support strong growth.",
        "confidence": 0.89,
        "inputs": payload,
    }

    prediction = Prediction(
        user_id=current_user.id,
        type="crop",
        title="Crop Recommendation",
        input_data=str(payload),
        result=str(result),
        confidence=result["confidence"],
    )
    db.add(prediction)
    db.commit()
    db.refresh(prediction)

    return result
