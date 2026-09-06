from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.config import settings

def get_normalized_database_url(url: str) -> str:
    """Normalize database URL for SQLAlchemy compatibility across hosting providers."""
    if not url:
        return "sqlite:///./app.db"

    # Render and Heroku use postgres:// which SQLAlchemy 2.0 rejects
    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql+psycopg://", 1)

    # Standard postgresql:// should use psycopg v3 dialect unless explicitly specified
    if url.startswith("postgresql://") and not (
        url.startswith("postgresql+psycopg://") or url.startswith("postgresql+psycopg2://")
    ):
        return url.replace("postgresql://", "postgresql+psycopg://", 1)

    return url


db_url = get_normalized_database_url(settings.database_url)

if db_url.startswith("sqlite"):
    engine = create_engine(
        db_url,
        connect_args={"check_same_thread": False},
    )
else:
    engine = create_engine(
        db_url,
        pool_pre_ping=True,
        pool_recycle=300,
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
