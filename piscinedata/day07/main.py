import task02
from task04 import insert_countries
from task03 import insert_categories
from task05 import insert_laureates
from task06 import insert_prizes
from task08 import french_prizes
from task09 import peace_prizes
from task07 import multiple_prizes

task02.creates_database("nobel.db")
insert_countries("nobels.json", "nobel.db")
insert_categories("nobels.json", "nobel.db")
insert_laureates("nobels.json", "nobel.db")
insert_prizes("nobels.json", "nobel.db")
#print(french_prizes("nobel.db"))
#print(multiple_prizes("nobel.db")[:5])
print(peace_prizes("nobel.db"))