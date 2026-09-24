/*
** EPITECH PROJECT, 2026
** secured [WSL: Ubuntu]
** File description:
** delete_hastable
*/

#include "../hashtable/hashtable.h"
#include "../include/include.h"

void delete_hashtable(hashtable_t *ht)
{
    node_t *next;
    node_t *tmp;
    int i = 0;

    if (!ht)
        return;
    for (; i < ht->len; i++) {
        tmp = ht->array[i];
        while (tmp) {
            next = tmp->next;
            free(tmp->key);
            free(tmp->value);
            free(tmp);
            tmp = next;
        }
    }
    free(ht->array);
    free(ht);
}
