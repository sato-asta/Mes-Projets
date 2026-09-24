/*
** EPITECH PROJECT, 2025
** put char
** File description:
** write
*/

#include <unistd.h>

int my_put_char(char c)
{
    write(1, &c, 1);
    return 1;
}
