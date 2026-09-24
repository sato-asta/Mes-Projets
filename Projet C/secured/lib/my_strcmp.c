/*
** EPITECH PROJECT, 2025
** lib
** File description:
** strcmp
*/

int my_strcmp(char *s1, char *s2)
{
    while (*s1 && (*s1 == *s2)) {
        s1++;
        s2++;
    }
    return (unsigned char) *s1 - (unsigned char) *s2;
}
