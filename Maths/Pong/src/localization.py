##############################
##         EPITECH          ##
##         101pong          ##
## ------------------------ ##
##   by Ronan and Nathan    ##
##############################

from numpy import array, dot, linalg
from math import degrees, acos

class Location:
    """location in 3D space"""

    def __init__(self, x: int | float, y: int | float, z: int | float) -> None:
        """create a location at x,y,z"""
        assert type(x) in [int, float], "x must be an integer or float"
        assert type(y) in [int, float], "y must be an integer or float"
        assert type(z) in [int, float], "z must be an integer or float"

        self.x = float(x)
        self.y = float(y)
        self.z = float(z)

    def show(self, n: int | None = None, a: int | None = None) -> None:
        """returns string representation of ball"""
        if n:
            print(f"At time t + {n - 1}, ball coordinates will be:")
            print(f"({self.x:.2f}, {self.y:.2f}, {self.z:.2f})")
        if a is not None and a >= 0:
            print("The incidence angle is:")
            print(f"{a:.2f} degrees")
        else:
            print("The ball won't reach the paddle.")

    def get_angle(self, vector: 'Vector', paddle_normal: array = array([0, 0, 1])) -> float:
        """returns angle of incidence between vector and paddle surface"""
        v = array([vector.vx, vector.vy, vector.vz])
        if self.z + vector.vz > 0 >= vector.vz:
            cos_theta = abs(dot(v, paddle_normal)) / (linalg.norm(v) * linalg.norm(paddle_normal))
            angle_deg = degrees(acos(cos_theta))
            return round(angle_deg, 2)
        return -1
