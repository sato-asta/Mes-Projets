##############################
##         EPITECH          ##
##         102architect     ##
## ------------------------ ##
##         by Ronan         ##
##############################

import sys
from flags import *
from utils import *

def print_usage():
    print("USAGE")
    print("./102architect x y transfo1 arg11 [arg12] [transfo2 arg21 [arg22]] ...\n")
    print("DESCRIPTION")
    print("x\tabscissa of the original point")
    print("y\tordinate of the original point")
    print("transfo arg1 [arg2]")
    print("-t i j\ttranslation along vector (i, j)")
    print("-z m n\tscaling by factors m (x-axis) and n (y-axis)")
    print("-r d\trotation centered in O by a d degree angle")
    print("-s d\treflection over the axis passing through O with an inclination angle of d degrees")

def main():
    if len(sys.argv) < 2:
        print("Error: not enough arguments", file=sys.stderr)
        sys.exit(84)

    if sys.argv[1] == "-h" or sys.argv[1] == "--help":
        print_usage()
        sys.exit(0)

    try:
        x = float(sys.argv[1])
        y = float(sys.argv[2])
    except Exception:
        print("Error: invalid coordinates", file=sys.stderr)
        sys.exit(84)

    composed = identity_matrix()
    idx = 3
    while idx < len(sys.argv):
        transfo = sys.argv[idx]
        if transfo in ["-t", "-z"]:
            args = sys.argv[idx+1:idx+3]
            idx += 3
        elif transfo in ["-r", "-s"]:
            args = sys.argv[idx+1:idx+2]
            idx += 2
        else:
            print("Error: unknown transformation", file=sys.stderr)
            sys.exit(84)

        matrix = build_matrix(transfo, args)
        composed = multiply_matrices(matrix, composed)

    print_matrix(composed)
    final_x, final_y = apply_matrix(composed, x, y)
    print(f"({x:.2f}, {y:.2f}) => ({final_x:.2f}, {final_y:.2f})")

if __name__ == "__main__":
    main()