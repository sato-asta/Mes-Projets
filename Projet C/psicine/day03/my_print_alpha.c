/*
** EPITECH PROJECT, 2025
** aaaaaaaaaaaaadadafaf
** File description:
** aaa
*/

#include <unistd.h>

int my_putchar(char c);

int my_print_alpha(void)
{
    for (int i = 97; i <= 122; i++) {
        my_putchar(i);
    }
    my_putchar('\n');
    return (0);
}
