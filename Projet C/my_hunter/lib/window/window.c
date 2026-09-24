/*
** EPITECH PROJECT, 2025
** my_hunter
** File description:
** lib
*/

#include "../../include/main.h"

int init_game_over(game_t *g)
{
    sfFloatRect bounds;

    g->game_over_font = sfFont_createFromFile("assets/Police.ttf");
    if (!g->game_over_font)
        return 84;
    g->game_over_text = sfText_create();
    if (!g->game_over_text)
        return 84;
    sfText_setString(g->game_over_text, "GAME OVER");
    sfText_setFont(g->game_over_text, g->game_over_font);
    sfText_setCharacterSize(g->game_over_text, 80);
    sfText_setFillColor(g->game_over_text, sfRed);
    bounds = sfText_getGlobalBounds(g->game_over_text);
    sfText_setPosition(g->game_over_text,
        (sfVector2f){(g->settings->w - bounds.width) / 2,
            (g->settings->h - bounds.height) / 2});
    g->game_over = false;
    return 0;
}

int create_window(game_t *g)
{
    unsigned style;
    sfVideoMode mode = {g->settings->w, g->settings->h, 32};

    if (!g)
        return 84;
    style = g->settings->fullscreen ? sfFullscreen : sfClose;
    if (g->settings->w < 800 || g->settings->h < 600 ||
        g->settings->w > 1920 || g->settings->h > 1080)
        return 84;
    g->win = sfRenderWindow_create(mode, "my_hunter", style, NULL);
    if (!g->win)
        return 84;
    sfRenderWindow_setFramerateLimit(g->win, g->settings->fps);
    return 0;
}

int toggle_fullscreen(game_t *g)
{
    sfVector2u win_size;

    if (g->win)
        sfRenderWindow_destroy(g->win);
    g->settings->fullscreen = !g->settings->fullscreen;
    if (create_window(g) == 84 || !g->win)
        return 84;
    win_size = sfRenderWindow_getSize(g->win);
    sfRectangleShape_setPosition(g->fullscreen_btn,
        (sfVector2f){(float)win_size.x - 50.f, 10.f});
    return 0;
}

void destroy_window(game_t *g)
{
    if (g->win) {
        sfRenderWindow_destroy(g->win);
        g->win = NULL;
    }
}
