/*
** EPITECH PROJECT, 2026
** secured [WSL: Ubuntu]
** File description:
** new_hastable
*/

#include "../hashtable/hashtable.h"

hashtable_t *new_hashtable(int (*hash)(char *, int), int len)
{
    hashtable_t *ht = malloc(sizeof(hashtable_t));
    int i = 0;

    if (!ht)
        return NULL;
    ht->len = len;
    ht->hash = hash;
    ht->array = malloc(sizeof(node_t *) * len);
    if (!ht->array)
        return NULL;
    for (; i < len; i++)
        ht->array[i] = NULL;
    return ht;
}
