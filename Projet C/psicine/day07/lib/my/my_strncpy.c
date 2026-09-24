/*
** EPITECH PROJECT, 2025
** ugiubdbvd
** File description:
** iuygiyvgsv
*/

#include <stdio.h>

char *my_strncpy(char *dest, char const *src, int n)
{
    for (int i = 0; i < n; i++) {
        dest[i] = src[i];
    }
    return dest;
}
