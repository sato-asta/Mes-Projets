/*
** EPITECH PROJECT, 2025
** first
** File description:
** a
*/

#include <unistd.h>

void my_putchar(char c)
{
    write(1, &c, 1);
}

int yop(int number){
    for (int i1 = 48; i1 <= 57; i1++);
    return number;
}

int toi(int number2){
    for(int i2 = 48; i2 <= 57; i2++);
    return number2;
}

int my_print_comb(void)
{
    int num2;
    int num;
    yop(num);
    toi(num2);
    for (int i3 = 48; i3 <=57; i3++){
        my_putchar(i3);
        my_putchar(num2);
        my_putchar(num);
        if (i3 < 57)
            my_putchar(num2);
        if (num2 < 57)
            my_putchar(num);
        
    }
}




int main(void)
{
    my_print_comb();
    return (0);
}
