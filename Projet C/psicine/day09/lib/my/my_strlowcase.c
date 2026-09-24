/*
** EPITECH PROJECT, 2025
** vuhsuivb
** File description:
** vkbydsyg
*/

char *my_strlowcase(char *str)
{
    for (int i = 0; str[i] != '\0'; i++) {
        if (str[i] >= 'A' && str[i] <= 'Z')
            str[i] += 32;
    }
    return str;
}
