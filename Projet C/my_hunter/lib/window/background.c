/*
** EPITECH PROJECT, 2025
** my_hunter
** File description:
** lib
*/

#include "../../include/main.h"

int init_background(game_t *g, const char *path)
{
    g->bg = malloc(sizeof(background_t));
    if (!path)
        return 84;
    g->bg->tex = sfTexture_createFromFile(path, NULL);
    if (!g->bg->tex) {
        free(g->bg);
        g->bg = NULL;
        return 84;
    }
    g->bg->spr = sfSprite_create();
    if (!g->bg->spr) {
        sfTexture_destroy(g->bg->tex);
        free(g->bg);
        g->bg = NULL;
        return 84;
    }
    sfSprite_setTexture(g->bg->spr, g->bg->tex, sfTrue);
    sfSprite_setPosition(g->bg->spr, (sfVector2f){0, 0});
    return 0;
}

void draw_background(const background_t *bg, sfRenderWindow *win)
{
    if (bg && bg->spr)
        sfRenderWindow_drawSprite(win, bg->spr, NULL);
}

void destroy_background(background_t *bg)
{
    if (!bg)
        return;
    if (bg->spr)
        sfSprite_destroy(bg->spr);
    if (bg->tex)
        sfTexture_destroy(bg->tex);
    free(bg);
}
