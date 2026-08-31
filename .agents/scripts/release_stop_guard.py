#!/usr/bin/env python3
import json
import sys
from pathlib import Path

try:
    payload = json.load(sys.stdin)
except Exception:
    payload = {}

workspace_paths = payload.get("workspacePaths") or []
execution_num = int(payload.get("executionNum") or 0)
termination_reason = payload.get("terminationReason") or ""

# Never fight hard system limits/errors indefinitely.
if termination_reason in {"error", "cancelled", "user_stop"}:
    print(json.dumps({"decision": "allow"}))
    raise SystemExit(0)

if not workspace_paths:
    print(json.dumps({"decision": "allow"}))
    raise SystemExit(0)

workspace = Path(workspace_paths[0])
status_path = workspace / ".agents" / "release" / "status.json"

try:
    status = json.loads(status_path.read_text(encoding="utf-8"))
except Exception:
    status = {"ready": False, "human_blocker": False}

# User/human action required: allow the agent to stop and ask.
if status.get("human_blocker") is True:
    print(json.dumps({"decision": "allow"}))
    raise SystemExit(0)

# Release ready: allow clean stop.
if status.get("ready") is True:
    print(json.dumps({"decision": "allow"}))
    raise SystemExit(0)

# Safety cap: avoid infinite loops. The next user run can resume from status.
if execution_num >= 30:
    print(json.dumps({
        "decision": "allow",
        "reason": "Release guard safety cap reached. Preserve status.json and resume from remaining blockers on next invocation."
    }))
    raise SystemExit(0)

print(json.dumps({
    "decision": "continue",
    "reason": (
        "RELEASE MODE: V1 is not marked ready and there is no human blocker. "
        "Do not stop. Continue autonomously: inspect remaining launch blockers, "
        "delegate/recheck QA as needed, apply the smallest fix, retest, build, "
        "and update .agents/release/status.json. Do not open new architecture or editorial work."
    )
}))
