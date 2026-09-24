/*
** EPITECH PROJECT, 2025
** my_radar
** File description:
** lib
*/

#include "main.h"
#include <stdlib.h>

void destroy_game(game_t *g)
{
    if (!g)
        return;
    if (g->clock)
        sfClock_destroy(g->clock);
    destroy_window(g->win);
    destroy_sprites(g);
    free(g->settings);
    free(g);
}
