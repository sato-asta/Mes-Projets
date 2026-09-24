/*
** EPITECH PROJECT, 2025
** my_sudo
** File description:
** lib
*/

#include <string.h>
#include "main.h"

static int handle_flag(int argc, char **argv, int *i,
    struct sudo_options *opts)
{
    if (strcmp(argv[*i], "-u") == 0 && *i + 1 < argc) {
        opts->user = argv[*i + 1];
        (*i)++;
        return 1;
    }
    if (strcmp(argv[*i], "-g") == 0 && *i + 1 < argc) {
        opts->group = argv[*i + 1];
        (*i)++;
        return 1;
    }
    return 0;
}

int parse_args(int argc, char **argv, struct sudo_options *opts)
{
    opts->user = NULL;
    opts->group = NULL;
    opts->command = NULL;
    opts->shell = 0;
    for (int i = 1; i < argc; i++) {
        if (strcmp(argv[i], "-h") == 0 ||
            strcmp(argv[i], "--help") == 0) {
            print_help();
            return HELP;
        }
        if (strcmp(argv[i], "-s") == 0) {
            opts->shell = 1;
            continue;
        }
        if (!handle_flag(argc, argv, &i, opts)) {
            opts->command = &argv[i];
            break;
        }
    }
    return 0;
}
