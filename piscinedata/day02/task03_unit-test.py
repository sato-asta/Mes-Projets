import unittest
from task03 import Athlete

class TestTask03(unittest.TestCase):
    def test_setters(self):
        a = Athlete("Bob", "FR", "2000")
        a.setName("Bobby")
        a.setCountry("ES")
        a.setBirthdate("1999")
        self.assertEqual(a._name, "Bobby")
        self.assertEqual(a._country, "ES")
        self.assertEqual(a._birthdate, "1999")

    def test_setter_error(self):
        a = Athlete("Bob", "FR", "2000")
        with self.assertRaises(ValueError):
            a.setName("")

if __name__ == "__main__":
    unittest.main()
