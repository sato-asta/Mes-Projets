/*
** EPITECH PROJECT, 2025
** setting_up
** File description:
** lib
*/

#include <unistd.h>
#include "../../include/main.h"

int print_board(board_t const *b)
{
    size_t i = 0;

    if (!b || !b->data) {
        write_error("Invalid board\n");
        return 84;
    }
    for (i = 0; i < b->height; i++) {
        if (write(1, b->data + i * b->width, b->width) < 0)
            return 84;
        if (write(1, "\n", 1) < 0)
            return 84;
    }
    return 0;
}
