##
## EPITECH PROJECT, 2025
## my_hunter
## File description:
## Makefile
##

NAME    =   my_hunter

SRC	=	main.c
SRC	+=	lib/help.c
SRC	+= 	lib/print_error.c
SRC	+= 	lib/others/events.c
SRC	+=	lib/others/play_song.c
SRC	+=	lib/others/clean_program.c
SRC	+=	lib/others/game_loop.c
SRC	+=	lib/others/initiation.c
SRC	+=	lib/others/for_events.c
SRC	+=	lib/window/window.c
SRC	+=	lib/window/background.c
SRC	+=	lib/window/cursor.c
SRC	+=	lib/window/menu.c
SRC	+=	lib/window/restart.c
SRC	+=	lib/my/my_itostr.c
SRC	+=	lib/my/my_strcpy.c
SRC	+=	lib/my/my_strlen.c
SRC	+=	lib/my/my_strcmp.c
SRC	+=	lib/my/my_strncmp.c
SRC	+=	lib/duck/random_dunk.c
SRC	+= 	lib/duck/duck.c
SRC	+= 	lib/duck/animations.c
SRC	+= 	lib/duck/time.c
SRC	+=	lib/duck/mutiple_duck.c
SRC	+=	lib/tab/tab_score.c
SRC	+=	lib/tab/best_score.c

OBJ     =   $(SRC:.c=.o)

LIBS    =   -lcsfml-graphics -lcsfml-window -lcsfml-system -lcsfml-audio

all: $(NAME)

$(NAME): $(OBJ)
	$(CC) -o $(NAME) $(OBJ) $(LIBS)

debug:	$(OBJ)
	$(CC) -o $(NAME) $(OBJ) $(LIBS) -fsanitize=address

run: $(NAME)
	@rm -f /tmp/.X42-lock
	Xvfb :42 -screen 0 1024x768x24 &
	sleep 2
	export DISPLAY=:42 && \
	xkbcomp -w0 $$DISPLAY - 2>/dev/null && \
    ./$(NAME)

clean:
	$(RM) $(OBJ)

fclean: clean
	$(RM) $(NAME)

re: fclean all
