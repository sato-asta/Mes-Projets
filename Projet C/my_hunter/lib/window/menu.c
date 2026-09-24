/*
** EPITECH PROJECT, 2025
** my_hunter
** File description:
** lib
*/

#include "../../include/main.h"

int init_menu_background(game_t *g, const char *path)
{
    if (!g || !path)
        return 84;
    g->menu_bg_tex = sfTexture_createFromFile(path, NULL);
    if (!g->menu_bg_tex)
        return 84;
    g->menu_bg = sfSprite_create();
    if (!g->menu_bg) {
        sfTexture_destroy(g->menu_bg_tex);
        g->menu_bg_tex = NULL;
        return 84;
    }
    sfSprite_setTexture(g->menu_bg, g->menu_bg_tex, sfTrue);
    sfSprite_setScale(g->menu_bg,
        (sfVector2f)
        {(float)g->settings->w / sfTexture_getSize(g->menu_bg_tex).x,
            (float)g->settings->h / sfTexture_getSize(g->menu_bg_tex).y});
    return 0;
}

static int init_menu_button(game_t *g, unsigned w, unsigned h)
{
    g->menu->font = sfFont_createFromFile("assets/Police.ttf");
    if (!g->menu->font)
        return 84;
    g->menu->start_btn = sfRectangleShape_create();
    if (!g->menu->start_btn) {
        sfFont_destroy(g->menu->font);
        g->menu->font = NULL;
        return 84;
    }
    sfRectangleShape_setSize(g->menu->start_btn, (sfVector2f){200.f, 80.f});
    sfRectangleShape_setFillColor(g->menu->start_btn,
        sfColor_fromRGB(200, 200, 200));
    sfRectangleShape_setPosition(g->menu->start_btn,
        (sfVector2f){(w - 200) / 2.f, (h - 80) / 2.f});
    return 0;
}

static int init_menu_text(game_t *g, unsigned w, unsigned h)
{
    g->menu->start_text = sfText_create();
    if (!g->menu->start_text) {
        sfRectangleShape_destroy(g->menu->start_btn);
        sfFont_destroy(g->menu->font);
        g->menu->start_btn = NULL;
        g->menu->font = NULL;
        return 84;
    }
    sfText_setString(g->menu->start_text, "START");
    sfText_setFont(g->menu->start_text, g->menu->font);
    sfText_setCharacterSize(g->menu->start_text, 40);
    sfText_setFillColor(g->menu->start_text, sfColor_fromRGB(0, 0, 0));
    sfText_setPosition(g->menu->start_text,
        (sfVector2f){(w - 120) / 2.f, (h - 60) / 2.f});
    return 0;
}

int menu_init(game_t *g, unsigned w, unsigned h)
{
    if (!g)
        return 84;
    g->menu = malloc(sizeof(menu_t));
    if (!g->menu)
        return 84;
    if (init_menu_button(g, w, h) == 84)
        return 84;
    if (init_menu_text(g, w, h) == 84)
        return 84;
    g->menu->active = true;
    return 0;
}

void menu_draw(game_t *g)
{
    if (!g || !g->menu->active || !g->win)
        return;
    sfRenderWindow_drawRectangleShape(g->win, g->menu->start_btn, NULL);
    sfRenderWindow_drawText(g->win, g->menu->start_text, NULL);
}

void destroy_menu_background(game_t *g)
{
    if (!g)
        return;
    if (g->menu_bg) {
        sfSprite_destroy(g->menu_bg);
        g->menu_bg = NULL;
    }
    if (g->menu_bg_tex) {
        sfTexture_destroy(g->menu_bg_tex);
        g->menu_bg_tex = NULL;
    }
}
