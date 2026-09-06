class SoilModel:
    def predict(self, payload: dict) -> dict:
        nitrogen = float(payload.get("nitrogen", 0))
        phosphorus = float(payload.get("phosphorus", 0))
        potassium = float(payload.get("potassium", 0))
        ph = float(payload.get("ph", 7.0))

        if ph < 6.0:
            soil_type = "Acidic Soil"
            recommendation = "Soil is acidic; consider applying agricultural lime and organic compost to raise pH."
        elif ph > 7.5:
            soil_type = "Alkaline Soil"
            recommendation = "Soil is alkaline; apply gypsum or elemental sulfur to balance pH and enhance nutrient availability."
        elif nitrogen < 80:
            soil_type = "Sandy Loam (Low Nitrogen)"
            recommendation = "Replenish soil nitrogen using organic manure or nitrogen-rich fertilizers."
        elif potassium < 60:
            soil_type = "Clay Loam (Low Potassium)"
            recommendation = "Apply potash fertilizers to improve crop disease resistance and root vigor."
        else:
            soil_type = "Loamy Soil (Balanced)"
            recommendation = "Nutrient balance and pH are optimal. Maintain current irrigation and organic matter management."

        npk_avg = (nitrogen + phosphorus + potassium) / 3.0
        health_score = int(min(100, max(45, round((npk_avg / 150.0) * 50 + (8.0 - abs(ph - 6.8)) * 6.5))))
        confidence = round(min(0.96, max(0.80, 0.82 + (health_score / 600.0))), 2)

        return {
            "soil_type": soil_type,
            "health_score": health_score,
            "recommendation": recommendation,
            "confidence": confidence,
            "inputs": payload,
        }
