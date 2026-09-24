/*
** EPITECH PROJECT, 2025
** organized
** File description:
** lib
*/

#include "main.h"

void my_put_nbr(long nb)
{
    if (nb == 0) {
        my_put_char('0');
        return;
    }
    if (nb < 0) {
        my_put_char('-');
        nb = -nb;
    }
    if (nb / 10)
        my_put_nbr(nb / 10);
    my_put_char((nb % 10) + '0');
}
