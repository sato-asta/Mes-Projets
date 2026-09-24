/*
** EPITECH PROJECT, 2025
** flags g et G
** File description:
** my_printf
*/

#include "../../../../include/main.h"
#include <stdarg.h>

int print_g(va_list list)
{
    double g;

    g = va_arg(list, double);
    my_put_double_g(g);
    return 0;
}
