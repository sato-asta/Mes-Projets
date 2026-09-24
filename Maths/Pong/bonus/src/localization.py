##############################
##         EPITECH          ##
##         101pong          ##
## ------------------------ ##
##   by Ronan and Nathan    ##
##############################

from src.base import *
from src.vector import Vector


from math import acos, degrees, sqrt

class Location:
    def __init__(self, x: float, y: float, z: float = 0.0):
        self.x = float(x)
        self.y = float(y)
        self.z = float(z)

    def get_angle(self, vector: Vector) -> float:
        """Returns angle between location vector and velocity vector"""
        dot = self.x * vector.vx + self.y * vector.vy + self.z * vector.vz
        norm_pos = sqrt(self.x**2 + self.y**2 + self.z**2)
        norm_vec = vector.get_norm()
        if norm_pos == 0 or norm_vec == 0:
            return -1
        cos_theta = dot / (norm_pos * norm_vec)
        return round(degrees(acos(max(-1.0, min(1.0, cos_theta)))), 2)
