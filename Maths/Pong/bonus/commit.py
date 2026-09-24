## commit_name ##
## by JARJARBIN'S STUDIO ##

import os, time

commit_lines = {
    "ADD" : [],
    "FIX" : [],
    "UPDATE" : [],
    "REMOVE" : []
    }
commit_color = {
    "ADD" : "\033[92m",
    "FIX" : "\033[94m",
    "UPDATE" : "\033[96m",
    "REMOVE" : "\033[91m"
    }
commit_title = ""
commit_description = ""
file_type = ["", ".py", ".c", ".h", ".txt"]

def get_dir(*, path : str = "./") -> list :
    """Gets a list of all files in the current directory (recursively)."""
    dir_list = [(path + dir + "/") for dir in os.listdir(path) if os.path.isdir(path + dir)]
    sub_dir = []
    for dir in dir_list :
        sub_dir += get_dir(path=dir)
    return ["./"] + dir_list + sub_dir

def clear() -> None :
    """Clears the terminal screen."""
    os.system('clear')

def place(*, category : str | None = None) -> None :
    """Prints the current state of commit_lines."""
    if category :
        if not (commit_lines[category] in [[], ['']]) :
            print(f"{commit_color[category]}{category}\033[0m :")
            for file in commit_lines[category] :
                if file != '' : print(f"  - {commit_color[category]}{file}\033[0m")
        return
    print(f"\033[97m{commit_title}\033[0m\n")
    for category in commit_lines : place(category = category)

def correct(inpt : str) -> str :
    """Do a correction on the path."""
    new_inpt = "./" + inpt.removeprefix("./")
    in_added_action = False
    for added_action in commit_lines:
        if new_inpt in commit_lines[added_action]:
            in_added_action = True
            break
    if not (os.path.isfile(new_inpt) or in_added_action):
        for dir in get_dir() :
            for type in file_type:
                new_inpt = dir + inpt + type
                if os.path.isfile(new_inpt) :
                    in_added_action = False
                    for added_action in commit_lines:
                        if new_inpt.removeprefix("./") in commit_lines[added_action]:
                            in_added_action = True
                            break
                    if not in_added_action:
                        return new_inpt
    return inpt

def fill() -> None :
    """Fills the commit_lines dictionary with file paths from user input (if file paths exists)."""
    count = 0
    for action in commit_lines :
        file = " "
        while file != "":
            count += 1
            clear()
            place(category = action)
            inpt = input(f"\nnew {commit_color[action]}{action}\033[0m :\n    >>> ")
            if inpt == "-" :
                if len(commit_lines[action]) > 0 :
                    commit_lines[action].pop(-1)
                else :
                    print(f'\n\033[31m[ERROR] -> No more file to delete, list is empty\033[0m')
                    time.sleep(2)
            elif inpt == "--" :
                if len(commit_lines[action]) > 0 :
                    commit_lines[action] = []
                else :
                    print(f'\n\033[31m[ERROR] -> No more file to delete, list is empty\033[0m')
                    time.sleep(2)
            else :
                inpt = correct(inpt)
                file = inpt.split("->")[0]
                if os.path.isfile(file) or (action == "REMOVE") :
                    in_added_action = False
                    for added_action in commit_lines :
                        if file in commit_lines[added_action] :
                            in_added_action = True
                            break
                    if not in_added_action : commit_lines[action].append(inpt.removeprefix("./"))
                    else :
                        print(f'\n\033[33m[WARNING] -> "{file}" is already added under {added_action}.\033[0m')
                        time.sleep(2)
                elif file != "" :
                    print(f'\n\033[31m[ERROR] -> "{file}" is not a valid file path.\033[0m')
                    time.sleep(2)

def get_title() -> None :
    """Generates the commit title based on the first non-empty action in commit_lines and user input."""
    global commit_title
    commit_title_action = ""
    for action in commit_lines :
        print(commit_lines[action])
        if commit_lines[action] != [] :
            commit_title_action = action
            break
    clear()
    commit_title = f"[{commit_title_action}] {input(f"TITLE : [{commit_color[commit_title_action]}{commit_title_action}\033[0m] :\n    >>> ")}"

def get_description() -> None :
    """Generates the commit description based on the contents of commit_lines."""
    global commit_description
    for key in commit_lines :
        if commit_lines[key] != [''] :
            for file in commit_lines[key] :
                if file != '' : commit_description += f"\n[{key}] {file}"

def copy_commit_name() -> None :
    """Generates the commit title and description, copies them to clipboard."""
    global commit_lines, commit_title, commit_description
    fill()
    get_title()
    get_description()
    os.system(f'echo "{commit_title}\n{commit_description}" | clipboard')
    clear()

def main()-> None :
    try : copy_commit_name()
    except KeyError :
        clear()
        print("\033[31m--- [ERROR] -> An unexpected error occurred. Please try again. ---\033[0m")
    else :
        print("\033[32m--- [SUCCESS] -> Commit name copied to clipboard! ---\033[0m\n")
        place()

main()