/*
** EPITECH PROJECT, 2025
** mytop
** File description:
** process information reader
*/
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static char *search_info(char *line)
{
    char *after_name = strrchr(line, ')');
    int index = 3;
    char *search = NULL;
    char *NI = NULL;

    after_name++;
    search = strtok(after_name, " ");
    while (search) {
        if (index == 19) {
            NI = strdup(search);
            break;
        }
        index++;
        search = strtok(NULL, " ");
    }
    return NI;
}

char *get_ni(char *PID)
{
    char *path = malloc(strlen(PID) + strlen("/proc/") + strlen("/stat") + 1);
    FILE *stat = NULL;
    char *NI = NULL;
    char line[256];

    sprintf(path, "/proc/%s/stat", PID);
    stat = fopen(path, "r");
    if (!stat) {
        free(path);
        return NULL;
    }
    fgets(line, sizeof(line), stat);
    NI = search_info(line);
    free(path);
    fclose(stat);
    return NI;
}
