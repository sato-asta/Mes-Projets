/*
** EPITECH PROJECT, 2025
** my_hunter
** File description:
** lib
*/

#include "../include/main.h"

int my_getnbr(char const *str)
{
    long nb = 0;
    int sign = 1;
    size_t i = 0;

    if (!str)
        return 0;
    if (str[i] == '-' || str[i] == '+') {
        if (str[i] == '-')
            sign = -1;
        i++;
    }
    for (; str[i] >= '0' && str[i] <= '9'; i++) {
        nb = nb * 10 + (str[i] - '0');
        if (nb * sign > 2147483647)
            return 2147483647;
        if (nb * sign < -2147483648)
            return -2147483648;
    }
    return (int)(nb * sign);
}
