/*
** EPITECH PROJECT, 2025
** mytop
** File description:
** CPU percentage calculation
*/
#include <stdlib.h>
#include "../include/main.h"
#include "../include/value.h"

static const round_array_t r_array[5] = {
    {.f = value_to_raw, .abbrev = "iB", .type = O},
    {.f = value_to_ko, .abbrev = "kiB", .type = KO},
    {.f = value_to_mo, .abbrev = "miB", .type = MO},
    {.f = value_to_go, .abbrev = "giB", .type = GO},
    {.f = NULL, .type = O},
};

double value_to_raw(char *value_send)
{
    return strtoul(value_send, NULL, 10);
}

double value_to_ko(char *value_send)
{
    double value = strtoul(value_send, NULL, 10);

    return value / 1024.0;
}

double value_to_mo(char *value_send)
{
    double value = strtoul(value_send, NULL, 10);

    return value / (1024.0 * 1024.0);
}

double value_to_go(char *value_send)
{
    double value = strtoul(value_send, NULL, 10);

    return value / (1024.0 * 1024.0 * 1024.0);
}

static conv_t get_conv(round_type_t id)
{
    for (int i = 0; r_array[i].f != NULL; i++) {
        if (r_array[i].type == id) {
            return r_array[i].f;
        }
    }
    return NULL;
}

char *get_abbrev(round_type_t id)
{
    for (int i = 0; r_array[i].f != NULL; i++) {
        if (r_array[i].type == id) {
            return r_array[i].abbrev;
        }
    }
    return NULL;
}
