/*
** EPITECH PROJECT, 2026
** secured [WSL: Ubuntu]
** File description:
** ht_dump
*/

#include "../hashtable/hashtable.h"

void ht_dump(hashtable_t *ht)
{
    int i = 0;
    node_t *tmp;

    if (!ht)
        return;
    for (; i < ht->len; i++) {
        my_putstr("[");
        my_putnbr(i);
        my_putstr("]:\n");
        tmp = ht->array[i];
        while (tmp) {
            my_putstr("> ");
            my_putstr(tmp->key);
            my_putstr(" - ");
            my_putstr(tmp->value);
            my_putstr("\n");
            tmp = tmp->next;
        }
    }
}
