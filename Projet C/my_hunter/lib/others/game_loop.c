/*
** EPITECH PROJECT, 2025
** my_hunter
** File description:
** lib
*/

#include "../../include/main.h"

static void update_ducks(game_t *g, float dt)
{
    duck_t *tmp = g->duck_list;

    if (!tmp)
        return;
    while (tmp != NULL) {
        advance_animation(tmp, g->anim_clock);
        duck_update(tmp, dt, g->win, g);
        tmp = tmp->next;
    }
}

static void draw_menu(game_t *g)
{
    sfRenderWindow_setMouseCursorVisible(g->win, sfTrue);
    sfRenderWindow_drawSprite(g->win, g->menu_bg, NULL);
    menu_draw(g);
}

static void draw_game(game_t *g, float dt)
{
    sfRenderWindow_setMouseCursorVisible(g->win, sfFalse);
    update_ducks(g, dt);
    draw_background(g->bg, g->win);
    duck_draw(g->duck_list, g->win);
    score_ui_update(g->ui, g->score);
    score_ui_draw(g->ui, g->win);
    cursor_update(g, g->win);
    cursor_draw(g, g->win);
    sfRenderWindow_drawRectangleShape(g->win, g->fullscreen_btn, NULL);
}

static void draw_game_over(game_t *g)
{
    sfRenderWindow_drawSprite(g->win, g->restart_bg, NULL);
    sfRenderWindow_setMouseCursorVisible(g->win, sfTrue);
    sfRenderWindow_drawText(g->win, g->game_over_text, NULL);
    if (g->restart_btn && g->restart_text) {
        sfRenderWindow_drawRectangleShape(g->win, g->restart_btn, NULL);
        sfRenderWindow_drawText(g->win, g->restart_text, NULL);
    }
}

static void draw_current_state(game_t *g, float dt)
{
    if (g->menu->active) {
        draw_menu(g);
        return;
    }
    if (!g->game_over) {
        draw_game(g, dt);
        return;
    }
    draw_game_over(g);
}

void game_loop(game_t *g, unsigned w, unsigned h)
{
    float dt;

    if (menu_init(g, w, h) == 84)
        return;
    while (g->running && sfRenderWindow_isOpen(g->win)) {
        process_events(g);
        dt = get_delta(g->frame_clock);
        reset_clock(g->frame_clock);
        sfRenderWindow_clear(g->win, sfColor_fromRGB(0, 0, 0));
        draw_current_state(g, dt);
        sfRenderWindow_display(g->win);
    }
}
