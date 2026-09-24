/*
** EPITECH PROJECT, 2025
** flag c
** File description:
** my_printf
*/

#include "../../../../include/main.h"
#include <stdarg.h>

int print_c(va_list list)
{
    char c;

    c = va_arg(list, int);
    my_put_char(c);
    return 1;
}
