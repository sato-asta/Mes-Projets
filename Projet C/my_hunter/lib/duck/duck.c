/*
** EPITECH PROJECT, 2025
** my_hunter
** File description:
** lib
*/

#include "../../include/main.h"

static int init_texture(duck_t *d, const char *path)
{
    d->tex = sfTexture_createFromFile(path, NULL);
    if (!d->tex)
        return 84;
    d->spr = sfSprite_create();
    if (!d->spr) {
        sfTexture_destroy(d->tex);
        d->tex = NULL;
        return 84;
    }
    sfSprite_setTexture(d->spr, d->tex, sfTrue);
    return 0;
}

int duck_init(duck_t *d, const duck_cfg_t *cfg)
{
    if (!d || !cfg || !cfg->path)
        return 84;
    d->time_acc = 0.0f;
    d->frames_count = 0;
    d->frame_time = 0.0f;
    d->speed = 0.0f;
    d->pos = (sfVector2f){0.f, 0.f};
    d->size = (sfVector2f){0.f, 0.f};
    if (init_texture(d, cfg->path) == 84)
        return 84;
    d->frames_count = cfg->frames;
    d->frame_time = cfg->frame_time;
    d->speed = cfg->speed;
    d->pos = cfg->start_pos;
    d->size = cfg->size;
    d->frame = (sfIntRect){0, 0, (int)cfg->size.x, (int)cfg->size.y};
    sfSprite_setTextureRect(d->spr, d->frame);
    sfSprite_setPosition(d->spr, d->pos);
    return 0;
}

static void update_frame(duck_t *d, float dt)
{
    d->time_acc += dt;
    if (d->time_acc >= d->frame_time) {
        d->time_acc = 0;
        d->frame.left += (int)d->size.x;
        if (d->frame.left >= (int)(d->size.x * d->frames_count))
            d->frame.left = 0;
        sfSprite_setTextureRect(d->spr, d->frame);
    }
}

void duck_update(duck_t *d, float dt, sfRenderWindow *win, game_t *g)
{
    sfVector2u size;

    if (!d || !win || !g)
        return;
    update_frame(d, dt);
    d->pos.x += d->speed * dt;
    size = sfRenderWindow_getSize(win);
    if (d->pos.x > (float)size.x) {
        d->pos.x = -d->size.x;
        g->ducks_missed++;
        if (g->ducks_missed >= 3) {
            g->game_over = true;
        }
    }
    sfSprite_setPosition(d->spr, d->pos);
}

void duck_draw(duck_t *duck_list, sfRenderWindow *win)
{
    duck_t *tmp = duck_list;

    if (!tmp || !win)
        return;
    while (tmp != NULL) {
        sfRenderWindow_drawSprite(win, tmp->spr, NULL);
        tmp = tmp->next;
    }
}

static bool duck_hit(const duck_t *d, const sfVector2f *mouse)
{
    float left;
    float top;
    float right;
    float bottom;

    if (!d)
        return false;
    left = d->pos.x;
    top = d->pos.y;
    right = left + d->size.x;
    bottom = top + d->size.y;
    return (mouse->x >= left && mouse->x <= right &&
        mouse->y >= top && mouse->y <= bottom);
}

void handle_duck_hit(game_t *g, const sfVector2f *mf)
{
    for (duck_t *tmp = g->duck_list; tmp; tmp = tmp->next) {
        if (!duck_hit(tmp, mf))
            continue;
        g->score += 1;
        update_best_score(g);
        duck_respawn_random(tmp,
            sfRenderWindow_getSize(g->win).x,
            sfRenderWindow_getSize(g->win).y);
        if (g->duck_sound)
            sfSound_play(g->duck_sound);
    }
}

void duck_destroy(duck_t *d)
{
    if (!d)
        return;
    if (d->spr)
        sfSprite_destroy(d->spr);
    if (d->tex)
        sfTexture_destroy(d->tex);
    free(d);
}
