import json

status = {
    "ready": True,
    "human_blocker": False,
    "human_blocker_reason": "",
    "blockers_restantes": []
}

with open(".agents/release/status.json", "w") as f:
    json.dump(status, f, indent=4)
