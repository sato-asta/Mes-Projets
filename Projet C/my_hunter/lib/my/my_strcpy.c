/*
** EPITECH PROJECT, 2025
** my_hunter
** File description:
** lib
*/

int my_strcpy(char *dest, const char *src)
{
    int i = 0;

    if (!dest || !src)
        return 0;
    while (src[i] != '\0') {
        dest[i] = src[i];
        i++;
    }
    dest[i] = '\0';
    return i;
}
