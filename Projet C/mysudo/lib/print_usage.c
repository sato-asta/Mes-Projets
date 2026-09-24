/*
** EPITECH PROJECT, 2025
** my_sudo
** File description:
** lib
*/

#include "main.h"

void print_usage(void)
{
    const char *str = "usage: my_sudo -h | -K | -k | -V\n"
        "usage: my_sudo -v [-ABkNnS] [-g group] [-h host] [-p prompt] "
        "[-u user]\n"
        "usage: my_sudo -l [-ABkNnS] [-g group] [-h host] [-p prompt] "
        "[-U user]\n"
        "            [-u user] [command [arg ...]]\n"
        "usage: my_sudo [-ABbEHkNnPS] [-r role] [-t type] [-C num] "
        "[-D directory]\n"
        "            [-g group] [-h host] [-p prompt] [-R directory] "
        "[-T timeout]\n"
        "            [-u user] [VAR=value] [-i | -s] [command [arg ...]]\n"
        "usage: my_sudo -e [-ABkNnS] [-r role] [-t type] [-C num] "
        "[-D directory]\n"
        "            [-g group] [-h host] [-p prompt] [-R directory] "
        "[-T timeout]\n"
        "            [-u user] file ...\n";

    write(STDOUT_FILENO, str, my_strlen(str));
}
