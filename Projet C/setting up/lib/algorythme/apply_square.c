/*
** EPITECH PROJECT, 2025
** my_hunter
** File description:
** lib
*/

#include "../../include/main.h"

static int validate_square(board_t *b, square_t *best)
{
    if (b == NULL || b->data == NULL || best == NULL) {
        write_error("Invalid board or square\n");
        return 84;
    }
    if (best->x >= b->width || best->y >= b->height) {
        write_error("Square out of bounds\n");
        return 84;
    }
    if (best->size > b->width || best->size > b->height) {
        write_error("Square out of bounds\n");
        return 84;
    }
    return 0;
}

static void make_square(board_t *b, square_t *best)
{
    size_t start_y = best->y + 1 - best->size;
    size_t start_x = best->x + 1 - best->size;
    size_t i;
    size_t j;

    for (i = start_y; i <= best->y; i++) {
        for (j = start_x; j <= best->x; j++) {
            b->data[i * b->width + j] = 'x';
        }
    }
}

int apply_square(board_t *b, square_t *best)
{
    if (validate_square(b, best) != 0)
        return 84;
    make_square(b, best);
    return 0;
}
