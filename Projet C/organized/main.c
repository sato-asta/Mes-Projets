/*
** EPITECH PROJECT, 2025
** organized
** File description:
** principal function
*/

#include "main.h"
#include "shell.h"

int main(void)
{
    workshop_t ws;

    ws.list = NULL;
    ws.next_id = 0;
    return workshop_shell(&ws);
}
