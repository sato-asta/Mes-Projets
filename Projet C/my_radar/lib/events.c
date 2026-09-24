/*
** EPITECH PROJECT, 2025
** my_radar
** File description:
** lib
*/

#include "main.h"

static void handle_key_pressed(game_t *g, sfEvent event)
{
    if (event.key.code == sfKeyL)
        g->show_hitboxes = !g->show_hitboxes;
    if (event.key.code == sfKeyS)
        g->show_sprites = !g->show_sprites;
}

void handle_events(game_t *g)
{
    sfEvent event;

    while (sfRenderWindow_pollEvent(g->win, &event)) {
        if (event.type == sfEvtClosed)
            sfRenderWindow_close(g->win);
        if (event.type == sfEvtKeyPressed)
            handle_key_pressed(g, event);
    }
}
