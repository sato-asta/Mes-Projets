/*
** EPITECH PROJECT, 2025
** récursive
** File description:
** lib
*/

#include <dirent.h>
#include <sys/stat.h>
#include <stdlib.h>
#include "../include/main.h"

static void print_path_header(char *path)
{
    my_put_str(path);
    my_put_char(':');
    my_put_char('\n');
}

int build_fullpath(char *dest, const char *dir, const char *name)
{
    if (my_strlen(dir) + 1 + my_strlen(name) >= 1023)
        return 0;
    my_str_cpy(dest, (char *)dir);
    my_str_cat(dest, "/");
    my_str_cat(dest, (char *)name);
    return 1;
}

static void stat_and_recurse(char *path, struct dirent *entry, args_t *args)
{
    char fullpath[1024];
    struct stat st;

    if (!build_fullpath(fullpath, path, entry->d_name))
        return;
    if (stat(fullpath, &st) == -1)
        return;
    if (S_ISDIR(st.st_mode)) {
        my_put_char('\n');
        list_folder_r(fullpath, args);
    }
}

static void second_path(char *path, args_t *args)
{
    struct dirent *entry;
    DIR *dir = opendir(path);

    if (!dir)
        return;
    for (entry = readdir(dir); entry != NULL; entry = readdir(dir)) {
        if (!args->opt_a && entry->d_name[0] == '.')
            continue;
        if (my_strcmp(entry->d_name, ".") == 0 ||
            my_strcmp(entry->d_name, "..") == 0)
            continue;
        if (my_strlen(path) + 1 + my_strlen(entry->d_name) >= 1023)
            continue;
        stat_and_recurse(path, entry, args);
    }
    closedir(dir);
}

void list_folder_r(char *path, args_t *args)
{
    DIR *dir = opendir(path);
    struct dirent *entry;

    if (!dir) {
        my_put_str("Erreur : impossible d'ouvrir le dossier\n");
        return;
    }
    print_path_header(path);
    for (entry = readdir(dir); entry != NULL; entry = readdir(dir)) {
        if (!args->opt_a && entry->d_name[0] == '.')
            continue;
        my_put_str(entry->d_name);
        my_put_char('\n');
    }
    closedir(dir);
    dir = opendir(path);
    if (!dir)
        return;
    second_path(path, args);
    closedir(dir);
}
