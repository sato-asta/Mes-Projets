/*
** EPITECH PROJECT, 2025
**
** File description:
**
*/

#include <stdio.h>

typedef struct node {
    int data;
    struct node *next;
} node_t;

void display_node(node_t *node)
{
    while (node) {
        printf("%d", node->data);
        node = node->next;
    }
}
