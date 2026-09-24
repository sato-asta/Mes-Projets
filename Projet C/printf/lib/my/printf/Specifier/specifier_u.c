/*
** EPITECH PROJECT, 2025
** flag u
** File description:
** my_printf
*/

#include "../../../../include/main.h"
#include <stdarg.h>
#include <stdio.h>
#include <limits.h>

int print_u(va_list list)
{
    unsigned int u = va_arg(list, unsigned int);

    u += UINT_MAX + 1;
    return my_put_unsigned_nbr(u);
}
