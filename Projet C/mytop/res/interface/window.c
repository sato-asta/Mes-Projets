/*
** EPITECH PROJECT, 2025
** mytop
** File description:
** window initialization
*/

#include <ncurses.h>
#include <time.h>
#include "input.h"
#include "main.h"
#include "system_info.h"

static void refresh_window(app_t *app)
{
    wrefresh(app->header->window);
    wrefresh(app->main->window);
}

static void init_params(app_t *app)
{
    cbreak();
    noecho();
    keypad(stdscr, TRUE);
    keypad(app->main->window, TRUE);
    nodelay(stdscr, TRUE);
    curs_set(0);
    read_system_info(&app->sysinfo);
}

void init_window(app_t *app)
{
    long last = time(NULL);
    long now = 0;
    double delta = 2;
    int refreshDelay = 2;

    init_params(app);
    while (app->isRunning) {
        now = time(NULL);
        input_handler(app);
        refresh_window(app);
        if (delta >= refreshDelay) {
            read_system_info(&app->sysinfo);
            display_system_header(app);
            get_proc_list(app);
            refresh_list(app);
            last = now;
        }
        delta = difftime(now, last);
    }
    endwin();
}
