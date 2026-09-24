/*
** EPITECH PROJECT, 2025
** my_ls
** File description:
** project 2
*/

#include <sys/types.h>
#include <dirent.h>
#include <stdbool.h>
#include <stdio.h>
#include "include/main.h"
#include <stdlib.h>
#include <sys/stat.h>

static void init_args(args_t *args, int argc)
{
    args->opt_a = false;
    args->opt_l = false;
    args->opt_R = false;
    args->opt_t = false;
    args->opt_d = false;
    args->path_count = 0;
    args->paths = malloc(sizeof(char *) * argc);
    if (!args->paths) {
        perror("malloc");
        exit(84);
    }
}

static void activate_flag(char c, args_t *args)
{
    if (c == 'a')
        args->opt_a = true;
    if (c == 'l')
        args->opt_l = true;
    if (c == 'R')
        args->opt_R = true;
    if (c == 't')
        args->opt_t = true;
    if (c == 'd')
        args->opt_d = true;
}

static bool is_valid_option(char c)
{
    const char *valid_opts = "alRtd";

    for (int i = 0; valid_opts[i] != '\0'; i++) {
        if (c == valid_opts[i])
            return true;
    }
    return false;
}

static void set_option_flags(char *opt_str, args_t *args)
{
    char c;

    for (int i = 1; opt_str[i] != '\0'; i++) {
        c = opt_str[i];
        if (!is_valid_option(c)) {
            my_put_str("my_ls: invalid option -- ");
            my_put_char(c);
            my_put_char('\n');
            exit(84);
        }
        activate_flag(c, args);
    }
}

static void parse_args(int argc, char **argv, args_t *args)
{
    init_args(args, argc);
    for (int i = 1; i < argc; i++) {
        if (argv[i][0] == '-' && argv[i][1] != '\0') {
            set_option_flags(argv[i], args);
        } else {
            args->paths[args->path_count] = argv[i];
            args->path_count++;
        }
    }
    if (args->path_count == 0) {
        args->paths[0] = ".";
        args->path_count = 1;
    }
}

static void print_path_header(char *path)
{
    my_put_str(path);
    my_put_char(':');
    my_put_char('\n');
}

static void print_single_file(char *path, char *filename, args_t *args)
{
    if (args->opt_l)
        print_file_info(path, filename);
    else {
        my_put_str(filename);
        my_put_char('\n');
    }
}

static folder_func_t select_folder_func(args_t *args)
{
    if (args->opt_t)
        return list_folder_t;
    if (args->opt_l)
        return list_folder_l;
    if (args->opt_R)
        return list_folder_r;
    return list_folder;
}

static void handle_path(char *path, int path_count, int index, args_t *args)
{
    struct stat st;
    bool is_dir;
    bool multiple = path_count > 1;
    folder_func_t folder_func;

    if (lstat(path, &st) == -1) {
        my_put_str("Error 84\n");
        return;
    }
    is_dir = S_ISDIR(st.st_mode);
    if (is_dir && !args->opt_d) {
        if (multiple)
            print_path_header(path);
        folder_func = select_folder_func(args);
        folder_func(path, args);
    } else {
        print_single_file(".", path, args);
    }
    if (multiple && index < path_count - 1)
        my_put_char('\n');
}

int my_ls(int argc, char **argv)
{
    args_t args;

    parse_args(argc, argv, &args);
    for (int i = 0; i < args.path_count; i++)
        handle_path(args.paths[i], args.path_count, i, &args);
    free(args.paths);
    return 0;
}
