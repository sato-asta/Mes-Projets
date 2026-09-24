/*
** EPITECH PROJECT, 2026
** lib
** File description:
** my putstr
*/

#include <unistd.h>
#include "../include/include.h"

static void my_putchar(char c)
{
    write(1, &c, 1);
}

void my_putstr(char const *str)
{
    write(1, str, my_strlen(str));
}
