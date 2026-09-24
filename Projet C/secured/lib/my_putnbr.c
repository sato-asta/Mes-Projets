/*
** EPITECH PROJECT, 2026
** lib
** File description:
** my_putnbr
*/

#include <unistd.h>

void my_putnbr(long nb)
{
    char digit = 0;

    if (nb < 0) {
        write(1, "-", 1);
        nb = -nb;
    }
    if (nb >= 10)
        my_putnbr(nb / 10);
    digit = (nb % 10) + '0';
    write(1, &digit, 1);
}
