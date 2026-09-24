/*
** EPITECH PROJECT, 2026
** secured [WSL: Ubuntu]
** File description:
** include
*/

#ifndef INCLUDE_H_
    #define INCLUDE_H_
    #define SUCCESS 0
    #define FAILURE 84
    #define DIV 2.6f
    #define FOR_ENTIRE 1000.0f
    #define NB_PRIME 701
    #include <unistd.h>
    #include <stdlib.h>

void my_putstr(char const *str);
void my_putnbr(long nb);
int my_strcmp(char *s1, char *s2);
int my_strlen(const char *str);
char *my_strdup(char const *src);

#endif /* !INCLUDE_H_ */
