/*
** EPITECH PROJECT, 2025
** mytop
** File description:
** process information reader
*/
#include <stdlib.h>
#include "../../include/main.h"

void free_pid_data(pid_data_t **data, int len)
{
    if (!data || len == 0)
        return;
    for (int i = 0; i < len; i++) {
        free(data[i]->UTIL);
        free(data[i]->PR);
        free(data[i]->NI);
        free(data[i]->VIRT);
        free(data[i]->RES);
        free(data[i]->SHR);
        free(data[i]->S);
    }
}

static void integrity_check(pid_data_t *data)
{
    if (!data->UTIL || !data->pid || !data->PR || !data->NI
        || !data->VIRT || !data->RES || !data->SHR || !data->S) {
        exit(84);
    }
}

pid_data_t *new_pid_data(char *PID)
{
    pid_data_t *new = malloc(sizeof(pid_data_t));

    if (!new)
        return NULL;
    new->pid = PID;
    new->UTIL = get_util(PID);
    new->PR = get_br(PID);
    new->NI = get_ni(PID);
    new->VIRT = get_virt(PID);
    new->RES = get_res(PID);
    new->SHR = get_shr(PID);
    new->S = get_state(PID);
    integrity_check(new);
    return new;
}
