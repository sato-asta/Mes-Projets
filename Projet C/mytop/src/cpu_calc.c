/*
** EPITECH PROJECT, 2025
** mytop
** File description:
** CPU percentage calculation
*/

#include "../include/system_info.h"

static void set_zero_cpu(system_info_t *info)
{
    info->cpu_us = 0.0;
    info->cpu_sy = 0.0;
    info->cpu_ni = 0.0;
    info->cpu_id = 100.0;
    info->cpu_wa = 0.0;
    info->cpu_hi = 0.0;
    info->cpu_si = 0.0;
    info->cpu_st = 0.0;
}

static void calc_cpu_percent(system_info_t *info, unsigned long total_diff)
{
    info->cpu_us = 100.0f * (info->curr_user - info->prev_user) /
        total_diff;
    info->cpu_sy = 100.0f * (info->curr_system - info->prev_system) /
        total_diff;
    info->cpu_ni = 100.0f * (info->curr_nice - info->prev_nice) /
        total_diff;
    info->cpu_id = 100.0f * (info->curr_idle - info->prev_idle) /
        total_diff;
    info->cpu_wa = 100.0f * (info->curr_iowait - info->prev_iowait) /
        total_diff;
    info->cpu_hi = 100.0f * (info->curr_irq - info->prev_irq) /
        total_diff;
    info->cpu_si = 100.0f * (info->curr_softirq - info->prev_softirq) /
        total_diff;
    info->cpu_st = 100.0f * (info->curr_steal - info->prev_steal) /
        total_diff;
}

void calculate_cpu_percentages(system_info_t *info)
{
    unsigned long total_diff;

    total_diff = info->curr_total - info->prev_total;
    if (total_diff == 0) {
        set_zero_cpu(info);
        return;
    }
    calc_cpu_percent(info, total_diff);
}
