/*
** EPITECH PROJECT, 2025
** mycomputefactorialit
** File description:
** exercise 1
*/

#include <stdio.h>

int my_compute_factorial_it(int nb)
{
    int result = nb;

    if (nb > 12)
        return (0);
    if (nb < 0)
        return (0);
    if (nb == 0)
        return (1);
    while (nb > 1) {
        result *= nb - 1;
        nb -= 1;
    }
    return (result);
}
