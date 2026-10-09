# Roamly — Agent Bootstrap Instructions

Before doing ANYTHING in this project, read these files in order:

1. **`docs/RULES.md`** — Coding law. Non-negotiable.
2. **`docs/MEMORY.md`** — Architecture decisions, API quirks, env vars, known bugs.
3. **`docs/TASKS.md`** — Current phase checklist. Know what's done and what's pending.
4. **`PROGRESS.md`** — Running changelog. Know the current state before writing any code.

After completing any work, update:
- **`docs/TASKS.md`** — Mark completed items `[x]`, add newly discovered tasks
- **`docs/MEMORY.md`** — Record new decisions, bugs fixed, new packages added
- **`PROGRESS.md`** — Append dated entry: what was built, files changed, decisions, bugs, what's next

---

## Quick Reference

| Need | File |
|---|---|
| Coding rules | `docs/RULES.md` |
| Product requirements | `docs/PRD.md` |
| Architecture & API notes | `docs/MEMORY.md` |
| Task checklist | `docs/TASKS.md` |
| Design system & wireframes | `docs/DESIGN.md` |
| Running changelog | `PROGRESS.md` |
| API contract | `API.md` |
| Category config | `frontend/src/config/categories.js` |
| Agent rules | `.agent/rules/roamly.md` |

---

## Hard Rules (repeat from RULES.md)

- **FREE ONLY** — no paid APIs, no hardcoded keys
- **Backend proxies all external calls** — frontend only calls `/api/*`
- **Null = "Not available"** — never guess missing values
- **Never label area "unsafe"** without 3+ independent reports
- **NEVER commit `.env`**
- **Never rename existing API endpoints**
- **Run tests before committing**
