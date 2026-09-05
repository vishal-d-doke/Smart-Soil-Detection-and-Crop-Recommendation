class SoilModel:
    def predict(self, payload: dict) -> dict:
        nitrogen = float(payload.get("nitrogen", 0))
        phosphorus = float(payload.get("phosphorus", 0))
        potassium = float(payload.get("potassium", 0))
        ph = float(payload.get("ph", 0))

        if ph < 6.5:
            soil_type = "Acidic Soil"
        elif ph > 7.5:
            soil_type = "Alkaline Soil"
        else:
            soil_type = "Loamy Soil"

        health_score = min(100, max(50, round((nitrogen + phosphorus + potassium) / 20 + (8 - abs(ph - 7)) * 5)))

        return {
            "soil_type": soil_type,
            "health_score": health_score,
            "recommendation": "Use balanced fertilization and check pH regularly.",
            "confidence": 0.9,
        }
