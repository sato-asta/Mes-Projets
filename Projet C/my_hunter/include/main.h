/*
** EPITECH PROJECT, 2025
** my_hunter
** File description:
** header
*/

#ifndef HUNTER_H_
    #define HUNTER_H_

    #include <SFML/Graphics.h>
    #include <SFML/System.h>
    #include <SFML/Audio.h>
    #include <stdbool.h>
    #include <stdlib.h>

    #define DUCK_COUNT 5
//structure
typedef struct menu_s {
    sfRectangleShape *start_btn;
    sfText *start_text;
    sfFont *font;
    bool active;
} menu_t;

typedef struct score_ui_s {
    sfFont *font;
    sfText *text;
    unsigned current;
    unsigned best;
} score_ui_t;

typedef struct cursor_s {
    sfCircleShape *shape;
} cursor_t;

typedef struct window_s {
    unsigned w;
    unsigned h;
    unsigned fps;
    int fullscreen;
} window_t;

typedef struct duck_s {
    sfTexture *tex;
    sfSprite *spr;
    sfIntRect frame;
    unsigned frames_count;
    float frame_time;
    float time_acc;
    sfVector2f pos;
    sfVector2f size;
    float speed;
    struct duck_s *next;
    int id;
} duck_t;

typedef struct duck_cfg_s {
    const char *path;
    sfVector2f start_pos;
    sfVector2f size;
    unsigned frames;
    float frame_time;
    float speed;
} duck_cfg_t;

typedef struct background_s {
    sfTexture *tex;
    sfSprite *spr;
} background_t;

typedef struct game_s {
    sfRenderWindow *win;
    bool running;
    sfClock *frame_clock;
    sfClock *anim_clock;
    duck_t *duck_list;
    background_t *bg;
    window_t *settings;
    sfRectangleShape *fullscreen_btn;
    score_ui_t *ui;
    cursor_t *cursor;
    unsigned score;
    unsigned best;
    duck_cfg_t *cfg;
    sfSoundBuffer *duck_buffer;
    sfSound *duck_sound;
    sfMusic *bg_music;
    sfText *game_over_text;
    sfFont *game_over_font;
    int ducks_missed;
    bool game_over;
    sfRectangleShape *restart_btn;
    sfText *restart_text;
    menu_t *menu;
    sfTexture *menu_bg_tex;
    sfSprite *menu_bg;
    sfTexture *restart_bg_tex;
    sfSprite *restart_bg;
} game_t;

//lib
int print_help(void);
void print_error(const char *msg);

//window
void destroy_window(game_t *g);
int init_background(game_t *g, const char *path);
void draw_background(const background_t *bg, sfRenderWindow *win);
void destroy_background(background_t *bg);
int create_window(game_t *g);
int toggle_fullscreen(game_t *g);
int init_game_over(game_t *g);

//duck
int duck_init(duck_t *d, const duck_cfg_t *cfg);
void duck_update(duck_t *d, float dt, sfRenderWindow *win, game_t *g);
void duck_draw(duck_t *d, sfRenderWindow *win);
static bool duck_hit(const duck_t *d, const sfVector2f *mouse);
void duck_destroy(duck_t *d);
void advance_animation(duck_t *d, sfClock *clock);
void handle_duck_hit(game_t *g, const sfVector2f *mf);

//time
float get_delta(sfClock *clock);
void reset_clock(sfClock *clock);

//events
void process_events(game_t *g);
int init_button(game_t *g);
void update_best_score(game_t *g);
void menu_handle_click(menu_t *menu, sfRenderWindow *win, sfMouseButton button);
void respawn_ducks_and_reset(game_t *g);
void reset_game_state(game_t *g);

//free
void cleanup_game(game_t *g);

//my
int my_itostr(char *dest, unsigned value);
int my_strcpy(char *dest, const char *src);
int my_strlen(const char *str);
int my_strcmp(const char *s1, const char *s2);
int my_strncmp(const char *s1, const char *s2, int n);

//score
int score_ui_init(game_t *g, const char *font_path);
void score_ui_update(score_ui_t *ui, unsigned score);
void score_ui_draw(const score_ui_t *ui, sfRenderWindow *win);
void score_ui_destroy(score_ui_t *ui);

//curseur
int cursor_init(game_t *g);
void cursor_update(game_t *g, sfRenderWindow *win);
void cursor_draw(const game_t *g, sfRenderWindow *win);
void cursor_destroy(game_t *g);

//best score
unsigned bestscore_load(const char *path);
void bestscore_save(const char *path, unsigned best);

//randomizer
void duck_respawn_random(duck_t *d, unsigned win_w, unsigned win_h);
void game_seed_random(void);

//song
int init_audio(game_t *g);
int play_song(game_t *g, sfVector2f *mf);
int init_music(game_t *g);

//list chainé
duck_t *make_head(duck_cfg_t *cfg);
duck_t *make_node(duck_t *my_list, duck_cfg_t *cfg);

//menu
int menu_init(game_t *g, unsigned w, unsigned h);
void menu_draw(game_t *g);
int init_menu_background(game_t *g, const char *path);
void destroy_menu_background(game_t *g);

//restart
void draw_restart_button(game_t *g);
int init_restart_button(game_t *g);
int init_restart_background(game_t *g, const char *path);
void destroy_restart_background(game_t *g);

//main
int run_game(unsigned w, unsigned h);
void game_loop(game_t *g, unsigned w, unsigned h);
int init_graphics(game_t *g, unsigned w, unsigned h);
int init_game(game_t *g, unsigned w, unsigned h);
#endif
