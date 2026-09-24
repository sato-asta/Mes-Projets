#INTERFACE#
SRC += res/interface/window.c
SRC += res/interface/input_handler.c

#OBJET#
SRC += res/objet/app.c
SRC += res/objet/frame.c
SRC += res/objet/ivector2.c
SRC += res/objet/pid_info.c
#SYSTEM#
SRC += src/system_reader.c
SRC += src/display.c
SRC += src/cpu_info.c
SRC += src/cpu_calc.c
SRC += src/mem_info.c
SRC += src/load_info.c
SRC += src/process_info.c
SRC += src/set_util_name.c
SRC += src/get_ni.c
SRC += src/get_virt.c
SRC += src/get_pr.c
SRC += src/get_res.c
SRC += src/get_shr.c
SRC += src/get_state.c

SRC += res/interface/process/get_process_list.c
SRC += res/interface/process/display_pid_info.c
SRC += res/interface/process/retrieve_pid_data.c

#input#
SRC += res/interface/input/close.c
SRC += res/interface/input/win_scroll.c
SRC += res/interface/input/resize.c

#TOOL#
SRC += res/conversion.c
SRC += res/tool/int_len.c

#BONUS#
BONUS += bonus/tkt.c


#ADI

ADI = res/interface/input/p1.c

LIBS = -lncurses
NAME = my_top


#GNU 99 == include POSIX compilation data (enable strdup)
all:
	clang -o $(NAME) -std=gnu99 main.c $(SRC) $(ADI) -I include $(LIBS)

bonus:
	clang -o my_top -std=gnu99 main.c $(SRC) $(BONUS) -I include $(LIBS)

launch:
	./$(NAME)

clean:
	@rm -f $(OBJ)

fclean:
	@rm -f $(NAME)

valgrind:
	valgrind --leak-check=full --suppressions=valgrind.sup ./$(NAME)

coding style:
	epiclang $(SRC) -I include -lncurses main.c

first: all clean
re: all clean
run : fclean all clean
exec : fclean all launch clean
rebonus: bonus clean

.PHONY: all bonus clean fclean re run launch exec first valgrind

