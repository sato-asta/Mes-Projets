/*
** EPITECH PROJECT, 2025
** my put double
** File description:
** lib
*/

#include "../../include/main.h"

static void handle_missing_digit(int nb)
{
    int digits = 0;
    int temp = nb;

    if (temp == 0)
        digits = 1;
    else {
        while (temp > 0) {
            temp /= 10;
            digits++;
        }
    }
    for (int i = digits; i < 6; i++) {
        my_put_char('0');
    }
}

int my_put_double(double nb)
{
    int entier = (int)nb;
    double deci = nb - entier;
    int decimal_part;

    if (deci >= 0) {
        decimal_part = (int)(deci * 1000000 + 0.5);
    } else decimal_part = (int)(-deci * 1000000 + 0.5);
    if (decimal_part >= 1000000) {
        if (entier > 0) {
            entier = entier + 1;
        } else (entier = entier - 1);
        decimal_part = 0;
    }
    my_put_nbr(entier);
    my_put_char('.');
    handle_missing_digit(decimal_part);
    my_put_nbr(decimal_part);
    return 0;
}
