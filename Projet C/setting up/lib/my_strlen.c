/*
** EPITECH PROJECT, 2025
** my_hunter
** File description:
** lib
*/

#include "../include/main.h"

size_t my_strlen(char const *str)
{
    size_t i = 0;

    if (!str)
        return 0;
    while (str[i] != '\0')
        i++;
    return i;
}
