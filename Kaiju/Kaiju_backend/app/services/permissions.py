from app.core.errors import apiError, ERR_PERMISSION

LEVEL_PERMISSIONS = {
    1: {
        "view": ["QC", "LC", "CD"],
    },
    2: {
        "view": ["QC", "LC", "CD"],
        "reserve_own_quarter": ["QC"],
    },
    3: {
        "view": ["QC", "LC", "CD"],
        "reserve_own_quarter": ["QC"],
        "request_adjacent_transfer": ["QC"],
    },
    4: {
        "view": ["QC", "LC", "CD"],
        "reserve_own_quarter": ["QC"],
        "request_adjacent_transfer": ["QC", "LC"],
        "organize_transit": ["LC"],
        "requisition": ["CD"],
    },
    5: {
        "view": ["QC", "LC", "CD"],
        "reserve_own_quarter": ["QC"],
        "request_adjacent_transfer": ["QC", "LC", "CD"],
        "organize_transit": ["LC", "CD"],
        "requisition": ["CD"],
        "lower_retention_threshold": ["CD"],
    },
}


ALL_ACTIONS = [
    "view",
    "reserve_own_quarter",
    "request_adjacent_transfer",
    "organize_transit",
    "requisition",
    "lower_retention_threshold",
]


def isAllowed(level, role, action):
    allowed_roles = LEVEL_PERMISSIONS.get(level, {}).get(action, [])
    return role.value in allowed_roles


def getAllowedActions(level, role):
    return [action for action in ALL_ACTIONS if isAllowed(level, role, action)]


def checkPermission(level, role, action):
    if not isAllowed(level, role, action):
        raise apiError(
            403,
            ERR_PERMISSION,
            "Role " + role.value + " cannot '" + action + "' at level " + str(level),
        )
