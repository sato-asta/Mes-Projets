/*
** EPITECH PROJECT, 2025
** aaadadavvsvsvsv
** File description:
** aaddad vvvzvsvs
*/

#include <unistd.h>

void my_putchar(char c);

void displays(int a, int b)
{
    for (int c = 2; c <= 9; c++) {
        my_putchar(a + 48);
        my_putchar(b + 48);
        my_putchar(c + 48);
        if (!(a == 7 && b == 8 && c == 9)) {
            my_putchar(',');
            my_putchar(' ');
        }
    }
}

int my_print_comb(void)
{
    for (int a = 0; a <= 7; a++) {
        for (int b = 1; b <= 8; b++) {
            displays(a, b);
        }
    }
    return (0);
}
