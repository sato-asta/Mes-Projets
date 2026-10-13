from app.Database import base, engine
from app import models
from app.Database import SessionLocal
from app.models.districts import district


def test_database_connection_and_tables_created():
    base.metadata.create_all(engine)

    expected_tables = {
        "users",
        "districts",
        "district_adjacencies",
        "resources",
        "inventory",
        "transfers",
        "disaster_levels",
        "user_district_scopes",
    }

    actual_tables = set(base.metadata.tables.keys())
    assert expected_tables.issubset(actual_tables), (
        f"Tables manquantes : {expected_tables - actual_tables}"
    )


def test_can_insert_and_read_district():

    db = SessionLocal()
    try:
        d = district(code="T", name="TestDistrict", sea_access=False, is_hub=False)
        db.add(d)
        db.commit()
        db.refresh(d)

        assert d.id is not None

        result = db.query(district).filter_by(code="T").first()
        assert result is not None
        assert result.name == "TestDistrict"
    finally:
        db.rollback()
        db.query(district).filter_by(code="T").delete()
        db.commit()
        db.close()