/*
** EPITECH PROJECT, 2025
** setting_up
** File description:
** lib
*/

#include <stdlib.h>
#include "../../include/main.h"

static int pat_ok(char const *p)
{
    size_t i = 0;

    if (!p || !p[0])
        return 0;
    for (; p[i] != '\0'; i++) {
        if (p[i] != '.' && p[i] != 'o')
            return 0;
    }
    return 1;
}

static int init_board(board_t *out, size_t size)
{
    out->width = size;
    out->height = size;
    out->data = malloc(size * size);
    if (!out->data) {
        write_error("Malloc failed\n");
        return 84;
    }
    return 0;
}

static void complete_generate_board(board_t *out, char const *pattern)
{
    size_t w = out->width;
    size_t h = out->height;
    size_t i;
    size_t total = w * h;
    size_t len = my_strlen(pattern);

    for (i = 0; i < total; i++) {
        out->data[i] = pattern[i % len];
    }
}

int generate_board(size_t size, char const *pattern, board_t *out)
{
    if (!out || size == 0 || !pat_ok(pattern)) {
        write_error("Invalid generator args\n");
        return 84;
    }
    if (init_board(out, size) != 0)
        return 84;
    complete_generate_board(out, pattern);
    return 0;
}
