/*
** EPITECH PROJECT, 2025
** my_radar
** File description:
** lib
*/

#include "main.h"


int main(int argc, char **argv)
{
    game_t *game;

    if (argc == 2 && my_strcmp(argv[1], "-h") == 0) {
        print_help();
        return 0;
    }
    game = init_game();
    if (!game) {
        print_error("Failed to init game\n");
        return 84;
    }
    if (parse_script(game, argv[1]) == 84) {
        print_error("Invalid or missing script file\n");
        destroy_game(game);
        return 84;
    }
    game_loop(game);
    destroy_game(game);
    return 0;
}
