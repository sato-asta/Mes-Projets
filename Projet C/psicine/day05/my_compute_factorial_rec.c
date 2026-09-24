/*
** EPITECH PROJECT, 2025
** mycomputefactorialrec
** File description:
** exercise 2
*/

#include <stdio.h>

int my_compute_factorial_rec(int nb)
{
    int result = 1;

    if (nb > 12)
        return (0);
    if (nb < 0)
        return (0);
    if (nb == 0) {
        return (1);
    }
    result = nb * my_compute_factorial_rec(nb - 1);
    return (result);
}
