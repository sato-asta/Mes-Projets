from pydantic import BaseModel


class MyPermissionsOut(BaseModel):
    level: int
    role: str
    allowed_actions: list[str]
