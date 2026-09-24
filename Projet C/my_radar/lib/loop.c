/*
** EPITECH PROJECT, 2025
** my_radar
** File description:
** lib
*/

#include "main.h"

void game_loop(game_t *g)
{
    sfTime time;
    float dt;

    while (sfRenderWindow_isOpen(g->win)) {
        time = sfClock_restart(g->clock);
        dt = sfTime_asSeconds(time);
        handle_events(g);
        update_aircrafts(g, dt);
        sfRenderWindow_clear(g->win, sfColor_fromRGB(0, 0, 0));
        draw_entities(g);
        sfRenderWindow_display(g->win);
    }
}
