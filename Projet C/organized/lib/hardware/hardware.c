/*
** EPITECH PROJECT, 2025
** organized
** File description:
** lib
*/

#include "main.h"

static int is_valid_type(const char *type)
{
    if (!type)
        return FAILURE;
    if (my_strcmp(type, "ACTUATOR") == SUCCESS)
        return SUCCESS;
    if (my_strcmp(type, "DEVICE") == SUCCESS)
        return SUCCESS;
    if (my_strcmp(type, "PROCESSOR") == SUCCESS)
        return SUCCESS;
    if (my_strcmp(type, "SENSOR") == SUCCESS)
        return SUCCESS;
    if (my_strcmp(type, "WIRE") == SUCCESS)
        return SUCCESS;
    return FAILURE;
}

void print_added(const hardware_t *h)
{
    my_put_str(h->type);
    my_put_str(" n°");
    my_put_nbr(h->id);
    my_put_str(" - \"");
    my_put_str(h->name);
    my_put_str("\" added.\n");
}

void print_deleted(const hardware_t *h)
{
    my_put_str(h->type);
    my_put_str(" n°");
    my_put_nbr(h->id);
    my_put_str(" - \"");
    my_put_str(h->name);
    my_put_str("\" deleted.\n");
}

void print_line(const hardware_t *h)
{
    my_put_str(h->type);
    my_put_str(" n°");
    my_put_nbr(h->id);
    my_put_str(" - \"");
    my_put_str(h->name);
    my_put_str("\"\n");
}

hardware_t *create_hw(const char *type, const char *name, int id)
{
    hardware_t *hw = malloc(sizeof(hardware_t));

    if (!hw)
        return NULL;
    if (is_valid_type(type) == FAILURE || name == NULL) {
        free(hw);
        return NULL;
    }
    hw->type = my_strdup(type);
    hw->name = my_strdup(name);
    if (!hw->type || !hw->name) {
        free(hw->type);
        free(hw->name);
        free(hw);
        return NULL;
    }
    hw->id = id;
    hw->next = NULL;
    return hw;
}

static int has_reverse(char **tags, int i)
{
    if (tags[i + 1] && my_strcmp(tags[i + 1], "-r") == SUCCESS)
        return 1;
    return 0;
}

static int compare_tag(const char *tag, hardware_t *a, hardware_t *b)
{
    if (my_strcmp(tag, "TYPE") == SUCCESS)
        return my_strcmp(a->type, b->type);
    if (my_strcmp(tag, "NAME") == SUCCESS)
        return my_strcmp(a->name, b->name);
    if (my_strcmp(tag, "ID") == SUCCESS)
        return a->id - b->id;
    my_put_str("Error: unknown sort tag.\n");
    return 0;
}

int cmp_hw(hardware_t *a, hardware_t *b, char **tags)
{
    int res = 0;
    int rev = 0;

    for (int i = 0; tags && tags[i]; i++) {
        if (my_strcmp(tags[i], "-r") == SUCCESS)
            continue;
        rev = has_reverse(tags, i);
        res = compare_tag(tags[i], a, b);
        if (res != 0)
            return rev ? -res : res;
    }
    return SUCCESS;
}
