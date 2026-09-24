/*
** EPITECH PROJECT, 2025
** flag p
** File description:
** my_printf
*/

#include "../../../../include/main.h"
#include <stdarg.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>


int print_p(va_list list)
{
    void *thing = va_arg(list, void *);

    if (thing == NULL) {
        return my_put_str("(none)");
    }
    my_put_char('0');
    my_put_char('x');
    int_to_hex((unsigned long long)thing, 0);
    return sizeof(thing);
}
