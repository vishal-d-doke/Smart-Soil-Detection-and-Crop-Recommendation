import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database.connection import get_normalized_database_url


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as test_client:
        yield test_client


def test_root_endpoint(client):
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "Smart Soil" in data["message"]


def test_health_endpoint(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_database_url_normalization():
    # Render postgresql format
    render_url = "postgres://user:pass@ep-host.oregon-postgres.render.com/db"
    assert get_normalized_database_url(render_url) == "postgresql+psycopg://user:pass@ep-host.oregon-postgres.render.com/db"

    # Standard postgresql format
    standard_url = "postgresql://user:pass@localhost:5432/testdb"
    assert get_normalized_database_url(standard_url) == "postgresql+psycopg://user:pass@localhost:5432/testdb"

    # SQLite format unchanged
    sqlite_url = "sqlite:///./test.db"
    assert get_normalized_database_url(sqlite_url) == "sqlite:///./test.db"


def test_weather_endpoints(client):
    temp_res = client.get("/weather/temperature")
    assert temp_res.status_code == 200
    temp_data = temp_res.json()
    assert "temperature_c" in temp_data
    assert "humidity_pct" in temp_data

    market_res = client.get("/weather/market-prices")
    assert market_res.status_code == 200
    market_data = market_res.json()
    assert isinstance(market_data, list)
    assert len(market_data) > 0
    assert "crop" in market_data[0]
    assert "price" in market_data[0]


def test_user_flow_and_predictions(client):
    unique_email = f"deploy_test_{pytest.__name__}@example.com"
    user_payload = {
        "full_name": "Deployment Tester",
        "email": unique_email,
        "password": "Password123!",
        "phone": "+919876543210",
    }

    # Register
    reg_res = client.post("/auth/register", json=user_payload)
    assert reg_res.status_code in [200, 400]  # 400 if rerun with same email

    # Login
    login_res = client.post(
        "/auth/login",
        data={"username": unique_email, "password": "Password123!"},
    )
    assert login_res.status_code == 200
    token_data = login_res.json()
    assert "access_token" in token_data
    token = token_data["access_token"]
    auth_headers = {"Authorization": f"Bearer {token}"}

    # Get Me
    me_res = client.get("/auth/me", headers=auth_headers)
    assert me_res.status_code == 200
    assert me_res.json()["email"] == unique_email

    # Soil Analysis
    soil_payload = {
        "nitrogen": 85,
        "phosphorus": 45,
        "potassium": 50,
        "ph": 6.8,
        "temperature": 26,
        "humidity": 65,
        "rainfall": 120,
    }
    soil_res = client.post("/soil/analyze", json=soil_payload, headers=auth_headers)
    assert soil_res.status_code == 200
    soil_data = soil_res.json()
    assert "soil_type" in soil_data
    assert "health_score" in soil_data
    assert "recommendation" in soil_data

    # Crop Recommendation
    crop_payload = {
        "nitrogen": 95,
        "phosphorus": 50,
        "potassium": 45,
        "temperature": 29,
        "humidity": 70,
        "ph": 6.5,
        "rainfall": 140,
    }
    crop_res = client.post("/crop/recommend", json=crop_payload, headers=auth_headers)
    assert crop_res.status_code == 200
    crop_data = crop_res.json()
    assert "recommended_crop" in crop_data
    assert "confidence" in crop_data

    # History
    history_res = client.get("/history", headers=auth_headers)
    assert history_res.status_code == 200
    history_items = history_res.json()
    assert isinstance(history_items, list)
    assert len(history_items) >= 2
