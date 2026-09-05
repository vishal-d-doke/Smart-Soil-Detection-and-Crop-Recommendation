from fastapi import APIRouter

from app.services.weather import WeatherService

router = APIRouter()
service = WeatherService()


@router.get("/temperature")
def get_temperature():
    return service.get_current_temperature()


@router.get("/market-prices")
def get_market_prices():
    return service.get_market_prices()
