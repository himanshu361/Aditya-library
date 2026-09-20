from app.database import get_engine_kwargs


def test_postgres_engine_uses_connection_pooling():
    kwargs = get_engine_kwargs("postgresql://aditya:secret@localhost:5432/aditya_school")

    assert kwargs["pool_pre_ping"] is True
    assert kwargs["pool_recycle"] == 1800
    assert "connect_args" not in kwargs


def test_sqlite_engine_keeps_sqlite_compatibility():
    kwargs = get_engine_kwargs("sqlite:///./aditya.db")

    assert kwargs["connect_args"]["check_same_thread"] is False
    assert kwargs["pool_pre_ping"] is True
