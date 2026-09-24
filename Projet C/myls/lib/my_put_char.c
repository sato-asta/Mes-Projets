/*
** EPITECH PROJECT, 2025
** put char
** File description:
** lib
*/

#include <unistd.h>

void my_put_char(char c)
{
    write(1, &c, 1);
}
