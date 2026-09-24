/*
** EPITECH PROJECT, 2025
** my_print_digit
** File description:
** aaaaa
*/
#include <unistd.h>


int my_putchar(char c);

int my_print_digits(void)
{
    for (int i = 48; i <= 57; i++) {
        my_putchar(i);
    }
    my_putchar('\n');
    return (0);
}
