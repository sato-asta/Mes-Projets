##
## EPITECH PROJECT, 2025
## 105demography
## File description:
## Makefile
##

all:
	@cp main.py 105demography
	@chmod 775 105demography

epiclang:
	epiclang $(SRC)

clean:
	@rm -f 105demography.o
	@rm -f *~
	@rm -f *#
	@rm -f *.a
	@rm -f targets.log
	@rm -f dryrun.log
	@rm -f *.pch
	@rm -f 105demography

fclean: clean

re: fclean all

run: all
	@./105demography

.PHONY: all clean fclean re run
