import uuid
from fastapi.testclient import TestClient
from app.main import app
from app.Database import SessionLocal
from app.models.districts import district
from app.models.User import User
from app.models.disaster_level import disasterlevel

client = TestClient(app)


def registerAndLogin(role):
    unique = uuid.uuid4().hex[:8]
    email = f"test_{unique}@kaiju.com"
    name = f"Test {unique}"

    client.post("/auth/register", json={
        "name": name, "email": email, "password": "secret123", "role": role,
    })
    login = client.post("/auth/login", json={"email": email, "password": "secret123"})
    token = login.json()["access_token"]

    me = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    user_id = me.json()["id"]

    return user_id, token


def deleteUser(user_id):
    db = SessionLocal()
    db.query(User).filter_by(id=user_id).delete()
    db.commit()
    db.close()


def getAnyTwoDistricts():
    response = client.get("/districts")
    districts = response.json()
    return districts[0]["id"], districts[1]["id"]


def test_transfer_rejected_when_no_route_exists():
    db = SessionLocal()
    isolated_a = district(code="1", name="IsolatedA", sea_access=False, is_hub=False)
    isolated_b = district(code="2", name="IsolatedB", sea_access=False, is_hub=False)
    db.add_all([isolated_a, isolated_b])
    db.commit()
    db.refresh(isolated_a)
    db.refresh(isolated_b)

    cd_id, cd_token = registerAndLogin("CD")

    try:
        response = client.post("/transfers", headers={"Authorization": f"Bearer {cd_token}"}, json={
            "source_district_id": isolated_a.id,
            "destination_district_id": isolated_b.id,
            "resource_id": 1,
            "quantity": 1,
        })

        assert response.status_code == 400
        assert response.json()["detail"]["code"] == "ERR_NO_ROUTE"
    finally:
        db.query(district).filter(district.id.in_([isolated_a.id, isolated_b.id])).delete(synchronize_session=False)
        db.commit()
        db.close()
        deleteUser(cd_id)


def test_transfer_rejected_when_below_retention_threshold():
    cd_id, cd_token = registerAndLogin("CD")
    source_id, dest_id = getAnyTwoDistricts()

    inventory = client.get(f"/districts/{source_id}/inventory").json()
    item = inventory[0]

    too_much = item["quantity"] - item["min_retention"] + 1

    client.post("/disaster-level", headers={"Authorization": f"Bearer {cd_token}"}, json={"level": 4})

    try:
        response = client.post("/transfers", headers={"Authorization": f"Bearer {cd_token}"}, json={
            "source_district_id": source_id,
            "destination_district_id": dest_id,
            "resource_id": item["resource_id"],
            "quantity": too_much,
        })

        assert response.status_code == 409
        assert response.json()["detail"]["code"] == "ERR_RETENTION_THRESHOLD"
    finally:
        client.post("/disaster-level", headers={"Authorization": f"Bearer {cd_token}"}, json={"level": 1})

        db = SessionLocal()
        db.query(disasterlevel).filter(disasterlevel.changed_by_id == cd_id).delete(synchronize_session=False)
        db.commit()
        db.close()

        deleteUser(cd_id)


def test_transfer_rejected_at_watch_level():
    cd_id, cd_token = registerAndLogin("CD")
    source_id, dest_id = getAnyTwoDistricts()

    client.post("/disaster-level", headers={"Authorization": f"Bearer {cd_token}"}, json={"level": 1})

    try:
        response = client.post("/transfers", headers={"Authorization": f"Bearer {cd_token}"}, json={
            "source_district_id": source_id,
            "destination_district_id": dest_id,
            "resource_id": 1,
            "quantity": 1,
        })

        assert response.status_code == 403
        assert response.json()["detail"]["code"] == "ERR_PERMISSION_DENIED"
    finally:
        db = SessionLocal()
        db.query(disasterlevel).filter(disasterlevel.changed_by_id == cd_id).delete(synchronize_session=False)
        db.commit()
        db.close()

        deleteUser(cd_id)
