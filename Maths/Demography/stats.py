import math

def calculate_means(data):
    return sum(data) / len(data)

def calculate_correlation(X, Y):
    n = len(X)
    mean_x = calculate_means(X)
    mean_y = calculate_means(Y)
    numerator = sum((X[i] - mean_x) * (Y[i] - mean_y) for i in range(n))
    sum_x_squared = sum((X[i] - mean_x) ** 2 for i in range(n))
    sum_y_squared = sum((Y[i] - mean_y) ** 2 for i in range(n))
    denominator = math.sqrt(sum_x_squared * sum_y_squared)
    return numerator / denominator
