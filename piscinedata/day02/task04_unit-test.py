import unittest
from io import StringIO
from contextlib import redirect_stdout
from task03 import Athlete
from task04 import Competition

class TestTask04(unittest.TestCase):
    def test_add_athlete(self):
        c = Competition("Test")
        a = Athlete("Bob", "FR", "2000")
        c.add_athlete(a)
        self.assertIn(a, c.athletes)

    def test_rank(self):
        c = Competition("Test")
        a = Athlete("Bob", "FR", "2000")
        c.add_athlete(a)
        c.rank(a, 1)
        self.assertEqual(a._records["Test"], 1)

    def test_print_empty(self):
        c = Competition("Test")
        f = StringIO()
        with redirect_stdout(f):
            c.print()
        self.assertIn("has no athlete", f.getvalue())

if __name__ == "__main__":
    unittest.main()
