/*
** EPITECH PROJECT, 2025
** for myls
** File description:
** lib
*/

#include <sys/stat.h>
#include <dirent.h>
#include <pwd.h>
#include <grp.h>
#include <stdlib.h>
#include <time.h>
#include <unistd.h>
#include "../include/main.h"

static void print_permissions(mode_t mode)
{
    if (S_ISDIR(mode))
        my_put_char('d');
    else if (S_ISLNK(mode))
        my_put_char('l');
    else
        my_put_char('-');
    my_put_char((mode & S_IRUSR) ? 'r' : '-');
    my_put_char((mode & S_IWUSR) ? 'w' : '-');
    my_put_char((mode & S_IXUSR) ? 'x' : '-');
    my_put_char((mode & S_IRGRP) ? 'r' : '-');
    my_put_char((mode & S_IWGRP) ? 'w' : '-');
    my_put_char((mode & S_IXGRP) ? 'x' : '-');
    my_put_char((mode & S_IROTH) ? 'r' : '-');
    my_put_char((mode & S_IWOTH) ? 'w' : '-');
    my_put_char((mode & S_IXOTH) ? 'x' : '-');
}

static void print_user_group(struct stat *st)
{
    struct passwd *pw = getpwuid(st->st_uid);
    struct group *gr = getgrgid(st->st_gid);

    my_put_char(' ');
    my_put_str(pw ? pw->pw_name : "?");
    my_put_char(' ');
    my_put_str(gr ? gr->gr_name : "?");
}

static void print_time(time_t mod_time)
{
    char *time_str = ctime(&mod_time);

    if (time_str) {
        for (int i = 0; time_str[i] && time_str[i] != '\n'; i++)
            my_put_char(time_str[i]);
    }
}

static void print_file_details(struct stat *st, char *filename)
{
    print_permissions(st->st_mode);
    my_put_char(' ');
    my_put_nbr(st->st_nlink);
    print_user_group(st);
    my_put_char(' ');
    my_put_nbr(st->st_size);
    my_put_char(' ');
    print_time(st->st_mtime);
    my_put_char(' ');
    my_put_str(filename);
    my_put_char('\n');
}

void print_file_info(char *path, char *filename)
{
    char fullpath[1024];
    struct stat st;

    my_str_cpy(fullpath, path);
    my_str_cat(fullpath, "/");
    my_str_cat(fullpath, filename);
    if (lstat(fullpath, &st) == -1)
        return;
    print_file_details(&st, filename);
}

size_t collect_filenames(char *path, args_t *args, char **filenames, size_t max)
{
    DIR *dir = opendir(path);
    struct dirent *entry;
    size_t count = 0;

    if (!dir) {
        my_put_str("Erreur : impossible d'ouvrir le dossier\n");
        return 0;
    }
    for (entry = readdir(dir); entry != NULL &&
        count < max; entry = readdir(dir)) {
        if (!args->opt_a && entry->d_name[0] == '.')
            continue;
        filenames[count] = my_strdup(entry->d_name);
        count++;
    }
    closedir(dir);
    return count;
}

void print_sorted_files(char *path, char *filenames[], size_t count)
{
    for (size_t i = 0; i < count; i++) {
        print_file_info(path, filenames[i]);
        free(filenames[i]);
    }
}

void list_folder_l(char *path, args_t *args)
{
    char *filenames[2000];
    size_t count = collect_filenames(path, args, filenames, 1024);

    sort_names(filenames, count);
    print_sorted_files(path, filenames, count);
}
