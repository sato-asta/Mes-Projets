##############################
##         EPITECH          ##
##         102architect     ##
## ------------------------ ##
##         by Ronan         ##
##############################

from matrice import *

def build_matrix(flag, args):
    if flag == "-t":
        i, j = float(args[0]), float(args[1])
        print(f"Translation along vector ({i:.2f}, {j:.2f})")
        return translation_matrix(i, j)
    elif flag == "-z":
        m, n = float(args[0]), float(args[1])
        print(f"Scaling by factors {m:.2f} and {n:.2f}")
        return scaling_matrix(m, n)
    elif flag == "-r":
        d = float(args[0])
        print(f"Rotation by a {d:.2f} degree angle")
        return rotation_matrix(d)
    elif flag == "-s":
        d = float(args[0])
        print(f"Reflection over an axis with an inclination angle of {d:.2f} degrees")
        return reflection_matrix(d)
    else:
        raise ValueError("Unknown transformation")

def multiply_matrices(a, b):
    res = [[0.0]*3 for _ in range(3)]
    for i in range(3):
        for j in range(3):
            res[i][j] = sum(a[i][k] * b[k][j] for k in range(3))
    return res

