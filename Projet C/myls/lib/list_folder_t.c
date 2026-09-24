/*
** EPITECH PROJECT, 2025
** date
** File description:
** my_ls
*/

#include <dirent.h>
#include "../include/main.h"
#include <stdlib.h>

bool fill_entry_from_dirent(char *path, struct dirent *entry, file_t *dest)
{
    struct stat st;
    char fullpath[1024];

    my_str_cpy(fullpath, path);
    my_str_cat(fullpath, "/");
    my_str_cat(fullpath, entry->d_name);
    if (lstat(fullpath, &st) == -1)
        return false;
    dest->name = my_strdup(entry->d_name);
    dest->mtime = st.st_mtime;
    return true;
}

size_t file_stats(char *path, args_t *args, file_t *entries, size_t max)
{
    DIR *dir = opendir(path);
    struct dirent *entry;
    size_t count = 0;

    if (!dir) {
        my_put_str("Erreur : impossible d'ouvrir le dossier\n");
        return 0;
    }
    for (entry = readdir(dir); entry && count < max; entry = readdir(dir)) {
        if (!args->opt_a && entry->d_name[0] == '.')
            continue;
        if (fill_entry_from_dirent(path, entry, &entries[count]))
            count++;
    }
    closedir(dir);
    return count;
}

void swap_entries_if_needed(file_t *a, file_t *b)
{
    file_t temp = *a;

    if (a->mtime < b->mtime) {
        *a = *b;
        *b = temp;
    }
}

void sort_entries_by_time(file_t *entries, size_t count)
{
    for (size_t i = 0; i < count - 1; i++) {
        for (size_t j = i + 1; j < count; j++) {
            swap_entries_if_needed(&entries[i], &entries[j]);
        }
    }
}

void list_folder_t(char *path, args_t *args)
{
    file_t entries[2000];
    size_t count = file_stats(path, args, entries, 1024);

    sort_entries_by_time(entries, count);
    for (size_t i = 0; i < count; i++) {
        if (args->opt_l)
            print_file_info(path, entries[i].name);
        else {
            my_put_str(entries[i].name);
            my_put_char('\n');
        }
        free(entries[i].name);
    }
}
