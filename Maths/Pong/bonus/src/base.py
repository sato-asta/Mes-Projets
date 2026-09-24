##############################
##         EPITECH          ##
##         101pong          ##
## ------------------------ ##
##   by Ronan and Nathan    ##
##############################

## Variables ##
EXIT_SUCCESS = 0
EXIT_ERROR = 84
COLOR = {
    "BLACK" : (0, 0, 0),
    "WHITE" : (255, 255, 255),
}

## functions ##
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
