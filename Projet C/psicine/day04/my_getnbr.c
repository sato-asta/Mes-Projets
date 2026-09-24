/*
** EPITECH PROJECT, 2025
** my_getnbr
** File description:
** my_getnbr 5
*/

#include <stdio.h>

int char_to_int(char const *str, int i)
{
    int res;

    while (str[i] >= '0' && str[i] <= '9') {
        res = (res * 10) + (str[i] - 48);
        i++;
    }
    return (res);
}

int my_getnbr(char const *str)
{
    int i = 0;
    int res;

    while (str[i] < '0' || str[i] > '9')
        i++;
    res = char_to_int(str, i);
    if (str[i - 1] == '-') {
        res = res * - 1;
        if (res < -98545)
            return (0);
    }
    return (res);
}
