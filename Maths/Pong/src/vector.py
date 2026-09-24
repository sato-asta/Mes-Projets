##############################
##         EPITECH          ##
##         101pong          ##
## ------------------------ ##
##   by Ronan and Nathan    ##
##############################

from src.base import *

class Vector :
    """location in 3D space"""

    def __init__(
            self,
            vx : int | float,
            vy : int | float,
            vz : int | float
            ) -> None :
        """create a location at x,y,z"""

        assert type(vx) in [int, float], "x must be an integer"
        assert type(vy) in [int, float], "y must be an integer"
        assert type(vz) in [int, float], "z must be an integer"

        self.vx = float(vx)
        self.vy = float(vy)
        self.vz = float(vz)

    def __add__(
            self,
            other
            )-> None :
        """add two vectors"""
        self.vx += other.vx
        self.vy += other.vy
        self.vz += other.vz

    def __str__(
            self
            ) -> str :
        """return the string representation of the vector"""
        return f"vx {self.vx}; vy {self.vy}; vz {self.vz}"

    def show(
            self,
            ) -> None :
        """returns string representation of ball"""

        print("The velocity vector of the ball is:\n(", end = "")
        put_float(self.vx)
        print(", ", end = "")
        put_float(self.vy)
        print(", ", end = "")
        put_float(self.vz)
        print(")")

    def reverse(
            self,
            axis : str
            ) -> None :
        """reverses the vector on the given axis"""

        def x(
                vector : Vector
                ) -> None :
            """reverses the vector on the x-axis"""

            vector.vx *= -1

        def y(
                vector : Vector
                ) -> None :
            """reverses the vector on the y-axis"""

            vector.vy *= -1

        def z(
                vector : Vector
                ) -> None :
            """reverses the vector on the z-axis"""

            vector.vz *= -1

        assert 1 <= len(axis) <= 3
        for axe in axis:
            assert axe in ["x", "y", "z"]

        if "x" in axis:
            x(self)
        if "y" in axis:
            y(self)
        if "z" in axis:
            z(self)

    def coef(
            self,
            m : int | float
            ) -> None :
        """multiply every vector axis by m"""
        self.vx *= m
        self.vy *= m
        self.vz *= m

    def get_norm(
            self
            ) -> int | float :
        return sqrt(self.vx **2 + self.vy **2 + self.vz **2)
