/*
** EPITECH PROJECT, 2025
** copy str
** File description:
** lib
*/

char *my_str_cpy(char *dest, const char *src)
{
    int i = 0;

    while (src[i] != '\0') {
        dest[i] = src[i];
        i++;
    }
    dest[i] = '\0';
    return dest;
}
