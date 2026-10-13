import math
from app.models.disaster_level import disasterlevel
from app.models.settings import SystemSettings

CRITICAL_LEVEL = 5
SETTINGS_ID = 1


def calculateMinRetention(initial_quantity, threshold=0.30):
    return math.ceil(initial_quantity * threshold)


def get_current_disaster_level(db):
    latest = db.query(disasterlevel).order_by(disasterlevel.changed_at.desc()).first()
    return latest.level if latest else 1


def getSettings(db):
    settings = db.get(SystemSettings, SETTINGS_ID)
    if settings is None:
        settings = SystemSettings(id=SETTINGS_ID, retention_lowered=False)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings


def get_effective_min_retention(db, initial_quantity):
    level = get_current_disaster_level(db)
    settings = getSettings(db)

    threshold = 0.15 if (level == CRITICAL_LEVEL and settings.retention_lowered) else 0.30
    return calculateMinRetention(initial_quantity, threshold)


def getAvailableToTransfer(quantity, min_retention, reserved_quantity):
    return max(quantity - min_retention - reserved_quantity, 0)
