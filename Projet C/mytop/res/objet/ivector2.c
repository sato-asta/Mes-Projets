/*
** EPITECH PROJECT, 2025
** mytop
** File description:
** input handler
*/
#include <stdlib.h>
#include "../../include/main.h"

ivector2_t *new_ivector2(int x, int y)
{
    ivector2_t *vector = malloc(sizeof(ivector2_t));

    if (!vector)
        return NULL;
    vector->x = x;
    vector->y = y;
    return vector;
}
