/*
** EPITECH PROJECT, 2025
** double in hexa
** File description:
** flag a
*/
#include <stdio.h>
#include <stdlib.h>
#include "../../../include/main.h"

params_value_t *new_params_value(char c, int position)
{
    params_value_t *new = malloc(sizeof(params_value_t));

    if (!new) {
        return NULL;
    }
    new->c = c;
    new->position = position;
    new->used = false;
    return new;
}
