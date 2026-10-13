from pydantic import BaseModel


class DisasterLevelIn(BaseModel):
    level: int


class DisasterLevelOut(BaseModel):
    level: int


class RetentionSettingsOut(BaseModel):
    retention_lowered: bool
