/*
** EPITECH PROJECT, 2025
** flag d
** File description:
** my_printf
*/

#include "../../../../include/main.h"
#include <stdarg.h>

int print_d(va_list list)
{
    int d;

    d = va_arg(list, int);
    return my_put_nbr(d);
}
