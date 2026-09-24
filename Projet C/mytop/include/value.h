/*
** EPITECH PROJECT, 2025
** mytop
** File description:
** input
*/

#ifndef G_PSU_100_BDX_1_1_MYTOP_3_VALUE_H
    #define G_PSU_100_BDX_1_1_MYTOP_3_VALUE_H

typedef enum round_type {
    O,
    KO,
    MO,
    GO,
} round_type_t;

typedef struct input_array {
    int (*f)(app_t *app);
    int input;
} input_array_t;

typedef struct round_array {
    double (*f)(char *value);
    char *abbrev;
    round_type_t type;
} round_array_t;


typedef double (*conv_t)(char *value);
//conv_t get_conv(round_type_t id);
char *get_abbrev(round_type_t id);

#endif //G_PSU_100_BDX_1_1_MYTOP_3_VALUE_H
