#!/usr/bin/env/ python3
##############################
##         EPITECH          ##
##         101pong          ##
## ------------------------ ##
##   by Ronan and Nathan    ##
##############################

if __name__ == '__main__':
    from src.pong import start
    from src.base import *

    exit_code = start(argv)
    exit(exit_code)
