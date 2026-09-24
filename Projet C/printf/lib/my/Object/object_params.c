/*
** EPITECH PROJECT, 2025
** double in hexa
** File description:
** flag a
*/

#include <stdio.h>
#include <stdlib.h>
#include "../../../include/main.h"

params_t *new_params(params_value_t *data)
{
    params_t *new = malloc(sizeof(params_t));

    if (!new) {
        return NULL;
    }
    new->data = data;
    new->previous = NULL;
    new->next = NULL;
    return new;
}

void new_entry(params_t *params, params_value_t *new_value)
{
    params_t *new = new_params(new_value);

    if (!new) {
        return;
    }
    while (params->data != NULL) {
        params = params->next;
    }
    params->next = new;
    new->previous = params;
    new->data = NULL;
}
