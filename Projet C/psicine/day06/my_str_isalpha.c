/*
** EPITECH PROJECT, 2025
** nueuvqv
** File description:
** uyfcqytjf
*/

int my_str_isalpha(char const *str)
{
    int i = 0;

    for (; str[i] != '\0'; i++) {
        if ((str[i] <= 'a' || str[i] >= 'z')
            && (str[i] <= 'A' || str[i] >= 'Z'))
            return 0;
    }
    return 1;
}
