/*
** EPITECH PROJECT, 2025
** my_sudo
** File description:
** lib
*/

#include "main.h"

char *get_users_shell(const char *user)
{
    struct passwd *pw = my_getpwnam(user);

    if (pw && pw->pw_shell && pw->pw_shell[0] != '\0')
        return pw->pw_shell;
    return "/bin/sh";
}
