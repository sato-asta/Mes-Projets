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
    int index = 3;
    char *search = NULL;
    char *VIRT = NULL;

    after_name++;
    search = strtok(after_name, " ");
    while (search) {
        if (index == 23) {
            VIRT = strdup(search);
            break;
        }
        index++;
        search = strtok(NULL, " ");
    }
    return VIRT;
}

static char *get_virt_value(char *PID)
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

char *get_virt(char *PID)
{
    char *virt = get_virt_value(PID);
    long unsigned int value = value_to_ko(virt);
    char *r_value;

    r_value = malloc(sizeof(char) * (int_len(value) + 1));
    sprintf(r_value, "%lu", value);
    free(virt);
    return r_value;
}
