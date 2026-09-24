from mongoengine import *

class Prize(Document):
    meta = {"collection": "prizes"}
    year = IntField()
    category = StringField()
    laureates = ListField(DictField())

class Laureate(Document):
    meta = {"collection": "laureates"}
    firstname = StringField()
    surname = StringField()
    bornCountryCode = StringField()
    diedCountryCode = StringField()

class Country(Document):
    meta = {"collection": "countries"}
    name = StringField()
    code = StringField()
