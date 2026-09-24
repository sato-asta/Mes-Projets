/*
** EPITECH PROJECT, 2025
**
** File description:
**
*/

#include <stdio.h>
#include <errno.h>
#include <string.h>

int main() {
    FILE *f = fopen("fichier_inexistant.txt", "r");
    if (!f) {
        perror("Erreur lors de l'ouverture");
    }
    return 0;
}
