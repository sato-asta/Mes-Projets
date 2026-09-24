/*
** EPITECH PROJECT, 2025
** my_sudo
** File description:
** lib
*/

#include "main.h"

static char *get_shadow_hash(const char *username)
{
    FILE *fp = fopen("/etc/shadow", "r");
    char buff[1024];
    char *user = NULL;
    char *hash = NULL;

    if (!fp)
        return NULL;
    while (fgets(buff, sizeof(buff), fp)) {
        user = strtok(buff, ":");
        hash = strtok(NULL, ":");
        if (user && hash && strcmp(user, username) == 0) {
            fclose(fp);
            return strdup(hash);
        }
    }
    fclose(fp);
    return NULL;
}

static int prompt_password(const char *username, char *buf, long size)
{
    write(STDERR_FILENO, "[my_sudo] password for ", 23);
    write(STDERR_FILENO, username, my_strlen(username));
    write(STDERR_FILENO, ": ", 2);
    if (read(STDIN_FILENO, buf, size) <= 0)
        return FAILURE;
    buf[strcspn(buf, "\n")] = '\0';
    return SUCCESS;
}

static int check_password(const char *input, const char *stored)
{
    char *hash = crypt(input, stored);

    if (hash && my_strcmp(hash, stored) == 0)
        return SUCCESS;
    return FAILURE;
}

static void print_failure_message(void)
{
    write(STDOUT_FILENO,
        "my_sudo: 3 incorrect password attempts\n", 39);
}

int authenticate_user(const char *username)
{
    char buf[MAX_PASS_LEN] = {'\0'};
    int try = 3;
    char *stored = get_shadow_hash(username);

    if (!stored) {
        print_error("[my_sudo] error: cannot read shadow\n");
        return FAILURE;
    }
    while (try > 0) {
        if (prompt_password(username, buf, sizeof(buf)) == FAILURE)
            return FAILURE;
        if (check_password(buf, stored) == SUCCESS)
            return SUCCESS;
        write(STDERR_FILENO, "Sorry, try again.\n", 18);
        try--;
    }
    print_failure_message();
    return FAILURE;
}
