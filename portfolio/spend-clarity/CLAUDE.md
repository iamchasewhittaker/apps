# CLAUDE.md — ynab-enrich (Spend Clarity)

## Coding tools
This project lives at `portfolio/spend-clarity/` in the monorepo (`~/Developer/chase`).

| Tool | How to start |
|------|-------------|
| **Claude Code** | Run from repo root — reads this file automatically |
| **Cursor** | Open `portfolio/spend-clarity/` as workspace — `.cursor/rules/session-handoff.mdc` symlink auto-loads handoff conventions |
| **Antigravity (VS Code)** | Open `portfolio/spend-clarity/` — reads `CLAUDE.md` automatically |
| **Codex (OpenAI)** | Paste this file's header + `HANDOFF.md` State table into the prompt |
| **Windsurf / other** | Paste `HANDOFF.md` + top of this file into chat manually |

Always read **`HANDOFF.md`** and **`LEARNINGS.md`** (this folder) before starting work. Update both when you stop.

> *"For Reese. For Buzz. Forward — no excuses."*

## Learnings
Read **`LEARNINGS.md`** at session start for project-specific gotchas.
After a session where something unexpected happened or was learned, append an entry.

## Project
Standalone Python CLI that enriches YNAB transactions with item-level detail from receipt emails (Amazon, Apple) and merchant data from Privacy.com. Personal tool, runs locally on Chase's machine or via `launchd`. Not a plugin, not a service.

## Structure
```
src/ynab_enrich/
  cli.py              # `ynab-enrich run|digest`
  config.py           # env + Keychain + budget resolution
  ynab_client.py
  gmail_client.py
  privacy_client.py
  parsers/{amazon,apple}.py
  matcher.py          # amount + date (±1 day)
  writer.py           # DRY_RUN-aware memo updates
  logging_setup.py    # redacting formatter
tests/
```

## Conventions
- Python 3.11+, `uv` or venv, `pyproject.toml`.
- Type hints everywhere. `ruff` + `mypy` clean.
- One module = one responsibility.
- All external I/O through a client class.
- Tests use sanitized recorded fixtures, never live APIs.

## Safety rules (non-negotiable)
- `DRY_RUN=true` default. Live writes need explicit `--force` or `DRY_RUN=false`.
- Never overwrite an existing YNAB memo. Skip and log.
- Never guess on ambiguous matches. Skip and log.
- Match: amount equal + date within ±1 day.
- Log resolved YNAB budget name + ID at startup.
- CLI idempotent and bounded (`--since 7d`).

## Secrets handling (security-critical)
Real-money credentials. Treat accordingly.

- **macOS Keychain is the source of truth** for `YNAB_TOKEN` and `PRIVACY_API_KEY`. Use Python `keyring`.
- **Gmail OAuth** lives in `~/.config/ynab-enrich/` (`chmod 700` dir, `chmod 600` files). Never in the repo.
- **No secrets in the repo, ever.** `.env.example` with placeholders only.
- **`.gitignore` from commit 1:** `.env`, `secrets/`, `*.json` at root, `.venv/`, `*.log`, `__pycache__/`.
- **Pre-commit hook:** `gitleaks` via `pre-commit`. Non-optional.

**Loading pattern (`config.py`):**
```python
import keyring
SERVICE = "ynab-enrich"

def get_secret(name: str) -> str:
    val = keyring.get_password(SERVICE, name)
    if not val:
        raise RuntimeError(
            f"Missing secret {name!r}. Run: keyring set {SERVICE} {name}"
        )
    return val
```
Env vars are only for non-secret config. Never fall back to env for tokens.

**First-time setup:**
```
keyring set ynab-enrich YNAB_TOKEN
keyring set ynab-enrich PRIVACY_API_KEY
mkdir -p ~/.config/ynab-enrich && chmod 700 ~/.config/ynab-enrich
# drop Gmail client secrets JSON there, chmod 600
```

**Logging rules:**
- Redacting formatter: `Bearer \S+` and token patterns → `***`.
- Never log raw API responses without the redactor.
- Log file `chmod 600`.

## Non-secret environment
```
YNAB_BUDGET=last-used
DRY_RUN=true
LOG_PATH=~/Library/Logs/ynab-enrich.log
GMAIL_TOKEN_PATH=~/.config/ynab-enrich/gmail_token.json
GMAIL_CLIENT_SECRETS_PATH=~/.config/ynab-enrich/gmail_client.json
```

## Budget resolution
Default `last-used`. Override via `YNAB_BUDGET` (name or ID). Resolve once per run, verify before any write.

## Out of scope (v1)
Web scraping, Firecrawl, auto-categorization beyond memos, web UI, multi-user.

## Error handling
- Network: retry w/ backoff (3), then fail. No partial writes.
- Parser error on one email: log + skip, continue batch.
- Unknown email format: log msg ID + subject, skip.

## Roadmap
1. Enrich (current)
2. Category audit
3. Weekly partner digest
