/*
** EPITECH PROJECT, 2025
** my_hunter
** File description:
** lib
*/

#include <stdio.h>

unsigned bestscore_load(const char *path)
{
    unsigned best = 0;
    FILE *f = fopen(path, "rb");

    if (!f)
        return 0;
    if (fread(&best, sizeof(unsigned), 1, f) != 1)
        best = 0;
    fclose(f);
    return best;
}

void bestscore_save(const char *path, unsigned best)
{
    FILE *f = fopen(path, "wb");

    if (!f)
        return;
    if (fwrite(&best, sizeof(unsigned), 1, f) != 1) {
    }
    fclose(f);
}
