/*
** EPITECH PROJECT, 2025
** setting_up
** File description:
** lib
*/

#include <stdlib.h>
#include "../include/main.h"

void free_board(board_t *b)
{
    if (!b)
        return;
    if (b->data)
        free(b->data);
    b->data = NULL;
    b->width = 0;
    b->height = 0;
}
