##
## EPITECH PROJECT, 2025
## setting_up
## File description:
## makefile
##

NAME   = setting_up

SRC	=	main.c
SRC	+=	lib/free_memory.c
SRC	+=	lib/error.c
SRC	+=	lib/my_getnbr.c
SRC	+=	lib/my_strlen.c
SRC	+=	lib/algorythme/apply_square.c
SRC	+=	lib/algorythme/solve_enigme.c
SRC	+=	lib/algorythme/calcul_square.c
SRC	+=	lib/algorythme/check_board.c
SRC	+=	lib/algorythme/serch_best_square.c
SRC	+=	lib/board/allocate_for_board.c
SRC	+=	lib/board/cpy_grid.c
SRC	+=	lib/board/folder_management.c
SRC	+=	lib/board/parsing_folder.c
SRC	+=	lib/board/read_folder.c
SRC	+=	lib/board/parse_file.c
SRC	+=	lib/board/for_parse_file.c
SRC	+=	lib/board/print_board.c
SRC	+=	lib/board/generate_board.c

OBJ    = $(SRC:.c=.o)

all: $(NAME)

$(NAME): $(OBJ)
	$(CC) -o$(NAME) $(OBJ)

clean:
	$(RM) $(OBJ)

fclean: clean
	$(RM) $(NAME)

re: fclean all
