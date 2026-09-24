##############################
##         EPITECH          ##
##         101pong          ##
## ------------------------ ##
##   by Ronan and Nathan    ##
##############################

import pygame as pg
from src.localization import Location
from src.vector import Vector
import random

EXIT_SUCCESS = 0
EXIT_ERROR = 84
COLOR = {
    "BLACK" : (0, 0, 0),
    "WHITE" : (255, 255, 255),
}

class Ball:
    def __init__(self, x, y, z, vx, vy, vz, screen: pg.Surface):
        self.init_pos = (x, y, z)
        self.screen = screen
        self.radius = 10
        self.reset(vx, vy, vz)

    def reset(self, vx=None, vy=None, vz=None):
        x, y, z = self.init_pos
        self.location = Location(x, y, z)
        if vx is None or vy is None:
            angle = random.choice([45, 135, 225, 315])
            speed = 5
            vx = speed * pg.math.Vector2(1, 0).rotate(angle).x
            vy = speed * pg.math.Vector2(1, 0).rotate(angle).y
        self.velocity = Vector(vx, vy, vz if vz else 0)
        self.game_over = False

    def get_rect(self):
        return pg.Rect(
            int(self.location.x - self.radius),
            int(self.location.y - self.radius),
            self.radius * 2,
            self.radius * 2
        )

    def check_wall_collision(self):
        if self.location.x <= self.radius or self.location.x >= self.screen.get_width() - self.radius:
            self.game_over = True
        if self.location.y <= self.radius or self.location.y >= self.screen.get_height() - self.radius:
            self.velocity.reverse("y")

    def check_paddle_collision(self, paddle: pg.Rect):
        if self.get_rect().colliderect(paddle):
            self.velocity.reverse("x")

    def update(self, screen, paddle1, paddle2):
        if self.game_over:
            self.show_game_over(screen)
            return

        self.location.x += self.velocity.vx
        self.location.y += self.velocity.vy
        self.location.z += self.velocity.vz

        self.check_wall_collision()
        self.check_paddle_collision(paddle1)
        self.check_paddle_collision(paddle2)

        pg.draw.circle(screen, COLOR["WHITE"], (int(self.location.x), int(self.location.y)), self.radius)

    def show_game_over(self, screen):
        font = pg.font.SysFont('liberationmono', 50, True)
        text = font.render("GAME OVER – Press ENTER", True, COLOR["WHITE"])
        screen.blit(text, ((screen.get_width() - text.get_width()) // 2, screen.get_height() // 2))
