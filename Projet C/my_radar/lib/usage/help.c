/*
** EPITECH PROJECT, 2025
** my_radar
** File description:
** lib
*/

#include "main.h"

void print_help(void)
{
    const char *msg =
        "Air traffic simulation panel\n"
        "USAGE\n"
        "my_radar [OPTIONS] path_to_script\n"
        "path_to_script     The path to the script file.\n"
        "OPTIONS\n"
        "  -h print the usage and quit.\n"
        "USER INTERACTIONS\n"
        "  'L' key enable/disable hitboxes and areas.\n"
        "  'S' key enable/disable sprites.\n";

    write(STDOUT_FILENO, msg, my_strlen(msg));
}
