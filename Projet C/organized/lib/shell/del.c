/*
** EPITECH PROJECT, 2025
** organized
** File description:
** lib
*/

#include "main.h"

static int parse_id(char *arg, int *id)
{
    if (!arg || !id)
        return FAILURE;
    for (int i = 0; arg[i]; i++) {
        if (arg[i] < '0' || arg[i] > '9')
            return print_error("Error: del expects numeric ID.\n");
    }
    *id = my_atoi(arg);
    return SUCCESS;
}

static void free_hardware(hardware_t *cur)
{
    if (!cur)
        return;
    free(cur->type);
    free(cur->name);
    free(cur);
}

static void linked_deleted(hardware_t *prev, workshop_t *ws, hardware_t *cur)
{
    if (prev)
        prev->next = cur->next;
    else
        ws->list = cur->next;
}

static int delete_one(workshop_t *ws, int id)
{
    hardware_t *prev = NULL;
    hardware_t *cur = ws->list;

    while (cur) {
        if (cur->id == id) {
            linked_deleted(prev, ws, cur);
            print_deleted(cur);
            free_hardware(cur);
            return SUCCESS;
        }
        prev = cur;
        cur = cur->next;
    }
    return SUCCESS;
}

int del(void *data, char **args)
{
    workshop_t *ws = (workshop_t *)data;
    int id = 0;

    if (!ws || !args || !args[0])
        return FAILURE;
    for (int i = 0; args[i]; i++) {
        if (parse_id(args[i], &id) != SUCCESS)
            return FAILURE;
        if (delete_one(ws, id) != SUCCESS)
            return FAILURE;
    }
    return SUCCESS;
}
