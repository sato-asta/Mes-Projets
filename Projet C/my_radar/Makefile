##
## EPITECH PROJECT, 2025
## my_hunter
## File description:
## Makefile
##

NAME    =   my_radar

SRC	=	main.c
SRC	+=	lib/usage/help.c
SRC	+= 	lib/usage/print_error.c
SRC	+=	lib/window/window.c
SRC	+=	lib/window/draw.c
SRC	+=	lib/window/sprites.c
SRC	+=	lib/window/draw_hitboxes.c
SRC	+=	lib/my/my_strlen.c
SRC	+=	lib/my/my_getnbr.c
SRC	+=	lib/my/my_str_to_word_array.c
SRC	+=	lib/my/my_strcmp.c
SRC	+=	lib/usage/print_bad_args.c
SRC	+=	lib/destroy_game.c
SRC	+=	lib/entities/aircrafts.c
SRC	+=	lib/entities/towers.c
SRC	+=	lib/parser.c
SRC	+=	lib/events.c
SRC	+=	lib/loop.c
SRC	+=	lib/init_game.c
SRC	+=	lib/update.c
SRC	+=	lib/collision.c

OBJ     =   $(SRC:.c=.o)

LIBS    =   -lcsfml-graphics -lcsfml-window -lcsfml-system -lcsfml-audio -lm

CPPFLAGS = -I ./include

all: $(NAME)

$(NAME): $(OBJ)
	$(CC) -o $(NAME) $(OBJ) $(LIBS)

coding_style_de_merde:
	epiclang -I ./include main.c lib/*.c lib/window/*.c lib/my/*.c lib/usage/*.c

debug:	$(OBJ)
	$(CC) -o $(NAME) $(OBJ) $(LIBS) -fsanitize=address

clean:
	$(RM) $(OBJ)

fclean: clean
	$(RM) $(NAME)

re: fclean all
