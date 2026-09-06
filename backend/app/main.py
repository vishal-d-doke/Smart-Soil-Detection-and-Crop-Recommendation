import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect, text

from app.config import settings
from app.database.connection import Base, engine
from app.routes import auth, crop, history, profile, soil, weather

logger = logging.getLogger("smart_soil.main")


def init_db():
    try:
        Base.metadata.create_all(bind=engine)
        inspector = inspect(engine)
        if "users" in inspector.get_table_names():
            user_columns = {column["name"] for column in inspector.get_columns("users")}
            with engine.begin() as connection:
                if "phone" not in user_columns:
                    connection.execute(text("ALTER TABLE users ADD COLUMN phone VARCHAR(20)"))
                if "is_admin" not in user_columns:
                    connection.execute(text("ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT 0"))
                if "is_active" not in user_columns:
                    connection.execute(text("ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT 1"))
    except Exception as exc:
        logger.warning("Database initialization notice: %s", exc)


init_db()

app = FastAPI(title=settings.app_name, debug=settings.app_debug)

cors_origins = [origin.strip() for origin in settings.cors_origins.split(",") if origin.strip()]
is_wildcard = not cors_origins or cors_origins == ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if is_wildcard else cors_origins,
    allow_credentials=False if is_wildcard else True,
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
