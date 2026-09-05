from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect, text

from app.config import settings
from app.database.connection import Base, engine
from app.routes import auth, crop, history, profile, soil, weather

Base.metadata.create_all(bind=engine)
if engine.url.get_backend_name() == "sqlite":
    user_columns = {column["name"] for column in inspect(engine).get_columns("users")}
    if "phone" not in user_columns:
        with engine.begin() as connection:
            connection.execute(text("ALTER TABLE users ADD COLUMN phone VARCHAR(20)"))

app = FastAPI(title=settings.app_name, debug=settings.app_debug)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.cors_origins.split(",") if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(soil.router, prefix="/soil", tags=["soil"])
app.include_router(crop.router, prefix="/crop", tags=["crop"])
app.include_router(history.router, prefix="/history", tags=["history"])
app.include_router(profile.router, prefix="/profile", tags=["profile"])
app.include_router(weather.router, prefix="/weather", tags=["weather"])


@app.get("/")
def root():
    return {"message": "Smart Soil Detection and Crop Recommendation API", "status": "ok"}


@app.get("/health")
def health_check():
    return {"status": "ok"}
