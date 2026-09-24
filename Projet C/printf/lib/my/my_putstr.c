/*
** EPITECH PROJECT, 2025
** TTTTTTTTTTTTTTT
** File description:
** TTTTTTTTTTTTTTTTTTT
*/
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int my_put_str(void *ptr)
{
    char *str = 0;
    int i = 0;

    if (ptr == NULL)
        return 84;
    if ((long)ptr < 1000)
        return 84;
    str = (char *)ptr;
    for (; str[i] != '\0'; i++) {
        write(1, &str[i], 1);
    }
    return i;
}
