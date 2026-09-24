/*
** EPITECH PROJECT, 2025
** setting_up
** File description:
** lib
*/

#include <unistd.h>

int write_error(char const *msg)
{
    size_t n = 0;

    if (!msg)
        return -1;
    for (; msg[n] != '\0'; n++)
        ;
    if (write(2, msg, n) < 0)
        return 84;
    return 0;
}
