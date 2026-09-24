from task03 import Athlete

class Competition:
    def __init__(self, name):
        self.name = name
        self.athletes = []

    def add_athlete(self, athlete):

        if athlete not in self.athletes:
            self.athletes.append(athlete)

    def exclude(self, athlete):

        if athlete in self.athletes:
            self.athletes.remove(athlete)

    def rank(self, athlete, rank):

        if not isinstance(rank, int) or rank < 1:
            raise ValueError

        athlete.add_record(self.name, rank)

    def print(self):
        if len(self.athletes) == 0:
            print(f"The {self.name} has no athlete.")
            return

        print(f"{len(self.athletes)} athlete(s) engaged in the {self.name}:")
        for athlete in sorted(self.athletes, key=lambda x: x._name):
                print(f"{athlete._name} ({athlete._birthdate}) from {athlete._country}")