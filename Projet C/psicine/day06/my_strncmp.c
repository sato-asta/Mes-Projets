/*
** EPITECH PROJECT, 2025
** mystrncmp
** File description:
** exercise 7
*/
#include <stdio.h>
#include <string.h>

int my_strncmp(char const *s1, char const *s2, int n)
{
    for (int i = 0; s1[i] != '\0' && n != i; i++) {
        if (s1[i] != s2[i])
            return 1;
    }
    return 0;
}
