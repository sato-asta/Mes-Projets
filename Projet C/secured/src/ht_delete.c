/*
** EPITECH PROJECT, 2025
** secured [WSL: Ubuntu]
** File description:
** ht delete
*/

#include "../hashtable/hashtable.h"

static void remove_node(hashtable_t *ht, int index, node_t *tmp, node_t *prev)
{
    if (prev)
        prev->next = tmp->next;
    else
        ht->array[index] = tmp->next;
    free(tmp->key);
    free(tmp->value);
    free(tmp);
}

int ht_delete(hashtable_t *ht, char *key)
{
    int index = ht->hash(key, ht->len) % ht->len;
    node_t *tmp;
    node_t *prev = NULL;

    if (!ht || !key)
        return FAILURE;
    if (index < 0)
        index = -index;
    tmp = ht->array[index];
    while (tmp) {
        if (my_strcmp(tmp->key, key) == 0) {
            remove_node(ht, index, tmp, prev);
            return SUCCESS;
        }
        prev = tmp;
        tmp = tmp->next;
    }
    return FAILURE;
}
