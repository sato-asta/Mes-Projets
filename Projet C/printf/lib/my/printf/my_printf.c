/*
** EPITECH PROJECT, 2025
** my printf
** File description:
** main file
*/

#include <stdarg.h>
#include <stdio.h>

#include "../../../include/main.h"
#include <stdlib.h>

static const my_printf_t map[] = {
    {.c = 'd', .f = print_d},
    {.c = '%', .f = print_pourcent},
    {.c = 'i', .f = print_i},
    {.c = 's', .f = print_s},
    {.c = 'c', .f = print_c},
    {.c = 'o', .f = print_o},
    {.c = 'G', .f = print_g},
    {.c = 'g', .f = print_g},
    {.c = 'F', .f = print_f},
    {.c = 'f', .f = print_f},
    {.c = 'e', .f = print_e},
    {.c = 'E', .f = print_e},
    {.c = 'm', .f = print_m},
    {.c = 'A', .f = print_ga},
    {.c = 'a', .f = print_a},
    {.c = 'n', .f = print_n},
    {.c = 'p', .f = print_p},
    {.c = 'x', .f = print_x},
    {.c = 'X', .f = print_gx},
    {.c = 'u', .f = print_u},
    {.c = '0', .f = NULL}
};

int (*get_ptr(char c))(va_list)
{
    int i = 0;

    while (i < 20) {
        if (map[i].c == c) {
            return map[i].f;
        }
        i += 1;
    }
    return NULL;
}

char ignore_space(char const *str, int *position, params_t *params)
{
    int i = *position + 1;

    if (str[i] == '\0') {
        return '%';
    }
    while (str[i] == ' ') {
        i++;
        if (str[i] == '\0') {
            return '%';
        }
    }
    *position = i;
    return str[i];
}

static void pos_check(const int position, const int original_pos, const char f)
{
    if (position != original_pos) {
        my_put_char(f);
    }
}

static int write_flag(char const *str, int *position, va_list list, params_t *p)
{
    int (*ptr)(va_list list) = NULL;
    char flag;
    int callback = 0;
    int original_pos = *position;

    if (*position + 1 < my_strlen(str)) {
        flag = ignore_space(str, position, p);
        ptr = get_ptr(flag);
        if (ptr != NULL) {
            callback = ptr(list);
        } else {
            my_put_char('%');
            pos_check(*position, original_pos, flag);
        }
    }
    return callback;
}

int my_printf(char *str, ...)
{
    va_list list;
    params_t *params = new_params(NULL);
    char *cleaned = fetch_flag(str, params);
    int status = 0;

    va_start(list, str);
    for (int i = 0; cleaned[i] != '\0'; i++) {
        if (cleaned[i] == '%') {
            status = write_flag(cleaned, &i, list, params);
        } else {
            my_put_char(cleaned[i]);
        }
    }
    if (status == 84)
        my_put_str("Error 84");
    free(params);
    free(cleaned);
    return 0;
}
