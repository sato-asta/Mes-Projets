/*
** EPITECH PROJECT, 2025
** mytop
** File description:
** input handler
*/

#include <ctype.h>
#include <dirent.h>
#include <stdlib.h>
#include <string.h>
#include "../../../include/main.h"
#include "../../../include/value.h"

static void realloc_verif(void *ptr, DIR *current_dir)
{
    if (!ptr) {
        free(ptr);
        closedir(current_dir);
        exit(84);
    }
}

void free_old(app_t *app)
{
    if (app->pid_count <= 0)
        return;
    for (int i = 0; i < app->pid_count; i++) {
        free(app->pid_list[i]);
    }
}

void get_proc_list(app_t *app)
{
    DIR *proc = opendir("/proc");
    int count = 0;
    pid_data_t **pid_list = NULL;
    dirent_t *entry = NULL;

    if (!proc)
        exit(84);
    free_pid_data(app->pid_list, app->pid_count);
    entry = readdir(proc);
    while (entry != NULL) {
        if (isdigit((unsigned char) entry->d_name[0])) {
            pid_list = realloc(pid_list, sizeof(pid_data_t *) * (count + 1));
            pid_list[count] = new_pid_data(entry->d_name);
            count += 1;
        }
        entry = readdir(proc);
    }
    closedir(proc);
    app->pid_list = pid_list;
    app->pid_count = count;
}

void display_pid(char **pid_list, int max)
{
    int i = 0;

    while (i < max) {
        printf("PID = %s\n", pid_list[i]);
        i++;
    }
}
