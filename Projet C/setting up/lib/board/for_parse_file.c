/*
** EPITECH PROJECT, 2025
** setting_up
** File description:
** lib
*/

#include <unistd.h>
#include <stdlib.h>
#include "../../include/main.h"

int prepare_buffer(char const *path, char **buf, header_info_t *info)
{
    int fd;
    size_t fsize;

    if (load_file_fd(path, &fd, &fsize) != 0)
        return 84;
    if (read_file_to_buf(fd, fsize, buf) != 0)
        return 84;
    if (parse_header(*buf, &info->lines, &info->off) != 0) {
        free(*buf);
        write_error("Invalid header\n");
        return 84;
    }
    if (compute_width(*buf, info->off, &info->width) != 0) {
        free(*buf);
        write_error("Invalid width\n");
        return 84;
    }
    return 0;
}

int fill_board(char *buf, header_info_t *info, board_t *out)
{
    if (allocate_board(out, info->width, info->lines) != 0) {
        free(buf);
        return 84;
    }
    if (copy_grid_rows(buf, info->off, out) != 0) {
        free(buf);
        free(out->data);
        return 84;
    }
    free(buf);
    return 0;
}
