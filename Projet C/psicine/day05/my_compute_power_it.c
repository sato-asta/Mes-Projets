/*
** EPITECH PROJECT, 2025
** mycomputepowerit
** File description:
** exercise 3
*/

#include <stdio.h>

int my_compute_power_it(int nb, int p)
{
    if (p == 0)
        return (1);
    if (p > 31)
        return (0);
    if (p <= 0)
        return (0);
    while (p > 1) {
        nb = nb * nb;
        p -= 1;
    }
    return (nb);
}
