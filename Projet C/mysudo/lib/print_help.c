/*
** EPITECH PROJECT, 2025
** my_sudo
** File description:
** lib
*/

#include <unistd.h>
#include "main.h"

void print_help(void)
{
    char *msg1 = "usage: ./my_sudo -h\n";
    char *msg2 = "usage: ./my_sudo [-ug] [command [args ...]]\n";

    write(STDOUT_FILENO, msg1, my_strlen(msg1));
    write(STDOUT_FILENO, msg2, my_strlen(msg2));
}
