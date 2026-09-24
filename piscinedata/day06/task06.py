from flask import jsonify, request, Flask
from task04 import get_prices
from task00 import make_dataframe
from task01 import get_departments
from task02 import get_towns

app = Flask(__name__)

df = make_dataframe("real_estate.csv")

DEFAULT_ROOMS_MIN = 1
DEFAULT_ROOMS_MAX = 10
DEFAULT_SQ_MIN = 20.0
DEFAULT_SQ_MAX = 200.0

def parse_int_query_param(param_name: str, default_value:int) -> int:
    param_value = request.args.get(param_name)
    if param_value is None:
        return default_value
    try:
        return int(param_value)
    except ValueError:
        raise ValueError

def parse_float_query_param(param_name: str, default_value:float) -> float:
    param_value = request.args.get(param_name)
    if param_value is None:
        return default_value
    try:
        return float(param_value)
    except ValueError:
        raise ValueError

@app.route("/departments", methods=["GET"])
def route_departments():
    departments_list = get_departments(df)
    return jsonify(departments_list), 200

@app.route("/towns/<department>", methods=["GET"])
def route_towns_for_department(department):
    towns_list = get_towns(df, department)
    return jsonify(towns_list), 200

@app.route("/prices/departments/<department>", methods=["GET"])
def route_prices_for_department(department):
    try:
        room_min = parse_int_query_param("room_min", DEFAULT_ROOMS_MIN)
        room_max = parse_int_query_param("room_max", DEFAULT_ROOMS_MAX)
        square_min = parse_float_query_param("square_min", DEFAULT_SQ_MIN)
        square_max = parse_float_query_param("square_max", DEFAULT_SQ_MAX)
    except ValueError:
        return jsonify({"error": "Invalid query parameters"}), 400

    available_departments = get_departments(df)
    if department not in available_departments:
        return jsonify([]), 200

    prices_list = get_prices(df, department, "", room_min, room_max, square_min, square_max)
    return jsonify(prices_list), 200

@app.route("/prices/departments/<department>/towns/<town>", methods=["GET"])
def route_prices_for_town(department, town):
    try:
        room_min = parse_int_query_param("room_min", DEFAULT_ROOMS_MIN)
        room_max = parse_int_query_param("room_max", DEFAULT_ROOMS_MAX)
        square_min = parse_float_query_param("square_min", DEFAULT_SQ_MIN)
        square_max = parse_float_query_param("square_max", DEFAULT_SQ_MAX)
    except ValueError:
        return jsonify({"error": "Invalid query parameters"}), 400

    available_departments = get_departments(df)
    if department not in available_departments:
        return jsonify([]), 200

    towns_in_department = get_towns(df, department)
    town_codes_in_department = {town_entry["insee_code"] for town_entry in towns_in_department}
    if town not in town_codes_in_department:
        return jsonify([]), 200

    prices_list = get_prices(df, department, town, room_min, room_max, square_min, square_max)
    return jsonify(prices_list), 200

if __name__ == "__main__":
    app.run(debug=True)
