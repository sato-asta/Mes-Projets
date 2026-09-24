/*
** EPITECH PROJECT, 2025
** mytop
** File description:
** load average and uptime reader
*/

#include <stdio.h>
#include <stdlib.h>
#include "../include/system_info.h"

static void assign_load_value(int field, char *num_str, system_info_t *info)
{
    if (field == 0)
        info->load_1min = strtof(num_str, NULL);
    if (field == 1)
        info->load_5min = strtof(num_str, NULL);
    if (field == 2)
        info->load_15min = strtof(num_str, NULL);
}

static void process_load_field(
    char *num_str,
    int i,
    system_info_t *info,
    int *field)
{
    num_str[i] = '\0';
    assign_load_value(*field, num_str, info);
    *field = *field + 1;
}

static void parse_loadavg(char *line, system_info_t *info)
{
    char *ptr;
    char num_str[32];
    int i;
    int field;

    ptr = line;
    i = 0;
    field = 0;
    while (*ptr && field < 3) {
        if (*ptr != ' ' && *ptr != '\n') {
            num_str[i] = *ptr;
            i = i + 1;
            ptr = ptr + 1;
            continue;
        }
        if (i > 0)
            process_load_field(num_str, i, info, &field);
        i = 0;
        ptr = ptr + 1;
    }
}

void read_loadavg(system_info_t *info)
{
    FILE *fp;
    char buffer[256];

    fp = fopen("/proc/loadavg", "r");
    if (!fp)
        return;
    if (fgets(buffer, sizeof(buffer), fp))
        parse_loadavg(buffer, info);
    fclose(fp);
}

void read_uptime(system_info_t *info)
{
    FILE *fp;
    char buffer[256];
    char num_str[32];
    int i;

    fp = fopen("/proc/uptime", "r");
    i = 0;
    if (!fp)
        return;
    if (fgets(buffer, sizeof(buffer), fp)) {
        while (buffer[i] && buffer[i] != ' ') {
            num_str[i] = buffer[i];
            i = i + 1;
        }
        num_str[i] = '\0';
        info->uptime_seconds = (long)strtof(num_str, NULL);
    }
    fclose(fp);
}
