/*
** EPITECH PROJECT, 2025
** flag i
** File description:
** my_printf
*/

#include "../../../../include/main.h"
#include <stdarg.h>

int print_i(va_list list)
{
    int i;

    i = va_arg(list, int);
    return my_put_nbr(i);
}
