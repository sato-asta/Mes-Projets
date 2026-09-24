/*
** EPITECH PROJECT, 2025
** my_hunter
** File description:
** lib
*/

#include "../include/main.h"
#include <unistd.h>

int print_help(void)
{
    const char *msg =
        "my_hunter - small duck hunt game\n"
        "Usage: ./my_hunter [-h]\n"
        "Controls:\n"
        "  - Left click: shoot duck\n"
        "  - Close window button or ESC: quit\n";

    write(1, msg, my_strlen(msg));
    return 0;
}
