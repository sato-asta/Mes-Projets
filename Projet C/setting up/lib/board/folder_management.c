/*
** EPITECH PROJECT, 2025
** setting_up
** File description:
** lib
*/

#include "../../include/main.h"

int load_file_fd(char const *path, int *fd_out, size_t *size_out)
{
    struct stat st;
    int fd;

    if (stat(path, &st) != 0 || st.st_size <= 0) {
        write_error("Bad file\n");
        return 84;
    }
    fd = open(path, O_RDONLY);
    if (fd < 0) {
        write_error("Cannot open file\n");
        return 84;
    }
    *fd_out = fd;
    *size_out = (size_t)st.st_size;
    return 0;
}

int read_file_to_buf(int fd, size_t sz, char **out_buf)
{
    char *buf;
    int rd;

    buf = malloc(sz + 1);
    if (buf == NULL) {
        close(fd);
        write_error("Malloc failed\n");
        return 84;
    }
    rd = read_all(fd, buf, sz);
    close(fd);
    if (rd < 0) {
        free(buf);
        write_error("Read failed\n");
        return 84;
    }
    buf[(size_t)rd] = '\0';
    *out_buf = buf;
    return 0;
}
