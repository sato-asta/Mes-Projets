/*
** EPITECH PROJECT, 2025
** organized
** File description:
** lib
*/

#include "main.h"

void my_put_char(char c)
{
    write(STDOUT_FILENO, &c, 1);
}
