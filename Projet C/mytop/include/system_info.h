/*
** EPITECH PROJECT, 2025
** mytop
** File description:
** system_info header
*/

#ifndef SYSTEM_INFO_H
    #define SYSTEM_INFO_H

typedef struct {
    float load_1min;
    float load_5min;
    float load_15min;
    long uptime_seconds;
    int total_tasks;
    int running_tasks;
    int sleeping_tasks;
    int stopped_tasks;
    int zombie_tasks;
    unsigned long prev_user;
    unsigned long prev_nice;
    unsigned long prev_system;
    unsigned long prev_idle;
    unsigned long prev_iowait;
    unsigned long prev_irq;
    unsigned long prev_softirq;
    unsigned long prev_steal;
    unsigned long prev_total;
    unsigned long curr_user;
    unsigned long curr_nice;
    unsigned long curr_system;
    unsigned long curr_idle;
    unsigned long curr_iowait;
    unsigned long curr_irq;
    unsigned long curr_softirq;
    unsigned long curr_steal;
    unsigned long curr_total;
    float cpu_us;
    float cpu_sy;
    float cpu_ni;
    float cpu_id;
    float cpu_wa;
    float cpu_hi;
    float cpu_si;
    float cpu_st;
    unsigned long mem_total;
    unsigned long mem_free;
    unsigned long mem_available;
    unsigned long mem_buffers;
    unsigned long mem_cached;
    unsigned long mem_used;
    unsigned long mem_SReclaimable;
    unsigned long swap_total;
    unsigned long swap_free;
    unsigned long swap_used;
} system_info_t;

void read_system_info(system_info_t *info);
void read_loadavg(system_info_t *info);
void read_uptime(system_info_t *info);
void read_cpu_stats(system_info_t *info);
void calculate_cpu_percentages(system_info_t *info);
void read_meminfo(system_info_t *info);
void count_processes(system_info_t *info);
void update_cpu(system_info_t *info);

#endif
