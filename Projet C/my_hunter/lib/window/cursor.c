/*
** EPITECH PROJECT, 2025
** my_hunter
** File description:
** lib
*/

#include "../../include/main.h"

int cursor_init(game_t *g)
{
    g->cursor = malloc(sizeof(cursor_t));
    if (!g->cursor)
        return 84;
    g->cursor->shape = sfCircleShape_create();
    if (!g->cursor->shape) {
        free(g->cursor);
        g->cursor = NULL;
        return 84;
    }
    sfCircleShape_setRadius(g->cursor->shape, 8.f);
    sfCircleShape_setFillColor(g->cursor->shape, sfTransparent);
    sfCircleShape_setOutlineThickness(g->cursor->shape, 2.f);
    sfCircleShape_setOutlineColor(g->cursor->shape,
        sfColor_fromRGB(255, 50, 50));
    return 0;
}

void cursor_update(game_t *g, sfRenderWindow *win)
{
    sfVector2i m = sfMouse_getPositionRenderWindow(win);
    sfVector2f pos = {(float)m.x - 8.f, (float)m.y - 8.f};

    if (!g || !g->cursor || !g->cursor->shape || !win)
        return;
    sfCircleShape_setPosition(g->cursor->shape, pos);
}

void cursor_draw(const game_t *g, sfRenderWindow *win)
{
    if (!g || !g->cursor || !g->cursor->shape || !win)
        return;
    sfRenderWindow_drawCircleShape(win, g->cursor->shape, NULL);
}

void cursor_destroy(game_t *g)
{
    if (!g || !g->cursor)
        return;
    if (g->cursor->shape)
        sfCircleShape_destroy(g->cursor->shape);
    free(g->cursor);
    g->cursor = NULL;
}
