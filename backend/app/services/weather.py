from __future__ import annotations

import random


class WeatherService:
    def get_current_temperature(self) -> dict:
        return {
            "temperature_c": round(random.uniform(22, 35), 1),
            "humidity_pct": round(random.uniform(45, 80), 1),
            "status": "Partly cloudy",
        }

    def get_market_prices(self) -> list[dict]:
        crops = [
            {"crop": "Rice", "price": 32.5},
            {"crop": "Wheat", "price": 28.8},
            {"crop": "Maize", "price": 24.1},
            {"crop": "Soybean", "price": 35.4},
            {"crop": "Potato", "price": 26.9},
        ]
        for item in crops:
            item["price"] = round(item["price"] * random.uniform(0.96, 1.08), 2)
        return crops
