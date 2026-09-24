/*
** EPITECH PROJECT, 2025
** my_radar
** File description:
** lib
*/

#include "main.h"
#include <math.h>

static void update_aircraft_position(aircraft_t *a, float dt)
{
    float dx;
    float dy;
    float distance;
    float total_time;
    float progress;

    if (!a->has_started) {
        a->elapsed_time += dt;
        if (a->elapsed_time >= a->delay) {
            a->has_started = true;
            a->elapsed_time = 0.0f;
        }
        return;
    }
    dx = a->x_arr - a->x_dep;
    dy = a->y_arr - a->y_dep;
    distance = sqrt(dx * dx + dy * dy);
    total_time = distance / a->speed;
    a->elapsed_time += dt;
    if (a->elapsed_time >= total_time) {
        a->x = a->x_arr;
        a->y = a->y_arr;
        return;
    }
    progress = a->elapsed_time / total_time;
    a->x = a->x_dep + dx * progress;
    a->y = a->y_dep + dy * progress;
}

void update_aircrafts(game_t *g, float dt)
{
    aircraft_t *a = g->aircrafts;

    while (a) {
        update_aircraft_position(a, dt);
        a = a->next;
    }
    check_all_collisions(g);
}
