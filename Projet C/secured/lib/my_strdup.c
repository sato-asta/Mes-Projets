/*
** EPITECH PROJECT, 2025
** lib
** File description:
** str dup
*/

#include <stdlib.h>
#include "../include/include.h"

char *my_strdup(char const *src)
{
    char *dup;
    int len = 0;
    int i = 0;

    if (!src)
        return NULL;
    len = my_strlen(src);
    dup = malloc(sizeof(char) * (len + 1));
    if (!dup)
        return NULL;
    while (i < len) {
        dup[i] = src[i];
        i++;
    }
    dup[i] = '\0';
    return dup;
}
