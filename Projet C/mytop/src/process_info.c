/*
** EPITECH PROJECT, 2025
** mytop
** File description:
** process information reader
*/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <dirent.h>
#include <ctype.h>
#include "../include/system_info.h"

static void update_task_state(char state, system_info_t *info)
{
    if (state == 'R')
        info->running_tasks = info->running_tasks + 1;
    if (state == 'S' || state == 'D')
        info->sleeping_tasks = info->sleeping_tasks + 1;
    if (state == 'T')
        info->stopped_tasks = info->stopped_tasks + 1;
    if (state == 'Z')
        info->zombie_tasks = info->zombie_tasks + 1;
}

static void copy_string(char *dest, char *src, int *j, int *i)
{
    *i = 0;
    while (src[*i]) {
        dest[*j] = src[*i];
        *j = *j + 1;
        *i = *i + 1;
    }
}

static void build_proc_path(char *dest, char *pid_name)
{
    int i;
    int j;

    j = 0;
    copy_string(dest, "/proc/", &j, &i);
    copy_string(dest, pid_name, &j, &i);
    copy_string(dest, "/stat", &j, &i);
    dest[j] = '\0';
}

static void read_process_state(char *pid_name, system_info_t *info)
{
    char path[512];
    char buffer[1024];
    FILE *fp;
    char *start;

    build_proc_path(path, pid_name);
    fp = fopen(path, "r");
    if (!fp)
        return;
    if (fgets(buffer, sizeof(buffer), fp)) {
        start = strchr(buffer, ')');
        if (start && *(start + 1) == ' ')
            update_task_state(*(start + 2), info);
    }
    fclose(fp);
}

static void init_task_counters(system_info_t *info)
{
    info->total_tasks = 0;
    info->running_tasks = 0;
    info->sleeping_tasks = 0;
    info->stopped_tasks = 0;
    info->zombie_tasks = 0;
}

void count_processes(system_info_t *info)
{
    DIR *dir;
    struct dirent *entry;

    dir = opendir("/proc");
    if (!dir)
        return;
    init_task_counters(info);
    entry = readdir(dir);
    while (entry != NULL) {
        if (isdigit(entry->d_name[0])) {
            info->total_tasks = info->total_tasks + 1;
            read_process_state(entry->d_name, info);
        }
        entry = readdir(dir);
    }
    closedir(dir);
}
