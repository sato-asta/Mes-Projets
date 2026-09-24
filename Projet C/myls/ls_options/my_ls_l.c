/*
** EPITECH PROJECT, 2025
** options -l
** File description:
** my_ls
*/

#include <stdarg.h>
#include "../include/main.h"

int options_l(args_t *args)
{
    for (int i = 0; i < args->path_count; i++) {
        list_folder_l(args->paths[i], args);
    }
    return 0;
}
