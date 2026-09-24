/*
** EPITECH PROJECT, 2025
** Test
** File description:
** Test
*/

#include <stdio.h>
#include <stdlib.h>

#include "../../include/main.h"


void reversed_octal(char *str, int digits)
{
    while (digits >= 0) {
        my_put_char(str[digits]);
        digits -= 1;
    }
}

int get_digits(int number)
{
    int i = 0;

    while (number > 0) {
        i++;
        number /= 8;
    }
    return i;
}

int int_to_octal(int number)
{
    char octal_char = 0;
    int digits = get_digits(number);
    char *octal_str = malloc(sizeof(char) * digits);
    int i = 0;

    if (!octal_str) {
        return 84;
    }
    while (number > 0) {
        octal_char = (number % 8) + '0';
        number /= 8;
        octal_str[i] = octal_char;
        i++;
    }
    octal_str[i] = '\0';
    reversed_octal(octal_str, digits - 1);
    free(octal_str);
    return 0;
}
