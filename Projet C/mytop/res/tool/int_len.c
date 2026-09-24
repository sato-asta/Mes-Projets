/*
** EPITECH PROJECT, 2025
** mytop
** File description:
** CPU percentage calculation
*/
int int_len(long int value)
{
    int isNeg = value < 0;
    int tmp = value;
    int len = 0;

    if (isNeg) {
        tmp *= -1;
        len += 1;
    }
    if (tmp == 0) {
        return 1;
    }
    while (tmp != 0) {
        tmp /= 10;
        len += 1;
    }
    return len;
}
