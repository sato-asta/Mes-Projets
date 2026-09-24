/*
** EPITECH PROJECT, 2025
** my_hunter
** File description:
** lib
*/

#include "../../include/main.h"

int init_restart_background(game_t *g, const char *path)
{
    g->restart_bg_tex = sfTexture_createFromFile(path, NULL);
    if (!g->restart_bg_tex)
        return 84;
    g->restart_bg = sfSprite_create();
    if (!g->restart_bg)
        return 84;
    sfSprite_setTexture(g->restart_bg, g->restart_bg_tex, sfTrue);
    sfSprite_setScale(g->restart_bg, (sfVector2f)
        {(float)g->settings->w /
            sfTexture_getSize(g->restart_bg_tex).x,
            (float)g->settings->h /
            sfTexture_getSize(g->restart_bg_tex).y});
    return 0;
}

static int init_restart_shape(game_t *g)
{
    g->restart_btn = sfRectangleShape_create();
    if (!g->restart_btn)
        return 84;
    sfRectangleShape_setSize(g->restart_btn, (sfVector2f){200.f, 80.f});
    sfRectangleShape_setFillColor(g->restart_btn,
        sfColor_fromRGB(200, 200, 200));
    sfRectangleShape_setPosition(g->restart_btn,
        (sfVector2f){(g->settings->w - 200) / 2.f,
            (g->settings->h - 80) / 2.f + 100.f});
    return 0;
}

static int init_restart_text(game_t *g)
{
    g->restart_text = sfText_create();
    if (!g->restart_text)
        return 84;
    sfText_setString(g->restart_text, "RESTART");
    sfText_setFont(g->restart_text, g->game_over_font);
    sfText_setCharacterSize(g->restart_text, 40);
    sfText_setFillColor(g->restart_text, sfBlack);
    sfText_setPosition(g->restart_text,
        (sfVector2f){(g->settings->w - 120) / 2.f,
            (g->settings->h - 60) / 2.f + 110.f});
    return 0;
}

int init_restart_button(game_t *g)
{
    if (!g || !g->settings || !g->game_over_font)
        return 84;
    if (init_restart_shape(g) == 84)
        return 84;
    if (init_restart_text(g) == 84)
        return 84;
    return 0;
}

void draw_restart_button(game_t *g)
{
    sfRenderWindow_drawRectangleShape(g->win, g->restart_btn, NULL);
    sfRenderWindow_drawText(g->win, g->restart_text, NULL);
}

void destroy_restart_background(game_t *g)
{
    if (!g)
        return;
    if (g->restart_bg) {
        sfSprite_destroy(g->restart_bg);
        g->restart_bg = NULL;
    }
    if (g->restart_bg_tex) {
        sfTexture_destroy(g->restart_bg_tex);
        g->restart_bg_tex = NULL;
    }
}
