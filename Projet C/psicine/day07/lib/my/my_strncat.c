/*
** EPITECH PROJECT, 2025
** vuigqy
** File description:
** vuygsyugv
*/

#include <stdio.h>

int my_strlen(char const *str)
{
    int i;

    i = 0;
    while (str[i] != '\0') {
        i++;
    }
    return (i);
}

char *my_strncat(char *dest, char const *src, int nb)
{
    int i = 0;
    int n = nb;
    int max_len = my_strlen(dest);

    if (n > my_strlen(src)) {
        return 0;
    }
    for (; i < n; i++) {
        dest[max_len + i] = src[i];
    }
    dest[max_len + n] = '\0';
    return dest;
}
