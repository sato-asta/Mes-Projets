/*
** EPITECH PROJECT, 2025
** flag s
** File description:
** my_printf
*/

#include "../../../../include/main.h"
#include <stdarg.h>
#include <stdlib.h>

int print_s(va_list list)
{
    char *s = NULL;

    s = va_arg(list, char *);
    return my_put_str(s);
}
