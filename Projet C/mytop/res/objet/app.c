/*
** EPITECH PROJECT, 2025
** mytop
** File description:
** app initialization
*/

#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "main.h"

app_t *new_app(void)
{
    app_t *app = malloc(sizeof(app_t));
    int h = 0;
    int w = 0;

    if (!app) {
        printf("[ERROR]: from app.c malloc failed exeption");
        exit(84);
    }
    app->isRunning = true;
    getmaxyx(stdscr, h, w);
    app->header = create_window(5, 0, 0, 0);
    app->main = create_window(50, COLS, 0, 6);
    memset(&app->sysinfo, 0, sizeof(system_info_t));
    return app;
}

void app_free(app_t *app)
{
    free(app->header->pos);
    free(app->header->size);
    delwin(app->header->window);
    free(app->header);
    free(app->main->pos);
    free(app->main->size);
    delwin(app->main->window);
    free(app->main);
    for (int i = 0; i < app->pid_count; i++) {
        free(app->pid_list[i]);
    }
    free(app->pid_list);
    free(app);
}
