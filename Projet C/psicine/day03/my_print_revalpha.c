/*
** EPITECH PROJECT, 2025
** my_print_revalpha
** File description:
** aa
*/

#include <unistd.h>

int my_putchar(char c);

int my_print_revalpha(void)
{
    for (int i = 122; i >= 97; i--) {
        my_putchar(i);
    }
    my_putchar('\n');
    return (0);
}
