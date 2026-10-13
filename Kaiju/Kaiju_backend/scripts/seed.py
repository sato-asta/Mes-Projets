from app.Database import SessionLocal, base, engine
from app import models
from app.models.districts import district
from app.models.adjacency import districtadjacency
from app.models.ressources import Resource
from app.models.inventory import Inventory
from app.models.disaster_level import disasterlevel

base.metadata.create_all(engine)
db = SessionLocal()

districts_data = [
    {"code": "A", "name": "Apex", "sea_access": False, "is_hub": False},
    {"code": "E", "name": "Echo", "sea_access": True, "is_hub": False},
    {"code": "W", "name": "Warden", "sea_access": False, "is_hub": False},
    {"code": "X", "name": "Xeno", "sea_access": True, "is_hub": True},
    {"code": "Z", "name": "Zion", "sea_access": True, "is_hub": False},
]

adjacency_pairs = [
    ("A", "E"),
    ("A", "W"),
    ("A", "X"),
    ("E", "X"),
    ("W", "X"),
    ("W", "Z"),
    ("X", "Z")
]

resource_name = [
    "Medical personnel",
    "Rescue teams",
    "Transport vehicles",
    "Emergency shelters",
    "Food & water supplies",
    "Communication equipment",
    "Power generators",
    "Engineering crews",
    "Security units",
    "Hazmat equipment",
]

initial_distribution = {
    "Medical personnel": {"A": 12, "E": 5, "W": 8, "X": 3, "Z": 7},
    "Rescue teams": {"A": 4, "E": 9, "W": 3, "X": 6, "Z": 5},
    "Transport vehicles": {"A": 6, "E": 3, "W": 10, "X": 4, "Z": 7},
    "Emergency shelters": {"A": 8, "E": 6, "W": 4, "X": 10, "Z": 2},
    "Food & water supplies": {"A": 5, "E": 8, "W": 6, "X": 7, "Z": 9},
    "Communication equipment": {"A": 3, "E": 7, "W": 5, "X": 8, "Z": 4},
    "Power generators": {"A": 7, "E": 2, "W": 9, "X": 5, "Z": 6},
    "Engineering crews": {"A": 2, "E": 6, "W": 7, "X": 4, "Z": 8},
    "Security units": {"A": 9, "E": 4, "W": 2, "X": 6, "Z": 3},
    "Hazmat equipment": {"A": 3, "E": 5, "W": 4, "X": 2, "Z": 10},
}

districts_by_code = {}
for dstc in districts_data:
    existing = db.query(district).filter_by(code=dstc["code"]).first()
    if existing:
        districts_by_code[dstc["code"]] = existing
        continue
    obj = district(**dstc)
    db.add(obj)
    db.flush()
    districts_by_code[dstc["code"]] = obj

db.commit()

for code_a, code_b in adjacency_pairs:
    a_id = districts_by_code[code_a].id
    b_id = districts_by_code[code_b].id
    existing = db.query(districtadjacency).filter_by(district_a_id=a_id, district_b_id=b_id).first()
    if not existing:
        db.add(districtadjacency(district_a_id=a_id, district_b_id=b_id))

db.commit()

resources_by_name = {}
for name in resource_name:
    existing = db.query(Resource).filter_by(name=name).first()
    if existing:
        resources_by_name[name] = existing
        continue
    obj = Resource(name=name)
    db.add(obj)
    db.flush()
    resources_by_name[name] = obj

db.commit()

for resource_name, per_district in initial_distribution.items():
    resource_obj = resources_by_name[resource_name]
    for code, quantity in per_district.items():
        district_obj = districts_by_code[code]
        existing = db.query(Inventory).filter_by(resource_id=resource_obj.id, district_id=district_obj.id).first()
        if existing:
            continue
        db.add(Inventory(resource_id=resource_obj.id, district_id=district_obj.id, quantity=quantity, initial_quantity=quantity))

db.commit()

existing_level = db.query(disasterlevel).first()
if not existing_level:
    db.add(disasterlevel(level=1, changed_by_id=None))
    db.commit()

print("Seed data initialized")
print(f"Districts: {db.query(district).count()}")
print(f"Adjacencies: {db.query(districtadjacency).count()}")
print(f"Resources: {db.query(Resource).count()}")
print(f"Inventory rows: {db.query(Inventory).count()}")
print(f"Disaster levels: {db.query(disasterlevel).count()}")

db.close()