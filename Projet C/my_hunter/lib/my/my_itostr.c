/*
** EPITECH PROJECT, 2025
** my_hunter
** File description:
** lib
*/

int my_itostr(char *dest, unsigned value)
{
    char buf[20];
    int i = 0;
    int j;

    if (!dest)
        return 0;
    do {
        buf[i] = (char)('0' + (value % 10));
        i += 1;
        value /= 10;
    } while (value > 0);
    for (j = 0; j < i; j++) {
        dest[j] = buf[i - j - 1];
    }
    dest[i] = '\0';
    return i;
}
