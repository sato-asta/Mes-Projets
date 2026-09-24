/*
** EPITECH PROJECT, 2025
** testmyrevstr
** File description:
** exercise 4
*/

#include <criterion/criterion.h>

Test(my_revstr, change_the_word)
{
    char str[] = "hello";

    my_revstr(str);
    cr_assert_str_eq(str, "olleh");
}
