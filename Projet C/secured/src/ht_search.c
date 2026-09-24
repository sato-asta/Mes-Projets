/*
** EPITECH PROJECT, 2025
** secured
** File description:
** search ht
*/

#include <string.h>
#include "../hashtable/hashtable.h"

char *ht_search(hashtable_t *ht, char *key)
{
    int index = ht->hash(key, ht->len) % ht->len;
    node_t *tmp;

    if (!ht || !key)
        return NULL;
    if (index < 0)
        index = -index;
    tmp = ht->array[index];
    while (tmp) {
        if (my_strcmp(tmp->key, key) == 0)
            return tmp->value;
        tmp = tmp->next;
    }
    return NULL;
}
