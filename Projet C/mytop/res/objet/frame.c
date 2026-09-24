/*
** EPITECH PROJECT, 2025
** mytop
** File description:
** input handler
*/

#include <ncurses.h>
#include <stdlib.h>

#include "../../include/main.h"

win_t *create_window(
    int height,
    int width,
    int posX,
    int posY)
{
    WINDOW *localwind;
    win_t *new = malloc(sizeof(win_t));

    localwind = newwin(height, width, posY, posX);
    if (!localwind)
        return false;
    new->window = localwind;
    new->size = new_ivector2(height, width);
    new->pos = new_ivector2(posX, posY);
    new->scroll = 0;
    return new;
}
