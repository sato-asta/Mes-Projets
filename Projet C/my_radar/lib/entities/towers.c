/*
** EPITECH PROJECT, 2025
** my_radar
** File description:
** lib
*/

#include "main.h"
#include <stdlib.h>

tower_t *create_tower(int *values)
{
    tower_t *t = malloc(sizeof(tower_t));

    if (!t)
        return NULL;
    t->x = values[0];
    t->y = values[1];
    t->radius = values[2];
    t->next = NULL;
    return t;
}
