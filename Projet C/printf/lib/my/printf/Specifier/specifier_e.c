/*
** EPITECH PROJECT, 2025
** flags e et E
** File description:
** my_printf
*/

#include "../../../../include/main.h"
#include <stdarg.h>

int print_e(va_list list)
{
    double e;

    e = va_arg(list, double);
    return conv_double_to_scient(e);
}
