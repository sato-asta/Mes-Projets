/*
** EPITECH PROJECT, 2025
** mytop
** File description:
** main
*/

#ifndef G_PSU_100_BDX_1_1_MYTOP_3_MAIN_H
    #define G_PSU_100_BDX_1_1_MYTOP_3_MAIN_H
    #include <dirent.h>
    #include "system_info.h"
    #include "ncurses.h"

typedef struct ivector2 ivector2_t;
typedef struct win win_t;
typedef struct dirent dirent_t;

typedef struct pid_data {
    char *pid;
    char *UTIL;
    char *PR;
    char *NI;
    char *VIRT;
    char *RES;
    char *SHR;
    char *S;
    char *CPU;
    char *MEM;
    char *TEMPS;
    char *COM;
} pid_data_t;

pid_data_t *new_pid_data(char *PID);
void free_pid_data(pid_data_t **data, int len);

typedef struct app {
    int isRunning;
    system_info_t sysinfo;
    win_t *header;
    win_t *main;
    pid_data_t **pid_list;
    int pid_count;
    int round;
} app_t;

struct win {
    WINDOW *window;
    ivector2_t *size;
    ivector2_t *pos;
    int scroll;
};

win_t *create_window(int height, int width, int posX, int posY);
app_t *new_app(void);
void init_window(app_t *app);
void app_free(app_t *app);
void display_system_header(app_t *app);
void get_proc_list(app_t *app);
void display_pid(char **pid_list, int max);
int display_pid_info(app_t *app);
void refresh_list(app_t *app);
void display_main_header(WINDOW *main);
int center_text(int colStart, int colWidth, char *text);

//DATA GET
char *get_util(char *PID);
char *set_util_name(char *name);
char *get_br(char *PID);
char *get_ni(char *PID);
char *get_virt(char *PID);
char *get_res(char *PID);
char *get_shr(char *PID);
char *get_state(char *PID);

//Conversion
double value_to_go(char *value_send);
double value_to_mo(char *value_send);
double value_to_ko(char *value_send);
double value_to_raw(char *value_send);

//TOOL
int int_len(unsigned long int value);


struct ivector2 {
    int x;
    int y;
};
ivector2_t *new_ivector2(int x, int y);
int p1test(app_t *app);

#endif //G_PSU_100_BDX_1_1_MYTOP_3_MAIN_H
