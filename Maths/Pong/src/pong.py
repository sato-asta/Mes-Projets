##############################
##         EPITECH          ##
##         101pong          ##
## ------------------------ ##
##   by Ronan and Nathan    ##
##############################

from src.ball import *
from src.base import *

class Pong :
    """just a window"""

    def __init__(
            self,
            argv : list[str]
            ) -> None :
        """create a window"""

        assert type(argv) == list, "argv must be a list"
        for arg in argv :
            assert type(arg) == str, "arg must be a string"
        assert len(argv) == 8, "argv must have 8 arguments"

        x, y, z = (0, 0, 0)
        vx, vy, vz = (0, 0, 0)
        n = 0

        assert is_float(argv[1], 1); x = float(argv[1])
        assert is_float(argv[2], 2); y = float(argv[2])
        assert is_float(argv[3], 3); z = float(argv[3])
        assert is_float(argv[4], 4); vx = float(argv[4]) - x
        assert is_float(argv[5], 5); vy = float(argv[5]) - y
        assert is_float(argv[6], 6); vz = float(argv[6]) - z
        assert is_int(argv[7], 7); n = int(argv[7])
        assert n >= 0, "n must be equal or greater than 0"

        self.ball = Ball(x, y, z, vx, vy, vz)
        self.n = n + 1

    def show (
            self
            ) -> None :
        """returns string representation of ball"""

        self.ball.show(self.n)

    def __call__(
            self
            ) -> None :
        """update ball's location"""

        self.ball.update()

def start(
        argv : list[str]
        ) -> int :
    """start pong game"""
    try :
        assert len(argv) > 1, "Error: must have at least 1 argument"
        if argv[1] in ['-h', '--help']:
            print(
                "USAGE"
                "\n    ./101pong x0 y0 z0 x1 y1 z1 n"
                "\n"
                "\n"
                "\nDESCRIPTION"
                "\n    x0  ball abscissa at time t - 1"
                "\n    y0  ball ordinate at time t - 1"
                "\n    z0  ball altitude at time t - 1"
                "\n    x1  ball abscissa at time t"
                "\n    y1  ball ordinate at time t"
                "\n    z1  ball altitude at time t"
                "\n    n   time shift (greater than or equal to zero, integer)")
        else :
            pong = Pong(argv)
            for n in range(pong.n) : pong()
            pong.show()

    except AssertionError as error :
        print(f"Error: {error}")
        return EXIT_ERROR

    return EXIT_SUCCESS
