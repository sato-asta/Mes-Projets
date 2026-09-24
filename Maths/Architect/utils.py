##############################
##         EPITECH          ##
##         102architect     ##
## ------------------------ ##
##         by Ronan         ##
##############################

from matrice import *

def format_val(val):
    if abs(val) < 1e-10:
        val = 0.0
    return f"{val:.2f}"

def apply_matrix(matrix, x, y):
    res_x = matrix[0][0]*x + matrix[0][1]*y + matrix[0][2]
    res_y = matrix[1][0]*x + matrix[1][1]*y + matrix[1][2]
    return res_x, res_y

def print_matrix(matrix):
    for row in matrix:
        print("\t".join(format_val(val) for val in row))