/*
** EPITECH PROJECT, 2025
** my_radar
** File description:
** lib
*/


#include "main.h"

static void draw_aircrafts(game_t *g)
{
    aircraft_t *a = g->aircrafts;

    if (!g->plane_spr)
        return;
    sfSprite_setScale(g->plane_spr, (sfVector2f){0.3, 0.3});
    while (a) {
        if (a->has_started) {
            sfSprite_setPosition(g->plane_spr, (sfVector2f){a->x, a->y});
            sfRenderWindow_drawSprite(g->win, g->plane_spr, NULL);
        }
        a = a->next;
    }
}

static void draw_towers(game_t *g)
{
    tower_t *t = g->towers;

    if (!g->tower_spr)
        return;
    sfSprite_setScale(g->tower_spr, (sfVector2f){0.3, 0.3});
    while (t) {
        sfSprite_setPosition(g->tower_spr, (sfVector2f){t->x, t->y});
        sfRenderWindow_drawSprite(g->win, g->tower_spr, NULL);
        t = t->next;
    }
}

void draw_entities(game_t *g)
{
    if (g->map_spr)
        sfRenderWindow_drawSprite(g->win, g->map_spr, NULL);
    if (g->show_sprites) {
        if (g->show_aircrafts)
            draw_aircrafts(g);
        if (g->show_towers)
            draw_towers(g);
    }
    if (g->show_hitboxes) {
        if (g->show_aircrafts)
            draw_aircraft_hitboxes(g);
        if (g->show_towers)
            draw_tower_hitboxes(g);
    }
}
