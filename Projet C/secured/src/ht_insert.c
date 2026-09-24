/*
** EPITECH PROJECT, 2026
** secured [WSL: Ubuntu]
** File description:
** ht_insert
*/

#include "../hashtable/hashtable.h"
#include <stdlib.h>

static int update_existing(node_t *tmp, char *value)
{
    free(tmp->value);
    tmp->value = my_strdup(value);
    return SUCCESS;
}

static node_t *create_node(char *key, char *value)
{
    node_t *new = malloc(sizeof(node_t));

    if (!new)
        return NULL;
    new->key = my_strdup(key);
    new->value = my_strdup(value);
    new->next = NULL;
    return new;
}

int ht_insert(hashtable_t *ht, char *key, char *value)
{
    int index = ht->hash(key, ht->len) % ht->len;
    node_t *tmp;
    node_t *new;

    if (!ht || !key || !value)
        return FAILURE;
    if (index < 0)
        index = -index;
    tmp = ht->array[index];
    while (tmp) {
        if (my_strcmp(tmp->key, key) == 0)
            return update_existing(tmp, value);
        tmp = tmp->next;
    }
    new = create_node(key, value);
    if (!new)
        return FAILURE;
    new->next = ht->array[index];
    ht->array[index] = new;
    return SUCCESS;
}
