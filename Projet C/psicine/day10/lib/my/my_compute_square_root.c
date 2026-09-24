/*
** EPITECH PROJECT, 2025
** mycomputesquareroot
** File description:
** nvenvuvhzuvnzv
*/

#include <stdio.h>

int my_compute_square_root(int nb)
{
    int i = nb;

    while (nb != i * i) {
        i -= 1;
        if (i == 0)
            return (0);
        if (nb < 0)
            return (0);
    }
    return (i);
}
