/*
** EPITECH PROJECT, 2025
** double in hexa
** File description:
** flag a
*/

#include "../../include/main.h"

static int add_neg(double *nb)
{
    if (*nb < 0) {
        my_put_char('-');
        *nb = *nb * -1;
        return 1;
    }
    return 0;
}

static int print_hex(int digits, int uppercase)
{
    const char *hex = uppercase ? "0123456789ABCDEF" :
        "0123456789abcdef";

    my_put_char(hex[digits]);
    return 1;
}

static int print_nb(double nb, double frac, int uppercase, int exposant)
{
    int digits;
    int printed_char = 0;

    printed_char += my_put_str(uppercase ? "0X1." : "0x1.");
    frac = nb - 1.0;
    for (int i = 0; i < 13; i++) {
        frac = frac * 16;
        digits = (int)frac;
        printed_char += print_hex(digits, uppercase);
        frac = frac - digits;
    }
    my_put_char(uppercase ? 'P' : 'p');
    printed_char += 1;
    if (exposant >= 0) {
        my_put_char('+');
        printed_char += 1;
    }
    printed_char += my_put_nbr(exposant);
    return printed_char;
}

int my_put_double_in_hexa(double nb, int uppercase)
{
    int exposant = 0;
    double frac = 0;
    int printed_char = 0;

    if (nb == 0.0) {
        return my_put_str(uppercase ? "0X0P+0" : "0x0p+0");
    }
    printed_char += add_neg(&nb);
    while (nb > 2.0) {
        nb = nb / 2.0;
        exposant++;
    }
    while (nb < 1.0) {
        nb = nb * 2.0;
        exposant--;
    }
    printed_char += print_nb(nb, frac, uppercase, exposant);
    return printed_char;
}
