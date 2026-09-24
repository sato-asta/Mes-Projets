##############################
##         EPITECH          ##
##         101pong          ##
## ------------------------ ##
##   by Ronan and Nathan    ##
##############################

from src.localization import *
from src.vector import *

class Ball:
    """just a ball"""

    def __init__(
            self,
            x : int | float, y : int | float, z : int | float,
            vx : int | float, vy : int | float, vz : int | float
            ) -> None :
        """creates a ball with location at x,y,z and with velocity of vx,vy,vz"""

        assert type(vx) in [int, float], "vx must be an integer"
        assert type(vy) in [int, float], "vy must be an integer"
        assert type(vz) in [int, float], "vz must be an integer"

        self.origin_location = Location(x, y, z)
        self.location = Location(x, y, z)
        self.velocity = Vector(vx, vy, vz)
        self.angle = -1

    def show(
            self,
            n : int | None = None
            ) -> None:
        """returns string representation of ball"""

        self.velocity.show()
        self.location.show(n, self.angle)

    def get_angle(
            self
            ) -> None:
        """check for collision with ball and set self.angle to the angle of incidence"""

        angle = self.origin_location.get_angle(self.velocity)
        if angle >= 0 :
            self.angle = angle

    def update(
            self
            ) -> None :
        """update ball's location and check for collision"""

        self.location.x += self.velocity.vx
        self.location.y += self.velocity.vy
        self.location.z += self.velocity.vz
        self.get_angle()
