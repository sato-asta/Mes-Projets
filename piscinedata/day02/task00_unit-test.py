import unittest
from task00 import multiply, multiply2, multiply10, getSecondMax

class TestMultiply(unittest.TestCase) :

    def test_multiply_integers(self):
        self.assertEqual(multiply(3, 4), 12)

    def test_multiply_floats(self):
        self.assertAlmostEqual(multiply(1.5, 2), 3.0)

    def test_multiply(self):
        self.assertEqual(multiply(3, 4), 12)

    def test_multiply_float(self):
        self.assertEqual(multiply(1.5, 2), 3.0)

    def test_multiply2(self):
        self.assertEqual(multiply2(5), 10)

    def test_multiply10(self):
        self.assertEqual(multiply10(-2), -20)

    def test_second_max(self):
        self.assertEqual(getSecondMax([5, 5, 5]), 0)

    def test_second_max_simple(self):
        self.assertEqual(getSecondMax([1, 2, 3]), 2)

    def test_second_max_error(self):
        with self.assertRaises(ValueError):
            getSecondMax([1, 1])

if __name__ == "__main__":
    unittest.main()