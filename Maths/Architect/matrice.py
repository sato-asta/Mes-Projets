##############################
##         EPITECH          ##
##         102architect     ##
## ------------------------ ##
##         by Ronan         ##
##############################


import math

def identity_matrix():
    return [
        [1.0, 0.0, 0.0],
        [0.0, 1.0, 0.0],
        [0.0, 0.0, 1.0]
    ]

def translation_matrix(i, j):
    return [
        [1.0, 0.0, i],
        [0.0, 1.0, j],
        [0.0, 0.0, 1.0]
    ]

def scaling_matrix(m, n):
    return [
        [m,   0.0, 0.0],
        [0.0, n,   0.0],
        [0.0, 0.0, 1.0]
    ]

def rotation_matrix(d):
    rad = math.radians(d)
    return [
        [math.cos(rad), -math.sin(rad), 0.0],
        [math.sin(rad),  math.cos(rad), 0.0],
        [0.0,            0.0,           1.0]
    ]

def reflection_matrix(d):
    rad = math.radians(d)
    return [
        [math.cos(2*rad), math.sin(2*rad), 0.0],
        [math.sin(2*rad), -math.cos(2*rad), 0.0],
        [0.0,   0.0,  1.0]
    ]
