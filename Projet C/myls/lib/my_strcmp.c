/*
** EPITECH PROJECT, 2025
** copy str
** File description:
** lib
*/

#include "../include/main.h"

int my_strcmp(const char *s1, const char *s2)
{
    char c1 = 0;
    char c2 = 0;

    while (*s1 == *s2) {
        c1 = my_tolower((unsigned char)*s1);
        c2 = my_tolower((unsigned char)*s2);
        if (c1 != c2)
            return c1 - c2;
        s1++;
        s2++;
    }
    return (unsigned char)*s1 - (unsigned char)*s2;
}
