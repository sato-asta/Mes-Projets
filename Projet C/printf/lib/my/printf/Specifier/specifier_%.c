/*
** EPITECH PROJECT, 2025
** flag %
** File description:
** my_printf
*/

#include "../../../../include/main.h"
#include <stdarg.h>

int print_pourcent(va_list list)
{
    my_put_char('%');
    return 1;
}
