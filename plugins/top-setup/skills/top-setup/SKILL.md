---
name: top-setup
description: "Set up a brand-new Odin Project (TOP) repo by following section 6 of Project - Brief.md. Manual only: run it as /top-setup <repo-name> when starting a new project."
disable-model-invocation: true
argument-hint: "<repo-name or git url>"
---

# TOP repo setup

Set up a new Odin Project repo exactly as the Project Brief describes.

1. Detect the OS and shell first (the Brief's "Detect the environment first"). Then read the entire Brief, start to finish, before doing anything: `Project - Brief.md` in the vault folder `Documents/Obsidian/The Odin Project/` (Windows: `C:\Users\s-lin\OneDrive\Documents\Obsidian\The Odin Project\`; WSL: `/mnt/c/Users/s-lin/OneDrive/Documents/Obsidian/The Odin Project/`). Then read `Claude Code Toolbox.md` and only the Toolbox file(s) this project touches.
2. Follow section 6 ("Starting a New Project") step by step, including everything under its subsections. The argument is the repo name or git URL. Re-derive everything fresh: the sequence number, the recently taught range, which Toolbox files apply. Reuse nothing from an earlier project. If this skill's wording disagrees with the Brief, the Brief wins.
3. Read the Brief's "Later" section if it has one. It is a general list of recommendations, not hard triggers. If this project's topic looks related to an entry, mention it once as an optional suggestion and let Samuel accept or skip it. Never insist, and never raise the same entry twice in one setup.
4. Where the Brief says to copy a file from a sibling repo, use the newest `odin-*` repo in the repos folder found by the environment check (not a hardcoded `~/repos`).
5. After the TODO.md question, run the Brief's "Catch-up mode" subsection.

Rules that always hold:
- Setup means docs and tooling only. Never create project source files, `package.json`, `package-lock.json`, `webpack.config.js` or `src/`.
- Nothing in the repo, its files or its history may mention Claude or AI. Do not commit or push unless Samuel asks.
- No em dashes or en dashes in anything written. Use a plain spaced hyphen.
- Plugins are added by Samuel in Customize > Plugins, never with `claude plugin install`. Tell him which plugin when one is needed.
- If the Brief is unclear or contradicts itself, ask before guessing.

Finish with a short list: what was created, what Samuel still has to do, and anything in the Brief that looked outdated.
