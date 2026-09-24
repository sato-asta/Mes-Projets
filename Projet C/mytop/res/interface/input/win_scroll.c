/*
** EPITECH PROJECT, 2025
** mytop
** File description:
** input handler
*/
#include "../../../include/main.h"
#include <math.h>

static void display_line(pid_data_t *data, WINDOW *wind, int currentIndex)
{
    mvwprintw(wind, currentIndex,
        center_text(3, 4, data->pid), "%s", data->pid);
    mvwprintw(wind, currentIndex, 8, "%s", data->UTIL);
    mvwprintw(wind, currentIndex, 17, "%s", data->PR);
    mvwprintw(wind, currentIndex, 22, "%s", data->NI);
    mvwprintw(wind, currentIndex, 28, "%s", data->VIRT);
    mvwprintw(wind, currentIndex, 38, "%s", data->RES);
    mvwprintw(wind, currentIndex, 48, "%s", data->SHR);
    mvwprintw(wind, currentIndex, 58, "%s", data->S);
}

void refresh_list(app_t *app)
{
    int read_index = app->main->scroll;
    int h = 0;
    int w = 0;

    getmaxyx(app->main->window, h, w);
    werase(app->main->window);
    display_main_header(app->main->window);
    for (int i = 1; i < h; i++) {
        if (read_index < app->pid_count) {
            display_line(app->pid_list[read_index], app->main->window, i);
            read_index++;
        }
    }
}

int scroll_top(app_t *app)
{
    if (app && app->main->window) {
        if (app->main->scroll > 0) {
            app->main->scroll -= 1;
            refresh_list(app);
        }
        return 0;
    }
    return 84;
}

int scroll_bottom(app_t *app)
{
    if (app->main->window) {
        if (app->main->scroll < app->pid_count - 1) {
            app->main->scroll += 1;
            refresh_list(app);
        }
        return 0;
    }
    return 84;
}
