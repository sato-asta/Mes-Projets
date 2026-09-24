##############################
##         EPITECH          ##
##         101pong          ##
## ------------------------ ##
##   by Ronan and Nathan    ##
##############################

import pygame as pg
from src.ball import *

class Pong:
    """just a window"""

    def __init__(
            self,
            x1: float | int,
            y1: float | int,
            z1: float | int,
            x2: float | int,
            y2: float | int,
            z2: float | int,
            screen: pg.Surface
    ) -> None:
        """create an instance of Pong game"""

        x = float(x1)
        y = float(y1)
        z = float(z1)
        vx = float(x2) - x
        vy = float(y2) - y
        vz = float(z2) - z

        self.screen = screen
        self.ball = Ball(x, y, z, vx, vy, vz, self.screen)

    def __call__(
            self,
            screen: pg.Surface,
            paddle1: pg.Rect,
            paddle2: pg.Rect
    ) -> None:
        """update ball's location"""
        self.ball.update(screen, paddle1, paddle2)
