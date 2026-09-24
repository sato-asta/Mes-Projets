class Athlete:
    def __init__(self, name, country, birthdate):
        self.name = name
        self.country = country
        self.birthdate = birthdate
        self.records = {}

    def add_record(self, championship_name, rank):

        if not isinstance(championship_name, str) or championship_name == "":
            raise ValueError

        if not isinstance(rank, int) or rank < 1:
            raise ValueError

        self.records[championship_name] = rank

    def print(self):
        print(f"My name is {self.name}, from {self.country}.")
        print(f"My birth date is {self.birthdate}.")

        if len(self.records) > 0:
            print(f"My records are :")

            for championship_name in sorted(self.records.keys()):
                print(f"Rank {self.records[championship_name]} at the {championship_name}")