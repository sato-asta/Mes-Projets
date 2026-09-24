/*
** EPITECH PROJECT, 2025
** str dup
** File description:
** lib
*/

#include <stdlib.h>
#include "../include/main.h"

char *my_strdup(const char *src)
{
    int len = my_strlen(src);
    char *copy = malloc(len + 1);

    if (!copy)
        return NULL;
    for (int i = 0; i <= len; i++)
        copy[i] = src[i];
    return copy;
}
