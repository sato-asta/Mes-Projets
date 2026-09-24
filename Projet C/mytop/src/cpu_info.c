/*
** EPITECH PROJECT, 2025
** mytop
** File description:
** CPU information reader
*/

#include <stdio.h>
#include <stdlib.h>
#include "../include/system_info.h"
#include <unistd.h>

void save_previous_cpu_stats(system_info_t *info)
{
    info->prev_user = info->curr_user;
    info->prev_nice = info->curr_nice;
    info->prev_system = info->curr_system;
    info->prev_idle = info->curr_idle;
    info->prev_iowait = info->curr_iowait;
    info->prev_irq = info->curr_irq;
    info->prev_softirq = info->curr_softirq;
    info->prev_steal = info->curr_steal;
    info->prev_total = info->curr_total;
}

static void assign_cpu_values(unsigned long *values, system_info_t *info)
{
    info->curr_user = values[0];
    info->curr_nice = values[1];
    info->curr_system = values[2];
    info->curr_idle = values[3];
    info->curr_iowait = values[4];
    info->curr_irq = values[5];
    info->curr_softirq = values[6];
    info->curr_steal = values[7];
    info->curr_total = info->curr_user + info->curr_nice +
        info->curr_system + info->curr_idle + info->curr_iowait +
        info->curr_irq + info->curr_softirq + info->curr_steal;
}

static void process_number(
    char *num_str,
    int i,
    unsigned long *values,
    int *field)
{
    num_str[i] = '\0';
    values[*field] = strtol(num_str, NULL, 10);
    *field = *field + 1;
}

static void extract_cpu_values(char *ptr, unsigned long *values)
{
    char num_str[32];
    int i;
    int field;

    i = 0;
    field = 0;
    while (*ptr && field < 8) {
        if (*ptr != ' ' && *ptr != '\n') {
            num_str[i] = *ptr;
            i = i + 1;
            ptr = ptr + 1;
            continue;
        }
        if (i > 0)
            process_number(num_str, i, values, &field);
        i = 0;
        ptr = ptr + 1;
    }
}

static void parse_cpu_line(char *buffer, system_info_t *info)
{
    char *ptr;
    unsigned long values[8];

    ptr = buffer;
    while (*ptr && *ptr != ' ')
        ptr = ptr + 1;
    ptr = ptr + 1;
    extract_cpu_values(ptr, values);
    assign_cpu_values(values, info);
}

void read_cpu_stats(system_info_t *info)
{
    FILE *fp;
    char buffer[256];

    fp = fopen("/proc/stat", "r");
    if (!fp)
        return;
    if (fgets(buffer, sizeof(buffer), fp)) {
        parse_cpu_line(buffer, info);
    }
    fclose(fp);
}

void update_cpu(system_info_t *info)
{
    read_cpu_stats(info);
    save_previous_cpu_stats(info);
    usleep(100000);
    read_cpu_stats(info);
    calculate_cpu_percentages(info);
    save_previous_cpu_stats(info);
}
