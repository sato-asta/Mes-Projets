/*
** EPITECH PROJECT, 2025
** my_hunter
** File description:
** lib
*/

#include "../../include/main.h"

void update_best_score(game_t *g)
{
    if (g->score > g->best) {
        g->best = g->score;
        g->ui->best = g->best;
        bestscore_save("best.txt", g->best);
    }
}

int init_button(game_t *g)
{
    g->fullscreen_btn = sfRectangleShape_create();
    if (!g->fullscreen_btn)
        return 84;
    sfRectangleShape_setSize(g->fullscreen_btn,
        (sfVector2f){40.f, 40.f});
    sfRectangleShape_setFillColor(g->fullscreen_btn,
        sfColor_fromRGB(200, 200, 200));
    sfRectangleShape_setPosition(g->fullscreen_btn,
        (sfVector2f){g->settings->w - 50.f, 10.f});
    return 0;
}

void menu_handle_click(menu_t *menu, sfRenderWindow *win, sfMouseButton button)
{
    sfVector2i mouse;
    sfFloatRect bounds;

    if (!menu->active || button != sfMouseLeft)
        return;
    mouse = sfMouse_getPositionRenderWindow(win);
    bounds = sfRectangleShape_getGlobalBounds(menu->start_btn);
    if (sfFloatRect_contains(&bounds, mouse.x, mouse.y)) {
        menu->active = false;
    }
}

void reset_game_state(game_t *g)
{
    g->score = 0;
    g->ducks_missed = 0;
    g->game_over = false;
}

void respawn_ducks_and_reset(game_t *g)
{
    duck_t *tmp = g->duck_list;

    while (tmp) {
        duck_respawn_random(tmp, g->settings->w, g->settings->h);
        tmp = tmp->next;
    }
    if (g->frame_clock)
        sfClock_restart(g->frame_clock);
    if (g->anim_clock)
        sfClock_restart(g->anim_clock);
    if (g->ui)
        score_ui_update(g->ui, g->score);
}
