/*
** EPITECH PROJECT, 2025
** my_hunter
** File description:
** lib
*/

#include "../../include/main.h"

static void handle_key(game_t *g, sfKeyCode code)
{
    if (code == sfKeyEscape)
        g->running = false;
    if (code == sfKeyF11)
        toggle_fullscreen(g);
}

static void handle_fullscreen_click(game_t *g, const sfVector2i *m)
{
    sfFloatRect bounds = sfRectangleShape_getGlobalBounds(g->fullscreen_btn);

    if (sfFloatRect_contains(&bounds, m->x, m->y)) {
        toggle_fullscreen(g);
    }
}

static void handle_click(game_t *g, sfMouseButton button)
{
    sfVector2i m;
    sfVector2f mf;

    if (button != sfMouseLeft)
        return;
    m = sfMouse_getPositionRenderWindow(g->win);
    handle_fullscreen_click(g, &m);
    mf.x = (float)m.x;
    mf.y = (float)m.y;
    handle_duck_hit(g, &mf);
}

static void handle_mouse_move(game_t *g, int x, int y)
{
    sfFloatRect bounds = sfRectangleShape_getGlobalBounds(g->fullscreen_btn);

    if (sfFloatRect_contains(&bounds, x, y)) {
        sfRectangleShape_setFillColor(g->fullscreen_btn,
            sfColor_fromRGB(255, 255, 255));
    } else {
        sfRectangleShape_setFillColor(g->fullscreen_btn,
            sfColor_fromRGB(200, 200, 200));
    }
}

static void handle_resize(game_t *g, unsigned w, unsigned h)
{
    (void)h;
    sfRectangleShape_setPosition(g->fullscreen_btn,
        (sfVector2f){(float)w - 50.f, 10.f});
}

void handle_restart_click(game_t *g, const sfVector2i *m)
{
    sfFloatRect bounds = sfRectangleShape_getGlobalBounds(g->restart_btn);

    if (!sfFloatRect_contains(&bounds, m->x, m->y))
        return;
    reset_game_state(g);
    respawn_ducks_and_reset(g);
}

static void handle_event_key(game_t *g, const sfEvent *e)
{
    if (e->type == sfEvtKeyPressed)
        handle_key(g, e->key.code);
}

static void handle_event_mouse_button(game_t *g, const sfEvent *e)
{
    sfVector2i mouse;

    if (e->type != sfEvtMouseButtonPressed)
        return;
    if (g->menu && g->menu->active) {
        menu_handle_click(g->menu, g->win, e->mouseButton.button);
        return;
    }
    handle_click(g, e->mouseButton.button);
    if (g->game_over) {
        mouse = sfMouse_getPositionRenderWindow(g->win);
        handle_restart_click(g, &mouse);
    }
}

static void handle_event_mouse_move(game_t *g, const sfEvent *e)
{
    if (e->type == sfEvtMouseMoved)
        handle_mouse_move(g, e->mouseMove.x, e->mouseMove.y);
}

void process_events(game_t *g)
{
    sfEvent e;

    while (sfRenderWindow_pollEvent(g->win, &e)) {
        if (e.type == sfEvtClosed)
            sfRenderWindow_close(g->win);
        handle_event_key(g, &e);
        handle_event_mouse_button(g, &e);
        handle_event_mouse_move(g, &e);
        if (e.type == sfEvtResized)
            handle_resize(g, e.size.width, e.size.height);
    }
}
