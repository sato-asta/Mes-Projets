/*
** EPITECH PROJECT, 2025
** my printf
** File description:
** main file
*/

#ifndef MAIN_H
    #define MAIN_H

    #include <unistd.h>
    #include <stdlib.h>
    #include <fcntl.h>
    #include <pwd.h>
    #include <grp.h>
    #include <errno.h>
    #include <string.h>
    #include <stdio.h>
    #include <crypt.h>

    #define MAX_PASS_LEN 256
    #define FAILURE 84
    #define BUF_SIZE 9000
    #define HELP 1
    #define SUCCESS 0

struct sudo_options {
    char *user;
    char *group;
    char **command;
    int shell;
};

typedef struct passwd_fields {
    char *login;
    char *x;
    char *uid;
    char *gid;
    char *gecos;
    char *home;
    char *shell;
} passwd_fields_t;

typedef struct ids {
    uid_t uid;
    gid_t gid;
} ids_t;

int parse_args(int argc, char *argv[], struct sudo_options *opts);
void my_put_str(char *str);
int my_strlen(const char *str);
void print_help(void);
void print_error(char *msg);
int my_strcmp(const char *s1, const char *s2);
int authenticate_user(const char *username);
int user_is_sudoers(const char *username);
int execute_command(char **cmd);
int switch_identity(const char *user, const char *group);
char *get_users_shell(const char *user);
struct passwd *my_getpwnam(const char *name);
struct group *my_getgrnam(const char *name);
void print_usage(void);

#endif
