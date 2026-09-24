def print_transactions(number_list):

    if not number_list:
        return

    for value in number_list:
        if value == 0:
            continue
        elif value > 0:
            print(f"You received {value:.2f} euros")
        else:
            print(f"You spent {abs(value):.2f} euros")
