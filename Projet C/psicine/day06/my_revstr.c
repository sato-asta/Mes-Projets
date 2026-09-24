/*
** EPITECH PROJECT, 2025
** myrevstr
** File description:
** exercise 3
*/

#include <stdio.h>

char *my_revstr(char *str)
{
    int i = 0;
    char temp = 0;

    while (str[i] != '\0')
        i++;
    for (int u = 0; u < i; u++) {
        temp = str[i - 1];
        str[i - 1] = str[u];
        i -= 1;
        str[u] = temp;
    }
    return str;
}
