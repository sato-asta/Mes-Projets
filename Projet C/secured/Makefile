##
## EPITECH PROJECT, 2026
## secured [WSL: Ubuntu]
## File description:
## Makefile
##

FLAGS = -I./include -lncurses


SRC =	src/hash.c \
	  	src/ht_dump.c \
	  	src/ht_insert.c \
	  	lib/my_putstr.c \
	  	lib/my_putnbr.c \
	  	src/new_hastable.c \
	  	src/delete_hastable.c \
	  	src/ht_search.c	\
	  	lib/my_strcmp.c	\
	  	lib/my_strlen.c	\
	  	src/ht_delete.c	\
	  	lib/my_strdup.c	\

OBJ = $(SRC:.c=.o)

NAME = libhashtable.a

all: $(NAME)
	@ar rc $(NAME) $(OBJ)
	@echo "Compiled"

$(NAME): 	$(OBJ)
	@ar rc $(NAME) $(OBJ)

clean:
	@rm -f *~
	@rm -f *#
	@rm -f targets.log
	@rm -f dryrun.log
	@rm -f *.pch
	@rm -f *.out
	@rm -f $(OBJ)
	@rm -f secured
	@echo "Clean"

epiclang:
	@epiclang -g3 $(SRC) -o secured

fclean:
	@rm -f ../libhashtable.a
	@rm -f libhashtable.a
	@echo "Clean"

re: clean all

run: clean all
	@./secured

valgrind: clean all
	@valgrind --leak-check=full ./secured

.PHONY: all epiclang re clean fclean run valgrind
