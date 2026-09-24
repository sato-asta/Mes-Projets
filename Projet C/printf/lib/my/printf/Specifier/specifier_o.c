/*
** EPITECH PROJECT, 2025
** flag o
** File description:
** my_printf
*/

#include "../../../../include/main.h"
#include <stdarg.h>
#include <unistd.h>

int print_o(va_list list)
{
    int o = va_arg(list, int);

    return int_to_octal(o);
}
