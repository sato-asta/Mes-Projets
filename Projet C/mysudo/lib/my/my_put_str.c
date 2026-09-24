/*
** EPITECH PROJECT, 2025
** my_sudo
** File description:
** lib
*/

#include <unistd.h>
#include "main.h"

void my_put_str(char *str)
{
    write(1, str, my_strlen(str));
}
