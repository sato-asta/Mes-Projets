/*
** EPITECH PROJECT, 2025
** my_strlen
** File description:
** exercise 3
*/

int my_strlen(char const *str)
{
    int i;

    i = 0;
    while (str[i] != '\0') {
        i++;
    }
    return (i);
}
