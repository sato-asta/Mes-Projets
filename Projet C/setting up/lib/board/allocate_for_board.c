/*
** EPITECH PROJECT, 2025
** setting_up
** File description:
** lip
*/

#include <stdlib.h>
#include "../../include/main.h"

int allocate_board(board_t *out, size_t width, size_t height)
{
    out->width = width;
    out->height = height;
    out->data = malloc(width * height);
    if (out->data == NULL) {
        write_error("Malloc failed\n");
        return 84;
    }
    return 0;
}
