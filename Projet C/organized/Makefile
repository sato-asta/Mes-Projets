##
## EPITECH PROJECT, 2025
## put char
## File description:
## write
##

SRC	= main.c
SRC	+=	lib/print_error.c
SRC	+=	lib/my/my_put_char.c
SRC	+=	lib/my/my_put_str.c
SRC	+=	lib/my/my_strlen.c
SRC	+=	lib/my/my_put_nbr.c
SRC	+=	lib/my/my_strcmp.c
SRC	+=	lib/my/my_strdup.c
SRC	+=	lib/my/my_atoi.c
SRC	+=	lib/hardware/hardware.c
SRC	+=	lib/shell/add.c
SRC	+=	lib/shell/del.c
SRC	+=	lib/shell/sort.c
SRC	+=	lib/shell/disp.c

OBJ = $(SRC:.c=.o)
NAME = organized
CPPFLAGS = -I ./include
all: $(NAME)

$(NAME): $(OBJ)
	clang -o $(NAME) $(OBJ) $(CPPFLAGS) -L. -lshell

clean:
	@rm -f $(OBJ)

coding_style_de_merde:
	epiclang -I ./include main.c lib/*.c lib/my/*.c lib/hardware/*.c lib/shell/*.c -L. -lshell

fclean: clean all


first: all clean
re: fclean all clean
run : fclean all compile clean