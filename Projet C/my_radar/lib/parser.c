/*
** EPITECH PROJECT, 2025
** my_radar
** File description:
** lib
*/

#include "main.h"

static void add_aircraft(game_t *g, aircraft_t *a)
{
    a->next = g->aircrafts;
    g->aircrafts = a;
}

static void add_tower(game_t *g, tower_t *t)
{
    t->next = g->towers;
    g->towers = t;
}

static int parse_aircraft(game_t *g, char **w)
{
    int vals[6];
    aircraft_t *a;

    for (int i = 0; i < 6; i++)
        vals[i] = my_getnbr(w[i + 1]);
    a = create_aircraft(vals);
    if (!a)
        return 84;
    add_aircraft(g, a);
    return 0;
}

static int parse_tower(game_t *g, char **w)
{
    int vals[3];
    tower_t *t;

    for (int i = 0; i < 3; i++)
        vals[i] = my_getnbr(w[i + 1]);
    t = create_tower(vals);
    if (!t)
        return 84;
    add_tower(g, t);
    return 0;
}

static int parse_line(game_t *g, char *line)
{
    char **w = my_str_to_word_array(line, " ");

    if (!w)
        return 84;
    if (my_strcmp(w[0], "A") == 0)
        return parse_aircraft(g, w);
    else if (my_strcmp(w[0], "T") == 0)
        return parse_tower(g, w);
    free(w);
    return 0;
}

int parse_script(game_t *g, const char *filepath)
{
    FILE *f = fopen(filepath, "r");
    char *line = NULL;
    size_t len = 0;
    ssize_t read;

    if (!f)
        return 84;
    read = getline(&line, &len, f);
    while (read != -1) {
        if (parse_line(g, line) == 84) {
            free(line);
            fclose(f);
            return 84;
        }
        read = getline(&line, &len, f);
    }
    free(line);
    fclose(f);
    return 0;
}
