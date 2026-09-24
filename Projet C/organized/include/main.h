/*
** EPITECH PROJECT, 2025
** organized
** File description:
** header
*/

#ifndef MAIN_H_
    #define MAIN_H_

    #include <stdio.h>
    #include <unistd.h>
    #include <stdlib.h>

    #define FAILURE 84
    #define SUCCESS 0

//my
int my_strlen(const char *str);
void my_put_char(char c);
void my_put_str(char *str);
void my_put_nbr(long nb);
char *my_strdup(const char *str);
int my_strcmp(const char *s1, const char *s2);
int my_atoi(const char *str);

//lib
int print_error(const char *str);

//organized structure
typedef struct hardware {
    char *name;
    char *type;
    int id;
    struct hardware *next;
} hardware_t;

typedef struct workshop {
    hardware_t *list;
    int next_id;
}workshop_t;

//hardware
void print_line(const hardware_t *h);
void print_deleted(const hardware_t *h);
static int is_valid_type(const char *type);
hardware_t *create_hw(const char *type, const char *name, int id);
void print_added(const hardware_t *h);
int cmp_hw(hardware_t *a, hardware_t *b, char **tags);

#endif
