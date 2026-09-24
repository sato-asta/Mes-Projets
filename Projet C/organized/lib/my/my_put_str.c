/*
** EPITECH PROJECT, 2025
** organized
** File description:
** lib
*/

#include "main.h"

void my_put_str(char *str)
{
    write(STDOUT_FILENO, str, my_strlen(str));
}
