/*
** EPITECH PROJECT, 2025
** my_hunter
** File description:
** lib
*/

#include "../../include/main.h"

float get_delta(sfClock *clock)
{
    sfTime t = sfClock_getElapsedTime(clock);

    if (!clock)
        return 0.0f;
    return t.microseconds / 1000000.0f;
}

void reset_clock(sfClock *clock)
{
    if (!clock)
        return;
    sfClock_restart(clock);
}
