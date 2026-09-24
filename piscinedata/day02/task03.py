class Athlete:
    def __init__(self, name, country, birthdate):
        self._name = name
        self._country = country
        self._birthdate = birthdate
        self._records = {}

    def add_record(self, championship_name, rank):

        self._records[championship_name] = rank

    def setName(self, new_name):

        if new_name == "":
            raise ValueError
        self._name = new_name

    def setCountry(self, new_country):
        if new_country == "":
            raise ValueError

        self._country = new_country

    def setBirthdate(self, new_birthdate):
        if new_birthdate == "":
            raise ValueError

        self._birthdate = new_birthdate

    def print(self):
        print(f"My name is {self._name}, from {self._country}")
        print(f"My birth date is {self._birthdate}")

        if len(self._records) > 0:
            print(f"My records are :")

            for championship_name in sorted(self._records.keys()):
                print(f"Rank {self._records[championship_name]} at the {championship_name}")