/*
** EPITECH PROJECT, 2025
** Test bb
** File description:
** Bebou sucré
*/

#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>

#include "../../include/main.h"

static int get_hexa_len(ulli_t int_addr)
{
    int i = 0;

    while (int_addr / 16 != 0) {
        i++;
        int_addr /= 16;
    }
    i++;
    return i;
}

static void reversed_display(char *str, int len)
{
    for (int i = len - 1; i >= 0; i--) {
        my_put_char(str[i]);
    }
}

void int_to_hex(ulli_t int_addr, int is_majuscule)
{
    const char *hex_list = "0123456789abcdef";
    int hex_character_count = get_hexa_len(int_addr);
    char *hex_string = malloc(sizeof(char) * hex_character_count + 1);

    if (!hex_string) {
        return;
    }
    if (is_majuscule == 1) {
        hex_list = "0123456789ABCDEF";
    }
    for (int i = 0; i < hex_character_count; i++) {
        hex_string[i] = hex_list[int_addr % 16];
        int_addr /= 16;
    }
    reversed_display(hex_string, hex_character_count);
    free(hex_string);
}
