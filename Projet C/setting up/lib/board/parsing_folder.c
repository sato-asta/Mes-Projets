/*
** EPITECH PROJECT, 2025
** setting_up
** File description:
** lib
*/

#include "../../include/main.h"

int parse_header(char const *buf, size_t *lines, size_t *off)
{
    size_t i = 0;
    size_t n = 0;

    while (buf[i] != '\0' && buf[i] != '\n') {
        if (buf[i] < '0' || buf[i] > '9')
            return -1;
        n = n * 10 + (size_t)(buf[i] - '0');
        i = i + 1;
    }
    if (buf[i] != '\n' || n == 0)
        return -1;
    *lines = n;
    *off = i + 1;
    return 0;
}

int compute_width(char const *buf, size_t off, size_t *width)
{
    size_t i = off;
    size_t w = 0;

    while (buf[i] != '\n' && buf[i] != '\0') {
        w = w + 1;
        i = i + 1;
    }
    if (w == 0)
        return 84;
    *width = w;
    return 0;
}
