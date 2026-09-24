/*
** EPITECH PROJECT, 2025
** str chr
** File description:
** lib
*/

#include <stddef.h>

char *my_strchr(char *str, int i)
{
    while (*str) {
        if (*str == (char)i)
            return str;
        str++;
    }
    if (i == '\0')
        return str;
    return NULL;
}
