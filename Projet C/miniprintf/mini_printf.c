/*
** EPITECH PROJECT, 2025
** project 1
** File description:
** mini_printf
*/

#include <stdio.h>
#include <stdarg.h>
#include "./include/my.h"
#include <unistd.h>

static int digits_mini_printf(char const *format, int o, va_list ap)
{
    int d = 0;
    int count = 0;

    if (format[o] == 'd' || format[o] == 'i') {
        d = va_arg(ap, int);
        my_put_nbr(d);
        count++;
    }
    if (format[o] == '%') {
        my_putchar('%');
        count++;
    }
    return count;
}

static int characters_mini_printf(char format, va_list ap)
{
    char *s = NULL;
    char c = 0;
    int count = 0;

    if (format == 'c') {
        c = (char) va_arg(ap, int);
        my_putchar(c);
        count++;
    } else if (format == 's') {
        s = va_arg(ap, char *);
        my_putstr(s);
        count++;
    }
    return count;
}

int mini_printf(char *format, ...)
{
    va_list ap;
    int count = 0;

    va_start(ap, format);
    if (format == NULL)
        return 84;
    for (int o = 0; format[o] != '\0'; o++) {
        if (format[o] == '%' && format[o + 1]) {
            o++;
            count += characters_mini_printf(format[o], ap);
            count += digits_mini_printf(format, o, ap);
        } else {
            write(1, &format[o], 1);
        }
    }
    va_end(ap);
    return count;
}
