class CropModel:
    def recommend(self, payload: dict) -> dict:
        rainfall = float(payload.get("rainfall", 0))
        temperature = float(payload.get("temperature", 0))
        humidity = float(payload.get("humidity", 0))

        if temperature > 30 and rainfall > 120:
            crop = "Rice"
        elif temperature > 28 and humidity > 60:
            crop = "Maize"
        elif rainfall < 100:
            crop = "Sorghum"
        else:
            crop = "Wheat"

        return {
            "recommended_crop": crop,
            "yield_estimate": "High",
            "reason": "The crop matches the observed climate and soil conditions.",
            "confidence": 0.88,
        }
