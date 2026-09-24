/*
** EPITECH PROJECT, 2025
** driouhdbhe
** File description:
** rbukdgwgvi
*/

#include <unistd.h>
#include "../../include/include.h"

int my_isneg(int n)
{
    if (n >= 0){
        my_putchar('P');
    } else {
        my_putchar('N');
    }
    my_putchar('\n');
    return (0);
}
