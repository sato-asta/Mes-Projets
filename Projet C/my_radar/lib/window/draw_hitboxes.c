/*
** EPITECH PROJECT, 2025
** my_radar
** File description:
** draw_hitboxes
*/

#include "main.h"

void draw_aircraft_hitbox(sfRenderWindow *win, aircraft_t *a)
{
    sfRectangleShape *rect = sfRectangleShape_create();
    sfVector2f size = {20.0f, 20.0f};
    sfVector2f position;

    if (!rect)
        return;
    position.x = a->x - 10.0f;
    position.y = a->y - 10.0f;
    sfRectangleShape_setSize(rect, size);
    sfRectangleShape_setPosition(rect, position);
    sfRectangleShape_setFillColor(rect, sfTransparent);
    sfRectangleShape_setOutlineColor(rect, sfColor_fromRGB(255, 0, 0));
    sfRectangleShape_setOutlineThickness(rect, 2.0f);
    sfRenderWindow_drawRectangleShape(win, rect, NULL);
    sfRectangleShape_destroy(rect);
}

void draw_tower_area(sfRenderWindow *win, tower_t *t)
{
    sfCircleShape *circle = sfCircleShape_create();
    sfVector2f position;

    if (!circle)
        return;
    sfCircleShape_setRadius(circle, (float)t->radius);
    position.x = t->x - t->radius;
    position.y = t->y - t->radius;
    sfCircleShape_setPosition(circle, position);
    sfCircleShape_setFillColor(circle, sfTransparent);
    sfCircleShape_setOutlineColor(circle, sfColor_fromRGB(0, 255, 0));
    sfCircleShape_setOutlineThickness(circle, 2.0f);
    sfRenderWindow_drawCircleShape(win, circle, NULL);
    sfCircleShape_destroy(circle);
}

void draw_aircraft_hitboxes(game_t *g)
{
    aircraft_t *a = g->aircrafts;

    while (a) {
        if (a->has_started)
            draw_aircraft_hitbox(g->win, a);
        a = a->next;
    }
}

void draw_tower_hitboxes(game_t *g)
{
    tower_t *t = g->towers;

    while (t) {
        draw_tower_area(g->win, t);
        t = t->next;
    }
}
