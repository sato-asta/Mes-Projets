/*
** EPITECH PROJECT, 2025
** mytop
** File description:
** process information reader
*/
#include <dirent.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <pwd.h>

#include "../../../include/main.h"

char *get_username(uid_t uid)
{
    struct passwd *pw = getpwuid(uid);

    if (!pw) {
        return NULL;
    }
    return strdup(pw->pw_name);
}

char *search_dat(char *path, char *dataname)
{
    FILE *status = fopen(path, "r");
    char line[256];
    char *uid = NULL;

    if (!status) {
        return NULL;
    }
    while (fgets(line, sizeof(line), status)) {
        if (strncmp(line, dataname, strlen(dataname)) == 0) {
            uid = malloc(strlen(line) + 1);
            strcpy(uid, line);
            break;
        }
    }
    fclose(status);
    return uid;
}

char *get_util(char *PID)
{
    char *PATH = malloc(strlen("/proc") + strlen(PID) + strlen("status") + 1);
    char *uid_line = NULL;
    char *util = NULL;
    int tmp = 0;

    sprintf(PATH, "/proc/%s/status", PID);
    uid_line = search_dat(PATH, "Uid:");
    if (uid_line == NULL) {
        free(PATH);
        free(uid_line);
        return NULL;
    }
    sscanf(uid_line, "Uid:\t%d", &tmp);
    util = set_util_name(get_username(tmp));
    free(uid_line);
    free(PATH);
    return util;
}
