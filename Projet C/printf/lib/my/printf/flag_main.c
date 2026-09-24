/*
** EPITECH PROJECT, 2025
** flag special
** File description:
** my_printf
*/

#include <stdio.h>
#include <stdlib.h>
#include "../../../include/main.h"

#include "../../../include/main.h"
int is_valid_flag(char c)
{
    char *valid_flag = "#";

    for (int i = 0; valid_flag[i] != '\0'; i++) {
        if (valid_flag[i] == c) {
            return true;
        }
    }
    return false;
}

bool all_flag_valid(const char *str, int startpos, int endpos) {
    for (int i = startpos; i < endpos; i++) {
        if (!is_valid_flag(str[i])) {
            return false;
        }
    }
    return true;
}

static void inval_seq_p(char *cs, const char *str, const int sp, const int ep)
{
    for (int i = sp + 1; i < ep; i++) {
        cs[my_strlen(cs)] = str[i];
    }
}

static int flag_register(params_t *p, const char *str, int sp, int ep)
{
    if (!all_flag_valid(str, sp, ep))
        return 0;
    for (int i = sp; i < ep; i++)
        new_entry(p, new_params_value(str[i], i));
    return 1;
}

static bool go_to_n_s(const char *str, char *cs, int *sp, params_t *p)
{
    int i = *sp;

    while (str[i] && !is_specfier_valid(str[i])) {
        i++;
    }
    if (!str[i]) {
        return false;
    }
    if (!flag_register(p, str, *sp, i)) {
        inval_seq_p(cs, str, *sp - 1, i + 1);
        *sp = i + 1;
        return false;
    }
    cs[my_strlen(cs)] = str[i];
    *sp = i + 1;
    return true;
}

char *fetch_flag(const char *string, params_t *params)
{
    int i = 0;
    int len = my_strlen(string);
    char *cleaned_str = calloc(len + 1, sizeof(char));

    if (!cleaned_str) {
        return "(none)";
    }
    while (string[i]) {
        if (string[i] == '%') {
            i++;
            cleaned_str[my_strlen(cleaned_str)] = '%';
            go_to_n_s(string, cleaned_str, &i, params);
        } else {
            cleaned_str[my_strlen(cleaned_str)] = string[i];
            i++;
        }
    }
    return cleaned_str;
}
