/*
** EPITECH PROJECT, 2025
** my_radar
** File description:
** lib
*/

int my_getnbr(const char *str)
{
    int i = 0;
    int sign = 1;
    int nb = 0;

    if (str[i] == '-') {
        sign = -1;
        i++;
    }
    while (str[i] >= '0' && str[i] <= '9') {
        nb = nb * 10 + (str[i] - '0');
        i++;
    }
    return nb * sign;
}
