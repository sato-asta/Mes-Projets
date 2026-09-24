/*
** EPITECH PROJECT, 2025
** TTTTTTTTTTTTTTT
** File description:
** EEEEEEEEEEEEEEEE
*/

int my_strlen(char const *str)
{
    int i = 0;

    if (!str) {
        return 0;
    }
    for (; str[i] != '\0'; i++);
    return i;
}
