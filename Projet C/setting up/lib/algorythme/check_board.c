/*
** EPITECH PROJECT, 2025
** setting_up
** File description:
** lib
*/

#include <stdint.h>
#include "../../include/main.h"

int validate_board_args(board_t const *in, square_t *best)
{
    if (in == NULL || best == NULL) {
        write_error("Invalid arguments\n");
        return 84;
    }
    if (in->width == 0 || in->height == 0) {
        write_error("Empty board\n");
        return 84;
    }
    if (in->width > SIZE_MAX / in->height) {
        write_error("Size overflow\n");
        return 84;
    }
    return 0;
}

size_t *allocate(size_t w, size_t h)
{
    size_t *dp = malloc(sizeof(size_t) * w * h);

    if (dp == NULL) {
        write_error("Malloc failed\n");
        return NULL;
    }
    return dp;
}
