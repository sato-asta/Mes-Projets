/*
** EPITECH PROJECT, 2025
** vbqyv
** File description:
** yukggvqq
*/

int my_str_isnum(char const *str)
{
    int i = 0;

    for (; str[i] != '\0'; i++) {
        if (str[i] >= '1' && str[i] <= '9')
            return 1;
    }
    return 0;
}

