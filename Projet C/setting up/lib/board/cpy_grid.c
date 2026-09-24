/*
** EPITECH PROJECT, 2025
** setting_up
** File description:
** lib
*/

#include "../../include/main.h"

static int copy_one_row(char const *buf, size_t *pos,
    board_t *out, size_t row)
{
    size_t col;
    size_t j = row * out->width;

    for (col = 0; col < out->width; col = col + 1) {
        if (buf[*pos] == '\0') {
            write_error("Unexpected end of file\n");
            return 84;
        }
        if (buf[*pos] != '.' && buf[*pos] != 'o') {
            write_error("Invalid char in map\n");
            return 84;
        }
        out->data[j + col] = buf[*pos];
        *pos = *pos + 1;
    }
    if (buf[*pos] != '\n') {
        write_error("Invalid row length\n");
    }
    *pos = *pos + 1;
    return 0;
}

int copy_grid_rows(char const *buf, size_t off, board_t *out)
{
    size_t row;
    size_t pos = off;

    for (row = 0; row < out->height; row = row + 1) {
        if (copy_one_row(buf, &pos, out, row) != 0)
            return 84;
    }
    if (buf[pos] != '\0' && buf[pos] != '\n')
        return write_error("Trailing content after grid\n");
    return 0;
}
