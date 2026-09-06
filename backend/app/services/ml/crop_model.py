class CropModel:
    def recommend(self, payload: dict) -> dict:
        rainfall = float(payload.get("rainfall", 0))
        temperature = float(payload.get("temperature", 0))
        humidity = float(payload.get("humidity", 0))
        nitrogen = float(payload.get("nitrogen", 0))
        phosphorus = float(payload.get("phosphorus", 0))
        potassium = float(payload.get("potassium", 0))
        ph = float(payload.get("ph", 6.5))

        if temperature > 28 and rainfall > 130:
            crop = "Rice"
            reason = "High seasonal temperature and abundant rainfall provide optimal wetland conditions for paddy cultivation."
            confidence = 0.94
        elif temperature > 25 and humidity > 55 and nitrogen >= 90:
            crop = "Maize"
            reason = "Warm temperature, moderate humidity, and high nitrogen availability support robust corn ear development."
            confidence = 0.92
        elif rainfall < 95:
            crop = "Sorghum"
            reason = "Drought-tolerant profile and moderate nutrient requirements make sorghum the safest, highest-yield option for dry spells."
            confidence = 0.89
        elif temperature <= 25 and 6.0 <= ph <= 7.5:
            crop = "Wheat"
            reason = "Moderate cooler temperatures and balanced neutral soil pH promote superior grain fill and tiller formation."
            confidence = 0.91
        elif potassium >= 75 and phosphorus >= 65:
            crop = "Soybean"
            reason = "Favorable phosphorus and potassium levels stimulate root nodulation and high-protein legume productivity."
            confidence = 0.88
        else:
            crop = "Millets"
            reason = "Hardy crop with minimal water and fertility requirements, ideal for diverse field conditions."
            confidence = 0.86

        return {
            "recommended_crop": crop,
            "yield_estimate": "High" if confidence > 0.90 else "Moderate",
            "reason": reason,
            "confidence": confidence,
            "inputs": payload,
        }
