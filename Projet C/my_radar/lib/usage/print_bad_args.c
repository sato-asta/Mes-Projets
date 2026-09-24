/*
** EPITECH PROJECT, 2025
** my_radar
** File description:
** lib
*/

#include "main.h"

int print_bad_args(void)
{
    const char *e = "./my_radar: bad arguments\n"
        "retry with -h\n";

    write(STDERR_FILENO, e, my_strlen(e));
    return 84;
}
