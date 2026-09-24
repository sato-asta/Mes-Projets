/*
** EPITECH PROJECT, 2025
** my_sudo
** File description:
** principal function
*/

#include "main.h"

static int validate_args(int argc, int ret, struct sudo_options *opts)
{
    if (argc < 2) {
        print_usage();
        return HELP;
    }
    if (ret == FAILURE)
        return FAILURE;
    if (ret == 0)
        return 0;
    if (opts->command == NULL && !opts->shell) {
        print_error("[my_sudo] error: no command provided\n");
        return FAILURE;
    }
    return 0;
}

static int validate_user(const char *user)
{
    if (user == NULL) {
        print_error("[my_sudo] error: cannot determine user\n");
        return FAILURE;
    }
    if (user_is_sudoers(user) == 84) {
        print_error("[my_sudo] error: not good user\n");
        return FAILURE;
    }
    if (authenticate_user(user) == 84)
        return FAILURE;
    return 0;
}

static int change_identity(const char *user, const char *group)
{
    if (switch_identity(user, group) == 84) {
        print_error("[my_sudo] error: cannot switch identity\n");
        return FAILURE;
    }
    return 0;
}

static int run_command(struct sudo_options *opts)
{
    char *cmd[2];
    char *shell = NULL;

    if (opts->shell) {
        shell = get_users_shell(opts->user ? opts->user : "root");
        if (!shell)
            shell = "/bin/sh";
        cmd[0] = shell;
        cmd[1] = NULL;
        return execute_command(cmd);
    }
    return execute_command(opts->command);
}

int main(int argc, char **argv)
{
    struct sudo_options opts;
    int ret = parse_args(argc, argv, &opts);
    char *user = opts.user ? opts.user : getenv("USER");
    int check = 0;

    if (ret == HELP)
        return 0;
    if (ret == FAILURE)
        return FAILURE;
    check = validate_args(argc, ret, &opts);
    if (check == HELP)
        return FAILURE;
    if (check != 0)
        return check;
    if (validate_user(user) != 0)
        return FAILURE;
    if (change_identity(opts.user, opts.group) != 0)
        return FAILURE;
    return run_command(&opts);
}
