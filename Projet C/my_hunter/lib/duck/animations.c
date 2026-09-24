/*
** EPITECH PROJECT, 2025
** my_hunter
** File description:
** lib
*/

#include "../../include/main.h"

void advance_animation(duck_t *d, sfClock *clock)
{
    float elapsed = get_delta(clock);

    if (!d || !clock || !d->spr)
        return;
    if (elapsed < d->frame_time)
        return;
    d->frame.left += d->frame.width;
    if ((d->frame.left / d->frame.width) >= (int)d->frames_count)
        d->frame.left = 0;
    sfSprite_setTextureRect(d->spr, d->frame);
    reset_clock(clock);
}
