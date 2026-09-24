/*
** EPITECH PROJECT, 2025
** my_radar
** File description:
** lib
*/

#include "main.h"

void print_error(const char *msg)
{
    if (!msg)
        return;
    write(STDOUT_FILENO, msg, my_strlen(msg));
}
