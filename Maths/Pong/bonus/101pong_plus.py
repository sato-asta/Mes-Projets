##############################
##         EPITECH          ##
##         101pong          ##
## ------------------------ ##
##   by Ronan and Nathan    ##
##############################

import sys
import random
from os import get_terminal_size
import pygame as pg
import warnings
from src.pong import Pong
from src.vector import Vector

warnings.filterwarnings("ignore", category=RuntimeWarning)

COLOR = {
    "WHITE": (255, 255, 255),
    "BLACK": (0, 0, 0)
}
EXIT_SUCCESS = 0
EXIT_ERROR = 1

warnings.filterwarnings("ignore", category=RuntimeWarning)


def put_center(*, string: str = "", placeholder: str = " ") -> None:
    try:
        term_width = get_terminal_size().columns
    except OSError:
        term_width = 80
    if string == "":
        print(placeholder * term_width, end="")
    else:
        offset = (term_width + 9 - len(string)) // 2
        print(placeholder * offset + string + placeholder * offset, end="")
        if term_width % 2 == 0:
            print(placeholder, end="")
        print()


def main_menu(screen: pg.Surface, width: int, height: int) -> bool:
    pg.font.init()
    title_font = pg.font.SysFont('liberationmono', 50, True)
    option_font = pg.font.SysFont('liberationmono', 30, True)

    title_text = title_font.render("Welcome to 101pong+", True, COLOR["WHITE"])
    play_text = option_font.render("Press ENTER to Play", True, COLOR["WHITE"])
    quit_text = option_font.render("Press ESC to Quit", True, COLOR["WHITE"])

    while True:
        screen.fill(COLOR["BLACK"])
        screen.blit(title_text, ((width - title_text.get_width()) // 2, height // 3))
        screen.blit(play_text, ((width - play_text.get_width()) // 2, height // 2))
        screen.blit(quit_text, ((width - quit_text.get_width()) // 2, height // 2 + 50))
        pg.display.update()

        for event in pg.event.get():
            if event.type == pg.QUIT:
                return False
            if event.type == pg.KEYDOWN:
                if event.key == pg.K_RETURN:
                    return True
                if event.key == pg.K_ESCAPE:
                    return False


def window(*, debug: int = 0, width: int = 800, height: int = 600, title: str = "101pong+", speed: float = 0.2) -> int:
    for line in [
        "=========================================",
        "=========================================",
        "=========================================",
        "=======                           =======",
        "=======    Welcome to 101pong+    =======",
        "=======                           =======",
        "=========================================",
        "=========================================",
        "========================================="
    ]:
        put_center(string=f"\033[97m{line}\033[0m", placeholder="-" if "===" in line else " ")

    if debug: print("\n\033[43m \033[0m\033[33m window: initializing...\033[0m", end="")
    pg.init()
    try:
        pong_icon = pg.image.load('src/icon.png')
        pg.display.set_icon(pong_icon)
    except Exception:
        if debug: print("\r\n\033[41m \033[0m\033[31m icon not found, skipping\033[0m")
    screen = pg.display.set_mode((width, height))
    pg.display.set_caption(title)
    screen.fill(COLOR["BLACK"])
    is_window_open = True
    if debug: print("\033[42m \033[0m\033[32m window: initialized    \033[0m")

    if not main_menu(screen, width, height):
        pg.quit()
        return EXIT_SUCCESS

    pg.font.init()
    mono_font_title = pg.font.SysFont('liberationmono', 40, True)
    mono_font_description_1 = pg.font.SysFont('liberationmono', 20, True)
    mono_font_description_2 = pg.font.SysFont('liberationmono', 15, True)
    text_escape_title = mono_font_title.render("EXIT ?", False, COLOR["WHITE"])
    text_escape_description_1 = mono_font_description_1.render("Press 'escape' to cancel", False, COLOR["WHITE"])
    text_escape_description_2 = mono_font_description_2.render("Press 'enter' or 'space' to exit", False, COLOR["WHITE"])

    paddle_x_offset = 10
    paddle_w = 20
    paddle_h = 100
    paddle1_pos = 0.0
    paddle1_up = False
    paddle1_down = False
    paddle2_pos = 0.0
    paddle2_up = False
    paddle2_down = False

    try:
        pong = Pong(width / 2, height / 2, 0, width / 2, height / 2, 0, screen)
        angle = random.choice([45, 135, 225, 315])
        vx = speed * pg.math.Vector2(1, 0).rotate(angle).x
        vy = speed * pg.math.Vector2(1, 0).rotate(angle).y
        pong.ball.velocity = Vector(vx, vy, 0)
    except Exception as error:
        if debug: print(error, file=sys.stderr)
        return EXIT_ERROR

    do_escape = False

    try:
        while is_window_open:
            screen.fill(COLOR["BLACK"])
            if not do_escape:
                for event in pg.event.get():
                    if event.type == pg.QUIT: do_escape = True
                    if event.type == pg.KEYDOWN:
                        if event.key == pg.K_z: paddle1_up = True
                        if event.key == pg.K_s: paddle1_down = True
                        if event.key == pg.K_UP: paddle2_up = True
                        if event.key == pg.K_DOWN: paddle2_down = True
                        if event.key == pg.K_ESCAPE: do_escape = True
                    if event.type == pg.KEYUP:
                        if event.key == pg.K_z: paddle1_up = False
                        if event.key == pg.K_s: paddle1_down = False
                        if event.key == pg.K_UP: paddle2_up = False
                        if event.key == pg.K_DOWN: paddle2_down = False

                # 🔁 Redémarrage si Game Over
                if pong.ball.game_over:
                    keys = pg.key.get_pressed()
                    if keys[pg.K_RETURN]:
                        pong.ball.reset()

                paddle1_pos += speed if paddle1_down else -speed if paddle1_up else 0
                paddle2_pos += speed if paddle2_down else -speed if paddle2_up else 0

                paddle1_pos = max(-((height - paddle_h) / 2), min(paddle1_pos, ((height - paddle_h) / 2)))
                paddle2_pos = max(-((height - paddle_h) / 2), min(paddle2_pos, ((height - paddle_h) / 2)))

                paddle1 = pg.Rect(paddle_x_offset, paddle1_pos + (height - paddle_h) / 2, paddle_w, paddle_h)
                paddle2 = pg.Rect((width - paddle_w) - paddle_x_offset, paddle2_pos + (height - paddle_h) / 2, paddle_w, paddle_h)
                pg.draw.rect(screen, COLOR["WHITE"], paddle1)
                pg.draw.rect(screen, COLOR["WHITE"], paddle2)
                pong(screen, paddle1, paddle2)
            else:
                for event in pg.event.get():
                    if event.type == pg.QUIT: is_window_open = False
                    if event.type == pg.KEYDOWN:
                        if event.key == pg.K_ESCAPE: do_escape = False
                        if event.key in [pg.K_SPACE, pg.K_RETURN]: is_window_open = False
                escape_bg_bg = pg.Rect((width / 2) - 200, (height / 2) - 150, 400, 300)
                escape_bg = pg.Rect((width / 2) - 190, (height / 2) - 140, 380, 280)
                pg.draw.rect(screen, COLOR["WHITE"], escape_bg_bg)
                pg.draw.rect(screen, COLOR["BLACK"], escape_bg)
                screen.blit(text_escape_title, ((width - text_escape_title.get_width()) / 2, (height / 2) - 50))
                screen.blit(text_escape_description_1,
                            ((width - text_escape_description_1.get_width()) / 2, (height / 2) + 20))
                screen.blit(text_escape_description_2,
                            ((width - text_escape_description_2.get_width()) / 2, (height / 2) + 50))
            pg.display.update()
        pg.display.quit()
    except KeyboardInterrupt:
        if debug:
            print("\n\033[41m \033[0m\033[31m game: forcefully closed\033[0m")
    return EXIT_SUCCESS

if __name__ == "__main__":
    import os
    os.system("clear")

    try:
        exit_code = window(debug=0)
    except Exception as e:
        print("\n\033[41m \033[0m\033[31m Unexpected error occurred\033[0m\n")
        print(e)
        exit_code = EXIT_ERROR

    sys.exit(exit_code)
