import math
from stats import calculate_means

def linear_regression_y_on_x(X, Y):
    n = len(X)
    mean_x = calculate_means(X)
    mean_y = calculate_means(Y)
    numerator = sum((X[i] - mean_x) * (Y[i] - mean_y) for i in range(n))
    denominator = sum((X[i] - mean_x) ** 2 for i in range(n))
    a = numerator / denominator
    b = mean_y - a * mean_x
    return a, b

def linear_regression_x_on_y(X, Y):
    n = len(X)
    mean_x = calculate_means(X)
    mean_y = calculate_means(Y)
    numerator = sum((X[i] - mean_x) * (Y[i] - mean_y) for i in range(n))
    denominator = sum((Y[i] - mean_y) ** 2 for i in range(n))
    a = numerator / denominator
    b = mean_x - a * mean_y
    return a, b

def calculate_rmsd_y(X, Y, a, b):
    n = len(X)
    return math.sqrt(sum((Y[i] - (a * X[i] + b)) ** 2 for i in range(n)) / n)

def calculate_rmsd_x(X, Y, a, b):
    n = len(X)
    return math.sqrt(sum((X[i] - (a * Y[i] + b)) ** 2 for i in range(n)) / n)

def predict_population_fit1(a, b, year=2050):
    return a * year + b

def predict_population_fit2(a, b, year=2050):
    return (year - b) / a

def prepare_data(years, populations_list):
    X = []
    Y = []

    for i, year in enumerate(years):
        total_pop = 0
        valid = True
        for pop_data in populations_list:
            if pop_data[i] is None:
                valid = False
                break
            total_pop += pop_data[i]
        if valid:
            X.append(year)
            Y.append(total_pop)
    return X, Y

