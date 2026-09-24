/*
** EPITECH PROJECT, 2025
** my_sudo
** File description:
** lib
*/

#include <unistd.h>
#include "main.h"

void print_error(char *msg)
{
    write(STDERR_FILENO, msg, my_strlen(msg));
}
