/*
** EPITECH PROJECT, 2025
** my_hunter
** File description:
** lib
*/

#include "../include/main.h"
#include <unistd.h>

void print_error(const char *msg)
{
    if (!msg)
        return;
    write(STDOUT_FILENO, msg, my_strlen(msg));
    write(STDOUT_FILENO, "\n", 1);
}
