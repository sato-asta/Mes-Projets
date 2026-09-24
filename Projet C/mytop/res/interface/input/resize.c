/*
** EPITECH PROJECT, 2025
** mytop
** File description:
** input handler
*/
#include "../../../include/main.h"

int handle_resize(app_t *app)
{
    int h;
    int w;
    int max_scroll;
    int visible = 0;

    if (!app || !app->main || !app->main->window)
        return 84;
    getmaxyx(app->main->window, h, w);
    visible = h - 1;
    if (visible < 0)
        visible = 0;
    max_scroll = app->pid_count - visible;
    if (max_scroll < 0)
        max_scroll = 0;
    if (app->main->scroll > max_scroll)
        app->main->scroll = max_scroll;
    refresh_list(app);
    return 0;
}
