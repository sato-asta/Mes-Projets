/*
** EPITECH PROJECT, 2025
** mytop
** File description:
** system information reader
*/

#include "../include/system_info.h"

void read_system_info(system_info_t *info)
{
    read_loadavg(info);
    read_uptime(info);
    update_cpu(info);
    read_meminfo(info);
    count_processes(info);
}
