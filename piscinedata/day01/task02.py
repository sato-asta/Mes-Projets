def print_sorted_transactions(number_list):
    croissant = sorted(number_list)

    if not croissant:
        return

    for value in croissant:
        if value == 0:
            continue
        elif value > 0:
            print(f"You received {value:.2f} euros")
        else:
            print(f"You spent {abs(value):.2f} euros")
