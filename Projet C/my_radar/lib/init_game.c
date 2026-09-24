/*
** EPITECH PROJECT, 2025
** my_radar
** File description:
** lib
*/

#include "main.h"
#include <stdlib.h>

static void init_game_settings(game_t *g)
{
    g->settings->w = 1920;
    g->settings->h = 1080;
    g->settings->fps = 60;
    g->settings->fullscreen = 0;
}

static void init_game_flags(game_t *g)
{
    g->show_hitboxes = 1;
    g->show_sprites = 1;
    g->aircrafts = NULL;
    g->towers = NULL;
    g->show_aircrafts = true;
    g->show_towers = true;
}

game_t *init_game(void)
{
    game_t *g = malloc(sizeof(game_t));

    if (!g)
        return NULL;
    g->settings = malloc(sizeof(window_t));
    if (!g->settings) {
        free(g);
        return NULL;
    }
    init_game_settings(g);
    g->win = create_window(g->settings);
    if (!g->win || load_sprites(g) == 84) {
        if (g->win)
            destroy_window(g->win);
        free(g->settings);
        free(g);
        return NULL;
    }
    init_game_flags(g);
    g->clock = sfClock_create();
    return g;
}
