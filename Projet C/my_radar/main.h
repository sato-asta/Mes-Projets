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
    #include <unistd.h>
    #include <stdio.h>
    #include <fcntl.h>

//structure
typedef struct window_s {
    unsigned w;
    unsigned h;
    unsigned fps;
    int fullscreen;
} window_t;

typedef struct aircraft_s {
    int x_dep;
    int y_dep;
    int x_arr;
    int y_arr;
    int speed;
    int delay;
    float x;
    float y;
    float elapsed_time;
    bool has_started;
    struct aircraft_s *next;
} aircraft_t;

typedef struct tower_s {
    int x;
    int y;
    int radius;
    struct tower_s *next;
} tower_t;

typedef struct game_s {
    window_t *settings;
    sfRenderWindow *win;
    int show_hitboxes;
    int show_sprites;
    aircraft_t *aircrafts;
    tower_t *towers;
    bool show_aircrafts;
    bool show_towers;
    sfSprite *plane_spr;
    sfTexture *plane_texture;
    sfSprite *tower_spr;
    sfTexture *tower_texture;
    sfSprite *map_spr;
    sfTexture *map_texture;
    sfClock *clock;
} game_t;

//window
sfRenderWindow *create_window(window_t *settings);
void destroy_window(sfRenderWindow *win);
void draw_entities(game_t *g);

//hitboxes
void draw_aircraft_hitbox(sfRenderWindow *win, aircraft_t *a);
void draw_tower_area(sfRenderWindow *win, tower_t *t);
void draw_aircraft_hitboxes(game_t *g);
void draw_tower_hitboxes(game_t *g);

//entities
void destroy_sprites(game_t *g);
int load_sprites(game_t *g);

//lib
int my_strlen(const char *str);
int my_strcmp(const char *s1, const char *s2);
int my_getnbr(const char *str);
char **my_str_to_word_array(char *str, char *delim);

//others
void print_help(void);
void print_error(const char *msg);
int print_bad_args(void);

//game
game_t *init_game(void);
void destroy_game(game_t *g);
void game_loop(game_t *g);

//events
void handle_events(game_t *g);

//script
int parse_script(game_t *g, const char *filepath);
aircraft_t *create_aircraft(int *values);
tower_t *create_tower(int *values);

//update
void update_aircrafts(game_t *g, float dt);

//collision
bool check_collision(aircraft_t *a, aircraft_t *b);
bool is_in_control_area(aircraft_t *a, tower_t *tower);
void destroy_aircraft(aircraft_t **head, aircraft_t *to_destroy);
void check_all_collisions(game_t *g);
#endif
