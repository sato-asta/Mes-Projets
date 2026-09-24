##############################
##         EPITECH          ##
##         101pong          ##
## ------------------------ ##
##   by Ronan and Nathan    ##
##############################

## Modules ##
from sys import exit, argv
from numpy import array, arcsin
from numpy import angle
from math import sqrt, degrees

## Variables ##
EXIT_SUCCESS = 0
EXIT_ERROR = 84

## functions ##
def is_int(
        var : str,
        num : int = 0,
        err : str | None = None
        ) -> int :
    """returns true if given string can be converted to an integer"""

    if not err :
        err = f"arg no.{num} must be of type integer"
    try :
        int(var)
    except ValueError :
        assert False, err
    return True

def is_float(
        var : str,
        num : int = 0,
        err : str | None = None
        ) -> int :
    """returns true if given string can be converted to an integer"""

    if not err :
        err = f"arg no.{num} must be of type integer or float"
    try :
        float(var)
    except ValueError :
        assert False, err
    return True

def put_float(
        val : float | int,
        r : int = 2
        ) -> None :
    """print float rounded at r and filled by 0 if float decimal shorter than r"""

    s = str(round(val, r))
    len_float = len(s.split(".")[1])

    print(s, end = "")
    while len_float < r :
        print(0, end = "")
        len_float += 1
