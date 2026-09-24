#!/usr/bin/env python3

import sys


def print_help():
    print("USAGE")
    print("    ./104neutrinos n a h sd")
    print("\nDESCRIPTION")
    print("    n   number of values")
    print("    a   arithmetic mean")
    print("    h   harmonic mean")
    print("    sd  standard deviation")


def error(msg):
    print(msg, file=sys.stderr)
    sys.exit(84)


def parse_args(argv):
    if len(argv) == 2 and argv[1] == "-h":
        print_help()
        sys.exit(0)

    if len(argv) != 5:
        error("Invalid number of arguments")

    try:
        n = int(argv[1])
        a = float(argv[2])
        h = float(argv[3])
        sd = float(argv[4])
    except ValueError:
        error("Arguments must be numeric")

    if n <= 0:
        error("n must be a positive integer")

    return {
        "n": n,
        "a": a,
        "h": h,
        "sd": sd
    }

def print_stats(state):
    print(f"Number of values: {state['n']}")
    print(f"Standard deviation: {state['sd']:.2f}")
    print(f"Arithmetic mean: {state['a']:.2f}")
    print(f"Root mean square: 0.00")
    print(f"Harmonic mean: {state['h']:.2f}")

def main():
    state = parse_args(sys.argv)

    while True:
        try:
            value = input("Enter next value: ")
        except EOFError:
            break
        if value == "END":
            break
        try:
            float(value)
        except ValueError:
            error("Invalid value")
        state["n"] += 1
        print_stats(state)


if __name__ == "__main__":
    main()
