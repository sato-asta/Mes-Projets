/*
** EPITECH PROJECT, 2025
** mytop
** File description:
** input handler
*/
#include <string.h>
#include "../../../include/main.h"

void display_main_header(WINDOW *main)
{
    mvwprintw(main, 0, 4, "PID");
    mvwprintw(main, 0, 8, "UTIL.");
    mvwprintw(main, 0, 17, "PR");
    mvwprintw(main, 0, 22, "NI");
    mvwprintw(main, 0, 28, "VIRT");
    mvwprintw(main, 0, 38, "RES");
    mvwprintw(main, 0, 48, "SHR");
    mvwprintw(main, 0, 58, "S");
}

int center_text(int colStart, int colWidth, char *text)
{
    int len = colStart + (colWidth - strlen(text)) / 2;

    if (len < 0)
        return colStart;
    return len;
}
