/*
** EPITECH PROJECT, 2025
** organized
** File description:
** lib
*/

#include "main.h"

int disp(void *data, char **args)
{
    workshop_t *ws = (workshop_t *) data;

    if (!ws)
        return FAILURE;
    for (hardware_t *cur = ws->list; cur; cur = cur->next)
        print_line(cur);
    return SUCCESS;
}
