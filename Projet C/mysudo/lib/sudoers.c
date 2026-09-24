/*
** EPITECH PROJECT, 2025
** my_sudo
** File description:
** lib
*/

#include "main.h"

int read_sudoers(char *buf, int size)
{
    int fd = open("/etc/sudoers", O_RDONLY);
    long n = 0;

    if (fd == -1)
        return FAILURE;
    n = read(fd, buf, size - 1);
    close(fd);
    if (n <= 0)
        return FAILURE;
    buf[n] = '\0';
    return 0;
}

int user_is_sudoers(const char *username)
{
    char buf[BUF_SIZE];

    if (read_sudoers(buf, sizeof(buf)) != 0)
        return FAILURE;
    if (strstr(buf, username) != NULL)
        return 0;
    return FAILURE;
}
