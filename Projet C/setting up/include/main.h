/*
** EPITECH PROJECT, 2025
** setting_up
** File description:
** header
*/

#ifndef BSQ_H
    #define BSQ_H

    #include <stddef.h>
    #include <sys/stat.h>
    #include <fcntl.h>
    #include <unistd.h>
    #include <stdlib.h>

//structure
typedef struct board_s {
    char *data;
    size_t width;
    size_t height;
} board_t;

typedef struct square_s {
    size_t x;
    size_t y;
    size_t size;
} square_t;

typedef struct {
    size_t i;
    size_t j;
} coords_t;

typedef struct {
    size_t lines;
    size_t off;
    size_t width;
} header_info_t;

typedef struct {
    size_t width;
    size_t height;
} board_size_t;

//algo
int compute_fill(board_t const *in, size_t *dp);
int compute_best(board_t const *in, size_t const *dp,
    square_t *best);
int validate_board_args(board_t const *in, square_t *best);
size_t *allocate(size_t w, size_t h);
int solve_board(board_t const *in, square_t *best);
int apply_square(board_t *b, square_t *best);

//lib
int my_getnbr(char const *str);
size_t my_strlen(char const *str);
int write_error(char const *msg);
void free_board(board_t *b);

//board
int generate_board(size_t size, char const *pattern, board_t *out);
int read_all(int fd, char *buf, size_t sz);
int allocate_board(board_t *out, size_t width, size_t height);
int compute_width(char const *buf, size_t off, size_t *width);
int parse_header(char const *buf, size_t *lines, size_t *off);
static int copy_one_row(char const *buf, size_t *pos,
    board_t *out, size_t row);
int copy_grid_rows(char const *buf, size_t off, board_t *out);
int load_file_fd(char const *path, int *fd_out, size_t *size_out);
int read_file_to_buf(int fd, size_t sz, char **out_buf);
int fill_board(char *buf, header_info_t *info, board_t *out);
int prepare_buffer(char const *path, char **buf, header_info_t *info);
int parse_board_file(char const *path, board_t *out);
int print_board(board_t const *b);
#endif
