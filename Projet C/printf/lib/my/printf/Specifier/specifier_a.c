/*
** EPITECH PROJECT, 2025
** flags a et A
** File description:
** my_printf
*/

#include "../../../../include/main.h"
#include <stdarg.h>

int print_a(va_list list)
{
    double a = va_arg(list, double);

    my_put_double_in_hexa(a, 0);
    return 0;
}

int print_ga(va_list list)
{
    double a = va_arg(list, double);

    my_put_double_in_hexa(a, 1);
    return 0;
}
