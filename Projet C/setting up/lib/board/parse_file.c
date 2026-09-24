/*
** EPITECH PROJECT, 2025
** setting_up
** File description:
** lib
*/

#include "../../include/main.h"

int parse_board_file(char const *path, board_t *out)
{
    char *buf;
    header_info_t info;

    if (path == NULL || out == NULL) {
        write_error("Invalid input\n");
        return 84;
    }
    if (prepare_buffer(path, &buf, &info) != 0)
        return 84;
    if (fill_board(buf, &info, out) != 0)
        return 84;
    return 0;
}
