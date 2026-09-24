/*
** EPITECH PROJECT, 2025
** setting_up
** File description:
** lib
*/

#include "../../include/main.h"

static void update_best(size_t val, size_t i, size_t j, square_t *best)
{
    if (val > best->size
        || (val == best->size && i < best->y)
        || (val == best->size && i == best->y && j < best->x)) {
        best->size = val;
        best->y = i;
        best->x = j;
    }
}

int compute_best(board_t const *in, size_t const *dp,
    square_t *best)
{
    size_t w = in->width;
    size_t h = in->height;
    size_t i;
    size_t j;
    size_t val;

    best->size = 0;
    best->x = 0;
    best->y = 0;
    for (i = 0; i < h; i = i + 1) {
        for (j = 0; j < w; j = j + 1) {
            val = dp[i * w + j];
            update_best(val, i, j, best);
        }
    }
    return 0;
}
