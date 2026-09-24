/*
** EPITECH PROJECT, 2025
** my_radar
** File description:
** lib
*/

#include "main.h"
#include <stdlib.h>

aircraft_t *create_aircraft(int *values)
{
    aircraft_t *a = malloc(sizeof(aircraft_t));

    if (!a)
        return NULL;
    a->x_dep = values[0];
    a->y_dep = values[1];
    a->x_arr = values[2];
    a->y_arr = values[3];
    a->speed = values[4];
    a->delay = values[5];
    a->x = values[0];
    a->y = values[1];
    a->elapsed_time = 0.0f;
    a->has_started = false;
    a->next = NULL;
    return a;
}
