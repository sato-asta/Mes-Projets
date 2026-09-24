import unittest
from io import StringIO
from contextlib import redirect_stdout
from task01 import Athlete

class TestTask01(unittest.TestCase):
    def test_add_record(self):
        a = Athlete("Bob", "FR", "2000")
        a.add_record("Champ", 1)
        self.assertEqual(a.records["Champ"], 1)

    def test_add_record_error(self):
        a = Athlete("Bob", "FR", "2000")
        with self.assertRaises(ValueError):
            a.add_record("", 1)

    def test_print(self):
        a = Athlete("Bob", "FR", "2000")
        f = StringIO()
        with redirect_stdout(f):
            a.print()
        out = f.getvalue().strip().split("\n")
        self.assertEqual(out[0], "My name is Bob, from FR.")
        self.assertEqual(out[1], "My birth date is 2000.")

if __name__ == "__main__":
    unittest.main()
