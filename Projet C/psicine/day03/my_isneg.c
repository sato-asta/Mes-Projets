/*
** EPITECH PROJECT, 2025
** my_sineg
** File description:
** exercise 4
*/
#include <unistd.h>

int my_putchar(char c);

int my_isneg(int n)
{
    if (n >= 0){
        my_putchar('P');
    } else {
        my_putchar('N');
    }
    my_putchar('\n');
    return (0);
}
