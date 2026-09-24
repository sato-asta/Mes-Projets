/*
** EPITECH PROJECT, 2025
** setting_up
** File description:
** lib
*/

#include "../../include/main.h"

static size_t min3(size_t a, size_t b, size_t c)
{
    size_t m = a;

    if (b < m)
        m = b;
    if (c < m)
        m = c;
    return m;
}

static int compute_cell(board_t const *in, size_t *dp,
    size_t w, coords_t *pos)
{
    size_t idx = pos->i * w + pos->j;
    size_t val;

    if (in->data[idx] == 'o') {
        dp[idx] = 0;
        return 0;
    }
    if (pos->i == 0 || pos->j == 0) {
        dp[idx] = 1;
        return 0;
    }
    val = 1 + min3(
        dp[(pos->i - 1) * w + pos->j],
        dp[pos->i * w + (pos->j - 1)],
        dp[(pos->i - 1) * w + (pos->j - 1)]);
    dp[idx] = val;
    return 0;
}

int compute_fill(board_t const *in, size_t *dp)
{
    size_t w = in->width;
    size_t h = in->height;
    size_t i;
    size_t j;
    coords_t pos;

    for (i = 0; i < h; i = i + 1) {
        for (j = 0; j < w; j = j + 1) {
            pos.i = i;
            pos.j = j;
            compute_cell(in, dp, w, &pos);
        }
    }
    return 0;
}
