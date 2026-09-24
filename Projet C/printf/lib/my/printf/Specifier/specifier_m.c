/*
** EPITECH PROJECT, 2025
** flag m
** File description:
** my_printf
*/

#include "../../../../include/main.h"
#include <stdarg.h>
#include <string.h>
#include <errno.h>

int print_m(va_list list)
{
    char *error = strerror(errno);

    va_arg(list, int);
    my_put_str(error);
    return 0;
}
