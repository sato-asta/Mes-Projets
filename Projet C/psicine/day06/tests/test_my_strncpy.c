/*
** EPITECH PROJECT, 2025
** test copy
** File description:
** exercise 4
*/

#include <criterion/criterion.h>

Test(my_strncpy, copy_five_characters_in_empty_arry)
{
    char dest[5] = {0};

    my_strncpy(dest, "HelloWorld", 5);
    cr_assert_str_eq(dest, "Hello");
}
