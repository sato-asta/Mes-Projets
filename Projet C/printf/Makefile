##
## EPITECH PROJECT, 2025
## put char
## File description:
## write
##

SRC = 	lib/my/printf/flag_main.c	\
		lib/my/printf/Specifier/specifier_%.c	\
		lib/my/printf/Specifier/specifier_s.c	\
		lib/my/printf/Specifier/specifier_d.c	\
		lib/my/printf/Specifier/specifier_i.c	\
		lib/my/printf/Specifier/specifier_c.c	\
		lib/my/printf/Specifier/specifier_a.c	\
		lib/my/printf/Specifier/specifier_f.c	\
		lib/my/printf/Specifier/specifier_g.c	\
		lib/my/printf/Specifier/specifier_m.c	\
		lib/my/printf/Specifier/specifier_n.c	\
		lib/my/printf/Specifier/specifier_x.c	\
		lib/my/printf/Specifier/specifier_p.c	\
		lib/my/printf/Specifier/specifier_u.c	\
		lib/my/printf/Specifier/specifier_o.c	\
		lib/my/printf/Specifier/specifier_e.c	\
		lib/my/printf/my_printf.c	\
		lib/my/my_put_char.c	\
		lib/my/my_put_nbr.c	\
		lib/my/my_put_double.c	\
		lib/my/my_putstr.c	\
		lib/my/my_strlen.c	\
		lib/my/my_hex.c	\
		lib/my/conv_double_to_scient.c	\
		lib/my/my_put_double_in_hexa.c	\
		lib/my/my_put_double_g.c	\
		lib/my/int_to_octal.c	\
		lib/my/printf/specifier_main.c \
		lib/my/Object/object_params.c \
		lib/my/Object/object_params_value.c	\

OBJ = $(SRC:.c=.o)
NAME = libmy.a

all: $(NAME)

$(NAME): $(OBJ)
	@ar rc $(NAME) $(OBJ)

compile:
	clang main.c $(SRC) -I include -L. -lmy
	./a.out
	rm -f a.out

clean:
	@rm -f $(OBJ)

fclean:	clean

unit_tests:	fclean all
		clang -o Test test/test.c $(SRC) -I ./include/ -L ./ -lmy --coverage -lcriterion
		./Test

tests_run : unit_tests
		@rm -f ./Test

clean_test:	clean
		@rm -f  *.gcno
		@rm -f 	*.gcda

cover:
		gcovr --gcov-executable "llvm-cov gcov"

first: all clean
re: fclean all clean
run : fclean all compile clean
tests: fclean all tests_run clean
.PHONY: all clean fclean re run launch
