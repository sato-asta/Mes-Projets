/*
** EPITECH PROJECT, 2025
** options -t
** File description:
** my_ls
*/

#include "../include/main.h"

int options_t(args_t *args)
{
    for (int i = 0; i < args->path_count; i++) {
        list_folder_l(args->paths[i], args);
    }
    return 0;
}
