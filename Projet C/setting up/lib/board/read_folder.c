/*
** EPITECH PROJECT, 2025
** setting_up
** File description:
** lib
*/

#include <unistd.h>

int read_all(int fd, char *buf, size_t sz)
{
    ssize_t rd = 0;
    size_t got = 0;

    while (got < sz) {
        rd = read(fd, buf + got, sz - got);
        if (rd < 0)
            return -1;
        if (rd == 0)
            break;
        got = got + (size_t)rd;
    }
    return (int)got;
}
