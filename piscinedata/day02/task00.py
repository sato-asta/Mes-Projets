import heapq


def multiply(a, b):
    return a * b

def multiply2(x):
    return x * 2

def multiply10(x):
    return x * 10

def getSecondMax(numbers):
    sorted_numbers = sorted(set(numbers))
    length = len(sorted_numbers)

    if length == 0:
        raise ValueError

    if length == 1:
        if len(numbers) > 2:
            return 0
        raise ValueError

    return sorted_numbers[-2]