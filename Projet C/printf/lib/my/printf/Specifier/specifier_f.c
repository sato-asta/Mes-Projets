/*
** EPITECH PROJECT, 2025
** flags f et F
** File description:
** my_printf
*/

#include "../../../../include/main.h"
#include <stdarg.h>

int print_f(va_list list)
{
    double f;

    f = va_arg(list, double);
    return my_put_double(f);
}
