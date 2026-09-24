/*
** EPITECH PROJECT, 2025
** myputchar
** File description:
** efffss
*/

#include <unistd.h>

void my_putchar(char c)
{
    write(1, &c, 1);
}
