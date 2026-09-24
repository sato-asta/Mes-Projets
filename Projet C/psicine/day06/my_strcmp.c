/*
** EPITECH PROJECT, 2025
** mystrcmp
** File description:
** exercise 6
*/

int my_strlen5(char const *str)
{
    int i;

    i = 0;
    while (str[i] != '\0') {
        i++;
    }
    return (i);
}

int my_strcmp(char const *s1, char const *s2)
{
    if (my_strlen5(s1) < my_strlen5(s2))
        return -1;
    if (my_strlen5(s1) > my_strlen5(s2))
        return 1;
    for (int i = 0; s1[i] != '\0'; i++) {
        if (s1[i] != s2[i])
            return 1;
    }
    return 0;
}
