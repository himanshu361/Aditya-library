from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.config import get_settings

settings = get_settings()


def get_engine_kwargs(database_url: str | None = None) -> dict:
    url = (database_url or settings.database_url).lower()

    if url.startswith("sqlite"):
        return {
            "connect_args": {"check_same_thread": False},
            "pool_pre_ping": True,
        }

    if url.startswith("postgresql"):
        return {
            "pool_pre_ping": True,
            "pool_recycle": 1800,
        }

    return {"pool_pre_ping": True}


engine = create_engine(settings.database_url, **get_engine_kwargs(settings.database_url))
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


def ensure_sqlite_compatibility():
    if not str(engine.url).startswith('sqlite'):
        return

    inspector = inspect(engine)
    for table_name, columns in {
        'purchases': ['verified_at'],
        'access_logs': ['closed_at', 'ip_hash', 'user_agent'],
    }.items():
        if not inspector.has_table(table_name):
            continue

        existing_columns = {col['name'] for col in inspector.get_columns(table_name)}
        for column_name in columns:
            if column_name not in existing_columns:
                with engine.begin() as connection:
                    connection.exec_driver_sql(f'ALTER TABLE {table_name} ADD COLUMN {column_name} DATETIME')


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
