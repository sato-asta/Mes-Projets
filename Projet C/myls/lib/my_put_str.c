/*
** EPITECH PROJECT, 2025
** put str
** File description:
** for lib
*/

#include <unistd.h>
#include "../include/main.h"

int my_put_str(char *str)
{
    write(1, str, my_strlen(str));
    return 0;
}
