/*
** EPITECH PROJECT, 2025
** my_swap.c
** File description:
** exercise 1
*/

int my_swap(int *a, int *b)
{
    int k = 0;

    k = *a;
    *a = *b;
    *b = k;
    return (0);
}
