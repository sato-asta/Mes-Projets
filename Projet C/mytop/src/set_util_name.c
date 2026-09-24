/*
** EPITECH PROJECT, 2025
** mytop
** File description:
** process information reader
*/
#include <stdlib.h>
#include <string.h>
#include "../include/main.h"

char *set_util_name(char *name)
{
    char *racc_name = NULL;

    if (!name)
        return NULL;
    if (strlen(name) > 7) {
        racc_name = malloc(sizeof(char) * 9);
        strncpy(racc_name, name, 7);
        racc_name[7] = '+';
        racc_name[8] = '\0';
        free(name);
        return racc_name;
    }
    return name;
}
