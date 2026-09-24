/*
** EPITECH PROJECT, 2025
** oihdrvuiubluvd
** File description:
** sulhhlubbudb
*/

#include <string.h>

int my_strlen8(char const *str)
{
    int i = 0;

    if (!str)
        return i;
    while (str[i] != '\0') {
        i++;
    }
    return (i);
}

int my_strncmp1(char const *s1, char const *s2, int n)
{
    for (int i = 0; s1[i] != '\0' && n != i; i++) {
        if (s1[i] != s2[i])
            return 1;
    }
    return 0;
}

char *my_strstr(char *str, const char *to_find)
{
    int n = my_strlen8(to_find);
    int o = my_strlen8(str);

    if (o < n)
        return NULL;
    for (int i = 0; str[i] != '\0'; i++) {
        if (my_strncmp1(&str[i], to_find, n) == 0)
            return &str[i];
    }
    return str;
}
