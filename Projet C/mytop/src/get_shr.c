/*
** EPITECH PROJECT, 2025
** mytop
** File description:
** process information reader
*/
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

#include "../include/main.h"
#include "../include/value.h"

static char *search_info(char *line)
{
    int index = 0;
    char *search = NULL;
    char *SHR = NULL;

    search = strtok(line, " ");
    while (search) {
        if (index == 2) {
            SHR = strdup(search);
            break;
        }
        index++;
        search = strtok(NULL, " ");
    }
    return SHR;
}

static char *get_virt_value(char *PID)
{
    char *path = malloc(strlen(PID) + strlen("/proc/") + strlen("/statm") + 1);
    FILE *stat = NULL;
    char *SHR = NULL;
    char line[256];

    sprintf(path, "/proc/%s/statm", PID);
    stat = fopen(path, "r");
    if (!stat) {
        free(path);
        return NULL;
    }
    fgets(line, sizeof(line), stat);
    SHR = search_info(line);
    free(path);
    fclose(stat);
    return SHR;
}

char *get_shr(char *PID)
{
    char *shr = get_virt_value(PID);
    long unsigned int value = value_to_raw(shr) * sysconf(_SC_PAGESIZE);
    char *r_value;

    value /= 1024;
    r_value = malloc(sizeof(char) * (int_len(value) + 1));
    sprintf(r_value, "%lu", value);
    free(shr);
    return r_value;
}
