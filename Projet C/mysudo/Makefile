##
## EPITECH PROJECT, 2025
## Makefile
## File description:
## for compilation
##

NAME    = my_sudo

CC      = clang
CFLAGS  = -Wall -Wextra -Iinclude

SRC = main.c
SRC += lib/my/my_put_str.c
SRC += lib/my/my_strlen.c
SRC += lib/my/my_strcmp.c
SRC += lib/print_error.c
SRC += lib/print_help.c
SRC += lib/parse_args.c
SRC += lib/read_password.c
SRC += lib/sudoers.c
SRC += lib/uid_gid.c
SRC += lib/user_shell.c
SRC	+=	lib/my/my_getpwnam.c
SRC	+=	lib/my/my_getgrnam.c
SRC	+=	lib/print_usage.c

OBJ     = $(SRC:.c=.o)

all: $(NAME)

$(NAME): $(OBJ)
	$(CC) $(OBJ) -o $(NAME) -lcrypt

clean:
	@rm -f $(OBJ)

coding_style_de_merde:
	 epiclang -I ./include lib/*.c lib/my/*.c main.c -lcrypt

fclean: clean
	@rm -f $(NAME)

re: fclean all
