/*
** EPITECH PROJECT, 2025
** strcat
** File description:
** exercise 2
*/

#include <stdio.h>

int my_strlen9(char const *str)
{
    int i;

    i = 0;
    while (str[i] != '\0') {
        i++;
    }
    return (i);
}

char *my_strcat(char *dest, char const *src)
{
    int i = 0;
    int n = 0;
    int max_len = my_strlen9(dest) + my_strlen9(src) + 1;

    while (dest[i] != '\0') {
        i++;
    }
    while (src[n] != '\0') {
        dest[i] = src[n];
        n++;
        i++;
    }
    return dest;
}
