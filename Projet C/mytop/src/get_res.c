/*
** EPITECH PROJECT, 2025
** mytop
** File description:
** process information reader
*/
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "../include/main.h"
#include "../include/value.h"

static char *search_info(char *line)
{
    char *after_name = strrchr(line, ':');
    char RES[32];

    after_name++;
    if (sscanf(after_name, "%31s kB", RES) != 1)
        return strdup("0");
    return strdup(RES);
}

static char *get_res_value(char *PID)
{
    char *path = malloc(strlen(PID) + strlen("/proc/") + strlen("/stat") + 1);
    FILE *stat = NULL;
    char *RES = NULL;
    char line[256];

    sprintf(path, "/proc/%s/status", PID);
    stat = fopen(path, "r");
    if (!stat) {
        free(path);
        return NULL;
    }
    while (fgets(line, sizeof(line), stat)) {
        if (strncmp(line, "VmRSS:", 6) == 0) {
            break;
        }
    }
    RES = search_info(line);
    fclose(stat);
    free(path);
    return RES;
}

char *get_res(char *PID)
{
    char *RES = get_res_value(PID);

    return RES;
}
