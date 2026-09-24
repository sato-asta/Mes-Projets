/*
** EPITECH PROJECT, 2025
** my_radar
** File description:
** lib
*/

#include "main.h"

static int load_map_sprite(game_t *g)
{
    float scale_x;
    float scale_y;

    g->map_texture = sfTexture_createFromFile(
        "assets/carte du monde.jpg", NULL);
    if (!g->map_texture)
        return 84;
    g->map_spr = sfSprite_create();
    sfSprite_setTexture(g->map_spr, g->map_texture, sfTrue);
    scale_x = (float)g->settings->w / 720.0f;
    scale_y = (float)g->settings->h / 360.0f;
    sfSprite_setScale(g->map_spr, (sfVector2f){scale_x, scale_y});
    return 0;
}

int load_sprites(game_t *g)
{
    if (load_map_sprite(g) == 84)
        return 84;
    g->plane_texture = sfTexture_createFromFile("assets/plane.png", NULL);
    if (!g->plane_texture)
        return 84;
    g->plane_spr = sfSprite_create();
    sfSprite_setTexture(g->plane_spr, g->plane_texture, sfTrue);
    g->tower_texture = sfTexture_createFromFile("assets/tower.png", NULL);
    if (!g->tower_texture)
        return 84;
    g->tower_spr = sfSprite_create();
    sfSprite_setTexture(g->tower_spr, g->tower_texture, sfTrue);
    return 0;
}

void destroy_sprites(game_t *g)
{
    if (!g)
        return;
    if (g->map_texture)
        sfTexture_destroy(g->map_texture);
    if (g->map_spr)
        sfSprite_destroy(g->map_spr);
    if (g->plane_texture)
        sfTexture_destroy(g->plane_texture);
    if (g->plane_spr)
        sfSprite_destroy(g->plane_spr);
    if (g->tower_texture)
        sfTexture_destroy(g->tower_texture);
    if (g->tower_spr)
        sfSprite_destroy(g->tower_spr);
}
