/*
** EPITECH PROJECT, 2025
** low case
** File description:
** lib
*/

int my_tolower(int c)
{
    if (c >= 'A' && c <= 'Z')
        return c + ('a' - 'A');
    return c;
}
