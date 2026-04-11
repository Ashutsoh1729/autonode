# Skills Guide — Teaching Your LLM New Tricks

Skills are **folders of instructions, scripts, and resources** that live inside your project and extend what an LLM coding assistant can do. When the LLM encounters a task that matches a skill, it reads the instructions and follows them exactly — like giving it a domain-specific playbook.

---

## 1. Where Skills Live

Skills are placed in a `.agent/skills/` directory at the root of your project:

```
your-project/
├── .agent/
│   ├── skills/
│   │   ├── deploy/
│   │   │   ├── SKILL.md          ← required entry-point
│   │   │   ├── scripts/
│   │   │   │   └── deploy.sh
│   │   │   └── resources/
│   │   │       └── env.template
│   │   ├── testing/
│   │   │   ├── SKILL.md
│   │   │   └── examples/
│   │   │       └── sample_test.ts
│   │   └── database/
│   │       └── SKILL.md
│   └── workflows/            ← (separate concept, not skills)
├── src/
└── ...
```

> [!IMPORTANT]
> Each skill **must** have a `SKILL.md` file at its root. This is the only file the LLM reads automatically to learn the skill.

---

## 2. Anatomy of `SKILL.md`

Every `SKILL.md` has **two parts**: YAML front-matter (metadata) and Markdown body (instructions).

````markdown
---
name: deploy
description: How to build and deploy the application to production
---

## Prerequisites

- Ensure you have AWS CLI configured (`aws configure`)
- The `.env.production` file must exist

## Steps

1. Run the build script:
   ```bash
   ./scripts/deploy.sh --env production
   ```
````

2. Verify the deployment:
   ```bash
   curl https://api.example.com/health
   ```

## Rules

- **Never** deploy without running tests first.
- Always use the `--env` flag; bare `deploy.sh` defaults to staging.
- If the health check fails, rollback immediately with:
  ```bash
  ./scripts/deploy.sh --rollback
  ```

```

### Front-matter Fields

| Field         | Required | Purpose                                                |
| ------------- | -------- | ------------------------------------------------------ |
| `name`        | ✅        | Short identifier (used in logs & references)           |
| `description` | ✅        | One-line summary the LLM uses to decide relevance      |

### Body (Markdown)

Write the body **as if you are writing instructions for a junior developer** — be explicit, step-by-step, and leave no room for interpretation. The LLM will follow these instructions literally.

---

## 3. Optional Supporting Directories

A skill folder can contain anything, but these three sub-directories are conventional:

| Directory     | Purpose                                                       |
| ------------- | ------------------------------------------------------------- |
| `scripts/`    | Executable helpers the skill's instructions reference          |
| `examples/`   | Reference implementations the LLM can study or copy           |
| `resources/`  | Templates, configs, data files the skill needs                |

```

.agent/skills/testing/
├── SKILL.md
├── scripts/
│ └── run_e2e.sh # script the SKILL.md tells the LLM to execute
├── examples/
│ └── sample_api_test.ts # pattern the LLM should follow when writing tests
└── resources/
└── fixtures.json # test data the LLM can reference

```

---

## 4. How the LLM Discovers & Uses Skills

The discovery flow works like this:

```

User sends a request
│
▼
LLM scans .agent/skills/ directory
│
▼
Reads the `description` from each SKILL.md front-matter
│
▼
If a skill seems relevant to the current task ───► Reads the FULL SKILL.md
│ │
▼ ▼
No match → proceeds with Follows the instructions
general knowledge exactly as documented

````

### Key behaviours

1. **Description matching** — the `description` field is what the LLM uses to decide if a skill is relevant. Make it specific and searchable.
2. **Full read before action** — once a skill is deemed relevant, the LLM reads the *entire* `SKILL.md` before doing anything.
3. **Strict adherence** — the LLM treats skill instructions as authoritative. If the skill says "use `pnpm`", it will use `pnpm` even if it would normally default to `npm`.
4. **Referencing sub-files** — the `SKILL.md` can point to scripts, examples, or resources. The LLM will read those files when instructed.

---

## 5. Writing Effective Skills — Best Practices

### ✅ Do

- **Be explicit.** Specify exact commands, flags, file paths.
- **Add rules/constraints.** E.g., "Never delete migration files", "Always run linting before commit".
- **Include examples.** A concrete example is worth 100 lines of explanation.
- **Keep it scoped.** One skill = one capability. Don't combine "deploy" and "database migrations" into a single skill.
- **Use headings.** The LLM parses Markdown structure to understand sections.

### ❌ Don't

- **Don't be vague.** "Deploy the app" → Bad. "Run `./scripts/deploy.sh --env production` and verify with the health endpoint" → Good.
- **Don't assume context.** State prerequisites clearly.
- **Don't put logic in SKILL.md that belongs in a script.** If it's more than 3-4 commands, write a script and reference it.
- **Don't create overlapping skills.** Two skills that both cover "testing" will confuse the LLM.

---

## 6. Practical Example — Creating a "Linting" Skill

### Step 1: Create the directory

```bash
mkdir -p .agent/skills/linting
````

### Step 2: Write `SKILL.md`

```markdown
---
name: linting
description: How to lint and auto-fix code in this project
---

## Overview

This project uses **ESLint** (v9, flat config) and **Prettier**.

## Lint the Entire Project

\`\`\`bash
npx eslint . --fix
npx prettier --write .
\`\`\`

## Lint a Single File

\`\`\`bash
npx eslint <file> --fix
npx prettier --write <file>
\`\`\`

## Rules

- Always run linting after making code changes.
- Never disable an ESLint rule inline without a comment explaining why.
- If a rule conflict exists between ESLint and Prettier, Prettier wins.
```

### Step 3: (Optional) Add a helper script

```bash
# .agent/skills/linting/scripts/lint-all.sh
#!/usr/bin/env bash
set -euo pipefail
npx eslint . --fix
npx prettier --write .
echo "✅ Linting complete"
```

Reference it in `SKILL.md`:

```markdown
## Quick Lint

Run the bundled script:
\`\`\`bash
./.agent/skills/linting/scripts/lint-all.sh
\`\`\`
```

That's it. Next time you ask the LLM to "lint the code" or "fix formatting", it will discover this skill, read the instructions, and follow them exactly.

---

## 7. Skills vs Workflows — What's the Difference?

| Aspect     | Skill                                        | Workflow                                     |
| ---------- | -------------------------------------------- | -------------------------------------------- |
| Location   | `.agent/skills/<name>/SKILL.md`              | `.agent/workflows/<name>.md`                 |
| Structure  | Folder with `SKILL.md` + optional sub-dirs   | Single `.md` file                            |
| Purpose    | Teach a **capability** (how to do something) | Define a **process** (a sequence of steps)   |
| Complexity | Can include scripts, examples, resources     | Typically just step-by-step instructions     |
| Triggered  | Automatically when task matches description  | Explicitly via slash command or user request |

> [!TIP]
> Use **skills** for reusable capabilities ("how to deploy", "how to test") and **workflows** for one-off processes ("release checklist", "onboard new developer").

---

## 8. Quick-Start Checklist

- [ ] Create `.agent/skills/<skill-name>/` directory
- [ ] Add a `SKILL.md` with `name` and `description` in YAML front-matter
- [ ] Write clear, step-by-step instructions in the Markdown body
- [ ] Add `scripts/`, `examples/`, or `resources/` if needed
- [ ] Test by asking the LLM to perform the task — verify it follows your instructions
- [ ] Iterate on the `SKILL.md` wording until the LLM behaves exactly as you want
