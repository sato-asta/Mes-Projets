import unittest
from task02 import Athlete

class TestTask02(unittest.TestCase):
    def test_private_attributes(self):
        a = Athlete("Bob", "FR", "2000")
        self.assertFalse(hasattr(a, "name"))
        self.assertTrue(hasattr(a, "_name"))

    def test_add_record(self):
        a = Athlete("Bob", "FR", "2000")
        a.add_record("Test", 2)
        self.assertEqual(a._records["Test"], 2)

if __name__ == "__main__":
    unittest.main()
