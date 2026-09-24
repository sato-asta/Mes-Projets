/*
** EPITECH PROJECT, 2025
** my_radar
** File description:
** lib
*/

#include "main.h"
#include <math.h>

bool check_collision(aircraft_t *a, aircraft_t *b)
{
    float a_left = a->x - 10;
    float a_right = a->x + 10;
    float a_top = a->y - 10;
    float a_bottom = a->y + 10;
    float b_left = b->x - 10;
    float b_right = b->x + 10;
    float b_top = b->y - 10;
    float b_bottom = b->y + 10;

    if (a_right < b_left || a_left > b_right)
        return false;
    if (a_bottom < b_top || a_top > b_bottom)
        return false;
    return true;
}

bool is_in_control_area(aircraft_t *a, tower_t *tower)
{
    float dx = a->x - tower->x;
    float dy = a->y - tower->y;
    float distance = sqrt(dx * dx + dy * dy);

    return distance <= tower->radius;
}

void destroy_aircraft(aircraft_t **head, aircraft_t *to_destroy)
{
    aircraft_t *current;
    aircraft_t *prev;

    current = *head;
    prev = NULL;
    while (current) {
        if (current == to_destroy) {
            if (prev)
                prev->next = current->next;
            else
                *head = current->next;
            free(current);
            return;
        }
        prev = current;
        current = current->next;
    }
}

static bool is_covered_by_any_tower(aircraft_t *a, tower_t *towers)
{
    tower_t *t;

    t = towers;
    while (t) {
        if (is_in_control_area(a, t))
            return true;
        t = t->next;
    }
    return false;
}

static bool both_aircrafts_covered(aircraft_t *a, aircraft_t *b,
    tower_t *towers)
{
    return is_covered_by_any_tower(a, towers) &&
        is_covered_by_any_tower(b, towers);
}

void check_all_collisions(game_t *g)
{
    aircraft_t *a;
    aircraft_t *b;
    aircraft_t *next_a;
    aircraft_t *next_b;
    bool a_destroyed;

    a = g->aircrafts;
    while (a) {
        next_a = a->next;
        b = a->next;
        a_destroyed = false;
        while (b) {
            next_b = b->next;
            if (check_collision(a, b) &&
                !both_aircrafts_covered(a, b, g->towers)) {
                destroy_aircraft(&g->aircrafts, b);
                destroy_aircraft(&g->aircrafts, a);
                a_destroyed = true;
                break;
            }
            b = next_b;
        }
        if (a_destroyed)
            a = g->aircrafts;
        else
            a = next_a;
    }
}
