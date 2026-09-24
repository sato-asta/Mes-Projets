from math import sqrt

class Vector:
    """3D velocity vector"""

    def __init__(self, vx: float, vy: float, vz: float = 0.0):
        self.vx = float(vx)
        self.vy = float(vy)
        self.vz = float(vz)

    def __add__(self, other):
        return Vector(self.vx + other.vx, self.vy + other.vy, self.vz + other.vz)

    def reverse(self, axis: str):
        if "x" in axis: self.vx *= -1
        if "y" in axis: self.vy *= -1
        if "z" in axis: self.vz *= -1

    def coef(self, m: float):
        self.vx *= m
        self.vy *= m
        self.vz *= m

    def get_norm(self) -> float:
        return sqrt(self.vx**2 + self.vy**2 + self.vz**2)

    def __str__(self):
        return f"vx={self.vx}, vy={self.vy}, vz={self.vz}"
