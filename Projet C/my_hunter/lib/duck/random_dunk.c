/*
** EPITECH PROJECT, 2025
** my_hunter
** File description:
** lib
*/

#include <stdlib.h>
#include <time.h>
#include "../../include/main.h"

static float frandf(float a, float b)
{
    float t;

    if (b < a) {
        t = a;
        a = b;
        b = t;
    }
    return a + (float)rand() / (float)RAND_MAX * (b - a);
}

void duck_respawn_random(duck_t *d, unsigned win_w, unsigned win_h)
{
    float y;
    float minY = 64.f;
    float maxY = (float)win_h - d->size.y - 64.f;

    if (!d || d->size.y <= 0.f)
        return;
    if (maxY < minY)
        maxY = minY;
    y = frandf(minY, maxY);
    d->pos.x = -d->size.x;
    d->pos.y = y;
    d->speed = frandf(300.f, 400.f);
    if (d->spr)
        sfSprite_setPosition(d->spr, d->pos);
}

void game_seed_random(void)
{
    srand((unsigned)time(NULL));
}
