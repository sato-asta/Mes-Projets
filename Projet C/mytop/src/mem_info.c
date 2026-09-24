/*
** EPITECH PROJECT, 2025
** mytop
** File description:
** memory information reader
*/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "../include/system_info.h"

static void assign_mem_total(char *key, char *num_str, system_info_t *info)
{
    if (strcmp(key, "MemTotal") == 0)
        info->mem_total = strtol(num_str, NULL, 10);
    if (strcmp(key, "MemFree") == 0)
        info->mem_free = strtol(num_str, NULL, 10);
    if (strcmp(key, "MemAvailable") == 0)
        info->mem_available = strtol(num_str, NULL, 10);
}

static void assign_mem_buffers(char *key, char *num_str, system_info_t *info)
{
    if (strcmp(key, "Buffers") == 0)
        info->mem_buffers = strtol(num_str, NULL, 10);
    if (strcmp(key, "Cached") == 0)
        info->mem_cached = strtol(num_str, NULL, 10);
    if (strcmp(key, "SReclaimable") == 0)
        info->mem_SReclaimable = strtol(num_str, NULL, 10);
}

static void assign_swap(char *key, char *num_str, system_info_t *info)
{
    if (strcmp(key, "SwapTotal") == 0)
        info->swap_total = strtol(num_str, NULL, 10);
    if (strcmp(key, "SwapFree") == 0)
        info->swap_free = strtol(num_str, NULL, 10);
}

static void assign_mem_value(char *key, char *num_str, system_info_t *info)
{
    assign_mem_total(key, num_str, info);
    assign_mem_buffers(key, num_str, info);
    assign_swap(key, num_str, info);
}

static char *extract_key(char *buffer, char *key)
{
    int i;
    char *ptr;

    i = 0;
    ptr = buffer;
    while (*ptr && *ptr != ' ' && *ptr != ':') {
        key[i] = *ptr;
        i = i + 1;
        ptr = ptr + 1;
    }
    key[i] = '\0';
    return ptr;
}

static char *skip_separators(char *ptr)
{
    while (*ptr && (*ptr == ' ' || *ptr == ':'))
        ptr = ptr + 1;
    return ptr;
}

static void extract_number(char *ptr, char *num_str)
{
    int j;

    j = 0;
    while (*ptr && *ptr >= '0' && *ptr <= '9') {
        num_str[j] = *ptr;
        j = j + 1;
        ptr = ptr + 1;
    }
    num_str[j] = '\0';
}

static void extract_key_value(char *buffer, char *key, char *num_str)
{
    char *ptr;

    ptr = extract_key(buffer, key);
    ptr = skip_separators(ptr);
    extract_number(ptr, num_str);
}

static void parse_meminfo_line(char *buffer, system_info_t *info)
{
    char key[64];
    char num_str[32];

    extract_key_value(buffer, key, num_str);
    if (num_str[0] == '\0')
        return;
    assign_mem_value(key, num_str, info);
}

void read_meminfo(system_info_t *info)
{
    FILE *fp;
    char buffer[256];
    unsigned long buff_cache;

    fp = fopen("/proc/meminfo", "r");
    if (!fp)
        return;
    while (fgets(buffer, sizeof(buffer), fp))
        parse_meminfo_line(buffer, info);
    buff_cache = info->mem_cached +
        info->mem_SReclaimable +
        info->mem_buffers;
    info->mem_used = info->mem_total - info->mem_free -
        buff_cache;
    info->swap_used = info->swap_total - info->swap_free;
    fclose(fp);
}
