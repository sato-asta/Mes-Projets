/*
** EPITECH PROJECT, 2025
** my_hunter
** File description:
** lib
*/

#include "../../include/main.h"

static void cleanup_backgrounds(game_t *g)
{
    if (!g)
        return;
    destroy_menu_background(g);
    destroy_restart_background(g);
}

static void cleanup_menu(game_t *g)
{
    if (!g || !g->menu)
        return;
    if (g->menu->start_btn) {
        sfRectangleShape_destroy(g->menu->start_btn);
        g->menu->start_btn = NULL;
    }
    if (g->menu->start_text) {
        sfText_destroy(g->menu->start_text);
        g->menu->start_text = NULL;
    }
    if (g->menu->font) {
        sfFont_destroy(g->menu->font);
        g->menu->font = NULL;
    }
    free(g->menu);
    g->menu = NULL;
}

static void cleanup_resources(game_t *g)
{
    if (!g)
        return;
    if (g->duck_sound)
        sfSound_destroy(g->duck_sound);
    if (g->restart_btn)
        sfRectangleShape_destroy(g->restart_btn);
    if (g->restart_text)
        sfText_destroy(g->restart_text);
    if (g->duck_buffer)
        sfSoundBuffer_destroy(g->duck_buffer);
    if (g->bg_music)
        sfMusic_destroy(g->bg_music);
    if (g->game_over_text)
        sfText_destroy(g->game_over_text);
    if (g->game_over_font)
        sfFont_destroy(g->game_over_font);
    if (g->fullscreen_btn)
        sfRectangleShape_destroy(g->fullscreen_btn);
}

static void cleanup_head(game_t *g)
{
    if (!g)
        return;
    cleanup_resources(g);
    if (g->frame_clock)
        sfClock_destroy(g->frame_clock);
    if (g->anim_clock)
        sfClock_destroy(g->anim_clock);
    if (g->win)
        sfRenderWindow_destroy(g->win);
}

static void cleanup_entities(game_t *g)
{
    duck_t *tmp = g->duck_list;
    duck_t *next;

    if (!g)
        return;
    while (tmp) {
        next = tmp->next;
        duck_destroy(tmp);
        tmp = next;
    }
    if (g->ui)
        score_ui_destroy(g->ui);
    if (g->bg)
        destroy_background(g->bg);
    if (g->cursor)
        cursor_destroy(g);
}

static void cleanup_structs(game_t *g)
{
    if (!g)
        return;
    if (g->cfg)
        free(g->cfg);
    if (g->settings)
        free(g->settings);
    free(g);
}

void cleanup_game(game_t *g)
{
    cleanup_head(g);
    cleanup_entities(g);
    cleanup_backgrounds(g);
    cleanup_menu(g);
    cleanup_structs(g);
}
