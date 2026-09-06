import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.prediction import Prediction
from app.models.user import User
from app.security import get_current_user
from app.services.ml.soil_model import SoilModel

router = APIRouter()
model = SoilModel()


@router.post("/analyze")
def analyze_soil(payload: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    required_fields = ["nitrogen", "phosphorus", "potassium", "ph", "temperature", "humidity", "rainfall"]
    missing = [field for field in required_fields if field not in payload]
    if missing:
        raise HTTPException(status_code=400, detail=f"Missing fields: {missing}")

    result = model.predict(payload)

    prediction = Prediction(
        user_id=current_user.id,
        type="soil",
        title=f"Soil Analysis - {result['soil_type']}",
        input_data=json.dumps(payload),
        result=json.dumps(result),
        confidence=result["confidence"],
    )
    db.add(prediction)
    db.commit()
    db.refresh(prediction)

    return result
