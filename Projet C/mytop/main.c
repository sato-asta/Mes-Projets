/*
** EPITECH PROJECT, 2025
** mytop
** File description:
** principal function
*/
#include "include/main.h"
#include <stdlib.h>
#include "include/value.h"

int main(int argc, char **argv)
{
    app_t *app = NULL;

    initscr();
    app = new_app();
    get_proc_list(app);
    init_window(app);
    app_free(app);
    return 0;
}
