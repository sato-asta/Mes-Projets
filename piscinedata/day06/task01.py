import pandas as pd

def format_department(dep):
    dep = str(dep)

    if dep in ["2A", "2B"]:
        return dep

    if dep.isdigit() and len(dep) == 1:
        return "0" + dep
    return dep

def get_departments(df):
    col = "Code INSEE du département"
    deps = []

    for value in df[col]:
        if pd.notna(value):
            code = format_department(value)
            if code not in deps:
                deps.append(code)

    deps.sort()
    return deps
