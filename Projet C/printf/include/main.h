/*
** EPITECH PROJECT, 2025
** my printf
** File description:
** main file
*/

#ifndef G_CPE_101_BDX_1_1_MYPRINTF_1_MAIN_H
    #define G_CPE_101_BDX_1_1_MYPRINTF_1_MAIN_H
    #include <stdarg.h>
    #include <stdbool.h>
    #include <stdint.h>
    #include <math.h>

typedef struct my_printf {
    char c;
    int (*f)(va_list);
} my_printf_t;

typedef struct params_value {
    bool used;
    int position;
    char c;
} params_value_t;

typedef struct params params_t;
struct params {
    params_value_t *data;
    params_t *next;
    params_t *previous;
};

typedef unsigned long long int ulli_t;

//LIB FUNCTION
int my_put_nbr(int nb);
int my_put_str(char const *str);
int my_strlen(char const *str);
void my_put_char(char c);
int my_put_double(double nb);
void int_to_hex(ulli_t int_addr, int is_majuscule);
int my_put_unsigned_nbr(unsigned int nb);
int conv_double_to_scient(double nb);
int my_put_double_in_hexa(double nb, int uppercase);
void my_put_double_g(double nb);
int int_to_octal(int number);

//Specifier
char ignore_space(char const *str, int *position, params_t *params);
bool is_specfier_valid(char flag);
int print_i(va_list list);
int print_d(va_list list);
int print_s(va_list list);
int print_pourcent(va_list list);
int print_c(va_list list);
int print_x(va_list list);
int print_gx(va_list list);
int print_u(va_list list);
int print_o(va_list list);
int print_e(va_list list);
int print_f(va_list list);
int print_g(va_list list);
int print_a(va_list list);
int print_p(va_list list);
int print_m(va_list list);
int print_n(va_list list);
int print_ga(va_list list);
bool is_all_specifier_valid(char const *str);

//Flag
int valid_parameters(char c);
char *fetch_flag(const char *string, params_t *params);

//Printf
int my_printf(char *str, ...);

//Object params
void new_entry(params_t *params, params_value_t *new_value);
params_t *new_params(params_value_t *data);

//Object params value
params_value_t *new_params_value(char c, int position);

#endif //G_CPE_101_BDX_1_1_MYPRINTF_1_MAIN_H
