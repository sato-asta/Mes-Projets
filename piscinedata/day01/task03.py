class Budget:
    
    def __init__(self):
        self._transactions = []
    def add_transactions(self, number_list):
        if not number_list:
            return
        
        for value in number_list:
            if value != 0:
                self._transactions.append(value)#
    
    def print_transactions(self):
        if not self._transactions:
            return
        
        for value in self._transactions:
            if value == 0:
                continue
            elif value > 0:
                print(f"You received {value:.2f} euros")
            else:
                print(f"You spent {abs(value):.2f} euros")
    
    def print_sorted_transactions(self):

        if not self._transactions:
            return

        croissant = sorted(self._transactions)
        
        for value in croissant:
            if value == 0:
                continue
            elif value > 0:
                print(f"You received {value:.2f} euros")
            else:
                print(f"You spent {abs(value):.2f} euros")