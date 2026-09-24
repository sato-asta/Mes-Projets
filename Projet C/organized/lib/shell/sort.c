/*
** EPITECH PROJECT, 2025
** organized
** File description:
** lib
*/

#include "main.h"

static int check_sort_args(char **args)
{
    for (int i = 0; args && args[i]; i++) {
        if (my_strcmp(args[i], "TYPE") != SUCCESS
            && my_strcmp(args[i], "NAME") != SUCCESS
            && my_strcmp(args[i], "ID") != SUCCESS
            && my_strcmp(args[i], "-r") != SUCCESS)
            return print_error("Error: sort tags must be TYPE/NAME/ID "
                "with optional -r.\n");
    }
    return SUCCESS;
}

static void insert_sorted(hardware_t **sorted, hardware_t *cur, char **args)
{
    hardware_t *it;

    if (!*sorted || cmp_hw(cur, *sorted, args) < 0) {
        cur->next = *sorted;
        *sorted = cur;
        return;
    }
    it = *sorted;
    while (it->next && cmp_hw(cur, it->next, args) >= 0)
        it = it->next;
    cur->next = it->next;
    it->next = cur;
}

int sort(void *data, char **args)
{
    workshop_t *ws = (workshop_t *)data;
    hardware_t *sorted = NULL;
    hardware_t *cur;
    hardware_t *next;

    if (!ws)
        return FAILURE;
    if (check_sort_args(args) != SUCCESS)
        return FAILURE;
    cur = ws->list;
    while (cur) {
        next = cur->next;
        insert_sorted(&sorted, cur, args);
        cur = next;
    }
    ws->list = sorted;
    return SUCCESS;
}
