/*
** EPITECH PROJECT, 2025
** put nbr
** File description:
** lib
*/

#include "../include/main.h"
#include <unistd.h>

int my_put_nbr(long nb)
{
    long c1 = 0;
    long c2 = 0;

    if (nb < 0) {
        nb = nb * -1;
        my_put_char('-');
    }
    if (nb >= 1) {
        c1 = nb / 10;
        c2 = nb % 10 + 48;
        my_put_nbr(c1);
        write(1, &c2, 1);
    }
    return 0;
}
