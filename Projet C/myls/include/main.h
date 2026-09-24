/*
** EPITECH PROJECT, 2025
** my printf
** File description:
** main file
*/

#ifndef G_PSU_100_BDX_1_1_MY_LS_1_MAIN_H_
    #define G_PSU_100_BDX_1_1_MY_LS_1_MAIN_H_

//include
    #include <stdbool.h>
    #include <sys/stat.h>

// Structure
typedef struct {
    bool opt_a;
    bool opt_l;
    bool opt_R;
    bool opt_t;
    bool opt_d;
    char **paths;
    int path_count;
} args_t;

typedef int (*ls_func_t)(args_t *);

typedef struct {
    char c;
    ls_func_t f;
} ls_t;

typedef struct {
    char *name;
    time_t mtime;
} file_t;
typedef void (*folder_func_t)(char *path, args_t *args);

typedef struct entry_list_s {
    char name[256];
    struct entry_list_s *next;
} entry_list_t;

//options
int options_t(args_t *args);
int options_l(args_t *args);
int options_d(args_t *args);
int options_a(args_t *args);
int options_r(args_t *args);

//lib functions
int my_strlen(char const *str);
int my_put_str(char *str);
void my_put_char(char c);
int my_put_nbr(long nb);
int my_strcmp(const char *s1, const char *s2);
void list_folder(char *path, args_t *args);
char *my_str_cpy(char *dest, const char *src);
int my_tolower(int c);
char *my_str_cat(char *dest, const char *src);
void list_folder_l(char *path, args_t *args);
char *my_strchr(char *str, int c);
void print_file_info(char *path, char *filename);
char *my_strdup(const char *src);
void sort_names(char **names, int count);
void list_folder_t(char *path, args_t *args);
void list_folder_r(char *path, args_t *args);

//primary functions
int my_ls(int argc, char **argv);

#endif
