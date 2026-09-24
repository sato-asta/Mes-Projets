/*
** EPITECH PROJECT, 2025
** print in alphabétique
** File description:
** lib
*/

#include "../include/main.h"

static void swap_if_needed(char **a, char **b)
{
    char *temp = *a;

    if (my_strcmp(*a, *b) > 0) {
        *a = *b;
        *b = temp;
    }
}

void sort_names(char **names, int count)
{
    int i = 0;
    int j;

    for (i = 0; i < count - 1; i++) {
        for (j = i + 1; j < count; j++)
            swap_if_needed(&names[i], &names[j]);
    }
}
