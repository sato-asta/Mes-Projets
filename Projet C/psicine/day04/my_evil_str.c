/*
** EPITECH PROJECT, 2025
** my_evil_str
** File description:
** exercise 4
*/

#include <stdio.h>

int my_strlen2(char const *str)
{
    int i = 0;

    while (str[i] != '\0') {
        i++;
    }
    return (0);
}

char *my_evil_str(char *str)
{
    int a;
    int b;
    char x;

    a = 0;
    b = my_strlen2(str) - 1;
    while (a < b) {
        x = str[a];
        str[a] = str[b];
        str[b] = x;
        a++;
        b--;
    }
    return (str);
}
