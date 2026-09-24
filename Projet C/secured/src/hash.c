/*
** EPITECH PROJECT, 2026
** secured [WSL: Ubuntu]
** File description:
** hash
*/

#include "../hashtable/hashtable.h"

int hash(char *key, int len)
{
    float hash = 1.0f;
    int i = 0;
    int log_steps = 0;

    if (!key || len <= 0)
        return FAILURE;
    while (key[i]) {
        hash += (float)(key[i] * (i + 1)) / DIV;
        i++;
    }
    while (hash > 1.0f) {
        hash /= 2.0f;
        log_steps++;
    }
    return log_steps * NB_PRIME + (int)(hash * FOR_ENTIRE);
}
