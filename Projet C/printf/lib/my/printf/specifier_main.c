/*
** EPITECH PROJECT, 2025
** flag special
** File description:
** my_printf
*/

#include <stdbool.h>
#include <stddef.h>

#include "../../../include/main.h"

bool is_specfier_valid(char flag) {
    char const str[20] = "csid%aefmopsuxAXEFgG";

    for (int i = 0; str[i] != '\0'; i++) {
        if (str[i] == flag) {
            return true;
        }
    }
    return false;
}

bool is_all_specifier_valid(char const *str)
{
    char c;

    for (int position = 0; str[position] != '\0'; position++) {
        if (str[position] == '%') {
            c = ignore_space(str, &position, NULL);
            return is_specfier_valid(c);
        }
    }
    return false;
}
