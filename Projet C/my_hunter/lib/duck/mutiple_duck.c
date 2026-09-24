/*
** EPITECH PROJECT, 2025
** my_hunter
** File description:
** lib
*/

#include "../../include/main.h"

duck_t *make_head(duck_cfg_t *cfg)
{
    duck_t *my_list = malloc(sizeof(duck_t));

    if (!my_list)
        return NULL;
    if (duck_init(my_list, cfg) == 84) {
        free(my_list);
        return NULL;
    }
    my_list->next = NULL;
    return my_list;
}

duck_t *make_node(duck_t *my_list, duck_cfg_t *cfg)
{
    duck_t *tmp = my_list;
    duck_t *node = malloc(sizeof(duck_t));

    if (!node)
        return NULL;
    while (tmp->next != NULL)
        tmp = tmp->next;
    if (duck_init(node, cfg) == 84) {
        free(node);
        return NULL;
    }
    node->next = NULL;
    tmp->next = node;
    return node;
}
