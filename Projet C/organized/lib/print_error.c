/*
** EPITECH PROJECT, 2025
** organized
** File description:
** lib
*/

#include "main.h"

int print_error(const char *str)
{
    write(STDOUT_FILENO, str, my_strlen(str));
    return FAILURE;
}
