/*
** EPITECH PROJECT, 2025
** my_hunter
** File description:
** function principal
*/

#include "include/main.h"

int run_game(unsigned w, unsigned h)
{
    game_t *g = malloc(sizeof(game_t));

    if (init_game(g, w, h) == 84) {
        cleanup_game(g);
        return 84;
    }
    g->running = true;
    game_loop(g, w, h);
    cleanup_game(g);
    return 0;
}

int main(int ac, char **av, char **env)
{
    int i = 0;

    if (ac == 2 && av && av[1] && my_strcmp(av[1], "-h") == 0) {
        print_help();
        return 0;
    }
    if (ac != 1) {
        print_error("Invalid arguments");
        return 84;
    }
    while (env[i] != NULL && my_strncmp(env[i], "DISPLAY=", 8) != 0) {
        i++;
    }
    if (env[i] == NULL) {
        print_error("DISPLAY non trouvé, impossible de lancer le jeu");
        return 84;
    }
    return run_game(1280, 720);
}
