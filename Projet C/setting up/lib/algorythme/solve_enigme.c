/*
** EPITECH PROJECT, 2025
** setting_up
** File description:
** lib
*/

#include <stdint.h>
#include <stdlib.h>
#include "../../include/main.h"

int solve_board(board_t const *in, square_t *best)
{
    size_t w = in->width;
    size_t h = in->height;
    size_t *dp;

    if (validate_board_args(in, best) != 0)
        return 84;
    dp = allocate(w, h);
    if (dp == NULL)
        return 84;
    compute_fill(in, dp);
    compute_best(in, dp, best);
    return 0;
}
