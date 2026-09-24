##
## EPITECH PROJECT, 2025
## ygvy
## File description:
## yguquv
##

NAME	=	cat

SRC	=	cat.c

OBJ	=	$(SRC:.c=.o)

CC	=	clang

CFLAGS	=	-Wall -Wextra -Werror

all: 	$(NAME)

$(NAME):	$(OBJ)
	$(CC) $(CFLAGS) -o $(NAME) $(OBJ)

clean:
	rm -f $(OBJ)

fclean: clean
	rm -f $(NAME)

re: fclean all
