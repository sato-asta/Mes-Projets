/*
** EPITECH PROJECT, 2025
** flags x et X
** File description:
** my_printf
*/

#include "../../../../include/main.h"
#include <stdarg.h>

int print_x(va_list list)
{
    int number = va_arg(list, int);

    int_to_hex(number, 0);
    return 0;
}

int print_gx(va_list list)
{
    int number = va_arg(list, int);

    int_to_hex(number, 1);
    return 0;
}
