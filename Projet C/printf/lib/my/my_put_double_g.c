/*
** EPITECH PROJECT, 2025
** f et e
** File description:
** flag g
*/


#include "../../include/main.h"
#include "../../include/my_macro_abs.h"

static void delete_zero(int *decimal_part)
{
    while (*decimal_part % 10 == 0 && *decimal_part != 0)
        *decimal_part /= 10;
    if (*decimal_part != 0) {
    }
}

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

void get_number_for_double_g(int decimal_part)
{
    if (decimal_part != 0) {
        my_put_char('.');
        handle_missing_digit(decimal_part);
        delete_zero(&decimal_part);
        my_put_nbr(decimal_part);
    }
}

int my_put_double_f(double nb)
{
    int entier = (int)nb;
    double deci = nb - entier;
    int decimal_part;

    if (deci >= 0) {
        decimal_part = (int)(deci * 1000000 + 0.5);
    } else decimal_part = (int)(-deci * 1000000 + 0.5);
    if (decimal_part >= 1000000) {
        if (entier > 0)
            entier = entier + 1;
        else (entier = entier - 1);
        decimal_part = 0;
    }
    my_put_nbr(entier);
    get_number_for_double_g(decimal_part);
    return 0;
}

static void float_log_10(double nb, int *exp)
{
    while (nb < 1.0) {
        nb = nb * 10.0;
        exp--;
    }
}

static int get_log_10(double nb)
{
    int exp = 0;

    if (nb >= 10.0) {
        while (nb >= 10.0) {
            nb = nb / 10.0;
            exp++;
        }
    } else if (nb < 1.0) {
        float_log_10(nb, &exp);
    }
    return exp;
}

void my_put_double_g(double nb)
{
    int exp = 0;

    if (isnan(nb)) {
        my_put_str("nan");
        return;
    }
    if (isinf(nb)) {
        my_put_str(nb < 0 ? "-inf" : "inf");
        return;
    }
    if (nb == 0.0) {
        my_put_str("0");
        return;
    }
    exp = get_log_10(ABS(nb));
    if (exp < -4 || exp >= 6) {
        conv_double_to_scient(nb);
    } else {
        my_put_double_f(nb);
    }
}
