/*
** EPITECH PROJECT, 2025
** setting_up
** File description:
** function principal
*/

#include "include/main.h"

static int is_uint(char const *s)
{
    size_t i = 0;

    if (!s || !s[0])
        return 0;
    for (; s[i] != '\0'; i++) {
        if (s[i] < '0' || s[i] > '9')
            return 0;
    }
    return 1;
}

int run_from_file(char const *path)
{
    board_t b = {0};
    square_t sq = {0, 0, 0};
    int ret = 0;

    if (parse_board_file(path, &b) != 0)
        return 84;
    if (solve_board(&b, &sq) != 0) {
        free_board(&b);
        return 84;
    }
    if (apply_square(&b, &sq) != 0) {
        free_board(&b);
        return 84;
    }
    ret = print_board(&b);
    free_board(&b);
    return ret == 0 ? 0 : 84;
}

int run_generate(size_t size, char const *pattern)
{
    board_t b = {0};
    square_t sq = {0, 0, 0};
    int ret = 0;

    if (generate_board(size, pattern, &b) != 0)
        return 84;
    if (solve_board(&b, &sq) != 0) {
        free_board(&b);
        return 84;
    }
    if (apply_square(&b, &sq) != 0) {
        free_board(&b);
        return 84;
    }
    ret = print_board(&b);
    free_board(&b);
    return ret == 0 ? 0 : 84;
}

int main(int ac, char **av)
{
    if (ac == 2)
        return run_from_file(av[1]);
    if (ac == 3 && is_uint(av[1]))
        return run_generate((size_t)my_getnbr(av[1]), av[2]);
    write_error("Invalid arguments\n");
    return 84;
}
