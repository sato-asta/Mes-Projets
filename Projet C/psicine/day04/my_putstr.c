/*
** EPITECH PROJECT, 2025
** my_putstr
** File description:
** exercise 2
*/

#include <unistd.h>

void my_putchar(char c);

int my_putstr(char const *str)
{
    int i;

    i = 0;
    while (str[i] != '\0') {
        my_putchar(str[i]);
        i++;
    }
    return (0);
}
