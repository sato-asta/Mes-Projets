/*
** EPITECH PROJECT, 2025
** mycomputepowerrec
** File description:
** exercise 4
*/

#include <stdio.h>

int my_compute_power_rec(int nb, int p)
{
    if (p > 31)
        return (0);
    if (p <= 0)
        return (1);
    if (p == 0)
        return (1);
    return nb * my_compute_power_rec(nb, p - 1);
}
