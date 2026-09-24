/*
** EPITECH PROJECT, 2025
** mytop
** File description:
** input handler
*/

#include <ncurses.h>
#include <stdlib.h>
#include "main.h"
#include "value.h"
#include "input.h"

const input_array_t array[6] = {
    {.f = win_close, .input = 113},
    {.f = scroll_top, .input = KEY_UP},
    {.f = scroll_bottom, .input = KEY_DOWN},
    {.f = handle_resize, .input = KEY_RESIZE},
    {.f = p1test, .input = KEY_BACKSPACE},
    {.f = NULL, .input = 0},
};

int input_handler(app_t *app)
{
    int currentInput = getch();

    if (currentInput == ERR)
        return false;
    for (int i = 0; array[i].f; i++) {
        if (array[i].input == currentInput) {
            array[i].f(app);
        }
    }
    return true;
}
