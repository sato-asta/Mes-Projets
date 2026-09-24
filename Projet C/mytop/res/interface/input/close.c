/*
** EPITECH PROJECT, 2025
** mytop
** File description:
** input handler
*/

#include <stdbool.h>
#include "main.h"

int win_close(app_t *app)
{
    app->isRunning = false;
    return 0;
}
