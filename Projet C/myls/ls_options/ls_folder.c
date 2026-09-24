/*
** EPITECH PROJECT, 2025
** ouvrir directory
** File description:
** my_ls
*/

#include <dirent.h>
#include "../include/main.h"
#include <stdio.h>
#include <stdlib.h>

int fill_names(char **names, DIR *dir, int max_files, args_t *args)
{
    struct dirent *entry;
    int count = 0;

    for (entry = readdir(dir); entry != NULL &&
        count < max_files; entry = readdir(dir)) {
        if (!args->opt_a && entry->d_name[0] == '.') {
            continue;
        }
        names[count] = malloc(my_strlen(entry->d_name) + 1);
        if (!names[count]) {
            continue;
        }
        my_str_cpy(names[count], entry->d_name);
        count++;
    }
    return count;
}

void list_folder(char *path, args_t *args)
{
    const int max_files = 2000;
    DIR *dir = opendir(path);
    char *names[2000];
    int count;
    int i;

    if (!dir) {
        my_put_str("Erreur : impossible d'ouvrir le dossier\n");
        return;
    }
    count = fill_names(names, dir, max_files, args);
    closedir(dir);
    sort_names(names, count);
    for (i = 0; i < count; i++) {
        my_put_str(names[i]);
        my_put_char('\n');
        free(names[i]);
    }
}
