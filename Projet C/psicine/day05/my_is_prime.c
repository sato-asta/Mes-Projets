/*
** EPITECH PROJECT, 2025
** myisprime
** File description:
** exercise 6
*/

#include <stdio.h>

int my_is_prime(int nb)
{
    while (nb <= 1)
        return (0);
    for (int i = 2; i * i <= nb; i++) {
        if (nb % i == 0)
            return (0);
    }
    return (1);
}
