# 2026-05-27 Agent Operating Parameters

## Goal

Update the durable agent handoff instructions with the user's senior-owner operating parameters for future repository work.

## Starting State

- Branch: `main`, tracking `origin/main`.
- Relevant dirty files before edits: none according to `git status --short --branch`.
- Running services: not checked for this documentation-only update.
- Important user constraints: update the agent parameters; do not commit unless explicitly asked.

## Changes Made

- `AGENTS.md`: added a comprehensive `Agent Operating Parameters` section covering senior-owner mindset, general operating rules, audit mode, implementation mode, debugging mode, feature mode, new project mode, private strategy evaluation, and decision standards.
- `.sessions/SESSION_INDEX.md`: added this session to the newest-first index.
- `.sessions/2026-05-27-agent-operating-parameters.md`: added this handoff entry.

## Verification

- Command: `sed -n '1,360p' AGENTS.md`
  - Result: passed; confirmed the new `Agent Operating Parameters` section and mode-specific formats are present.
- Command: `sed -n '1,140p' .sessions/SESSION_INDEX.md`
  - Result: passed; confirmed the 2026-05-27 session entry is first in the index.
- Command: `git status --short --branch`
  - Result: passed; confirmed only `AGENTS.md`, `.sessions/SESSION_INDEX.md`, and this session file are changed.

## Blocked / Not Run

- App lint/typecheck/build were not run because this is a documentation-only operating-instructions update.

## Current Worktree State

Latest status recorded during this session:

```text
## main...origin/main
 M .sessions/SESSION_INDEX.md
 M AGENTS.md
?? .sessions/2026-05-27-agent-operating-parameters.md
```

## Next Agent Start Here

1. Read `AGENTS.md`.
2. Read `.sessions/SESSION_INDEX.md`.
3. Read the newest session file linked from the index.
4. Run `git status --short --branch`.
5. Follow the new Agent Operating Parameters for audits, implementation, debugging, features, and project creation.

## Next Steps

- Commit only if the user explicitly asks.
