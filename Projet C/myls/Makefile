##
## EPITECH PROJECT, 2025
## put char
## File description:
## write
##

SRC =	my_ls.c
SRC	+=	ls_options/my_ls_a.c
SRC	+=	ls_options/my_ls_d.c
SRC	+=	ls_options/my_ls_t.c
SRC	+=	ls_options/my_ls_l.c
SRC	+=	ls_options/my_ls_r.c
SRC +=	lib/my_put_nbr.c
SRC	+=	lib/my_put_str.c
SRC	+=	lib/my_put_char.c
SRC	+=	lib/my_strlen.c
SRC	+=	lib/my_strcmp.c
SRC	+=	ls_options/ls_folder.c
SRC	+=	lib/my_strcpy.c
SRC	+=	lib/my_tolower.c
SRC	+=	lib/my_str_cat.c
SRC	+=	lib/list_folder_l.c
SRC	+=	main.c
SRC	+=	lib/my_strchr.c
SRC	+=	lib/my_str_dup.c
SRC	+=	lib/print_vs_alpha.c
SRC	+=	lib/list_folder_t.c
SRC	+=	lib/list_folder_r.c

OBJ = $(SRC:.c=.o)
NAME = my_ls

all: $(NAME)

$(NAME): $(OBJ)
	clang -o $(NAME) $(OBJ) -I include -L.

compile:
	clang -o my_ls main.c $(SRC) -I include -L.

clean:
	@rm -f $(OBJ)

fclean:	clean all


first: all clean
re: fclean all clean
run : fclean all compile clean

.PHONY: all clean fclean re run
