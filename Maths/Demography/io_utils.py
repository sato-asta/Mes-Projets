import sys
import csv

def print_usage():
    print("USAGE")
    print("    ./105demography [code]+")
    print()
    print("DESCRIPTION")
    print("    code    country code")

def exit_error(message):
    print(message, file=sys.stderr)
    sys.exit(84)

def load_data(filename, country_codes):
    try:
        with open(filename, 'r') as f:
            reader = csv.reader(f, delimiter=';')
            header = next(reader)

            years = [int(year) for year in header[2:]]
            country_names = []
            populations = []
            for row in reader:
                if row[1] in country_codes:
                    country_names.append(row[0])
                    pop_data = [
                        float(val) / 1_000_000 if val else None
                        for val in row[2:]
                    ]
                    populations.append(pop_data)
            if not populations:
                exit_error("Error: No country found with given codes")
            return country_names, years, populations
    except FileNotFoundError:
        exit_error("Error: File 105demography_data.csv not found")
    except Exception as e:
        exit_error(f"Error: {str(e)}")
