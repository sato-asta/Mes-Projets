/*
** EPITECH PROJECT, 2025
** my_strncopy
** File description:
** exercise 2
*/

#include <stdio.h>

char *my_strncpy(char *dest, char const *src, int n)
{
    for (int i = 0; i < n; i++) {
        dest[i] = src[i];
    }
    return dest;
}
