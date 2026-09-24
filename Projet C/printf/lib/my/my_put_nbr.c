/*
** EPITECH PROJECT, 2025
** TESSSSST
** File description:
** BLA BLA BLA
*/
#include <unistd.h>

int my_put_nbr(int nb)
{
    int character;
    int count = 0;

    if (nb < 0) {
        character = '-';
        write(1, &character, 1);
        nb = -nb;
        count += 1;
    }
    if (nb >= 10) {
        count += my_put_nbr(nb / 10);
    }
    character = (nb % 10) + '0';
    write(1, &character, 1);
    count += 1;
    return count;
}

int my_put_unsigned_nbr(unsigned int nb)
{
    char character;
    int count = 0;

    if (nb < 0) {
        character = '-';
        write(1, &character, 1);
        nb = -nb;
        count += 1;
    }
    if (nb >= 10) {
        count += my_put_unsigned_nbr(nb / 10);
    }
    character = (nb % 10) + '0';
    write(1, &character, 1);
    count += 1;
    return count;
}
