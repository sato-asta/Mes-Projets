/*
** EPITECH PROJECT, 2025
** oragnized
** File description:
** lib
*/

#include "main.h"

char *my_strdup(const char *str)
{
    int len = my_strlen(str);
    char *dup = malloc(len + 1);

    if (dup == NULL)
        return NULL;
    for (int i = 0; i < len; i++)
        dup[i] = str[i];
    dup[len] = '\0';
    return dup;
}
