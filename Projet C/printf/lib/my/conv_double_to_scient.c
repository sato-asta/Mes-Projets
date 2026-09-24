/*
** EPITECH PROJECT, 2025
** double to scient
** File description:
** for flag e
*/

#include "../../include/main.h"

static void check_exposant(int *exposant)
{
    if (*exposant >= 0)
        my_put_char('+');
    if (*exposant < 0) {
        my_put_char('-');
        *exposant = *exposant * -1;
    }
    if (*exposant < 10)
        my_put_char('0');
}

int conv_double_to_scient(double nb)
{
    int exposant = 0;

    if (nb < 0) {
        my_put_char('-');
        nb = -nb;
    }
    while (nb >= 10.0) {
        nb = nb / 10;
        exposant++;
    }
    while (nb > 0 && nb <= 1.0) {
        nb = nb * 10;
        exposant--;
    }
    my_put_double(nb);
    my_put_char('e');
    check_exposant(&exposant);
    my_put_nbr(exposant);
    return 0;
}
