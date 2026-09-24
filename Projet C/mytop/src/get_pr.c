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
    char *PR = NULL;

    after_name++;
    search = strtok(after_name, " ");
    while (search) {
        if (index == 18) {
            PR = strdup(search);
            break;
        }
        index++;
        search = strtok(NULL, " ");
    }
    return PR;
}

char *get_br(char *PID)
{
    char *path = malloc(strlen(PID) + strlen("/proc/") + strlen("/stat") + 1);
    FILE *stat = NULL;
    char *PR = NULL;
    char line[256];

    sprintf(path, "/proc/%s/stat", PID);
    stat = fopen(path, "r");
    if (!stat) {
        free(path);
        return NULL;
    }
    fgets(line, sizeof(line), stat);
    PR = search_info(line);
    fclose(stat);
    free(path);
    return PR;
}
