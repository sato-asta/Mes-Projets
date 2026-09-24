import json

class Budget:

    def __init__(self, json_path=None):
        self.transactions = []

        if json_path is not None:
            with open(json_path, "r") as file:
                data = json.load(file)
                lst = data.get("transactions", [])
                self.add_transactions(lst)

                if len(self.transactions) == 0:
                    print("No transactions found in the JSON file.")

    def add_transactions(self, number_list):
        if not number_list:
            return

        for value in number_list:
            if value != 0:
                self.transactions.append(value)

    def print_transactions(self):
        if len(self.transactions) == 0:
            return

        for value in self.transactions:
            if value > 0:
                print("You received {:.2f} euros".format(value))
            else:
                print("You spent {:.2f} euros".format(abs(value)))

    def print_sorted_transactions(self):
        if len(self.transactions) == 0:
            return

        sorted_list = sorted(self.transactions)

        for value in sorted_list:
            if value > 0:
                print("You received {:.2f} euros".format(value))
            else:
                print("You spent {:.2f} euros".format(abs(value)))
