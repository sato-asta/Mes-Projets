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
    char *after_name = strrchr(line, ')');
    char *STATE = NULL;

    after_name++;
    STATE = strtok(after_name, " ");
    return strdup(STATE);
}

static char *get_state_value(char *PID)
{
    char *path = malloc(strlen(PID) + strlen("/proc/") + strlen("/stat") + 1);
    FILE *stat = NULL;
    char *VIRT = NULL;
    char line[256];

    sprintf(path, "/proc/%s/stat", PID);
    stat = fopen(path, "r");
    if (!stat) {
        free(path);
        return NULL;
    }
    fgets(line, sizeof(line), stat);
    VIRT = search_info(line);
    free(path);
    fclose(stat);
    return VIRT;
}

char *get_state(char *PID)
{
    char *STATE = get_state_value(PID);

    if (!STATE)
        return NULL;
    return STATE;
}
