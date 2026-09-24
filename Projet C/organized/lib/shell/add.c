/*
** EPITECH PROJECT, 2025
** organized
** File description:
** lib
*/

#include "main.h"

static void delete_commas(char *s)
{
    if (!s)
        return;
    for (int i = 0; s[i]; i++) {
        if (s[i] == ',')
            s[i] = '\0';
    }
}

int add(void *data, char **args)
{
    workshop_t *ws = (workshop_t *)data;
    hardware_t *hw;

    if (!ws || !args || !args[0])
        return FAILURE;
    for (int i = 0; args[i]; i += 2) {
        if (!args[i + 1])
            return print_error("Error: add expects pairs TYPE NAME\n");
        delete_commas(args[i]);
        delete_commas(args[i + 1]);
        hw = create_hw(args[i], args[i + 1], ws->next_id);
        ws->next_id++;
        if (!hw)
            return print_error("Error add failed (bad TYPE or allocation)\n");
        hw->next = ws->list;
        ws->list = hw;
        print_added(hw);
    }
    return SUCCESS;
}
