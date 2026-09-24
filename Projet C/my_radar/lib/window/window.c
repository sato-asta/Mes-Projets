/*
** EPITECH PROJECT, 2025
** my_radar
** File description:
** lib
*/

#include "main.h"
#include <stdlib.h>

sfRenderWindow *create_window(window_t *settings)
{
    sfVideoMode mode = {settings->w, settings->h, 32};
    sfRenderWindow *win = sfRenderWindow_create(
        mode,
        "my_radar",
        settings->fullscreen ? sfFullscreen : (sfResize | sfClose),
        NULL
    );

    if (!win)
        return NULL;
    sfRenderWindow_setFramerateLimit(win, settings->fps);
    return win;
}

void destroy_window(sfRenderWindow *win)
{
    if (win)
        sfRenderWindow_destroy(win);
}
