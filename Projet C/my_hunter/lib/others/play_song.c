/*
** EPITECH PROJECT, 2025
** my_hunter
** File description:
** lib
*/

#include "../../include/main.h"

int init_audio(game_t *g)
{
    g->duck_buffer = sfSoundBuffer_createFromFile("assets/zemmour-tousse.mp3");
    if (!g->duck_buffer) {
        print_error("Failed to load duck sound");
        return 84;
    }
    g->duck_sound = sfSound_create();
    if (!g->duck_sound) {
        print_error("Failed to create sound");
        return 84;
    }
    sfSound_setBuffer(g->duck_sound, g->duck_buffer);
    return 0;
}

int init_music(game_t *g)
{
    g->bg_music = sfMusic_createFromFile("assets/background.mp3");
    if (!g->bg_music) {
        print_error("Failed to load background music");
        return 84;
    }
    sfMusic_setLoop(g->bg_music, sfTrue);
    sfMusic_setVolume(g->bg_music, 100.f);
    sfMusic_play(g->bg_music);
    return 0;
}

int play_song(game_t *g, sfVector2f *mf)
{
    if (!g || !g->duck_sound)
        return 84;
    if (mf) {
        sfSound_setPosition(g->duck_sound,
            (sfVector3f){mf->x, mf->y, 0});
    }
    sfSound_play(g->duck_sound);
    return 0;
}
