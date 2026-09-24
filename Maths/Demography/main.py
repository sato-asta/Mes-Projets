#!/usr/bin/env python3

import sys
from io_utils import print_usage, exit_error, load_data
from data_processing import prepare_data
from data_processing import (
    linear_regression_y_on_x, linear_regression_x_on_y,
    calculate_rmsd_y, calculate_rmsd_x,
    predict_population_fit1, predict_population_fit2
)
from stats import calculate_correlation

def main():
    if len(sys.argv) < 2:
        exit_error("Error: Missing country code")
    if sys.argv[1] == "-h":
        print_usage()
        sys.exit(0)
    country_codes = sys.argv[1:]
    country_names, years, populations = load_data("105demography_data.csv", country_codes)
    print(f"Country: {', '.join(country_names)}")
    X, Y = prepare_data(years, populations)
    if not X:
        exit_error("Error: No valid data found")
    a1, b1 = linear_regression_y_on_x(X, Y)
    rmsd1 = calculate_rmsd_y(X, Y, a1, b1)
    pop1 = predict_population_fit1(a1, b1)
    print("Fit1")
    print(f"    Y = {a1:.2f} X + {b1:.2f}")
    print(f"    Root-mean-square deviation: {rmsd1:.2f}")
    print(f"    Population in 2050: {pop1:.2f}")
    a2, b2 = linear_regression_x_on_y(X, Y)
    rmsd2 = calculate_rmsd_x(X, Y, a2, b2)
    pop2 = predict_population_fit2(a2, b2)
    print("Fit2")
    print(f"    X = {a2:.2f} Y + {b2:.2f}")
    print(f"    Root-mean-square deviation: {rmsd2:.2f}")
    print(f"    Population in 2050: {pop2:.2f}")
    corr = calculate_correlation(X, Y)
    print(f"Correlation: {corr:.4f}")

if __name__ == "__main__":
    main()