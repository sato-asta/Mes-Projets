/*
** EPITECH PROJECT, 2025
** voihsub
** File description:
** bmoluhsbui
*/

char *my_strlowcase(char *str)
{
    for (int i = 0; str[i] != '\0'; i++) {
        if (str[i] >= 'A' && str[i] <= 'Z')
            str[i] += 32;
    }
    return str;
}

static void upcase_char(char *str, int i)
{
    if (str[i + 1] >= 'a' && str[i + 1] <= 'z')
        str[i + 1] -= 32;
}

char *my_strcapitalize(char *str)
{
    str = my_strlowcase(str);
    if (str[0] >= 'a' && str[0] <= 'z')
        str[0] -= 32;
    for (int i = 0; str[i] != '\0'; i++) {
        if (str[i] == ' ' || str[i] == '+' || str[i] == '-') {
            upcase_char(str, i);
        }
    }
    return 0;
}
