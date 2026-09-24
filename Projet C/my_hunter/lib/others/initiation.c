/*
** EPITECH PROJECT, 2025
** my_hunter
** File description:
** lib
*/

#include "../../include/main.h"

static int init_duck(game_t *g, unsigned h)
{
    duck_t *tmp;

    g->cfg = malloc(sizeof(duck_cfg_t));
    if (!g->cfg)
        return 84;
    g->cfg->path = "assets/duck.png";
    g->cfg->start_pos = (sfVector2f){0, h / 2};
    g->cfg->size = (sfVector2f){110.f, 110.f};
    g->cfg->frames = 3;
    g->cfg->frame_time = 0.12f;
    g->cfg->speed = 220.f;
    g->duck_list = make_head(g->cfg);
    tmp = g->duck_list;
    for (int i = 0; i < DUCK_COUNT; i++) {
        make_node(tmp, g->cfg);
        tmp = tmp->next;
    }
    return 0;
}

static int init_settings(game_t *g, unsigned w, unsigned h)
{
    g->settings = malloc(sizeof(window_t));
    if (!g->settings)
        return 84;
    g->settings->w = w;
    g->settings->h = h;
    g->settings->fullscreen = 0;
    g->settings->fps = 60;
    return 0;
}

static int init_backgrounds(game_t *g)
{
    if (init_background(g, "assets/background.jpeg") == 84 ||
        init_menu_background(g, "assets/background2.jpeg") == 84 ||
        init_restart_background(g, "assets/background2.jpeg") == 84) {
        print_error("Failed to load background");
        return 84;
    }
    return 0;
}

static int init_clocks(game_t *g)
{
    g->frame_clock = sfClock_create();
    g->anim_clock = sfClock_create();
    if (!g->frame_clock || !g->anim_clock) {
        print_error("Failed to create clocks");
        return 84;
    }
    return 0;
}

int init_graphics(game_t *g, unsigned w, unsigned h)
{
    if (init_settings(g, w, h) == 84)
        return 84;
    if (init_backgrounds(g) == 84)
        return 84;
    if (create_window(g) == 84) {
        print_error("Failed to create window");
        return 84;
    }
    if (init_clocks(g) == 84)
        return 84;
    return 0;
}

static int init_entities(game_t *g, unsigned h)
{
    if (score_ui_init(g, "assets/Police.ttf") == 84) {
        print_error("Failed to init score UI");
        return 84;
    }
    g->ui->best = g->best;
    if (cursor_init(g) == 84) {
        print_error("Failed to init cursor");
        return 84;
    }
    if (init_duck(g, h) == 84) {
        print_error("Failed to init duck");
        return 84;
    }
    if (init_button(g) == 84) {
        print_error("Failed to create button");
        return 84;
    }
    return 0;
}

int init_systems(game_t *g, unsigned w, unsigned h)
{
    if (init_graphics(g, w, h) == 84)
        return 84;
    game_seed_random();
    g->score = 0;
    g->best = bestscore_load("best.txt");
    return 0;
}

int init_game(game_t *g, unsigned w, unsigned h)
{
    if (!g)
        return 84;
    if (init_systems(g, w, h) == 84)
        return 84;
    if (init_entities(g, h) == 84)
        return 84;
    if (init_audio(g) == 84)
        return 84;
    if (init_music(g) == 84)
        return 84;
    if (init_game_over(g) == 84)
        return 84;
    if (init_restart_button(g) == 84) {
        print_error("Failed to create restart button");
        return 84;
    }
    g->ducks_missed = 0;
    g->game_over = false;
    return 0;
}
