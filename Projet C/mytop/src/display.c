/*
** EPITECH PROJECT, 2025
** mytop
** File description:
** display system
*/

#include <ncurses.h>
#include <time.h>
#include <stdio.h>

#include "../include/main.h"
#include "../include/system_info.h"

static void display_top_line(system_info_t *info, WINDOW *header)
{
    time_t now;
    struct tm *tm_info;
    char time_str[16];
    int uptime_hours;
    int uptime_mins;
    char buffer[256];

    now = time(NULL);
    tm_info = localtime(&now);
    strftime(time_str, sizeof(time_str), "%H:%M:%S", tm_info);
    uptime_hours = info->uptime_seconds / 3600;
    uptime_mins = (info->uptime_seconds % 3600) / 60;
    sprintf(buffer,
        "my_top - %s up %2d:%02d,  %d user,  load average: %.2f, %.2f, %.2f",
        time_str, uptime_hours, uptime_mins, 1,
        info->load_1min, info->load_5min, info->load_15min);
    wmove(header, 0, 0);
    wprintw(header, "%s", buffer);
    clrtoeol();
}

static void display_tasks_line(system_info_t *info, WINDOW *header)
{
    char buffer[256];

    sprintf(buffer, "Tasks: %3d total,   %d running, %3d sleeping,"
        "   %d stopped,   %d zombie", info->total_tasks,
        info->running_tasks, info->sleeping_tasks,
        info->stopped_tasks, info->zombie_tasks);
    wmove(header, 1, 0);
    wprintw(header, "%s", buffer);
    clrtoeol();
}

static void display_cpu_line(system_info_t *info, WINDOW *header)
{
    char buffer[256];

    sprintf(buffer, "%%Cpu(s): %4.1f us, %4.1f sy, %4.1f ni, "
        "%4.1f id, %4.1f wa, %4.1f hi, %4.1f si, %4.1f st",
        info->cpu_us, info->cpu_sy, info->cpu_ni, info->cpu_id,
        info->cpu_wa, info->cpu_hi, info->cpu_si, info->cpu_st);
    wmove(header, 2, 0);
    wprintw(header, "%s", buffer);
    clrtoeol();
}

static void display_mem_line(system_info_t *info, WINDOW *header)
{
    float mem_total_mib;
    float mem_free_mib;
    float mem_used_mib;
    float mem_buff_cache_mib;
    char buffer[256];

    mem_total_mib = info->mem_total / 1024.0;
    mem_free_mib = info->mem_free / 1024.0;
    mem_used_mib = info->mem_used / 1024.0;
    mem_buff_cache_mib = (info->mem_buffers + info->mem_cached) /
        1024.0;
    sprintf(buffer, "MiB Mem : %8.1f total, %8.1f free, "
        "%8.1f used, %8.1f buff/cache", mem_total_mib,
        mem_free_mib, mem_used_mib, mem_buff_cache_mib);
    wmove(header, 3, 0);
    wprintw(header, "%s", buffer);
    clrtoeol();
}

static void display_swap_line(system_info_t *info, WINDOW *header)
{
    float swap_total_mib = info->swap_total / 1024.0;
    float swap_free_mib = info->swap_free / 1024.0;
    float swap_used_mib = info->swap_used / 1024.0;
    float mem_avail_mib = info->mem_available / 1024.0;
    char buffer[256];

    sprintf(buffer,
        "MiB Swap: %8.1f total, %8.1f free, %8.1f used. %8.1f avail Mem",
        swap_total_mib, swap_free_mib, swap_used_mib, mem_avail_mib);
    wmove(header, 4, 0);
    wprintw(header, "%s", buffer);
    clrtoeol();
}

void display_system_header(app_t *app)
{
    system_info_t info = app->sysinfo;

    display_top_line(&info, app->header->window);
    display_tasks_line(&info, app->header->window);
    display_cpu_line(&info, app->header->window);
    display_mem_line(&info, app->header->window);
    display_swap_line(&info, app->header->window);
    wmove(app->header->window, 5, 0);
    clrtoeol();
}
