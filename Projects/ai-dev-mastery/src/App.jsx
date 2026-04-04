import { useState, useEffect } from "react";

const curriculum = [
  {
    id: "claude-code",
    title: "Claude Code",
    icon: "◈",
    color: "#E8A87C",
    accent: "#3D2B1F",
    tagline: "AI-native terminal development",
    modules: [
      {
        title: "What is Claude Code?",
        duration: "10 min",
        type: "Concept",
        content: {
          summary: "Claude Code is Anthropic's agentic CLI tool that lets Claude read, write, and execute code directly in your terminal — no copy-pasting required.",
          points: [
            "Runs as a command-line tool (`claude`) inside any project directory",
            "Has full filesystem access: reads files, creates files, runs shell commands",
            "Understands your entire codebase via context — not just the current file",
            "Can run tests, fix failing tests, commit to Git, and iterate autonomously",
            "Works across stacks: Python, TypeScript, Ruby, Go, shell scripts, and more",
          ],
          tip: "Think of Claude Code as a junior developer who lives in your terminal — you give it goals, it figures out the steps.",
          quiz: [
            { q: "What file do you create to give Claude Code persistent project memory?", options: ["README.md", "CLAUDE.md", ".env", "context.json"], answer: 1 },
            { q: "Which flag lets Claude Code act without asking for approval each step?", options: ["--auto", "--skip-confirm", "--dangerously-skip-permissions", "--headless"], answer: 2 },
          ],
                    devTip: {
            label: "Treat Claude Code like a junior engineer on your team",
            insight: "Senior devs don't give juniors 500-line tasks with no context. They give small, well-scoped tasks with clear acceptance criteria and a pointer to relevant files. Claude Code works exactly the same way — the quality of your delegation determines the quality of the output. Before running a big command, ask yourself: would I be comfortable assigning this exact task to a new hire on day one?",
            antipattern: "Running `claude 'refactor the whole app'` is like telling a junior dev to 'fix everything.' It produces bloated, unfocused diffs. Break it into `claude 'extract auth logic into auth.service.ts'` then `claude 'add error handling to auth.service.ts'` — one focused task at a time.",
          },
        },
      },
      {
        title: "Installation & Setup",
        duration: "15 min",
        type: "Hands-on",
        content: {
          summary: "Get Claude Code running locally in under 5 minutes.",
          points: [
            "Requires Node.js 18+ — check with `node --version`",
            "Install globally: `npm install -g @anthropic-ai/claude-code`",
            "Authenticate: `claude` will prompt for your Anthropic API key on first run",
            "Set API key as env var: `export ANTHROPIC_API_KEY=sk-ant-...`",
            "Verify: `claude --version` should print the installed version",
          ],
          code: "npm install -g @anthropic-ai/claude-code\nexport ANTHROPIC_API_KEY=your_key_here\nclaude",
          tip: "Add ANTHROPIC_API_KEY to your shell profile (.zshrc or .bashrc) so you never have to set it again.",
          quiz: [
            { q: "What is the minimum Node.js version required for Claude Code?", options: ["14+", "16+", "18+", "20+"], answer: 2 },
          ],
        },
      },
      {
        title: "Core Workflows",
        duration: "25 min",
        type: "Hands-on",
        content: {
          summary: "The everyday patterns that make Claude Code powerful.",
          points: [
            "**Ask & Iterate**: `claude 'add dark mode to this app'` — Claude reads, edits, done",
            "**Fix a bug**: `claude 'the login form throws a 401 on correct credentials, fix it'`",
            "**Write tests**: `claude 'write unit tests for utils.js with 90% coverage'`",
            "**Refactor**: `claude 'extract the database logic into a service layer'`",
            "**Understand code**: `claude 'explain what the auth middleware does'`",
          ],
          tip: "Be specific about outcomes, not steps. Claude decides the steps. You define success.",
          quiz: [
            { q: "What's the most effective way to prompt Claude Code?", options: ["Describe every step it should take", "Specify the outcome and let Claude decide the steps", "Give it a file path and hope for the best", "Use only single-word commands"], answer: 1 },
          ],
                    devTip: {
            label: "Always review the diff — never blindly accept",
            insight: "Senior engineers review every line of AI-generated code before committing, the same way they'd review a PR from a junior developer. Set up a pre-commit hook that forces you to run `git diff --staged` before every commit. AI makes confident mistakes — wrong variable names, missed edge cases, subtle logic errors that look plausible. Your job shifts from writing to reviewing: a different skill, but no less rigorous.",
            antipattern: "The most dangerous workflow is: `claude 'fix the bug'` → accept all changes → `git commit -m 'fix bug'` without reading a line. This is how subtle regressions get shipped. At minimum, read the diff. Better: run the tests. Best: understand what changed and why.",
          },
        },
      },
      {
        title: "Context & Memory",
        duration: "20 min",
        type: "Concept",
        content: {
          summary: "How Claude Code reads and retains your project context.",
          points: [
            "Claude indexes your project tree automatically when you start a session",
            "CLAUDE.md files act as persistent memory — add project conventions, architecture notes, and gotchas",
            "Use `#` headings in CLAUDE.md to organize: Tech Stack, Conventions, Known Issues",
            "Long sessions accumulate context — `/compact` condenses history to save tokens",
            "Start fresh with `/clear` when switching tasks or debugging context drift",
          ],
          tip: "Invest 20 minutes writing a good CLAUDE.md — it pays back tenfold on every future session.",
          quiz: [
            { q: "Which command condenses a long Claude Code session to save tokens?", options: ["/save", "/compress", "/compact", "/trim"], answer: 2 },
          ],
                    devTip: {
            label: "CLAUDE.md is an investment, not a chore",
            insight: "The best CLAUDE.md files are written by treating the AI like an onboarding doc for a staff engineer joining your team mid-project. Include: the tech stack and why, the architectural decisions you've already made (and why you made them), coding conventions the team follows, known footguns and areas to be careful with, and the definition of done for this project. Senior devs maintain living documentation — CLAUDE.md is just the AI-native version of that habit.",
            antipattern: "An empty or generic CLAUDE.md that just says 'This is a React app using TypeScript' provides almost no useful context. Without it, Claude makes architectural assumptions that conflict with your existing patterns — and then you spend time reverting them.",
          },
        },
      },
      {
        title: "Agentic Mode & Autonomy",
        duration: "20 min",
        type: "Advanced",
        content: {
          summary: "Let Claude run multi-step tasks with minimal supervision.",
          points: [
            "`--dangerously-skip-permissions` allows Claude to act without asking for approval",
            "Use for CI pipelines, automated tasks, or when you trust the scope fully",
            "Claude will create branches, run tests, and commit — full loop, no babysitting",
            "Combine with Git: let Claude create a feature branch, you review the PR",
            "MCP (Model Context Protocol) servers extend Claude Code with external tools",
          ],
          tip: "For autonomous tasks, always work on a separate branch. Review the diff, not every keystroke.",
          quiz: [
            { q: "What is MCP in the context of Claude Code?", options: ["Multi-Core Processing", "Model Context Protocol — extends Claude with external tools", "Memory Cache Protocol", "A type of prompt template"], answer: 1 },
          ],
        },
      },
      {
        title: "Managing This Course in Claude Code",
        duration: "20 min",
        type: "Advanced",
        content: {
          summary: "This course is a React JSX file — which means Claude Code can read it, update it, add modules, fix bugs, and extend it just like any other codebase. Here is exactly how to set that up.",
          points: [
            "**Save the .jsx file** to a local folder: `~/projects/ai-dev-course/src/App.jsx`",
            "**Create a CLAUDE.md** in that folder with course structure context (see example below)",
            "**Open with Claude Code**: `cd ~/projects/ai-dev-course && claude`",
            "Tell Claude to add a track, module, quiz question, dev tip, or fix a bug — it reads the full file and makes surgical edits",
            "**Use a Claude Project** on claude.ai to store the latest version as an uploaded file + system prompt for chat-based updates",
          ],
          code: `# CLAUDE.md for this course project

## What this is
A React JSX single-file course app (~140kb).
Curriculum data is at the top, React component at the bottom.

## Structure
- curriculum: array of track objects
- Each track: { id, title, icon, color, accent, tagline, modules[] }
- Each module: { title, duration, type, content: { summary, points[], code?, tip, devTip?, gmatConnection?, quiz[] } }

## How to add a track
Insert a new object into the curriculum array before the closing ']'
Follow exact same shape as existing tracks.

## How to add a module
Insert into the target track's modules[] array.
Always include: title, duration, type, content.summary,
content.points (5 items), content.tip, content.quiz (1-2 items)

## Conventions
- devTip: { label, insight, antipattern } — senior dev callout
- gmatConnection: { skill, insight, example } — GMAT bridge
- color: hex for track accent
- type: 'Concept' | 'Hands-on' | 'Advanced'

## Do not
- Change the component logic unless explicitly asked
- Reformat the whole file
- Remove existing content unless asked`,
          tip: "For quick one-off updates (add a module, fix a typo, change a color), use the Claude Project approach on claude.ai — upload the file, ask Claude to make the change, download the updated version. For ongoing development and version control, use Claude Code with the CLAUDE.md setup.",
          devTip: {
            label: "Treat your course file like a production codebase from day one",
            insight: "The single best thing you can do before making any edits is initialize a Git repo: `git init && git add . && git commit -m 'initial course'`. Now every Claude Code edit is a reviewable diff, you can roll back anything, and you have a history of what changed and when. A 30-second setup that has saved hours of 'wait what did it change?' across thousands of projects.",
            antipattern: "Editing the file directly without version control, then having Claude Code make a large refactor that subtly breaks something you can't easily identify. Without Git, your only recovery option is starting over or manually diffing a backup. With Git, it's `git diff` and `git checkout -- App.jsx`.",
          },
          quiz: [
            { q: "What file should you create to give Claude Code context about this course's structure?", options: ["package.json", "CLAUDE.md", "README.md", ".cursorrules"], answer: 1 },
            { q: "What is the recommended approach for quick one-off course updates?", options: ["Rewrite the whole file", "Upload to a Claude Project, ask Claude to make the change, download the result", "Edit the JSX manually", "Use a Python script"], answer: 1 },
          ],
        },
      },
    ],
  },
  {
    id: "claude-console",
    title: "Claude Console",
    icon: "⌘",
    color: "#A8D8EA",
    accent: "#0A1E2A",
    tagline: "Your API dashboard and prompt workshop",
    modules: [
      {
        title: "What is Claude Console?",
        duration: "10 min",
        type: "Concept",
        content: {
          summary: "Claude Console (console.anthropic.com) is Anthropic's web dashboard for managing your API access. It is distinct from claude.ai (the consumer chat) and Claude Code (the CLI) — it's your control center for building with Claude programmatically.",
          points: [
            "**Claude Console vs. claude.ai**: claude.ai is the consumer chat product. Console is the developer portal — think of it as the 'backstage' where you manage API keys, billing, and run prompt experiments.",
            "**The four pillars of Console**: API key management (create, rotate, revoke), the Workbench prompt playground, usage and billing dashboards, and organization/team settings — all in one place.",
            "**Who uses Console**: Any developer or power user calling the Claude API directly, building automations, or managing a team of Claude users. If you use Zapier, n8n, or build apps with Claude, you need Console access.",
            "**Models available in Console**: The Workbench lets you select any Claude model (Haiku, Sonnet, Opus) and immediately see the cost and latency tradeoffs side by side — no code required.",
            "**Console is the source of truth for billing**: Every API call you make (via code, Zapier, or any tool) shows up in your Console usage dashboard. Monitor it weekly to avoid surprise charges.",
          ],
          tip: "Bookmark console.anthropic.com and visit the usage dashboard weekly — catching an unexpected spike early saves money and debug time.",
          diveDeeper: [
            { title: "Anthropic Console", url: "https://console.anthropic.com", type: "tool", note: "The dashboard itself — log in and explore each section." },
            { title: "Anthropic API Documentation", url: "https://docs.anthropic.com", type: "docs", note: "Official docs covering all Console features and API capabilities." },
          ],
          exercise: {
            type: "checklist",
            prompt: "Get oriented in Claude Console",
            steps: [
              "Go to console.anthropic.com and log in (or create an account)",
              "Find the API Keys section and note how many keys you have",
              "Click into the Workbench and send one test message",
              "Check the Usage tab and note your current spend this month",
              "Explore the Settings to see your organization name",
            ],
          },
          quiz: [
            { q: "What is the primary difference between console.anthropic.com and claude.ai?", options: ["Console is for mobile, claude.ai is for desktop", "Console is the developer API portal; claude.ai is the consumer chat product", "They are identical — just different URLs", "Console requires a paid plan; claude.ai is always free"], answer: 1 },
          ],
        },
      },
      {
        title: "API Keys & Authentication",
        duration: "15 min",
        type: "Hands-on",
        content: {
          summary: "API keys are the credentials that authenticate your code (or tools like Zapier) to the Claude API. Creating, securing, and rotating them properly is one of the most important operational habits a developer can build.",
          points: [
            "**Creating a key**: In Console → API Keys → Create Key. Give it a descriptive name like 'zapier-prod' or 'local-dev' — names that tell you where the key is used make rotation much easier.",
            "**Never hardcode keys**: Store keys in environment variables (`.env` files) or secrets managers, never directly in source code. A leaked key in a public GitHub repo can rack up thousands in API charges in hours.",
            "**Key rotation strategy**: Create a new key before revoking the old one. Update all integrations to the new key, then revoke the old one. Rotate every 90 days as a standard practice.",
            "**Per-key permissions and rate limits**: Console lets you set spending limits per key. Use lower limits on development keys and higher limits on production keys to catch runaway loops early.",
            "**Checking key usage**: Each key shows its last-used timestamp and cumulative spend in the Console dashboard — use this to identify keys that are no longer active and clean them up.",
          ],
          code: "# Store your key in a .env file (never commit this file)\nANTHROPIC_API_KEY=sk-ant-...\n\n# In Python, load it with:\nimport os\nfrom anthropic import Anthropic\n\nclient = Anthropic(api_key=os.environ.get('ANTHROPIC_API_KEY'))\n\n# In Node.js:\nconst Anthropic = require('@anthropic-ai/sdk');\nconst client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });",
          tip: "Use one API key per integration or project — never share a single key across everything. This way, if one key is compromised or a project goes over budget, you can revoke just that key.",
          devTip: {
            label: "Treat API keys like passwords",
            insight: "API keys are credentials with real financial impact. Treat them with the same seriousness as passwords: use environment variables, rotate them regularly, and set per-key spending limits. A key accidentally committed to a public repo can cost thousands before you notice.",
            antipattern: "Storing the API key directly in source code or sharing one 'master' key across all projects and team members — both create single points of failure with no audit trail.",
          },
          diveDeeper: [
            { title: "Anthropic API Key Best Practices", url: "https://docs.anthropic.com/en/api/getting-started", type: "docs", note: "Official guide to authentication and key management." },
          ],
          exercise: {
            type: "checklist",
            prompt: "Set up a secure API key for development",
            steps: [
              "Create a new API key in Console named 'local-dev'",
              "Create a .env file in your project root",
              "Add ANTHROPIC_API_KEY=your-key to the .env file",
              "Add .env to your .gitignore file",
              "Verify the key works by making one test API call",
              "Set a spending limit on the key (e.g. $10/month for dev)",
            ],
          },
          quiz: [
            { q: "What is the recommended way to store your Anthropic API key in a project?", options: ["Hardcode it directly in your source code", "Store it in an environment variable loaded from a .env file", "Post it in your team's Slack channel for easy access", "Store it in a comment at the top of your main file"], answer: 1 },
            { q: "Why should you use one API key per integration rather than one shared key?", options: ["It makes API calls faster", "It allows you to revoke or limit one integration without affecting others", "Anthropic requires it", "Multiple keys unlock more features"], answer: 1 },
          ],
        },
      },
      {
        title: "The Workbench: Prompt Playground",
        duration: "20 min",
        type: "Hands-on",
        content: {
          summary: "The Workbench is Claude Console's interactive prompt editor — a place to experiment with system prompts, compare model outputs, and tune parameters before writing a single line of production code. It's the fastest way to iterate on prompt quality.",
          points: [
            "**System prompt + user turn**: The Workbench separates the system prompt (persistent instructions) from the human turn (what changes each request). This mirrors the exact structure of a real API call — what you build here is copy-pasteable to code.",
            "**Model and parameter controls**: Select any Claude model and adjust temperature (0 = deterministic, 1 = creative), max tokens, top-k, and top-p. Observe how each parameter shifts the output quality and cost in real time.",
            "**Comparing model outputs**: Use the 'Compare' feature to send the same prompt to multiple models simultaneously. Helps you decide whether Haiku's speed/cost tradeoff is worth it vs. Sonnet's quality for your use case.",
            "**Saving prompt templates**: Click 'Save' to store a prompt as a named template. Templates are accessible to your whole organization — use them to standardize prompts across your team and prevent prompt drift.",
            "**Export to code**: Workbench has a 'Get Code' button that generates the exact Python, TypeScript, or curl command for your current prompt and settings — zero rewriting needed when you're ready to ship.",
          ],
          code: "# This is the code Workbench generates for you:\nimport anthropic\n\nclient = anthropic.Anthropic()\n\nmessage = client.messages.create(\n    model='claude-sonnet-4-6',\n    max_tokens=1024,\n    system='You are a helpful assistant.',\n    messages=[\n        {\"role\": \"user\", \"content\": \"Hello, Claude\"}\n    ]\n)\n\nprint(message.content[0].text)",
          tip: "Always start new AI feature development in the Workbench, not in code. Iterate on your prompt 5-10 times in the playground before touching your codebase — it's 10x faster than edit-run-debug cycles.",
          devTip: {
            label: "Workbench as a regression testing tool",
            insight: "Senior engineers use the Workbench not just for development but for regression testing: when you update a prompt, paste the old version and new version side by side and run the same test cases against both. This catches prompt regressions before they reach production.",
            antipattern: "Editing prompts directly in production code without first validating them in the Workbench. Even small wording changes can dramatically alter model behavior.",
          },
          diveDeeper: [
            { title: "Anthropic Workbench Guide", url: "https://docs.anthropic.com/en/docs/build-with-claude/workbench", type: "docs", note: "Official documentation for the Workbench prompt playground." },
            { title: "Prompt Engineering Guide", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview", type: "docs", note: "Anthropic's best practices for writing effective prompts." },
          ],
          exercise: {
            type: "try-this",
            prompt: "Open the Workbench at console.anthropic.com. Write a system prompt that makes Claude act as a concise code reviewer. Then send it a short piece of code (any language) and ask for a review. Try changing the temperature from 0 to 0.7 and notice how the output changes. When you're happy with the result, click 'Get Code' to export it.",
            timeEstimate: "15 min",
          },
          quiz: [
            { q: "What does the Workbench's 'Get Code' feature do?", options: ["Runs your prompt as a scheduled job", "Generates ready-to-use API code in Python, TypeScript, or curl", "Publishes your prompt to the Anthropic marketplace", "Converts your prompt to a fine-tuning dataset"], answer: 1 },
          ],
        },
      },
      {
        title: "Usage, Billing & Rate Limits",
        duration: "15 min",
        type: "Concept",
        content: {
          summary: "Understanding how Claude API pricing works — tokens, model tiers, and rate limits — is essential for building cost-effective applications and avoiding unexpected charges or service interruptions.",
          points: [
            "**Token-based pricing**: You pay per input token (your prompt) and per output token (Claude's response). Longer prompts and longer responses cost more. The Console usage dashboard breaks down spend by model and token type.",
            "**Model cost tiers**: Haiku is the cheapest and fastest (best for high-volume, simple tasks), Sonnet is mid-tier (best balance of quality and cost), and Opus is the most capable and expensive (best for complex reasoning). Choose based on task complexity.",
            "**Rate limits by tier**: Free tier has strict limits (tokens per minute, requests per minute, tokens per day). Paying users get higher limits. Console shows your current limits and usage percentage in real time.",
            "**Spending limits and alerts**: Set a monthly budget cap per key or per organization in Console → Settings → Billing. Enable email alerts at 80% of budget — this is your safety net against runaway loops or unexpected usage spikes.",
            "**Handling 429 errors**: A 429 status code means you've hit a rate limit. Best practice is exponential backoff: wait 1s, retry; if it fails again wait 2s, then 4s, etc. Never hammer the API with rapid retries — it makes the problem worse.",
          ],
          tip: "Start every new project with a low spending limit (e.g. $5) and raise it intentionally as you validate the use case. It's much easier to increase a limit than to dispute an unexpected $500 charge.",
          diveDeeper: [
            { title: "Anthropic Pricing Page", url: "https://www.anthropic.com/pricing", type: "article", note: "Current model pricing with input/output token rates for all models." },
            { title: "Rate Limits Documentation", url: "https://docs.anthropic.com/en/api/rate-limits", type: "docs", note: "Official guide to understanding and handling rate limits." },
          ],
          exercise: {
            type: "reflect",
            prompt: "Think about a task you want to automate with Claude. Estimate: How many API calls per day? How long is each prompt (roughly how many words)? Which model tier fits the complexity? Use the pricing page to estimate your monthly cost. Is it worth it? What could you do to cut the cost in half?",
          },
          quiz: [
            { q: "What HTTP status code indicates you've hit a Claude API rate limit?", options: ["401", "403", "404", "429"], answer: 3 },
            { q: "Which Claude model is best suited for high-volume, simple classification tasks where cost matters most?", options: ["Claude Opus", "Claude Sonnet", "Claude Haiku", "All models cost the same"], answer: 2 },
          ],
        },
      },
      {
        title: "Organizations & Team Access",
        duration: "10 min",
        type: "Concept",
        content: {
          summary: "Claude Console's organization features let you manage team access, share API keys safely, and maintain audit visibility — essential when more than one person is building with Claude.",
          points: [
            "**Organizations vs. personal accounts**: An Organization in Console is a shared workspace with a common billing account, shared API keys, and team member management. Useful for any team of 2+ people building with Claude.",
            "**Inviting team members**: Go to Console → Settings → Members → Invite. Members can be Admins (full access, billing visibility) or Developers (API access only, no billing). Always use the minimum necessary permission level.",
            "**Shared vs. personal keys**: Create organization-level keys for shared integrations (like a shared Zapier workflow) and personal keys for individual development. This separation makes auditing and revocation clean.",
            "**API key ownership and audit logs**: Console shows which key made which calls, and when. If a key is compromised or a team member leaves, you can revoke just their key without disrupting others.",
            "**SSO and enterprise features**: Enterprise plans include SSO (SAML), advanced audit logs, custom rate limits, and dedicated support. Worth evaluating if your team is building revenue-generating products on Claude.",
          ],
          tip: "When a team member leaves, immediately revoke their API keys in Console — don't wait. API keys are credentials, and ex-employee keys are a security and billing risk.",
          diveDeeper: [
            { title: "Console Organization Management", url: "https://docs.anthropic.com/en/docs/about-claude/teams", type: "docs", note: "Official guide to setting up and managing team access in Console." },
          ],
          exercise: {
            type: "checklist",
            prompt: "Set up your Console organization for team use",
            steps: [
              "Check if you have an Organization set up in Console Settings",
              "Create (or review) one shared API key named for its integration (e.g. 'zapier-team')",
              "Create one personal key named for yourself (e.g. 'alice-dev')",
              "Review the Members list — are the right people on your team listed?",
              "Set a shared monthly spending limit for the organization",
            ],
          },
          quiz: [
            { q: "When a team member leaves your organization, what should you do immediately in Console?", options: ["Nothing — their account expires automatically", "Revoke their API keys", "Change the organization password", "Delete their email from the team channel"], answer: 1 },
          ],
        },
      },
    ],
  },
  {
    id: "cursor",
    title: "Cursor",
    icon: "⌥",
    color: "#7EC8C8",
    accent: "#0F2E2E",
    tagline: "The AI-first code editor",
    modules: [
      {
        title: "Cursor vs. VS Code",
        duration: "10 min",
        type: "Concept",
        content: {
          summary: "Cursor is a VS Code fork rebuilt around AI. If you know VS Code, you already know 90% of Cursor.",
          points: [
            "All VS Code extensions, keybindings, and settings work in Cursor",
            "Cursor adds: Cmd+K (inline edit), Cmd+L (chat sidebar), Tab (AI autocomplete)",
            "AI sees your full codebase — not just the open file",
            "Supports Claude, GPT-4, and other models via settings",
            "Cursor Tab predicts your next edit based on recent changes — eerily accurate",
          ],
          tip: "Don't re-learn Cursor. Start by doing everything you normally do, then add AI where it feels natural.",
          quiz: [
            { q: "What shortcut opens the Cursor inline edit prompt?", options: ["Cmd+I", "Cmd+K", "Cmd+L", "Cmd+P"], answer: 1 },
          ],
        },
      },
      {
        title: "Cmd+K: Inline AI Edits",
        duration: "20 min",
        type: "Hands-on",
        content: {
          summary: "The fastest way to edit code with AI — without leaving the file.",
          points: [
            "Select code → Cmd+K → type what you want → Cursor rewrites it inline",
            "No selection? Cmd+K generates new code at the cursor position",
            "Works for: refactoring, adding error handling, converting to TypeScript, more",
            "Diff view shows before/after — accept with Enter, reject with Escape",
            "Follow-up instructions refine the result without starting over",
          ],
          tip: "Cmd+K shines for surgical edits. For bigger changes, use the Chat sidebar (Cmd+L) instead.",
          quiz: [
            { q: "How do you accept a Cmd+K suggestion in Cursor?", options: ["Click Accept", "Press Enter", "Press Tab", "Press Cmd+Y"], answer: 1 },
          ],
                    devTip: {
            label: "Use Cmd+K for the edit you already know how to do",
            insight: "Senior developers use Cmd+K for edits where they already know the correct approach — they just don't want to type it out. 'Convert this class component to a functional component with hooks,' 'add try/catch with typed error handling,' 'rename this variable throughout the function.' These are mechanical, well-defined tasks. The expertise is in knowing exactly what to ask for, not in hoping the AI figures out the design.",
            antipattern: "Using Cmd+K for open-ended architectural questions ('make this better') leads to churn — you get an edit, reject it, try again, reject it. If you can't write a one-sentence spec for the edit, use Cmd+L chat instead where you can have a conversation first.",
          },
        },
      },
      {
        title: "Chat Sidebar (Cmd+L)",
        duration: "20 min",
        type: "Hands-on",
        content: {
          summary: "A conversation with your codebase — full context, editable output.",
          points: [
            "Cmd+L opens the sidebar chat with your project context loaded",
            "Use @ to pull in specific files, folders, docs, or web URLs",
            "@codebase runs a semantic search across your whole project",
            "Cursor can apply suggested edits directly — click 'Apply' on any code block",
            "Multi-file edits are handled in Composer mode (Cmd+Shift+I)",
          ],
          tip: "Use @docs to add library documentation to context — Cursor can then answer questions about APIs it's never seen.",
          quiz: [
            { q: "What does @codebase do in Cursor's chat?", options: ["Opens a new file", "Runs a semantic search across your entire project", "Refreshes the AI context", "Clears the chat history"], answer: 1 },
          ],
        },
      },
      {
        title: "Cursor Rules",
        duration: "15 min",
        type: "Advanced",
        content: {
          summary: "Cursor Rules are your always-on instructions — like a CLAUDE.md but for your editor.",
          points: [
            "Create `.cursorrules` in your project root to set persistent instructions",
            "Or use Project Rules in Settings → Cursor Rules for GUI management",
            "Define: coding style, tech stack, naming conventions, what NOT to do",
            "Rules are injected into every AI prompt automatically — no repetition needed",
            "Different projects can have different rules — monorepo-friendly",
          ],
          code: "# .cursorrules example\nYou are an expert TypeScript developer.\nAlways use functional components in React.\nPrefer named exports over default exports.\nNever use `any` type — use `unknown` or proper types.\nWrite tests for all utility functions.",
          tip: "Copy your team's style guide into .cursorrules. Instant consistency, no arguments.",
          quiz: [
            { q: "What file stores project-level Cursor rules?", options: [".aiconfig", ".cursorconfig", ".cursorrules", "cursor.json"], answer: 2 },
          ],
                    devTip: {
            label: "Write .cursorrules like a linting config, not a prayer",
            insight: "The most effective .cursorrules files are specific and testable, not aspirational. Instead of 'write clean code,' write 'never use `var`, always use `const` or `let`.' Instead of 'follow best practices,' write 'all async functions must have try/catch, errors must be typed as `unknown` not `any`.' Senior devs treat AI rules the same way they treat ESLint: unambiguous, enforceable, version-controlled, and reviewed as a team.",
            antipattern: "Vague rules like 'be professional' or 'write good TypeScript' give the AI too much discretion — it'll interpret them differently on every generation. If you can't check whether the rule was followed by reading the output, the rule is too vague.",
          },
        },
      },
      {
        title: "Composer: Multi-File Agent",
        duration: "25 min",
        type: "Advanced",
        content: {
          summary: "Composer is Cursor's agentic mode — it plans and executes multi-file changes.",
          points: [
            "Open with Cmd+Shift+I — separate workspace from normal chat",
            "Describe a feature, Composer creates a plan then executes file by file",
            "Iterates on its own — runs linters, fixes errors, adjusts based on feedback",
            "Review all changes in a unified diff before accepting",
            "Best for: new features, large refactors, scaffolding new modules",
          ],
          tip: "Give Composer a clear goal and acceptance criteria. 'Build a user settings page with name/email/password fields, using our existing AuthContext' works far better than 'add settings'.",
          quiz: [
            { q: "What shortcut opens Cursor's Composer (multi-file agent) mode?", options: ["Cmd+Shift+C", "Cmd+Shift+I", "Cmd+Shift+A", "Cmd+Shift+P"], answer: 1 },
          ],
        },
      },
    ],
  },
  {
    id: "pm",
    title: "Project Management",
    icon: "◎",
    color: "#B8A9E8",
    accent: "#1A1035",
    tagline: "Ship projects with AI as your co-pilot",
    modules: [
      {
        title: "PM Fundamentals",
        duration: "15 min",
        type: "Concept",
        content: {
          summary: "Project management is the discipline of turning ambiguous goals into shipped outcomes — on time, with the right people, within constraints.",
          points: [
            "**Scope**: What are we building? What are we NOT building?",
            "**Schedule**: When does each piece need to be done?",
            "**Resources**: Who's doing what? What do we need?",
            "**Risk**: What could go wrong? What's the plan if it does?",
            "**Stakeholders**: Who needs to be informed, consulted, or in control?",
          ],
          tip: "The PM's job isn't to have all the answers — it's to make sure the right questions get asked at the right time.",
          gmatConnection: {
            skill: "Critical Reasoning — Assumption Questions",
            insight: "Every project plan rests on hidden assumptions. GMAT Assumption questions train you to identify what must be true for an argument to hold — the same skill that lets you spot a flawed project charter before it blows up in sprint 3.",
            example: "Plan: 'We'll launch in Q2 if the API integration is done by March.' Hidden assumption: the API vendor delivers on time, the integration has no breaking changes, and QA takes under 2 weeks.",
          },
          quiz: [
            { q: "Which PM framework uses the Start/Stop/Continue format?", options: ["Sprint Planning", "Retrospective", "Daily Standup", "Backlog Grooming"], answer: 1 },
          ],
        },
      },
      {
        title: "Agile & Scrum Basics",
        duration: "20 min",
        type: "Concept",
        content: {
          summary: "Agile is a mindset. Scrum is the most popular framework for practicing it.",
          points: [
            "Work in **sprints** — short cycles (1-2 weeks) that deliver something working",
            "**Backlog**: prioritized list of all work; groom it weekly",
            "**Sprint Planning**: pick what fits in the sprint, assign to team members",
            "**Daily Standup**: 15-min sync — what did you do, what will you do, any blockers?",
            "**Retrospective**: after each sprint, discuss what worked and what to improve",
          ],
          tip: "Don't cargo-cult Scrum. Use the ceremonies that add value to your team, skip the ones that don't.",
          quiz: [
            { q: "What is the typical length of a Scrum sprint?", options: ["1 day", "1-2 weeks", "1 month", "1 quarter"], answer: 1 },
          ],
        },
      },
      {
        title: "AI-Powered Planning",
        duration: "25 min",
        type: "Hands-on",
        content: {
          summary: "Use Claude to accelerate the slowest, most tedious parts of project planning.",
          points: [
            "**PRD generation**: Give Claude a feature idea, get a structured Product Requirements Doc",
            "**Story breakdown**: Paste an epic, ask Claude to split into user stories with acceptance criteria",
            "**Risk identification**: Describe your project, ask Claude to identify top 5 risks and mitigations",
            "**Retrospective facilitation**: Feed Claude sprint notes, get a structured retro summary",
            "**Stakeholder updates**: Share status notes, Claude drafts a polished project update email",
          ],
          tip: "Don't ask Claude to manage the project. Ask it to generate the artifacts you'd otherwise spend hours writing.",
          gmatConnection: {
            skill: "Data Insights — Multi-Source Reasoning",
            insight: "AI-powered planning means synthesizing multiple inputs — Slack threads, tickets, meeting notes, customer feedback — into a coherent plan. GMAT's Multi-Source Reasoning section trains exactly this: weigh conflicting data, spot what's missing, and draw defensible conclusions.",
            example: "Before sprint planning, feed Claude your backlog, last sprint's velocity, and stakeholder priorities. Evaluating Claude's output critically — 'is this conclusion actually supported by the data?' — is pure MSR thinking.",
          },
          quiz: [
            { q: "What's the best use of Claude in project planning?", options: ["Let it manage the project autonomously", "Generate artifacts like PRDs and retro summaries", "Replace the PM entirely", "Only use it for writing emails"], answer: 1 },
          ],
        },
      },
      {
        title: "Linear for Devs & PMs",
        duration: "20 min",
        type: "Hands-on",
        content: {
          summary: "Linear is the modern issue tracker — fast, opinionated, and built for software teams.",
          points: [
            "Issues live in **Teams** → **Projects** → **Cycles** (sprints) hierarchy",
            "Keyboard-first: C to create issue, G+I to go to inbox — no mouse needed",
            "**Cycles** = sprints; auto-roll unfinished issues to next cycle",
            "**Projects** group related issues across cycles — good for features or epics",
            "Integrates with GitHub: auto-close issues when PRs merge via branch naming",
          ],
          tip: "Use Linear's template feature to standardize bug reports, feature requests, and tech debt tickets — saves 5 min per issue across the team.",
          quiz: [
            { q: "In Linear, what keyboard shortcut creates a new issue?", options: ["N", "C", "I", "T"], answer: 1 },
          ],
        },
      },
      {
        title: "Shipping & Retrospectives",
        duration: "15 min",
        type: "Concept",
        content: {
          summary: "Shipping isn't the end — it's the beginning of learning. Retrospectives close the loop.",
          points: [
            "**Definition of Done**: agree upfront — coded + tested + reviewed + deployed = done",
            "Track velocity to predict future sprints more accurately over time",
            "Post-mortems for outages; retrospectives for sprints — different cadence, same spirit",
            "**Start/Stop/Continue** framework: simple, fast, effective retro format",
            "Celebrate shipped work — publicly, specifically, and often",
          ],
          tip: "The best retro action item is the one that actually gets done. Limit to 1-2 changes per sprint.",
          gmatConnection: {
            skill: "Critical Reasoning — Strengthen / Weaken",
            insight: "A retrospective is an argument evaluation exercise. GMAT CR trains you to evaluate whether evidence actually supports a conclusion, or whether there's a confounding factor being ignored.",
            example: "Retro claim: 'We should do more detailed sprint planning to avoid mid-sprint surprises.' A GMAT-trained PM asks: does the evidence support this? Maybe the real issue is unclear requirements upstream.",
          },
          quiz: [
            { q: "What does 'Definition of Done' mean in Agile?", options: ["The sprint is over", "Agreed criteria that must be met before work is considered complete", "The backlog is empty", "The PM signs off on the feature"], answer: 1 },
          ],
        },
      },
    ],
  },
  {
    id: "ai-fundamentals",
    title: "AI Fundamentals",
    icon: "⬡",
    color: "#82C9A0",
    accent: "#0A1F14",
    tagline: "How AI actually works — and how to use it well",
    modules: [
      {
        title: "How Large Language Models Work",
        duration: "15 min",
        type: "Concept",
        content: {
          summary: "LLMs like Claude and GPT-4 are next-token prediction engines trained on massive text corpora. Understanding the basics helps you use them far more effectively.",
          points: [
            "**Training**: LLMs learn by predicting the next word across trillions of text examples — patterns, facts, and reasoning emerge from scale",
            "**Tokens**: models process text as tokens (roughly 0.75 words each) — 'ChatGPT' is 2 tokens, 'tokenization' is 3",
            "**Context window**: the model only 'sees' a fixed amount of text at once — everything outside is invisible to it",
            "**Temperature**: controls randomness — 0 = deterministic, 1 = creative, 2 = chaotic",
            "**No internet by default**: base LLMs have a knowledge cutoff and can't browse unless given a tool",
          ],
          tip: "Think of an LLM as a very well-read person with perfect recall of everything they've read — but who has never experienced the world directly and can't look anything up.",
          quiz: [
            { q: "What does 'temperature' control in an LLM?", options: ["Processing speed", "Randomness and creativity of output", "Context window size", "Training data size"], answer: 1 },
            { q: "Roughly how many words does one token represent?", options: ["2 words", "1 word", "0.75 words", "3 words"], answer: 2 },
          ],
        },
      },
      {
        title: "Prompt Engineering Basics",
        duration: "25 min",
        type: "Hands-on",
        content: {
          summary: "The quality of your prompt is the single biggest lever on the quality of AI output. Small changes in wording produce dramatically different results.",
          points: [
            "**Be specific about output format**: 'Write a bulleted list of 5 risks' beats 'what are the risks?'",
            "**Give context**: who you are, what you're building, and who the audience is all shape the response",
            "**Use examples**: 'Write something like this: [example]' is one of the most powerful techniques",
            "**Chain of Thought**: adding 'think step by step' dramatically improves reasoning on hard problems",
            "**Negative constraints**: 'don't use jargon', 'avoid bullet points' are often as important as positive instructions",
          ],
          code: "// Weak prompt\n'Write a project update'\n\n// Strong prompt\n'Write a 3-sentence project update for a non-technical\nexecutive audience. We shipped the login feature on time,\nbut the dashboard is 1 week delayed due to API changes.\nTone: confident, not apologetic.'",
          tip: "Iterate on prompts the same way you iterate on code. Version them, test variations, and keep the ones that work.",
          quiz: [
            { q: "What technique dramatically improves LLM reasoning on hard problems?", options: ["Increasing temperature", "Adding 'think step by step'", "Using shorter prompts", "Repeating the question twice"], answer: 1 },
          ],
                    devTip: {
            label: "The prompt is the spec — treat it like one",
            insight: "Senior engineers write prompts the same way they write technical specs: precise, unambiguous, with examples where needed and explicit constraints about what NOT to do. A well-written prompt should be reusable by someone else on your team who's never seen the underlying task. If your prompt requires significant context to interpret, the prompt needs work — not the model.",
            antipattern: "Iterating on vague prompts — 'make it better,' 'be more specific,' 'try again' — is the prompt engineering equivalent of rubber-duck debugging without changing your code. Identify the specific failure, add a specific constraint, and test. One targeted change at a time.",
          },
        },
      },
      {
        title: "AI Model Landscape",
        duration: "15 min",
        type: "Concept",
        content: {
          summary: "The AI model landscape moves fast. Knowing the major players and their strengths helps you pick the right tool for each job.",
          points: [
            "**Anthropic Claude**: strong at reasoning, long documents, coding, and following nuanced instructions",
            "**OpenAI GPT-4o / o3**: broad capability, strong ecosystem, widely integrated into third-party tools",
            "**Google Gemini**: deep Google Workspace integration, strong multimodal (text + image + video)",
            "**Meta Llama**: open-source, runs locally, customizable — good for privacy-sensitive or offline use",
            "**Specialized models**: Whisper (speech), DALL-E / Midjourney (images), Eleven Labs (voice) — use the right tool for the job",
          ],
          tip: "Don't be model-loyal. Different tasks have different best-fit models. A $0.01 call to a small model can do the job that doesn't need frontier intelligence.",
          quiz: [
            { q: "Which model family is best for privacy-sensitive or fully offline use?", options: ["Claude", "GPT-4o", "Meta Llama (open-source)", "Gemini"], answer: 2 },
          ],
        },
      },
      {
        title: "AI Agents & Workflows",
        duration: "20 min",
        type: "Concept",
        content: {
          summary: "Agents are AI systems that can take actions — not just generate text. Understanding agentic patterns is essential for building real AI-powered products.",
          points: [
            "**Agent = LLM + tools + loop**: the model decides what to do, calls tools (search, code, APIs), and iterates",
            "**ReAct pattern**: Reason → Act → Observe → Reason again — the core loop most agents follow",
            "**Tool calling**: models can invoke functions you define — web search, database queries, email sending",
            "**Multi-agent**: specialized sub-agents (researcher, writer, reviewer) can be orchestrated by a manager agent",
            "**Human-in-the-loop**: most production agents ask for human approval at high-stakes decision points",
          ],
          tip: "Start with a single-agent, single-tool setup. Multi-agent systems are powerful but add complexity fast — earn the complexity by solving a real problem first.",
          quiz: [
            { q: "What does the ReAct pattern stand for?", options: ["Read, Edit, Act, Commit", "Reason, Act, Observe (then repeat)", "Request, Evaluate, Apply, Test", "None of the above"], answer: 1 },
          ],
                    devTip: {
            label: "Design for failure at every step in the agent loop",
            insight: "Every tool call in an agent loop can fail, timeout, or return unexpected data. Senior AI engineers implement: a maximum iteration count to prevent infinite loops, structured logging of each ReAct step for debugging, schema validation on tool outputs before the model sees them, and a human escalation path for states the agent cannot resolve. Agents that work 95% of the time but have no graceful failure for the other 5% are production liabilities.",
            antipattern: "Building an agent that calls 10 tools in sequence with no error handling between steps means a failure in step 3 silently corrupts everything downstream. Test your agent against adversarial inputs, malformed tool responses, and slow/unavailable services before shipping.",
          },
        },
      },
      {
        title: "Building with the API",
        duration: "25 min",
        type: "Hands-on",
        content: {
          summary: "The Anthropic API lets you embed Claude directly into your apps, scripts, and tools — no UI required. Knowing when to use the API vs. a pre-built tool vs. building from scratch is a core skill.",
          points: [
            "**When to use the API**: you need AI embedded in your own product, workflow, or script — not a chat interface",
            "**When to use claude.ai**: interactive exploration, drafting, research — anything conversational",
            "**When to buy**: third-party tools (Zapier AI, Notion AI) for common tasks — don't build what already exists",
            "Your first API call takes under 10 minutes — get your key at console.anthropic.com",
            "**Key parameters**: `model`, `max_tokens`, `messages` array, optional `system` prompt",
          ],
          code: "// Your first Claude API call (JavaScript)\nconst response = await fetch('https://api.anthropic.com/v1/messages', {\n  method: 'POST',\n  headers: {\n    'Content-Type': 'application/json',\n    'x-api-key': process.env.ANTHROPIC_API_KEY,\n    'anthropic-version': '2023-06-01'\n  },\n  body: JSON.stringify({\n    model: 'claude-sonnet-4-20250514',\n    max_tokens: 1024,\n    messages: [{ role: 'user', content: 'Explain APIs in one sentence.' }]\n  })\n});\nconst data = await response.json();\nconsole.log(data.content[0].text);",
          tip: "Start with the smallest possible API call: one message, one response, console.log the output. Get that working before adding any complexity.",
          quiz: [
            { q: "When should you use the Claude API instead of claude.ai?", options: ["Always — the API is always better", "When you need AI embedded in your own app or script", "When you want a chat interface", "Only for large enterprises"], answer: 1 },
            { q: "What are the three required fields in a Claude API call?", options: ["url, key, prompt", "model, max_tokens, messages", "system, user, assistant", "temperature, top_p, stream"], answer: 1 },
          ],
                    devTip: {
            label: "Implement retry logic and rate limit handling from day one",
            insight: "Every production Claude API integration needs: exponential backoff with jitter for rate limit errors (429s), a timeout on every request, logging of both the prompt and response for debugging, and a graceful fallback when the API is unavailable. Senior engineers treat external API calls as inherently unreliable — they design for failure, not just for the happy path. The 30 minutes you spend on error handling saves hours of on-call debugging.",
            antipattern: "Wrapping the API in a try/catch that swallows errors and returns null is not error handling — it's error hiding. Your users will see broken behavior and you'll have no logs to debug it. At minimum, log the error with the request context before failing gracefully.",
          },
        },
      },
      {
        title: "Using Claude Effectively",
        duration: "20 min",
        type: "Hands-on",
        content: {
          summary: "Claude.ai is more than a chat box. Understanding its full feature set — Projects, Memory, the desktop app, and model selection — turns it from a search engine replacement into a genuine thinking partner.",
          points: [
            "**claude.ai vs. desktop app**: the web app is great for quick tasks; the desktop app adds Cowork, Claude Code, file access, and system-level integrations",
            "**Projects**: group related conversations with shared context and custom instructions — use one project per client, topic, or goal",
            "**Memory**: Claude remembers facts about you across conversations — you can view, edit, and delete what it knows in Settings",
            "**Model selection**: Sonnet is the everyday workhorse; Opus is slower and more powerful for complex reasoning tasks",
            "**Artifacts**: Claude can generate self-contained code, documents, and apps directly in the interface — click to preview, edit, and export",
          ],
          code: `// Project system prompt example
// Set once in a Project — applies to every conversation inside it

You are helping Chase, a Payroll Specialist at Alpine School District.
He is studying for the GMAT Focus Edition and learning AI development tools.

Context:
- Technical level: intermediate (building React apps, using Claude API)
- Communication style: direct, no filler, practical examples preferred
- Current priorities: GMAT prep, PM skills, AI tooling

Always lead with the answer. Flag AI-sounding phrases if asked to write anything.`,
          tip: "Create one Project per major area of your life: 'Work', 'GMAT Prep', 'Side Projects'. Each gets its own system prompt, file uploads, and conversation history. It's the fastest way to get consistently good responses without re-explaining yourself every time.",
          devTip: {
            label: "Your system prompt is the highest-leverage input you control",
            insight: "Senior AI users spend more time crafting their Project system prompts than they do on individual messages. A well-written Project prompt means every subsequent message gets a better response without any extra effort. Think of it as a one-time investment: 30 minutes writing a great system prompt returns dividends on every conversation in that project. Include your role, communication preferences, technical level, current context, and what you want Claude to avoid.",
            antipattern: "Leaving the Project system prompt blank and repeating your context at the start of every conversation is the most common productivity leak in claude.ai power users. You're doing the same work over and over instead of doing it once.",
          },
          quiz: [
            { q: "What is the best use of Claude Projects?", options: ["Storing files only", "Grouping related conversations with shared context and custom instructions", "Running code", "Replacing your email client"], answer: 1 },
            { q: "Which Claude model is best for complex, multi-step reasoning tasks?", options: ["Haiku", "Sonnet", "Opus", "They are all identical"], answer: 2 },
          ],
        },
      },
      {
        title: "AI Ethics & Limitations",
        duration: "15 min",
        type: "Concept",
        content: {
          summary: "AI is powerful but not infallible. Understanding the failure modes makes you a better, safer user and builder.",
          points: [
            "**Hallucination**: models confidently state false facts — always verify claims that matter with primary sources",
            "**Bias**: training data reflects human biases — outputs can encode and amplify them",
            "**Context collapse**: models don't know what they don't know — they fill gaps with plausible-sounding guesses",
            "**Privacy**: don't paste sensitive PII, passwords, or confidential data into public AI products",
            "**Copyright**: AI-generated content exists in a legal gray zone — know your organization's policy before using it commercially",
          ],
          tip: "The best AI users are skeptical collaborators. Use AI to generate and explore, but apply your own judgment to verify, edit, and own the output.",
          quiz: [
            { q: "What is 'hallucination' in the context of LLMs?", options: ["The model refusing to answer", "The model confidently stating false information", "A visual glitch in the interface", "When the model repeats itself"], answer: 1 },
          ],
        },
      },
    ],
  },
  {
    id: "prompt-engineering",
    title: "Prompt Engineering",
    icon: "⟡",
    color: "#C792EA",
    accent: "#1A0A2E",
    tagline: "Master the language of AI",
    modules: [
      {
        title: "System Prompts & Personas",
        duration: "20 min",
        type: "Concept",
        content: {
          summary: "System prompts are the hidden instructions that shape every AI response before the user says a word. They're the most powerful and underused prompt tool.",
          points: [
            "**System prompt** = persistent instructions injected before the conversation starts",
            "Use it to define role, tone, output format, constraints, and domain context",
            "Personas focus the model: 'You are a senior financial analyst who communicates in plain English'",
            "Good system prompts handle the 80% of cases — user messages handle the remaining 20%",
            "In Claude: system prompts go in the API `system` field, or at the top of a Project's instructions",
          ],
          code: "// Example system prompt\nYou are a concise technical writer for a B2B SaaS company.\nYour audience is non-technical operations managers.\nAlways:\n- Use plain English, no jargon\n- Lead with the conclusion\n- Keep responses under 150 words unless asked for more\nNever:\n- Use bullet points for responses under 3 items\n- Start sentences with 'Certainly' or 'Great question'",
          tip: "Write your system prompt like an onboarding doc for a very literal new hire. Assume nothing is implied.",
          quiz: [
            { q: "Where do system prompts go in the Claude API?", options: ["In the first user message", "In the `system` field of the API request", "In a .env file", "In the model name parameter"], answer: 1 },
          ],
                    devTip: {
            label: "System prompts are contracts — version control them",
            insight: "Any system prompt being used in production should be in version control alongside your code, with a changelog. Senior AI engineers treat prompt changes as code changes: they write tests (example input/output pairs), evaluate changes against them before shipping, and maintain rollback capability. A prompt change that silently degrades output quality is just as bad as a silent regression in your codebase — and harder to catch.",
            antipattern: "Editing a production system prompt directly in the UI with no record of what changed is like editing a production database directly. You lose the ability to understand what broke when something breaks — and something always eventually breaks.",
          },
        },
      },
      {
        title: "Few-Shot Prompting",
        duration: "20 min",
        type: "Hands-on",
        content: {
          summary: "Showing the model examples of what you want is often more powerful than describing it. Few-shot prompting is the fastest way to lock in a specific format or style.",
          points: [
            "**Zero-shot**: just the instruction, no examples — works for common tasks",
            "**One-shot**: one example — useful for unusual formats or styles",
            "**Few-shot**: 2-5 examples — use when you need consistent, precise output",
            "Examples teach format, tone, length, and reasoning style simultaneously",
            "Place examples between the instruction and the actual input for best results",
          ],
          code: "// Few-shot example: extracting action items\nInstruction: Extract action items from meeting notes.\n\nExample 1:\nNotes: 'Sarah will follow up with the vendor by Friday.'\nAction items: [Sarah: follow up with vendor — due Friday]\n\nExample 2:\nNotes: 'We need to update the pricing page before launch.'\nAction items: [Team: update pricing page — before launch]\n\nNow extract from:\nNotes: [YOUR MEETING NOTES HERE]",
          tip: "If the model keeps getting the format wrong, try adding a third example that demonstrates the edge case it's failing on.",
          quiz: [
            { q: "How many examples does 'few-shot prompting' typically use?", options: ["0", "1", "2-5", "10+"], answer: 2 },
          ],
        },
      },
      {
        title: "Chain of Thought & Reasoning",
        duration: "20 min",
        type: "Hands-on",
        content: {
          summary: "Forcing the model to reason out loud before giving an answer dramatically improves accuracy on complex tasks — especially math, logic, and multi-step problems.",
          points: [
            "**Chain of Thought (CoT)**: 'Think step by step' before answering improves reasoning measurably",
            "**Zero-shot CoT**: just add 'Let's think step by step' — no examples needed",
            "**Scratchpad pattern**: 'First, reason through this in <thinking> tags, then give your answer'",
            "For multi-step decisions, ask the model to list assumptions and constraints before concluding",
            "CoT is most valuable for: math, logic puzzles, ambiguous situations, and multi-criteria decisions",
          ],
          code: "// Without CoT (prone to errors on complex problems)\n'Is 997 a prime number? Answer yes or no.'\n\n// With CoT (much more reliable)\n'Is 997 a prime number? Think step by step:\n1. Check if divisible by 2, 3, 5, 7...\n2. Only need to check up to √997 ≈ 31.6\n3. Then give your final answer.'",
          tip: "For critical decisions, always use CoT and then ask the model to argue against its own conclusion. Adversarial prompting catches errors that forward reasoning misses.",
          quiz: [
            { q: "What does adding 'think step by step' to a prompt improve?", options: ["Response speed", "Reasoning accuracy on complex tasks", "Output length", "Token efficiency"], answer: 1 },
          ],
        },
      },
      {
        title: "Structured Outputs",
        duration: "20 min",
        type: "Hands-on",
        content: {
          summary: "Getting AI to return consistent, parseable formats — JSON, XML, tables, markdown — is essential for building reliable AI-powered products.",
          points: [
            "Ask for JSON explicitly: 'Return a JSON object with keys: name, priority, due_date'",
            "Provide a schema or template in the prompt — models follow examples better than abstract specs",
            "Use XML tags for complex structured outputs: `<summary>`, `<action_items>`, `<risks>`",
            "For programmatic use, tell the model to return ONLY the JSON — no preamble or explanation",
            "Validate outputs in your code — even well-prompted models occasionally deviate",
          ],
          code: "// Prompt for structured JSON output\n'Analyze this customer feedback and return ONLY a JSON\nobject — no other text:\n{\n  \"sentiment\": \"positive|neutral|negative\",\n  \"key_issues\": [\"issue1\", \"issue2\"],\n  \"priority\": 1-5,\n  \"suggested_response\": \"string\"\n}\n\nFeedback: [PASTE FEEDBACK HERE]'",
          tip: "Add 'Return ONLY the JSON. No explanation, no markdown fences.' The model will still sometimes wrap it — handle that in your parser.",
          quiz: [
            { q: "What's the most reliable way to get consistent structured output from an LLM?", options: ["Ask nicely", "Provide a schema or template example in the prompt", "Use a shorter prompt", "Set temperature to 0"], answer: 1 },
          ],
                    devTip: {
            label: "Never trust LLM output without validation",
            insight: "Even with explicit JSON instructions, LLMs occasionally hallucinate extra fields, use wrong types, or wrap output in markdown fences. Senior engineers always validate structured outputs against a schema (Zod, JSON Schema, Pydantic) before using them in downstream code. Build a parsing layer that: strips markdown fences if present, attempts JSON.parse, validates against your expected schema, and falls back gracefully or retries if validation fails. Treat LLM output like untrusted user input.",
            antipattern: "Directly accessing `response.data.user.name` without validation will eventually throw a cannot-read-property-of-undefined error in production when the model returns a slightly different shape. One runtime error from unvalidated AI output in a critical path erases the productivity gains from using AI in the first place.",
          },
        },
      },
      {
        title: "Building a Prompt Library",
        duration: "15 min",
        type: "Concept",
        content: {
          summary: "Your best prompts are reusable assets. A prompt library turns one-off wins into compounding productivity — for you and your team.",
          points: [
            "Store prompts in a structured doc or tool (Notion, Obsidian, GitHub) with: name, use case, prompt text, example output",
            "Version your prompts — track what changed and why, just like code",
            "Categorize by task type: summarization, extraction, generation, classification, reasoning",
            "Add 'fill-in-the-blank' variables to make prompts reusable: `[AUDIENCE]`, `[CONTEXT]`, `[TONE]`",
            "Share your library with teammates — a good prompt benefits everyone who faces the same task",
          ],
          tip: "Every time you spend 10+ minutes crafting a prompt that works well, save it. Three months from now, you'll be glad you did.",
          quiz: [
            { q: "What makes a prompt 'reusable' in a prompt library?", options: ["It's very short", "It uses fill-in-the-blank variables for context-specific parts", "It was written by a professional", "It only works with one AI model"], answer: 1 },
          ],
        },
      },
    ],
  },
  {
    id: "zapier",
    title: "Zapier & Automations",
    icon: "⚡",
    color: "#FF8C69",
    accent: "#2A0A00",
    tagline: "Connect your tools. Automate the boring stuff.",
    modules: [
      {
        title: "Zapier Fundamentals",
        duration: "15 min",
        type: "Concept",
        content: {
          summary: "Zapier is a no-code automation platform that connects 6,000+ apps. The core idea: when something happens in App A, do something in App B — automatically.",
          points: [
            "**Zap** = an automated workflow: one trigger + one or more actions",
            "**Trigger**: the event that starts the Zap (new email, form submission, new row in sheet)",
            "**Action**: what happens as a result (create task, send Slack message, update CRM record)",
            "**Filter**: add conditions — only run the Zap if certain criteria are met",
            "**Multi-step Zaps**: chain multiple actions after one trigger (free plan: 1 action, paid: unlimited)",
          ],
          tip: "Start with the Zaps you'd actually use today. The best automation is the one that already annoys you enough to fix.",
          quiz: [
            { q: "What is a 'Zap' in Zapier?", options: ["A type of API key", "An automated workflow with a trigger and action(s)", "A Zapier pricing tier", "A type of webhook"], answer: 1 },
          ],
        },
      },
      {
        title: "Connecting AI to Your Tools",
        duration: "25 min",
        type: "Hands-on",
        content: {
          summary: "Zapier's AI integrations let you add Claude or ChatGPT as a step in any workflow — turning raw data into summaries, categories, drafted content, and more.",
          points: [
            "**Zapier's AI step**: add 'AI by Zapier' as an action — pass in text, get back AI-processed output",
            "Use AI to: summarize emails, categorize support tickets, extract data from unstructured text",
            "Pass the AI output into the next step: 'If AI says priority = high, create urgent Linear issue'",
            "**Claude via API in Zapier**: use Webhooks by Zapier to call Anthropic's API directly for more control",
            "Common pattern: Gmail → AI summarize → Slack post daily digest",
          ],
          code: "// Webhook step calling Claude API\nURL: https://api.anthropic.com/v1/messages\nMethod: POST\nHeaders: { x-api-key: YOUR_KEY, anthropic-version: 2023-06-01 }\nBody: {\n  model: 'claude-sonnet-4-20250514',\n  max_tokens: 300,\n  messages: [{ role: 'user',\n    content: 'Summarize this email in 2 sentences: {{email_body}}'\n  }]\n}",
          tip: "Use Zapier's built-in 'AI by Zapier' step for simple tasks. Graduate to a direct API webhook when you need model-specific features, longer outputs, or cost control.",
          quiz: [
            { q: "What Zapier feature lets you call external APIs like Claude directly?", options: ["Zapier Tables", "Webhooks by Zapier", "Zapier Interfaces", "Filter by Zapier"], answer: 1 },
          ],
        },
      },
      {
        title: "Real Workflow Recipes",
        duration: "25 min",
        type: "Hands-on",
        content: {
          summary: "The most valuable automations solve real daily friction. Here are battle-tested workflow patterns you can clone and adapt.",
          points: [
            "**Email triage**: Gmail → AI categorize (urgent/FYI/action needed) → label + route to folder",
            "**Meeting notes → tasks**: Notion meeting note → AI extract action items → Linear issues created",
            "**Lead enrichment**: new form submission → AI research company → add notes to CRM",
            "**Content calendar**: Google Sheet row added → AI draft blog outline → save to Notion",
            "**Daily digest**: Schedule trigger → pull Slack unreads + emails → AI summarize → send to yourself",
          ],
          tip: "Before building, map the workflow on paper: trigger → data → transformation → destination. Zaps that fail usually have a data format mismatch somewhere in that chain.",
          quiz: [
            { q: "What's the best first step when designing a new Zap?", options: ["Start building immediately in Zapier", "Map trigger → data → transformation → destination on paper first", "Search for a template", "Ask AI to build it"], answer: 1 },
          ],
                    devTip: {
            label: "Add an error notification step to every production Zap",
            insight: "Every Zap that processes real data should have a final step: if any previous step failed, send a Slack message or email with the error details. Senior automation engineers treat silent failures as the most dangerous failures — a Zap that stops working and tells no one can silently corrupt your data for days before anyone notices. Zapier has a built-in 'Email' action and Slack integration — add one to every workflow you care about.",
            antipattern: "Building a Zap, testing it once, and never looking at it again. Zaps fail when APIs change their data formats, when authentication tokens expire, or when apps update their field names. A monthly audit of your active Zaps — checking task history for error patterns — is the minimum viable maintenance cadence.",
          },
        },
      },
      {
        title: "Webhooks & Going Beyond Zapier",
        duration: "20 min",
        type: "Advanced",
        content: {
          summary: "Zapier is powerful but has limits. Knowing when to outgrow it — and what comes next — is a key skill.",
          points: [
            "**Webhooks**: HTTP callbacks that fire when an event happens — the backbone of modern integrations",
            "Zapier's free tier: 100 tasks/month, 15-min polling delay — paid tiers unlock speed and volume",
            "**Make (formerly Integromat)**: more powerful visual automation tool for complex multi-step flows",
            "**n8n**: open-source, self-hostable automation — no per-task pricing, full control",
            "Graduate to code (Python/Node) when: you need loops, complex logic, or high volume",
          ],
          tip: "Zapier is the right tool until it isn't. When you're paying $100+/month for Zapier tasks that a 50-line script could handle for free — it's time to graduate.",
          quiz: [
            { q: "What is n8n?", options: ["A Zapier pricing tier", "An open-source self-hostable automation tool", "A type of API key", "A Claude plugin"], answer: 1 },
          ],
        },
      },
      {
        title: "Automation Mindset",
        duration: "15 min",
        type: "Concept",
        content: {
          summary: "The most valuable skill isn't knowing Zapier's interface — it's training yourself to spot automation opportunities in everyday work.",
          points: [
            "**The 2-minute rule for automation**: if you do a task more than once a week, it's worth automating",
            "Look for: copy-paste between tools, manual data entry, status updates you send on a schedule",
            "**Document before automating**: write down exactly what you do manually — that's your Zap blueprint",
            "Start small: one trigger, one action. Complexity is the enemy of reliability",
            "**Maintenance matters**: Zaps break when apps change their APIs — review your automations monthly",
          ],
          tip: "Keep a running list of 'things I do manually that feel dumb.' Review it once a month and automate the top item. Compounding automation beats a perfect system you never build.",
          quiz: [
            { q: "According to the automation mindset, when is a task worth automating?", options: ["Only if it takes more than an hour", "If you do it more than once a week", "Only if it involves code", "When your manager asks you to"], answer: 1 },
          ],
        },
      },
      {
        title: "YNAB + AI",
        duration: "25 min",
        type: "Hands-on",
        content: {
          summary: "YNAB's zero-based budgeting is powerful alone — but combined with AI for transaction enrichment, pattern analysis, and rule writing, it becomes a genuinely smart financial system.",
          points: [
            "**Transaction enrichment**: use Claude to clean messy payee names from bank CSV exports — 'SQ *COFFEE 123' → 'Blue Copper Coffee'",
            "**Category suggestion**: paste transactions, ask Claude to suggest YNAB categories based on your budget structure",
            "**Spending pattern analysis**: export monthly data → Claude identifies trends, flags anomalies, surfaces insights",
            "**Budget rule prompts**: 'Write a YNAB rule that caps dining at $400/month and alerts me at 80%'",
            "**Full loop automation**: bank CSV → Claude enrichment → YNAB-formatted CSV → import ready",
          ],
          code: "// Claude prompt for transaction enrichment\n'Clean these bank payee names for YNAB.\nReturn JSON: [{original, cleaned_name, suggested_category}]\nCategories: Groceries, Dining, Gas, Subscriptions,\nShopping, Medical, Utilities.\n\nTransactions:\n- SQ *HARMONS 801555\n- AMZN MKTP US*AB12\n- SPOTIFY USA\n- SMITHS FUEL 0042\n- COSTCO WHSE #0021'",
          tip: "The biggest YNAB time sink is fixing messy payee names. A 5-minute Claude prompt on your monthly export saves 20+ minutes of manual cleanup — every month.",
          quiz: [
            { q: "What's the most time-saving YNAB + AI workflow?", options: ["Having AI set budget goals", "Automating payee enrichment and category suggestion", "Using AI to track investments", "Having Claude log into YNAB"], answer: 1 },
          ],
        },
      },
    ],
  },
  {
    id: "daily-planning",
    title: "Sunsama & Linear",
    icon: "☀",
    color: "#F9C74F",
    accent: "#2A1E00",
    tagline: "Daily planning that actually works",
    modules: [
      {
        title: "The Daily Planning Ritual",
        duration: "15 min",
        type: "Concept",
        content: {
          summary: "Sunsama is built around a single idea: a focused daily planning ritual that pulls your work into one place and helps you commit to what actually matters today.",
          points: [
            "**Morning ritual**: open Sunsama, pull tasks from all integrations (Linear, Gmail, Slack, Notion)",
            "**Time-box your day**: drag tasks onto your calendar to build a realistic day plan",
            "**Set a daily intention**: one sentence on what a successful day looks like — surfaces priorities",
            "**Evening shutdown**: review what you completed, roll over incomplete tasks, log your wins",
            "Research-backed: time-blocking + end-of-day shutdown reduces cognitive load and improves focus",
          ],
          tip: "The ritual only works if you do it every day. 10 focused minutes of morning planning saves 45 minutes of scattered context-switching throughout the day.",
          quiz: [
            { q: "What is the core feature that makes Sunsama different from a basic task manager?", options: ["It uses AI to write tasks for you", "A daily ritual of pulling, time-blocking, and shutting down your work", "It syncs with every app", "It replaces your calendar"], answer: 1 },
          ],
        },
      },
      {
        title: "Sunsama Integrations",
        duration: "20 min",
        type: "Hands-on",
        content: {
          summary: "Sunsama's power is in pulling tasks from everywhere into one focused view — so your day plan reflects your actual work, not just what you remembered to write down.",
          points: [
            "**Native integrations**: Linear, Asana, Jira, Trello, GitHub, Notion, Todoist, ClickUp",
            "**Communication**: Gmail (turn emails into tasks), Slack (save messages as tasks)",
            "**Calendar sync**: Google Calendar and Outlook — tasks become calendar blocks",
            "Import only what's relevant for today — not your whole backlog",
            "**Recurring tasks**: set daily/weekly habits that auto-appear in your planning ritual",
          ],
          tip: "Connect Linear for project work + Gmail for email tasks + Google Calendar for meetings. Those three cover 90% of where your day actually goes.",
          quiz: [
            { q: "What's the recommended integration combo for most knowledge workers using Sunsama?", options: ["Jira + Slack + Outlook", "Linear + Gmail + Google Calendar", "Todoist + Teams + Asana", "Notion + Trello + iCloud"], answer: 1 },
          ],
        },
      },
      {
        title: "Linear Deep Dive",
        duration: "25 min",
        type: "Hands-on",
        content: {
          summary: "Linear is the fastest, most opinionated issue tracker available. Understanding its data model and keyboard shortcuts turns it from a task list into a thinking tool.",
          points: [
            "**Data model**: Workspace → Teams → Projects → Issues → Sub-issues",
            "**Cycles**: Linear's version of sprints — auto-roll incomplete issues, track velocity",
            "**Views**: Board, List, Timeline — switch based on what question you're answering",
            "**My Issues**: your personal command center — filter by assignee, status, priority",
            "**Github integration**: branch name `[team]-[issue-id]-description` auto-links PR to issue",
          ],
          code: "// Keyboard shortcuts (memorize these)\nC        — Create issue\nG + I    — Go to My Issues\nG + P    — Go to Projects\nCmd+K    — Command palette (search everything)\nE        — Edit issue inline\nP        — Set priority\nA        — Assign issue",
          tip: "Use Linear's 'My Issues' view filtered to 'In Progress' as your second screen during deep work. It's your north star for the day alongside Sunsama.",
          quiz: [
            { q: "What keyboard shortcut opens the Linear command palette?", options: ["Cmd+P", "Cmd+K", "Cmd+/", "Cmd+Space"], answer: 1 },
          ],
                    devTip: {
            label: "Write issues for future-you, not present-you",
            insight: "Senior engineers write Linear issues that someone can pick up cold — 3 months from now, or from a different team. Every issue should have: clear acceptance criteria (how do you know it's done?), relevant context or links (what does the assignee need to read first?), and a scope boundary (what is explicitly NOT included). Issues that say 'fix the dashboard bug' are technical debt — they create rework when whoever picks it up discovers they needed 20 more minutes of context first.",
            antipattern: "Using Linear as a todo list instead of a spec system. 'Improve performance' is not an issue — 'Reduce dashboard load time from 3.2s to under 1s by lazy-loading the chart components' is an issue. The extra 3 minutes to write a good issue saves 30 minutes of clarification conversations.",
          },
        },
      },
      {
        title: "Sunsama + Linear Together",
        duration: "20 min",
        type: "Hands-on",
        content: {
          summary: "Sunsama and Linear serve different purposes — and together they cover everything from high-level project planning to today's focused work.",
          points: [
            "**Linear = project brain**: all issues, priorities, sprints, and team coordination live here",
            "**Sunsama = daily execution layer**: pull today's Linear issues into your time-blocked day",
            "Morning ritual: open Sunsama, import relevant Linear issues for the day, time-block them",
            "Complete tasks in Sunsama → auto-marks the Linear issue as done via integration",
            "**Weekly review**: use Linear's cycle view to assess velocity; use Sunsama's analytics to see where your time actually went",
          ],
          tip: "Don't duplicate work. Linear owns the task definition and team visibility. Sunsama owns when you'll do it and how long you'll spend. Clear separation, no confusion.",
          quiz: [
            { q: "In the Sunsama + Linear workflow, what does Sunsama own?", options: ["Task creation and team visibility", "When you'll do tasks and time allocation", "Sprint planning and backlog", "GitHub integration"], answer: 1 },
          ],
        },
      },
      {
        title: "Building Your Productivity Stack",
        duration: "15 min",
        type: "Concept",
        content: {
          summary: "The best productivity stack is the one you actually use. More tools ≠ more output. The goal is fewer, better-integrated tools with clear roles.",
          points: [
            "**Capture layer**: where new tasks land instantly (Sunsama quick-add, Linear C shortcut)",
            "**Project layer**: Linear for anything involving multiple steps or other people",
            "**Daily layer**: Sunsama for time-blocking and daily ritual",
            "**Communication layer**: Slack/email — tasks that live here should be pulled into Linear or Sunsama same day",
            "**Review cadence**: daily shutdown (Sunsama), weekly review (Linear cycle + Sunsama analytics)",
          ],
          tip: "Every tool in your stack should have one job. If two tools are fighting over the same job, eliminate one. Ambiguity in your stack is a tax on every decision you make.",
          quiz: [
            { q: "What is the biggest risk of adding too many productivity tools?", options: ["Higher subscription costs", "Ambiguity about where tasks live, creating decision overhead", "Slower computer performance", "Too many notifications"], answer: 1 },
          ],
        },
      },
    ],
  },
  {
    id: "cowork",
    title: "Claude Cowork",
    icon: "⊕",
    color: "#D4A5F5",
    accent: "#1A0530",
    tagline: "Give Claude a goal. Come back to finished work.",
    modules: [
      {
        title: "What is Claude Cowork?",
        duration: "15 min",
        type: "Concept",
        content: {
          summary: "Claude Cowork is Anthropic's agentic system for knowledge workers — not developers. You describe an outcome, Claude works through your local files and apps to deliver a finished result. No terminal, no prompting loop.",
          points: [
            "**Cowork vs. Chat**: chat responds to prompts one at a time; Cowork takes an outcome and handles every step autonomously",
            "**Where it lives**: in the Claude desktop app alongside Chat and Code — click the Cowork tab to switch modes",
            "**Who it's for**: researchers, analysts, ops teams, finance, legal — anyone working with documents, data, and files daily",
            "**Local-first**: Claude reads and writes your actual local files — no uploading, no copy-pasting, no manual export",
            "**Requirements**: Claude desktop app (macOS or Windows) + paid plan (Pro, Max, Team, or Enterprise) — currently in research preview",
          ],
          tip: "Cowork is the answer to the question: 'What if I could delegate the assembly work and keep the judgment calls?' If a task is time-consuming but not intellectually complex, it belongs in Cowork.",
          quiz: [
            { q: "What is the key difference between Cowork and regular Claude chat?", options: ["Cowork is faster", "Cowork takes an outcome and works autonomously; chat responds prompt by prompt", "Cowork only works with code", "Cowork requires no internet"], answer: 1 },
            { q: "What plans support Claude Cowork?", options: ["Free only", "Pro, Max, Team, and Enterprise (paid plans)", "Enterprise only", "All plans equally"], answer: 1 },
          ],
        },
      },
      {
        title: "Your First Cowork Task",
        duration: "20 min",
        type: "Hands-on",
        content: {
          summary: "Getting started with Cowork is intentionally simple — describe what you want done, review Claude's plan, and let it run. The interface is designed so the only requirement is knowing what outcome you want.",
          points: [
            "Open Claude Desktop → click the **Cowork** tab to switch from Chat mode",
            "Describe your goal in plain language: 'Organize my Downloads folder and propose a sorting structure before making changes'",
            "Claude **shows you its plan first** — review it, redirect if needed, then approve",
            "Watch progress indicators in real time, or walk away and come back to finished work",
            "Outputs land directly in your file system — formatted docs, spreadsheets, organized folders",
          ],
          code: `// Example Cowork task descriptions that work well

'Scan the Q1 sales reports in my Documents/Reports folder,
extract the key metrics from each, and build a summary
spreadsheet with month-over-month comparison columns.
Show me the structure before writing any files.'

'Go through my Downloads folder. Propose categories,
a naming convention, and flag anything to delete.
Don't move anything until I approve the plan.'

'Pull this week's Slack messages from #team-updates,
summarize the key decisions and action items, and
draft a Friday email digest I can review before sending.'`,
          tip: "Always include 'show me the plan before making changes' in your first few Cowork tasks. It builds trust in how Claude interprets your instructions — and lets you course-correct before any files are touched.",
          quiz: [
            { q: "What should you include in your first Cowork tasks to build trust safely?", options: ["Give Claude full autonomy immediately", "Ask Claude to show its plan before making any changes", "Only use Cowork for read-only tasks", "Always supervise every step"], answer: 1 },
          ],
        },
      },
      {
        title: "Sub-Agents & Parallel Workstreams",
        duration: "20 min",
        type: "Concept",
        content: {
          summary: "Cowork's real power is its ability to break complex tasks into parallel workstreams — multiple sub-agents working simultaneously on different pieces of a problem.",
          points: [
            "For complex tasks, Cowork automatically creates a **plan with sub-tasks** — each handled by a specialized sub-agent",
            "Sub-agents can run **in parallel**: one researching, one formatting, one writing — all at the same time",
            "You can inspect what each sub-agent is doing via the progress view — transparency is built in",
            "**Steer mid-task**: jump in at any point to redirect, add context, or correct course without restarting",
            "Long-running tasks have **no context timeout** — Cowork manages its own memory across a session",
          ],
          tip: "The best Cowork tasks are ones that would normally require you to juggle multiple open tabs and copy-paste between them. If you'd spend 40% of your time just transferring data between tools, Cowork eliminates that entirely.",
          quiz: [
            { q: "What happens when Cowork encounters a complex multi-part task?", options: ["It asks you to break it down manually", "It creates a plan and runs sub-agents in parallel on different parts", "It refuses and suggests chat instead", "It processes each step strictly in sequence only"], answer: 1 },
          ],
        },
      },
      {
        title: "Scheduled Tasks & Dispatch",
        duration: "20 min",
        type: "Hands-on",
        content: {
          summary: "Cowork's scheduled tasks and Dispatch feature turn Claude into an always-on assistant — running recurring work automatically and letting you assign tasks from your phone.",
          points: [
            "**Scheduled tasks**: define a task once with a cadence — daily, weekly, on a trigger — Claude handles it automatically",
            "Example schedules: 'Pull my analytics dashboard metrics and update the weekly report template every Friday at 9am'",
            "**Dispatch**: assign tasks to Cowork from your iPhone — Claude works on your desktop while you're away",
            "One continuous conversation across phone and desktop — start a thought on mobile, come back to finished work on your Mac",
            "Your desktop app must be running for local scheduled tasks — remote sessions (Pro/Max) continue even when your computer is off",
          ],
          code: `// Scheduled task examples

// Daily morning digest
'Every weekday at 8am: check my email for anything marked
urgent, pull today's calendar, and drop a 5-bullet briefing
in my Morning Notes folder.'

// Weekly report
'Every Friday at 4pm: pull this week's completed Linear
issues, summarize them in the weekly-report.md template
in my Documents/Reports folder.'

// YNAB transaction cleanup
'Every Sunday: scan the transactions-export.csv in my
Finance folder, clean up payee names, suggest categories,
and save an enriched version ready for YNAB import.'`,
          tip: "Start with one scheduled task that currently takes you 10+ minutes of manual work each week. Run it manually in Cowork first to verify the output, then schedule it. Automate what you've already validated.",
          devTip: {
            label: "Treat scheduled Cowork tasks like production cron jobs",
            insight: "Senior engineers know that unmonitored automation eventually fails silently. For any scheduled Cowork task that produces important output, add a final step: 'Save a completion log with timestamp and summary to task-log.md.' Review it weekly. When a task fails or produces unexpected output, you want a record of what happened and when — not a mystery of why your Friday report is missing.",
            antipattern: "Scheduling a task that writes to important files without any verification step. If Cowork misinterprets the task on run #7, you want to catch it before it has quietly corrupted two weeks of data. Always build in a human review point for anything consequential.",
          },
          quiz: [
            { q: "What is Dispatch in the context of Claude Cowork?", options: ["A file organization feature", "A way to assign tasks to Cowork from your phone while Claude works on your desktop", "A type of API call", "A scheduling algorithm"], answer: 1 },
          ],
        },
      },
      {
        title: "Computer Control & Connectors",
        duration: "20 min",
        type: "Advanced",
        content: {
          summary: "Cowork just shipped computer control (March 2026) — when no connector exists for an app, Claude takes direct control of your screen to complete the task. This is Anthropic's most powerful and most nascent capability.",
          points: [
            "**Connectors first**: Cowork always tries direct integrations (Slack, Google Drive, Gmail, Linear) before touching your screen",
            "**Computer control fallback**: if no connector exists, Claude opens the app, clicks, navigates, and fills forms like a human operator",
            "Powered by Anthropic's acquisition of Vercept AI — currently macOS only, Pro/Max plans",
            "**Always permission-first**: Claude requests access before opening any new app — you stay in control",
            "**Dispatch + computer control**: assign from iPhone → Claude opens your Mac, completes the task, delivers the result",
          ],
          tip: "Computer control is powerful but still early — Anthropic recommends starting with trusted apps and avoiding sensitive data. Use connectors wherever they exist; let computer control handle the gaps. Think of it as a fallback, not the primary mode.",
          devTip: {
            label: "Minimize computer control surface area — prefer connectors",
            insight: "Every computer control action is a potential failure point: UI changes, popups, authentication prompts, or slow loads can all break the flow. Senior practitioners design their Cowork tasks to use connectors (APIs) wherever possible and limit computer control to genuinely connector-less tasks. Document which apps you've granted computer control access to and audit them quarterly — both for security and reliability.",
            antipattern: "Relying on computer control for everything because it feels more powerful. Direct API connectors are faster, more reliable, and don't break when an app updates its UI. Reserve computer control for apps with no connector and low stakes — not your primary workflow tools.",
          },
          quiz: [
            { q: "What does Cowork do when no connector exists for a required app?", options: ["It skips that step entirely", "It falls back to controlling the screen directly like a human", "It asks you to build a connector", "It fails the task"], answer: 1 },
            { q: "Computer control in Cowork is currently available on which platform?", options: ["Windows only", "macOS only (research preview)", "iOS only", "All platforms"], answer: 1 },
          ],
        },
      },
      {
        title: "Cowork for Knowledge Workers",
        duration: "15 min",
        type: "Hands-on",
        content: {
          summary: "Cowork unlocks the most value for non-developers doing document-heavy, data-heavy, or repetitive file work. Here are the workflows that pay off fastest.",
          points: [
            "**Research synthesis**: dump 20 PDFs into a folder → 'Read these, extract key findings, write a 2-page summary with citations'",
            "**Report generation**: raw data CSV → 'Build an Excel report with pivot tables, charts, and an executive summary tab'",
            "**File organization**: messy Downloads → 'Propose and execute a folder structure, rename files consistently, flag duplicates'",
            "**Document drafting**: rough notes → 'Turn these bullet points into a polished memo with proper formatting'",
            "**YNAB workflow**: weekly transaction export → 'Clean payee names, suggest categories, save enriched CSV ready for import'",
          ],
          tip: "The highest-ROI Cowork task is the one you dread most each week because it's tedious but important. Identify it, run it in Cowork once manually to verify output quality, then schedule it. That one task alone often justifies the subscription.",
          quiz: [
            { q: "What type of work is Cowork designed for primarily?", options: ["Software development only", "Multi-step knowledge work involving documents, data, and local files", "Real-time collaboration", "Coding and debugging"], answer: 1 },
          ],
        },
      },
    ],
  },
  {
    id: "figma",
    title: "Figma",
    icon: "✦",
    color: "#FF7262",
    accent: "#1A0000",
    tagline: "Design faster. Hand off cleaner. Ship together.",
    modules: [
      {
        title: "Figma Fundamentals",
        duration: "20 min",
        type: "Concept",
        content: {
          summary: "Figma is the industry-standard collaborative design tool for UI/UX. Understanding its core concepts — frames, components, auto layout, and design systems — is essential before layering in AI.",
          points: [
            "**Frames**: the fundamental container in Figma — every screen, component, and layout lives in a frame",
            "**Components**: reusable design elements with a master + instances model — change the master, all instances update",
            "**Auto Layout**: Figma's flexbox-like system for responsive, self-organizing UI — the single most powerful Figma skill to master",
            "**Design tokens / Variables**: store colors, spacing, typography as named values — change once, update everywhere",
            "**Dev Mode**: the handoff layer — developers inspect exact CSS values, spacing, assets, and copy component code",
          ],
          tip: "Auto Layout is the skill that separates Figma beginners from power users. Invest a day learning it deeply — every design you make after that will be 3x faster to build and maintain.",
          devTip: {
            label: "Name everything as if a developer will read it in production",
            insight: "The most painful Figma files to develop from are the ones where layers are named 'Frame 247', 'Rectangle 12', and 'Group 8'. Senior designers name every frame and component as if it will become a React component name: 'UserCard', 'NavBar', 'PrimaryButton'. This isn't just aesthetic — Figma's Dev Mode and code export tools use layer names directly. Clean naming saves every developer who touches the file 20 minutes of archaeology per screen.",
            antipattern: "Building the entire design in one giant frame with no component system and manually copying elements. When the brand color changes, you now have 400 individual updates instead of one. Components and variables are the difference between a maintainable design system and a design graveyard.",
          },
          quiz: [
            { q: "What is Auto Layout in Figma?", options: ["An AI feature that generates designs", "A responsive layout system similar to CSS flexbox", "A plugin for accessibility", "The export settings panel"], answer: 1 },
            { q: "What is the purpose of Design Tokens / Variables in Figma?", options: ["To store user research data", "To store reusable values like colors and spacing that update everywhere when changed", "To export assets", "To manage user permissions"], answer: 1 },
          ],
        },
      },
      {
        title: "Figma AI Features",
        duration: "25 min",
        type: "Hands-on",
        content: {
          summary: "Figma has embedded AI throughout its product — from layout suggestions to full UI generation from text prompts. Knowing which features save real time versus which are still early is the key skill.",
          points: [
            "**Figma Make**: prompt-to-prototype — describe a UI in text, Figma generates an interactive prototype respecting your design library",
            "**AI layout suggestions**: Figma suggests improvements to spacing, alignment, and component usage as you work",
            "**Generative fill**: generate placeholder images, icons, and illustrations from text prompts directly in frames",
            "**Rename layers**: AI renames messy layer trees based on content and context — a huge time saver for inherited files",
            "**Accessibility checks**: AI flags contrast issues, font size problems, and spacing violations with suggested fixes",
          ],
          code: `// Figma Make prompt examples that work well

'A mobile settings screen for a budget app.
Use our existing design system components.
Include: profile section, notification preferences,
linked accounts list, and a sign out button.
Follow iOS Human Interface Guidelines spacing.'

'A data dashboard card showing monthly spending
by category. Include a donut chart placeholder,
legend, total amount, and month selector.
Match our existing card component style.'`,
          tip: "Figma Make works best when you reference your existing design system in the prompt. Without that anchor, it generates generic UI that you'll spend more time fixing than if you'd built it from scratch.",
          quiz: [
            { q: "What is Figma Make?", options: ["A plugin marketplace", "A prompt-to-prototype AI tool that generates UI from text descriptions", "Figma's version control system", "An accessibility checker"], answer: 1 },
          ],
        },
      },
      {
        title: "Figma → Claude Code via MCP",
        duration: "25 min",
        type: "Advanced",
        content: {
          summary: "Figma's MCP server is the most powerful bridge between design and code available today — it lets Claude Code read your design system and write directly to your Figma files using your actual components.",
          points: [
            "**Figma MCP server**: connects Claude Code (and Cursor) directly to your Figma file — AI reads your components, variables, and tokens",
            "Claude Code can generate production-ready React/CSS from your Figma designs using your actual design system, not generic code",
            "**Write back to Figma**: agents can create and modify real Figma frames — design and code stay in sync",
            "Install the Figma MCP via the /figma-use skill — available in Claude Code, Cursor, Copilot CLI, VS Code, and Warp",
            "**Skills system**: Figma's skill markdown files let you define exactly how agents interact with your files — team-customizable",
          ],
          code: `// Claude Code with Figma MCP — example workflow

// 1. Point Claude at your Figma file
// In CLAUDE.md:
// Figma file: https://figma.com/file/[FILE_ID]
// Design system: uses tokens from Variables panel
// Component library: [LIBRARY_NAME]

// 2. Ask Claude to implement a Figma screen
'Read the UserDashboard frame in our Figma file.
Generate a React component that matches it exactly,
using our existing design token variables and
Tailwind classes. Export as UserDashboard.tsx'

// 3. Ask Claude to create a new Figma frame
'Create a new mobile frame in Figma for the
ErrorState component. Use our existing color
variables and match the spacing of the EmptyState frame.'`,
          tip: "The Figma MCP workflow eliminates the biggest source of design-to-dev friction: the gap between what was designed and what gets built. When Claude reads your actual Figma components rather than screenshots, the output matches the intent.",
          devTip: {
            label: "Treat Figma as the source of truth — let code derive from it, not the other way",
            insight: "The teams getting the most out of Figma + Claude Code establish a clear data flow: design decisions live in Figma (components, tokens, spacing), code is generated from that source of truth via MCP. When this flow is respected, 'the design changed' stops meaning 'now go find every hardcoded value in the codebase and update it.' It means re-run the generation. The key is discipline: never bypass the design system by hardcoding values in code that exist as Figma variables.",
            antipattern: "Generating code from a Figma screenshot using vision AI instead of the MCP. You get plausible-looking code that uses wrong hex values, approximate spacing, and generic component names — none of which connect to your actual design system. The MCP connection takes 10 minutes to set up and pays for itself on the first screen.",
          },
          quiz: [
            { q: "What does the Figma MCP server enable?", options: ["Real-time collaboration between designers", "AI agents to read your design system and write directly to Figma files", "Cloud backup of Figma files", "Figma to PDF export"], answer: 1 },
          ],
        },
      },
      {
        title: "Design Systems & Tokens",
        duration: "20 min",
        type: "Concept",
        content: {
          summary: "A design system is the contract between design and engineering. Variables and tokens are its language — and they're the foundation that makes AI-assisted design scalable.",
          points: [
            "**Design tokens**: named key-value pairs for every design decision — colors, spacing, typography, shadows, border radius",
            "Store tokens as Figma Variables — they sync to code via style-dictionary, Tokens Studio, or the Figma API",
            "**Token naming convention**: semantic names beat descriptive ones — `color-action-primary` beats `blue-500` because it communicates intent",
            "**Theming**: swap an entire visual theme (light/dark, brand A/brand B) by switching a variable set — one click, every screen updates",
            "**AI + tokens**: when Claude Code reads your Figma variables via MCP, generated code uses your actual token names — zero translation layer",
          ],
          tip: "If your design system doesn't have tokens yet, start with just three: primary color, background color, and base spacing unit. A partial token system is infinitely better than none — it's the foundation everything else builds on.",
          quiz: [
            { q: "Why are semantic token names (like 'color-action-primary') better than descriptive ones (like 'blue-500')?", options: ["They are shorter to type", "They communicate design intent and survive brand color changes without renaming", "They are required by Figma", "They export better to CSS"], answer: 1 },
          ],
        },
      },
      {
        title: "Dev Handoff & Collaboration",
        duration: "15 min",
        type: "Hands-on",
        content: {
          summary: "The design-to-development handoff is where most design intent gets lost. Figma's Dev Mode and the MCP bridge are redefining what 'handoff' means in AI-assisted workflows.",
          points: [
            "**Dev Mode**: toggle to developer view — inspect exact spacing, CSS values, component names, and export assets",
            "Developers can copy CSS, iOS, or Android code for any element directly from Figma",
            "**Annotations**: add structured notes to frames explaining interactions, edge cases, and logic for developers",
            "**Component links**: connect Figma components to their code implementation — click in Figma, jump to Storybook or GitHub",
            "With Figma MCP: handoff becomes 'point Claude at this frame' — the AI reads the design and generates the implementation",
          ],
          tip: "The best handoff annotation answers the question a developer will definitely ask but won't bother you about: 'What happens on mobile?', 'What if the text is very long?', 'What's the empty state?' Add those annotations before marking a design ready for development.",
          quiz: [
            { q: "What is Figma Dev Mode used for?", options: ["Creating animations", "Letting developers inspect exact values, CSS, and export assets from designs", "Running user tests", "Managing Figma permissions"], answer: 1 },
          ],
        },
      },
    ],
  },
  {
    id: "notebooklm",
    title: "NotebookLM",
    icon: "◉",
    color: "#A8C8F8",
    accent: "#05101F",
    tagline: "Your AI-powered research companion",
    modules: [
      {
        title: "What is NotebookLM?",
        duration: "10 min",
        type: "Concept",
        content: {
          summary: "NotebookLM is Google's AI research tool that lets you upload your own documents and have grounded, citation-backed conversations with them — it only answers from what you give it.",
          points: [
            "**Source-grounded AI**: unlike ChatGPT, NotebookLM only draws from your uploaded documents — no hallucinations from general training",
            "Upload: PDFs, Google Docs, web URLs, YouTube videos, audio files, copy-pasted text",
            "Every answer includes citations — click to jump to the exact passage in the source",
            "**Notebooks** organize sources by project — create separate notebooks for each research area",
            "Free to use with a Google account at notebooklm.google.com",
          ],
          tip: "NotebookLM's superpower is trust. When it cites a source, you can verify it immediately. Use it when accuracy to specific documents matters more than breadth.",
          quiz: [
            { q: "What makes NotebookLM different from ChatGPT?", options: ["It is faster", "It only answers from your uploaded documents with citations", "It can browse the internet", "It has a better interface"], answer: 1 },
          ],
        },
      },
      {
        title: "Building Your First Notebook",
        duration: "20 min",
        type: "Hands-on",
        content: {
          summary: "A well-organized notebook is the foundation of a great research workflow. The quality of your sources determines the quality of your answers.",
          points: [
            "Create a notebook per topic: 'GMAT Prep', 'Company Research', 'Project Docs', 'Personal Finance'",
            "Upload PDFs directly — great for textbooks, research papers, official docs, annual reports",
            "Paste Google Doc URLs — NotebookLM stays synced as the doc updates",
            "Add YouTube video URLs — NotebookLM transcribes and indexes the content automatically",
            "**Source limit**: up to 50 sources per notebook, 500k words per source",
          ],
          tip: "For GMAT prep: upload your Manhattan Prep guides and OG explanation PDFs. Then ask NotebookLM to explain concepts, create practice scenarios, or quiz you directly from the material.",
          quiz: [
            { q: "What is the source limit per NotebookLM notebook?", options: ["10 sources", "25 sources", "50 sources", "Unlimited"], answer: 2 },
          ],
        },
      },
      {
        title: "Audio Overviews",
        duration: "15 min",
        type: "Hands-on",
        content: {
          summary: "NotebookLM can convert your notebook into a natural two-host podcast discussion — one of the most unique AI features available today.",
          points: [
            "Click 'Generate' in the Audio Overview panel — two AI hosts discuss your sources conversationally",
            "Great for: commute learning, reviewing research while doing other things, getting a high-level summary",
            "The hosts debate, clarify, and ask each other questions — surprisingly engaging and accurate",
            "**Customize the focus**: tell NotebookLM what angle or audience to target before generating",
            "Download the MP3 to listen in Overcast or any podcast app",
          ],
          tip: "Generate an audio overview of your GMAT study notes, then listen during your commute. Passive review of already-studied concepts is one of the most efficient study habits.",
          quiz: [
            { q: "What format does NotebookLM Audio Overview produce?", options: ["A text summary", "A two-host podcast-style audio discussion", "A video explainer", "A quiz"], answer: 1 },
          ],
        },
      },
      {
        title: "Research & Study Workflows",
        duration: "20 min",
        type: "Hands-on",
        content: {
          summary: "NotebookLM transforms how you interact with long documents — from passive reading to active dialogue with your sources.",
          points: [
            "**Deep research**: upload 10+ papers on a topic, ask 'What do these sources agree and disagree on?'",
            "**Study mode**: upload a textbook chapter, ask it to quiz you, explain confusing passages, or summarize key concepts",
            "**Meeting prep**: upload agenda, past notes, and relevant docs — ask 'What should I know before this meeting?'",
            "**Contract review**: upload an agreement, ask 'What are the key obligations and risks here?'",
            "**Competitive research**: upload competitor docs, earnings calls, press releases — ask synthesis questions",
          ],
          tip: "The best NotebookLM question is a synthesis question: 'Across all my sources, what are the three most important things to understand about X?' Single-source questions don't need NotebookLM.",
          quiz: [
            { q: "What type of question gets the most value from NotebookLM?", options: ["Simple factual lookups", "Synthesis questions across multiple sources", "Questions about current events", "Math problems"], answer: 1 },
          ],
        },
      },
      {
        title: "NotebookLM vs. Claude vs. ChatGPT",
        duration: "15 min",
        type: "Concept",
        content: {
          summary: "Each tool has a different strength. Knowing which to reach for — and when to combine them — separates effective AI users from everyone else.",
          points: [
            "**Use NotebookLM when**: grounded answers from specific documents matter, citations are needed, you are working with a closed corpus",
            "**Use Claude when**: you need reasoning, writing, coding, or synthesis without a specific source constraint",
            "**Use ChatGPT when**: you need broad general knowledge, web browsing, or ecosystem integrations",
            "**Combine them**: research in NotebookLM → paste findings into Claude → write a polished output",
            "NotebookLM = librarian. Claude = analyst. ChatGPT = generalist. Different jobs for different needs.",
          ],
          tip: "Don't pick a favorite and use it for everything. The 5 seconds it takes to choose the right tool saves 10 minutes of getting bad answers from the wrong one.",
          quiz: [
            { q: "Which tool is best described as a librarian for your specific documents?", options: ["ChatGPT", "Claude", "NotebookLM", "Gemini"], answer: 2 },
          ],
        },
      },
    ],
  },
  {
    id: "career",
    title: "Career & Job Search",
    icon: "◷",
    color: "#F4A9C0",
    accent: "#2A0A14",
    tagline: "AI as your personal career coach",
    modules: [
      {
        title: "AI-Powered Resume Tailoring",
        duration: "20 min",
        type: "Hands-on",
        content: {
          summary: "Generic resumes don't get interviews. AI lets you tailor your resume to every job posting in minutes — not hours — by surfacing the right language, keywords, and framing.",
          points: [
            "Paste the job description + your current resume → ask Claude to identify gaps and suggest rewrites",
            "**Mirror the language**: companies hire for the words they use — Claude maps your experience to their vocabulary",
            "**Transferable skills framing**: 'Reframe my Visa sales experience for a Payroll Specialist role'",
            "Ask Claude to identify ATS keywords in the JD and flag which are missing from your resume",
            "Always edit Claude's output — you know your actual impact better than it does",
          ],
          code: "// Resume tailoring prompt\n'I am applying for this role: [PASTE JOB DESCRIPTION]\n\nHere is my current resume: [PASTE RESUME]\n\nPlease:\n1. Identify the 5 most important keywords in the JD\n2. Flag which are missing or weak in my resume\n3. Suggest rewrites for 2-3 bullet points that better\n   match the role\nTone: confident, specific, no buzzwords.'",
          tip: "The best resumes don't lie — they reframe truth. Claude is excellent at finding the angle on your existing experience that fits a new role. Verify it's accurate before submitting.",
          quiz: [
            { q: "What is ATS in the context of job applications?", options: ["A type of interview format", "Applicant Tracking System — software that screens resumes by keywords", "A compensation structure", "A background check service"], answer: 1 },
          ],
        },
      },
      {
        title: "Interview Prep with AI",
        duration: "25 min",
        type: "Hands-on",
        content: {
          summary: "AI can compress weeks of interview prep into hours — researching the company, generating likely questions, and running realistic mock interviews with feedback.",
          points: [
            "**Company research**: 'Summarize this company's business model, recent news, and likely challenges' — paste their About page",
            "**Question generation**: 'What behavioral questions is this company likely to ask for a [role] position?'",
            "**Mock interview**: 'Ask me behavioral questions one at a time and give feedback on my STAR format'",
            "**Answer refinement**: paste a rough answer → Claude tightens it, sharpens the result, flags weak spots",
            "**Reverse prep**: 'What questions should I ask this interviewer that show strategic thinking?'",
          ],
          tip: "Run at least one full mock interview out loud — not just in text. Typing answers is not the same skill as speaking them. Use Claude to prep the content, then practice the delivery.",
          quiz: [
            { q: "What does STAR stand for in behavioral interview answers?", options: ["Skills Tasks Actions Results", "Situation Task Action Result", "Strategy Tactics Approach Review", "Story Theme Answer Recap"], answer: 1 },
          ],
        },
      },
      {
        title: "LinkedIn & Cold Outreach",
        duration: "20 min",
        type: "Hands-on",
        content: {
          summary: "Most cold outreach fails because it is generic. AI helps you write messages that are specific, relevant, and human — without spending an hour on each one.",
          points: [
            "**LinkedIn headline**: 'Write 3 headline options that position me as [X] for [target role]'",
            "**About section**: give Claude your career story in bullets → get a polished narrative paragraph",
            "**Cold message formula**: something specific about them → why you're reaching out → one clear ask",
            "Ask Claude to flag anything in a draft message that sounds generic, AI-written, or presumptuous",
            "**Follow-up sequence**: Claude can draft a first contact, 1-week follow-up, and final bump",
          ],
          tip: "The biggest mistake in cold outreach is leading with what you want. Lead with why you chose them specifically. Claude can help you find that hook by researching their background.",
          quiz: [
            { q: "What is the most common mistake in cold LinkedIn outreach?", options: ["Messages are too short", "Leading with what you want instead of why you chose them specifically", "Using proper grammar", "Mentioning a mutual connection"], answer: 1 },
          ],
        },
      },
      {
        title: "Cover Letters That Sound Human",
        duration: "20 min",
        type: "Hands-on",
        content: {
          summary: "The problem is not using AI to write cover letters — it is using AI badly. A Claude-drafted cover letter that sounds human requires the right prompt, your real voice, and genuine editing.",
          points: [
            "Give Claude your actual story: why this company, why this role, one specific thing that excites you",
            "**Ban these phrases**: 'I am writing to express my interest', 'I am passionate', 'I would be a great fit'",
            "Ask Claude to write in a direct, first-person voice — conversational but professional",
            "Read it out loud — if you would not say it in an interview, cut it",
            "The best cover letters are 200-250 words: one hook, one story, one clear ask",
          ],
          code: "// Cover letter prompt that avoids AI slop\n'Write a cover letter for: [JOB TITLE at COMPANY]\n\nContext:\n- My background: [2-3 sentences]\n- Why this company specifically: [real reason]\n- Most relevant experience: [specific example]\n\nConstraints:\n- Under 250 words\n- No: passionate, great fit, writing to express interest\n- Start with something other than I am writing to'",
          tip: "After Claude drafts it, do one pass and replace any sentence that feels like it could have been written for anyone. If it fits 100 applicants, it should be cut or made specific.",
          quiz: [
            { q: "What is the ideal length for a cover letter?", options: ["500-700 words", "200-250 words", "One full page", "As long as needed"], answer: 1 },
          ],
        },
      },
      {
        title: "Salary Research & Negotiation",
        duration: "15 min",
        type: "Concept",
        content: {
          summary: "Most people leave money on the table because they do not research comp, do not negotiate, or do not know how to handle the conversation. AI helps with all three.",
          points: [
            "**Research first**: 'What is market rate for a [role] in [city] with [X] years experience?' — cross-check Levels.fyi, Glassdoor, Blind",
            "**Anchor high**: ask Claude to help calculate your number — total comp, not just base salary",
            "**Negotiation script**: 'I am excited about the offer. Based on my research I was expecting closer to $X. Is there flexibility?'",
            "Ask Claude to role-play the recruiter's likely responses and prepare your counters",
            "**Non-salary levers**: PTO, remote work, start date, signing bonus, equity — Claude identifies what to ask for",
          ],
          tip: "The recruiter expects you to negotiate. Not negotiating is the one move with zero upside — you either get more money or land exactly where you would have anyway.",
          quiz: [
            { q: "What should you research before salary negotiations?", options: ["Only the company revenue", "Market rate for your role, location, and experience level", "Your interviewer's salary", "The company stock price"], answer: 1 },
          ],
        },
      },
    ],
  },
  {
    id: "apple-shortcuts",
    title: "Apple Shortcuts",
    icon: "⌗",
    color: "#5AC8FA",
    accent: "#0A1A2A",
    tagline: "Automate everything on Apple",
    modules: [
      {
        title: "What Are Apple Shortcuts?",
        duration: "15 min",
        type: "Concept",
        content: {
          summary: "Apple Shortcuts is a visual automation tool built into iOS and macOS that lets you chain actions together to automate tasks — no coding required, but with the depth to rival scripting.",
          points: [
            "**Shortcuts app** ships pre-installed on iOS 13+ and macOS Monterey+ — no download needed",
            "**Actions** are individual steps (send message, resize photo, get clipboard) that you chain together into a shortcut",
            "**Triggers** run shortcuts automatically: time of day, arriving at a location, opening an app, tapping an NFC tag, or via Siri voice command",
            "**Share Sheet integration** lets shortcuts process content from any app — select text in Safari, run a shortcut, get a result",
            "**Gallery** contains hundreds of pre-built shortcuts you can install and customize — great for learning patterns",
          ],
          tip: "Start by installing 3-5 shortcuts from the Gallery that match your daily habits — then open them to see how they are built.",
          quiz: [
            { q: "What is the minimum iOS version that includes the Shortcuts app?", options: ["iOS 11", "iOS 12", "iOS 13", "iOS 15"], answer: 2 },
            { q: "What is the basic building block of a shortcut?", options: ["A script", "An action", "A function", "A widget"], answer: 1 },
          ],
        },
      },
      {
        title: "Variables, Conditionals, and Loops",
        duration: "25 min",
        type: "Hands-on",
        content: {
          summary: "Shortcuts has real programming constructs — variables, if/else branching, and repeat loops — that turn simple automations into powerful logic flows.",
          points: [
            "**Set Variable** and **Get Variable** store and retrieve values across actions — name them clearly like `userName` or `totalPrice`",
            "**Magic Variables** auto-capture the output of every action — tap the magic wand icon to reference any previous action's result without setting a variable",
            "**If/Otherwise/End If** branches let you run different actions based on conditions: input contains, number is greater than, or device is connected to WiFi",
            "**Repeat** loops iterate a fixed number of times; **Repeat with Each** iterates over a list — use for batch-processing photos, files, or text items",
            "**Ask for Input** and **Choose from Menu** create interactive shortcuts that prompt the user for decisions at runtime",
          ],
          code: "-- Pseudo-code for a daily log shortcut --\nAsk for Input: \"How was your day?\" (type: Text)\nSet Variable: mood\nGet Current Date\nFormat Date: \"yyyy-MM-dd\"\nSet Variable: today\nText: \"## {today}\\n{mood}\"\nAppend to File: DailyLog.md (iCloud/Shortcuts/)",
          tip: "Use Magic Variables instead of Set Variable whenever possible — they keep your shortcut cleaner and easier to debug.",
          devTip: {
            label: "Think in data flow, not control flow",
            insight: "Shortcuts passes data from one action to the next like a pipeline. Each action receives the output of the previous action as implicit input. When you understand this, you stop over-using Set Variable and start designing shortcuts like Unix pipes.",
            antipattern: "Setting a variable after every single action and then getting it in the next action. Let implicit input flow naturally and only use Set Variable when you need to reference a value much later in the shortcut.",
          },
          quiz: [
            { q: "What is the advantage of Magic Variables over Set Variable?", options: ["They run faster", "They automatically reference any previous action's output without explicit variable creation", "They work offline", "They sync across devices"], answer: 1 },
            { q: "Which action iterates over a list of items?", options: ["Repeat", "Loop Each", "Repeat with Each", "For Each Item"], answer: 2 },
          ],
        },
      },
      {
        title: "App Integrations and Personal Automations",
        duration: "25 min",
        type: "Hands-on",
        content: {
          summary: "Shortcuts connects to nearly every built-in and third-party app on your device. Personal Automations run shortcuts automatically based on triggers you define — no taps required.",
          points: [
            "**App Intents** let third-party apps (Drafts, OmniFocus, Overcast, Toolbox Pro) expose deep actions to Shortcuts — check an app's Shortcuts actions in its settings",
            "**Personal Automations** trigger on: time of day, alarm, workout start/end, Wi-Fi connect, Bluetooth connect, app open/close, battery level, or NFC tag tap",
            "**Run Immediately** (no confirmation) is available for most triggers in iOS 15.4+ — essential for truly hands-free automations",
            "**Focus Mode integration**: trigger shortcuts when entering/leaving a Focus — e.g., start a timer and open Slack when Work Focus activates",
            "**Shortcuts URL schemes** let you trigger shortcuts from other apps: `shortcuts://run-shortcut?name=My%20Shortcut&input=text&text=hello`",
          ],
          code: "-- URL scheme to run a shortcut with input --\nshortcuts://run-shortcut?name=Log%20Task&input=text&text=Review%20PR\n\n-- x-callback-url for chaining between apps --\nshortcuts://x-callback-url/run-shortcut?name=Process&input=clipboard&x-success=drafts://",
          tip: "Set up a 'Morning Routine' automation triggered by dismissing your alarm: read today's calendar, speak the weather, and open your task manager.",
          quiz: [
            { q: "Which iOS version first allowed Personal Automations to run without confirmation?", options: ["iOS 14", "iOS 14.5", "iOS 15", "iOS 15.4"], answer: 3 },
            { q: "What URL scheme prefix triggers a shortcut externally?", options: ["apple-shortcuts://", "shortcuts://run-shortcut", "siri://shortcut", "automation://run"], answer: 1 },
          ],
        },
      },
      {
        title: "Advanced Scripting — APIs, Dictionaries, and Regex",
        duration: "30 min",
        type: "Advanced",
        content: {
          summary: "Shortcuts can make HTTP requests, parse JSON, use regular expressions, and manipulate dictionaries — turning your phone into a legitimate API client and data processor.",
          points: [
            "**Get Contents of URL** is the HTTP client: supports GET, POST, PUT, DELETE with custom headers, JSON body, and form data — it is cURL for your phone",
            "**Dictionaries** are key-value data structures: create them manually or parse JSON responses automatically — use Get Value for Key to extract nested fields",
            "**Match Text** uses ICU regular expressions for pattern matching — extract emails, URLs, dates, or any structured pattern from unstructured text",
            "**Base64 Encode** and **Generate Hash** enable auth workflows — build Bearer token headers and HMAC signatures for authenticated API calls",
            "**Run JavaScript on Web Page** (Safari action) executes arbitrary JS on the current page — scrape data, modify DOM, or extract structured info from any website",
          ],
          code: "-- API call: get weather and format it --\nURL: https://api.open-meteo.com/v1/forecast?latitude=40.7&longitude=-74.0&current_weather=true\nGet Contents of URL (GET)\nGet Dictionary Value: current_weather\nGet Dictionary Value: temperature\nSet Variable: temp\nText: \"It is {temp}°C in New York right now.\"\nShow Result",
          tip: "Test your API calls in a browser or curl first, then translate to Shortcuts — the Get Contents of URL action silently fails on malformed requests.",
          devTip: {
            label: "Shortcuts is a real API client — treat it like one",
            insight: "Get Contents of URL supports request headers, JSON request bodies, and parses JSON responses into native dictionaries automatically. You can build OAuth flows, poll webhooks, POST to Slack, or query Notion databases. Your phone is a programmable HTTP client that happens to have a touchscreen.",
            antipattern: "Trying to use Shortcuts for complex data transformations with deeply nested JSON, pagination, or error handling. Shortcuts has no try/catch and no debugger. If your shortcut needs more than 3 levels of nesting, build a lightweight API endpoint and have Shortcuts call that instead.",
          },
          quiz: [
            { q: "Which Shortcuts action functions as an HTTP client?", options: ["Open URL", "Get Contents of URL", "Safari Request", "Web API Call"], answer: 1 },
            { q: "What regex standard does the Match Text action use?", options: ["PCRE", "POSIX", "ICU", "JavaScript RegExp"], answer: 2 },
          ],
        },
      },
      {
        title: "AI-Assisted Shortcut Creation",
        duration: "20 min",
        type: "Advanced",
        content: {
          summary: "Claude and other AI tools can design, debug, and optimize complex shortcuts for you — describe what you want in plain English and get a step-by-step action list you can build in minutes.",
          points: [
            "**Describe the workflow** to Claude: 'Build me a shortcut that takes a URL from the share sheet, fetches the page title, and saves it as a Markdown link' — Claude returns the exact action sequence",
            "**Debug with AI**: paste a screenshot or describe the unexpected behavior — Claude identifies the broken action, explains why, and suggests the fix",
            "**Generate regex patterns**: tell Claude 'Write an ICU regex that extracts all dollar amounts from text' and paste it directly into Match Text",
            "**Design API integrations**: describe the API you want to call and Claude writes the full Get Contents of URL config — method, headers, body, and response parsing",
            "**Optimize existing shortcuts**: paste your action list into Claude and ask 'How can I simplify this?' — AI spots redundant variables, unnecessary actions, and cleaner logic paths",
          ],
          code: "-- Prompt to Claude for shortcut design --\n\"Build me an Apple Shortcut that:\n1. Triggers from the Share Sheet (accepts URLs)\n2. Gets the page contents from the URL\n3. Uses Get Contents of URL to call the Claude API:\n   POST https://api.anthropic.com/v1/messages\n   Header: x-api-key: (ask for input first run, save to file)\n   Header: anthropic-version: 2023-06-01\n   Body: {model: claude-sonnet-4-20250514, messages: [{role: user,\n   content: 'Summarize this article in 3 bullets: [page text]'}]}\n4. Shows the summary as a notification\n5. Offers to copy it to clipboard\"",
          tip: "When asking Claude to design a shortcut, always specify the trigger, input type, and desired output format — the more specific you are, the more accurate the action list.",
          quiz: [
            { q: "What is the most effective way to ask AI to help build a shortcut?", options: ["Say 'make me a shortcut'", "Describe the trigger, input, each transformation step, and desired output", "Paste a screenshot with no context", "Ask for the shortcut file directly"], answer: 1 },
            { q: "How can AI help with an existing shortcut that is not working?", options: ["It cannot help with debugging", "Describe the unexpected behavior and the action sequence — AI identifies the broken step", "Only by rewriting it from scratch", "Only if you export it as JSON"], answer: 1 },
          ],
        },
      },
    ],
  },
  {
    id: "gmat",
    title: "GMAT Focus",
    icon: "∑",
    color: "#F4D06F",
    accent: "#2A1F00",
    tagline: "Score higher. Think sharper.",
    modules: [
      {
        title: "GMAT Focus Edition Overview",
        duration: "10 min",
        type: "Concept",
        content: {
          summary: "The GMAT Focus Edition (launched 2023) is a shorter, sharper exam — 2h 15min, 3 sections, no essay, no geometry. It rewards analytical thinking over memorization.",
          points: [
            "**3 sections**: Quantitative Reasoning, Verbal Reasoning, Data Insights — 45 min each",
            "**Scoring**: 205–805 total; each section scores 60–90",
            "No more Integrated Reasoning or Analytical Writing Assessment",
            "Geometry is gone from Quant — focus shifts to algebra, arithmetic, and word problems",
            "You can review and change answers within a section — a major new feature",
          ],
          tip: "The Focus Edition rewards accuracy over speed. You have more time per question than previous versions — use it to be deliberate, not rushed.",
          quiz: [
            { q: "How long is the GMAT Focus Edition?", options: ["3 hours", "2 hours 15 minutes", "4 hours", "1 hour 45 minutes"], answer: 1 },
            { q: "Which section was removed in the GMAT Focus Edition?", options: ["Quantitative Reasoning", "Verbal Reasoning", "Analytical Writing Assessment", "Data Insights"], answer: 2 },
          ],
        },
      },
      {
        title: "Quantitative Reasoning",
        duration: "30 min",
        type: "Hands-on",
        content: {
          summary: "Quant tests problem-solving with numbers, algebra, and word problems — no geometry, no calculator.",
          points: [
            "**Problem Solving only** — Data Sufficiency moved to the Data Insights section",
            "Key topics: arithmetic, algebra, ratios, rates, percentages, statistics, number properties",
            "**Backsolve**: plug answer choices into the problem — saves time on algebra-heavy questions",
            "**Pick Numbers**: substitute simple values (2, 5, 100) to test abstract relationships",
            "**Estimation**: many answer choices are far apart — a rough calculation eliminates 3 choices fast",
          ],
          code: "// Backsolving example\n// Q: If 3x + 7 = 22, what is 2x?\n// Instead of solving: try answer choice x=5\n//   → 3(5)+7 = 22 ✓  → 2x = 10\n\n// Pick Numbers example\n// Q: If x is even and y is odd, is x+y even or odd?\n// Pick x=2, y=3 → 2+3=5 (odd) → always odd ✓\n\n// Estimation example\n// Q: 48% of 596 ≈ ?\n// → ~50% of 600 = 300  (answers: 285, 301, 334, 412 → pick 301)",
          tip: "Don't solve for the variable unless you have to. The GMAT rewards pattern recognition — train yourself to spot the shortcut before writing anything down.",
          quiz: [
            { q: "What strategy involves plugging answer choices back into the problem?", options: ["Pick Numbers", "Backsolving", "Estimation", "Chain of Thought"], answer: 1 },
          ],
        },
      },
      {
        title: "Verbal Reasoning",
        duration: "30 min",
        type: "Hands-on",
        content: {
          summary: "Verbal tests reading comprehension and critical reasoning — the ability to read carefully and evaluate arguments precisely.",
          points: [
            "**Two question types**: Reading Comprehension (RC) and Critical Reasoning (CR)",
            "**RC strategy**: read for structure, not details — 'what is the author doing in each paragraph?'",
            "**CR question types**: Strengthen, Weaken, Assumption, Inference, Bolded Statement, Evaluate",
            "**Pre-phrase answers**: form your own answer before reading choices — prevents trap answers from sounding good",
            "Common CR trap: answer choices that are true but irrelevant to the specific argument",
          ],
          tip: "For CR, always identify the conclusion first. Every question type revolves around the conclusion — if you're fuzzy on what the author is claiming, you'll chase wrong answers.",
          quiz: [
            { q: "What should you always identify first in a GMAT Critical Reasoning question?", options: ["The evidence", "The conclusion", "The assumption", "The question stem"], answer: 1 },
          ],
        },
      },
      {
        title: "Data Insights",
        duration: "30 min",
        type: "Hands-on",
        content: {
          summary: "Data Insights is the newest section — it combines data literacy, DS logic, and multi-source reasoning. Think: MBA analyst skills on test day.",
          points: [
            "**5 question types**: Data Sufficiency, Multi-Source Reasoning, Table Analysis, Graphics Interpretation, Two-Part Analysis",
            "**Data Sufficiency**: 'Is there enough info to answer the question?' — you never actually solve it",
            "DS key insight: sufficiency ≠ solving. Statement (1) alone, (2) alone, both, either, or neither",
            "**Table/Graphics**: read axis labels and footnotes before the question — details live there",
            "**Two-Part Analysis**: two linked answers from one choice set — both must be correct",
          ],
          code: "// Data Sufficiency answer key — memorize this\n// (A) Statement 1 alone sufficient\n// (B) Statement 2 alone sufficient\n// (C) Both together sufficient\n// (D) Each alone sufficient\n// (E) Neither sufficient, even together\n\n// Memory trick: 'AD or BCE'\n// If Statement (1) works → answer is A or D\n// If Statement (1) doesn't work → answer is B, C, or E\n// Test (2) to decide which",
          tip: "Data Sufficiency is a logic puzzle, not a math problem. The fastest solvers never compute the full answer — they only determine whether an answer is possible.",
          quiz: [
            { q: "In Data Sufficiency, if Statement (1) alone is sufficient, what are the possible answers?", options: ["A or B", "A or D", "C or D", "B or C"], answer: 1 },
          ],
        },
      },
      {
        title: "Study System & Error Log",
        duration: "20 min",
        type: "Concept",
        content: {
          summary: "The difference between a 650 and a 705 isn't raw intelligence — it's systematic review. Your error log is your edge.",
          points: [
            "**Error Log**: for every wrong answer, record: question type, what you did wrong, the correct approach",
            "Three error categories: **Careless** (knew it, rushed), **Conceptual** (missing knowledge), **Strategic** (wrong approach)",
            "Review your error log weekly — patterns reveal your highest-leverage study targets",
            "**Official materials first**: mba.com Official Practice Exams 1–6 are the gold standard",
            "Supplement with: Manhattan Prep guides for concepts, GMAT Club for volume practice",
          ],
          tip: "Study less, review more. Doing 20 problems and deeply reviewing 5 wrong answers beats doing 80 problems you never look at again. The error log forces the review habit.",
          quiz: [
            { q: "What are the three error log categories?", options: ["Easy, Medium, Hard", "Careless, Conceptual, Strategic", "Reading, Math, Logic", "Fast, Slow, Skipped"], answer: 1 },
          ],
        },
      },
    ],
  },
];

const typeColors = {
  Concept: { bg: "#1e1e2e", text: "#a9b1d6" },
  "Hands-on": { bg: "#1a2e1a", text: "#9ece6a" },
  Advanced: { bg: "#2e1a1a", text: "#f7768e" },
};

const fontSizes = {
  small:  { base: 16, sm: 14, xs: 12, title: 28, h2: 12, code: 14, badge: 11 },
  medium: { base: 18, sm: 16, xs: 14, title: 32, h2: 14, code: 16, badge: 12 },
  large:  { base: 22, sm: 20, xs: 16, title: 38, h2: 18, code: 18, badge: 14 },
};

const dailySparks = [
  "Write one prompt you use every day and cut it by 50% without losing meaning.",
  "Open a tool you haven't touched this week and explore it for 5 minutes.",
  "Ask Claude to explain yesterday's concept as if you're 10 years old.",
  "Find one keyboard shortcut you don't use and practice it 10 times right now.",
  "Write down one thing from today's module you could use at work this week.",
  "Take a 5-minute walk, then come back and summarize what you just learned.",
  "Open your most-used AI tool and try a prompt you've never tried before.",
  "Write a tweet-length summary of today's most important concept.",
  "Pick one module you completed and re-read just the key points from memory first.",
  "Set a 10-minute timer and try to apply today's concept to a real problem you have.",
  "Find one automation you could build with what you've learned so far.",
  "Write down 3 ways this week's content connects to your current job or project.",
  "Screenshot or note one thing that surprised you today.",
  "Try to teach today's concept out loud to an imaginary colleague.",
  "Write one 'what if I...' question sparked by today's module.",
  "Do a quick review: open any completed module and take its quiz again from memory.",
  "Close all distractions and do one focused 25-minute work block using today's tool.",
  "Write a one-sentence 'why this matters to me' for the current track.",
  "Find one resource (article, doc, video) from the Dive Deeper section and spend 5 min on it.",
  "Look at your completed modules count and set a goal for this week.",
  "Ask Claude a follow-up question about something in today's module that confused you.",
  "Try rewriting one of today's key points in your own words.",
  "Identify the one concept from today that you'll definitely use — write it down.",
  "Open a blank doc and draft a mini SOP using what you've learned this week.",
  "Do a 2-minute stretch, then return and do the exercise section of today's module.",
  "Find one way today's concept could save you more than 30 minutes per week.",
  "Write one question you'd ask the instructor of today's track if you could.",
  "Look at the study plan — are you on track? Adjust your pace if needed.",
  "Bookmark one module you want to revisit in a deeper session.",
  "Write down your current biggest bottleneck at work — which track addresses it?",
  "Try combining two tools you've learned so far in one hypothetical workflow.",
];

function trackTotalTime(track) {
  const mins = track.modules.reduce((sum, m) => {
    const n = parseInt(m.duration);
    return sum + (isNaN(n) ? 0 : n);
  }, 0);
  return mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${mins}m`;
}

export default function App() {
  const [activeCourse, setActiveCourse] = useState(0);
  const [activeModule, setActiveModule] = useState(0);
  const [completedModules, setCompletedModules] = useState(new Set());
  const [showCode, setShowCode] = useState(false);
  const [showGmat, setShowGmat] = useState(false);
  const [showDevTip, setShowDevTip] = useState(false);
  const [quizState, setQuizState] = useState({ active: false, index: 0, selected: null, correct: null });
  const [bookmarks, setBookmarks] = useState(new Set());
  const [notes, setNotes] = useState({});
  const [noteInput, setNoteInput] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [studyMins, setStudyMins] = useState(30);
  const [studyPlan, setStudyPlan] = useState(null);
  const [activeTab, setActiveTab] = useState("content"); // content | bookmarks | plan
  const [fontScale, setFontScale] = useState("medium");
  const [quizHistory, setQuizHistory] = useState({});
  const [exerciseChecked, setExerciseChecked] = useState({});
  const [currentStreak, setCurrentStreak] = useState(0);

  // Restore from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ai-dev-mastery-state");
      if (saved) {
        const s = JSON.parse(saved);
        if (s.completedModules) setCompletedModules(new Set(s.completedModules));
        if (s.bookmarks) setBookmarks(new Set(s.bookmarks));
        if (s.notes) setNotes(s.notes);
        if (s.fontScale) setFontScale(s.fontScale);
        if (s.quizHistory) setQuizHistory(s.quizHistory);
        if (s.exerciseChecked) setExerciseChecked(s.exerciseChecked);
        if (s.currentStreak !== undefined) setCurrentStreak(s.currentStreak);
      }
    } catch(e) {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem("ai-dev-mastery-state", JSON.stringify({
        completedModules: [...completedModules],
        bookmarks: [...bookmarks],
        notes, fontScale, quizHistory, exerciseChecked, currentStreak
      }));
    } catch(e) {}
  }, [completedModules, bookmarks, notes, fontScale, quizHistory, exerciseChecked, currentStreak]);

  const course = curriculum[activeCourse];
  const module = course.modules[activeModule];
  const moduleKey = `${activeCourse}-${activeModule}`;
  const isCompleted = completedModules.has(moduleKey);
  const isBookmarked = bookmarks.has(moduleKey);
  const hasGmatConnection = !!module.content.gmatConnection;
  const hasDevTip = !!module.content.devTip;
  const quizQuestions = module.content.quiz || [];
  const fs = fontSizes[fontScale];
  const currentNote = notes[moduleKey] || "";

  const totalModules = curriculum.reduce((a, c) => a + c.modules.length, 0);
  const progressPct = Math.round((completedModules.size / totalModules) * 100);

  function resetModule() {
    setShowCode(false); setShowGmat(false); setShowDevTip(false);
    setShowNotes(false); setNoteInput("");
    setQuizState({ active: false, index: 0, selected: null, correct: null });
  }

  function markComplete() {
    const next = new Set(completedModules);
    next.add(moduleKey);
    setCompletedModules(next);
    // Streak tracking
    try {
      const today = new Date().toISOString().slice(0, 10);
      const lastDate = localStorage.getItem("ai-dev-mastery-lastday");
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      if (lastDate === today) { /* same day, no change */ }
      else if (lastDate === yesterday) { setCurrentStreak(s => s + 1); }
      else { setCurrentStreak(1); }
      localStorage.setItem("ai-dev-mastery-lastday", today);
    } catch(e) {}
    if (activeModule < course.modules.length - 1) setActiveModule(activeModule + 1);
    resetModule();
  }

  function toggleBookmark() {
    const next = new Set(bookmarks);
    if (next.has(moduleKey)) next.delete(moduleKey); else next.add(moduleKey);
    setBookmarks(next);
  }

  function saveNote() {
    setNotes(prev => ({ ...prev, [moduleKey]: noteInput }));
    setShowNotes(false);
  }

  function courseProgress(idx) {
    const c = curriculum[idx];
    const done = c.modules.filter((_, mi) => completedModules.has(`${idx}-${mi}`)).length;
    return Math.round((done / c.modules.length) * 100);
  }

  function selectAnswer(answerIdx) {
    if (quizState.selected !== null) return;
    const correct = answerIdx === quizQuestions[quizState.index].answer;
    setQuizState(s => ({ ...s, selected: answerIdx, correct }));
    setQuizHistory(prev => {
      const prev_entry = prev[moduleKey] || { correct: 0, wrong: 0 };
      return { ...prev, [moduleKey]: { correct: prev_entry.correct + (correct ? 1 : 0), wrong: prev_entry.wrong + (correct ? 0 : 1) } };
    });
  }

  function nextQuizQuestion() {
    if (quizState.index + 1 < quizQuestions.length) {
      setQuizState({ active: true, index: quizState.index + 1, selected: null, correct: null });
    } else {
      setQuizState(s => ({ ...s, active: false }));
    }
  }

  function generateStudyPlan() {
    const themeConfig = [
      { name: "Tool Day", emoji: "🔧", color: "#7EC8C8", trackIds: ["claude-code", "claude-console", "cursor", "cowork", "figma"] },
      { name: "Theory Day", emoji: "📚", color: "#C792EA", trackIds: ["ai-fundamentals", "prompt-engineering", "pm"] },
      { name: "Build Day", emoji: "🏗", color: "#FF8C69", trackIds: ["zapier", "daily-planning"] },
      { name: "Career Day", emoji: "🚀", color: "#F4A9C0", trackIds: ["career", "notebooklm", "gmat"] },
    ];
    // Build pools of pending modules per track
    const trackPools = {};
    curriculum.forEach((c, ci) => {
      trackPools[c.id] = c.modules
        .map((m, mi) => ({ track: c.title, color: c.color, icon: c.icon, title: m.title, mins: parseInt(m.duration) || 15, ci, mi }))
        .filter((_, mi) => !completedModules.has(`${ci}-${mi}`));
    });
    // Review pool: modules where quiz was answered wrong
    const reviewPool = [];
    Object.entries(quizHistory).forEach(([key, hist]) => {
      if (hist.wrong > 0) {
        const [ci, mi] = key.split("-").map(Number);
        const c = curriculum[ci], m = c?.modules[mi];
        if (m) reviewPool.push({ track: c.title, color: c.color, icon: c.icon, title: `Review: ${m.title}`, mins: 10, ci, mi, isReview: true });
      }
    });
    const days = [];
    let themeIdx = 0, dayNum = 1, reviewInsertCount = 0;
    let safetyLimit = 200;
    while (safetyLimit-- > 0) {
      const theme = themeConfig[themeIdx % themeConfig.length];
      const themeTrackIds = theme.trackIds;
      const day = [], spark = dailySparks[(dayNum - 1) % dailySparks.length];
      let dayMins = 0;
      // Round-robin through theme tracks
      let added = true;
      while (added && dayMins < studyMins) {
        added = false;
        for (const trackId of themeTrackIds) {
          if (dayMins >= studyMins) break;
          const pool = trackPools[trackId];
          if (pool && pool.length > 0) {
            const m = pool.shift();
            if (dayMins + m.mins <= studyMins + 5) { day.push(m); dayMins += m.mins; added = true; }
            else { pool.unshift(m); }
          }
        }
      }
      // Every 3rd day, inject a review module if available
      reviewInsertCount++;
      if (reviewInsertCount % 3 === 0 && reviewPool.length > 0) {
        day.push(reviewPool.shift());
      }
      if (day.length === 0) break;
      days.push({ day: dayNum++, modules: day, total: dayMins, theme: theme.name, themeEmoji: theme.emoji, themeColor: theme.color, spark });
      themeIdx++;
    }
    setStudyPlan(days);
  }

  const currentQ = quizState.active ? quizQuestions[quizState.index] : null;
  const bookmarkedList = [];
  curriculum.forEach((c, ci) => {
    c.modules.forEach((m, mi) => {
      if (bookmarks.has(`${ci}-${mi}`)) bookmarkedList.push({ c, ci, m, mi });
    });
  });

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#0c0c14", minHeight: "100vh", color: "#e0e0ee", display: "flex", flexDirection: "column" }}>
      <a href="#main-content"
        style={{ position: "absolute", top: -100, left: 0, background: "#e0e0ee", color: "#0c0c14", padding: "8px 16px", zIndex: 200, fontSize: 16, borderRadius: "0 0 6px 0" }}
        onFocus={e => e.target.style.top = "0px"}
        onBlur={e => e.target.style.top = "-100px"}>
        Skip to content
      </a>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&family=Playfair+Display:wght@700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #0c0c14; }
        ::-webkit-scrollbar-thumb { background: #333355; border-radius: 2px; }
        .mod-btn:hover { opacity: 0.85; transform: translateX(2px); }
        .course-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .point-item { animation: fadeIn 0.3s ease forwards; opacity: 0; }
        @keyframes fadeIn { to { opacity: 1; } }
        .complete-btn:hover { filter: brightness(1.15); }
        .nav-btn:hover { background: #1e1e32 !important; }
        .gmat-toggle:hover { opacity: 0.85; }
        .dev-toggle:hover { opacity: 0.85; }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        .gmat-box { animation: slideDown 0.25s ease forwards; }
        .dev-box { animation: slideDown 0.25s ease forwards; }
        .outline-item:hover { color: #c0c0d8 !important; }
        .quiz-opt:hover { border-color: #555577 !important; background: #14141f !important; }
        @keyframes popIn { from { opacity:0; transform: scale(0.96); } to { opacity:1; transform: scale(1); } }
        .quiz-panel { animation: popIn 0.2s ease forwards; }
        .tab-btn:hover { color: #c0c0d8 !important; }
        .bk-item:hover { background: #14141f !important; }
        textarea { resize: vertical; }
        textarea:focus { outline: none; border-color: #4a4a7a !important; }
        *:focus-visible { outline: 2px solid #7EC8C8; outline-offset: 2px; }
        button:focus-visible { box-shadow: 0 0 0 4px rgba(126,200,200,0.2); }
        a:focus-visible { outline: 2px solid #7EC8C8; outline-offset: 2px; border-radius: 3px; }
        @media (prefers-reduced-motion: reduce) {
          .point-item { animation: none !important; opacity: 1 !important; }
          .gmat-box, .dev-box, .quiz-panel { animation: none !important; }
          * { transition-duration: 0.01ms !important; }
        }
        .dive-link:hover { background: #1a1a2e !important; }
        .exercise-check:hover { opacity: 0.85; }
        .spark-card { border-left: 3px solid #7EC8C8; }
      `}</style>

      {/* Header */}
      <header role="banner" style={{ borderBottom: "1px solid #1e1e32", padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0c0c14", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18, color: course.color }}>◈</span>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: "#e0e0ee", letterSpacing: "-0.5px" }}>AI Dev Mastery</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* Font scale toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: 2, border: "1px solid #2a2a3e", borderRadius: 6, padding: 2 }} role="group" aria-label="Font size">
            {[["small","A",14],["medium","A",17],["large","A",21]].map(([size, label, fz]) => (
              <button key={size} onClick={() => setFontScale(size)} aria-pressed={fontScale === size} aria-label={`Font size ${size}`}
                style={{ background: fontScale === size ? "#1e1e2e" : "transparent", border: "none", borderRadius: 4, padding: "3px 7px", cursor: "pointer", color: fontScale === size ? "#e0e0ee" : "#8888a8", fontSize: fz, fontWeight: 700, lineHeight: 1, transition: "all 0.15s" }}>{label}</button>
            ))}
          </div>
          {/* Streak */}
          {currentStreak > 0 && (
            <span style={{ fontSize: 13, color: "#FF8C69", fontWeight: 600 }} title={`${currentStreak}-day study streak`}>🔥 {currentStreak}</span>
          )}
          <button onClick={() => setActiveTab(activeTab === "plan" ? "content" : "plan")} aria-pressed={activeTab === "plan"}
            style={{ background: activeTab === "plan" ? "#1a1a2e" : "transparent", border: "1px solid #2a2a3e", borderRadius: 6, padding: "5px 12px", cursor: "pointer", color: "#9898c0", fontSize: fs.badge, fontFamily: "'DM Mono'" }}>
            📅 Study Plan
          </button>
          <button onClick={() => setActiveTab(activeTab === "bookmarks" ? "content" : "bookmarks")} aria-pressed={activeTab === "bookmarks"}
            style={{ background: activeTab === "bookmarks" ? "#1a1a2e" : "transparent", border: "1px solid #2a2a3e", borderRadius: 6, padding: "5px 12px", cursor: "pointer", color: bookmarkedList.length > 0 ? "#F4D06F" : "#9898c0", fontSize: fs.badge, fontFamily: "'DM Mono'" }}>
            🔖 {bookmarkedList.length > 0 ? `${bookmarkedList.length} saved` : "Bookmarks"}
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 100, height: 3, background: "#1e1e32", borderRadius: 2, overflow: "hidden" }} role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100} aria-label="Overall course progress">
              <div style={{ width: `${progressPct}%`, height: "100%", background: course.color, transition: "width 0.4s ease" }} />
            </div>
            <span style={{ fontSize: fs.badge, color: "#9898b8", fontFamily: "'DM Mono'" }}>{completedModules.size}/{totalModules}</span>
          </div>
        </div>
      </header>

      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        {/* Left Sidebar */}
        <aside role="navigation" aria-label="Course tracks and modules" style={{ width: 248, background: "#0e0e1a", borderRight: "1px solid #1e1e32", display: "flex", flexDirection: "column", overflowY: "auto", flexShrink: 0 }}>
          <div style={{ padding: "14px 10px 8px", borderBottom: "1px solid #1a1a28" }}>
            <div style={{ fontSize: fs.badge, color: "#8888a8", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8, paddingLeft: 4 }}>Tracks</div>
            {curriculum.map((c, idx) => {
              const pct = courseProgress(idx);
              const active = activeCourse === idx;
              return (
                <button key={c.id} className="course-btn"
                  onClick={() => { setActiveCourse(idx); setActiveModule(0); resetModule(); setActiveTab("content"); }}
                  aria-current={active ? "true" : undefined}
                  style={{ width: "100%", background: active ? `${c.color}14` : "transparent", border: active ? `1px solid ${c.color}40` : "1px solid transparent", borderRadius: 7, padding: "8px 10px", cursor: "pointer", textAlign: "left", marginBottom: 3, transition: "all 0.15s ease" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <span style={{ color: c.color, fontSize: fs.sm }}>{c.icon}</span>
                      <span style={{ color: active ? c.color : "#9898b8", fontSize: fs.xs, fontWeight: 500 }}>{c.title}</span>
                    </div>
                    <span style={{ fontSize: fs.badge, color: "#8888a8", fontFamily: "'DM Mono'" }}>{trackTotalTime(c)}</span>
                  </div>
                  <div style={{ width: "100%", height: 2, background: "#1e1e2e", borderRadius: 1 }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: c.color, borderRadius: 1, opacity: 0.7 }} />
                  </div>
                </button>
              );
            })}
          </div>
          <div style={{ padding: "10px 10px 20px", flex: 1 }}>
            <div style={{ fontSize: fs.badge, color: "#8888a8", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8, paddingLeft: 4 }}>Modules</div>
            {course.modules.map((m, mi) => {
              const key = `${activeCourse}-${mi}`;
              const done = completedModules.has(key);
              const active = activeModule === mi;
              const bk = bookmarks.has(key);
              const hasNote = !!notes[key];
              const hasGC = !!m.content.gmatConnection;
              return (
                <button key={mi} className="mod-btn"
                  onClick={() => { setActiveModule(mi); resetModule(); setActiveTab("content"); }}
                  aria-current={active ? "true" : undefined}
                  style={{ width: "100%", background: active ? "#16162a" : "transparent", border: "none", borderLeft: active ? `2px solid ${course.color}` : "2px solid transparent", padding: "8px 10px", cursor: "pointer", textAlign: "left", borderRadius: "0 5px 5px 0", marginBottom: 2, display: "flex", alignItems: "flex-start", gap: 7, transition: "all 0.15s ease" }}>
                  <span style={{ width: 14, height: 14, borderRadius: "50%", border: `1.5px solid ${done ? course.color : "#333355"}`, background: done ? course.color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: done ? course.accent : "transparent", flexShrink: 0, marginTop: 1 }}>✓</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: fs.xs, color: active ? "#e0e0ee" : "#9898b8", lineHeight: 1.3, fontWeight: active ? 500 : 400 }}>{m.title}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                      <span style={{ fontSize: fs.badge, color: "#8888a8" }}>{m.duration}</span>
                      {hasGC && <span style={{ fontSize: 8, color: "#F4D06F", background: "#F4D06F18", border: "1px solid #F4D06F30", borderRadius: 3, padding: "1px 4px" }}>∑</span>}
                      {bk && <span style={{ fontSize: 9, color: "#F4D06F" }}>🔖</span>}
                      {hasNote && <span style={{ fontSize: 9, color: "#82C9A0" }}>✎</span>}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main content */}
        <main id="main-content" role="main" style={{ flex: 1, overflowY: "auto", padding: "28px 36px 60px" }}>

          {/* ── BOOKMARKS TAB ── */}
          {activeTab === "bookmarks" && (
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#f0f0ff", marginBottom: 6 }}>Saved Modules</h1>
              <p style={{ fontSize: fs.base, color: "#9898b8", marginBottom: 24 }}>{bookmarkedList.length} bookmarked · click any to jump to it</p>
              {bookmarkedList.length === 0 ? (
                <div style={{ background: "#10101e", border: "1px solid #1a1a2e", borderRadius: 10, padding: "32px", textAlign: "center", color: "#8888a8", fontSize: fs.base }}>
                  No bookmarks yet — click 🔖 on any module to save it here.
                </div>
              ) : bookmarkedList.map(({ c, ci, m, mi }) => {
                const key = `${ci}-${mi}`;
                const hasNote = !!notes[key];
                return (
                  <div key={key} className="bk-item" onClick={() => { setActiveCourse(ci); setActiveModule(mi); resetModule(); setActiveTab("content"); }}
                    style={{ background: "#10101e", border: "1px solid #1a1a2e", borderRadius: 8, padding: "14px 16px", marginBottom: 8, cursor: "pointer", transition: "background 0.15s", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ color: c.color, fontSize: 16 }}>{c.icon}</span>
                      <div>
                        <div style={{ fontSize: fs.base, color: "#e0e0ee", fontWeight: 500 }}>{m.title}</div>
                        <div style={{ fontSize: fs.sm, color: c.color, marginTop: 2 }}>{c.title} · {m.duration}</div>
                        {hasNote && <div style={{ fontSize: fs.sm, color: "#82C9A0", marginTop: 3 }}>✎ {notes[key].slice(0, 60)}{notes[key].length > 60 ? "…" : ""}</div>}
                      </div>
                    </div>
                    <span style={{ fontSize: 11, color: "#44445a" }}>→</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── STUDY PLAN TAB ── */}
          {activeTab === "plan" && (
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#f0f0ff", marginBottom: 6 }}>Daily Study Plan</h1>
              <p style={{ fontSize: fs.base, color: "#9898b8", marginBottom: 24 }}>Tell us how many minutes you have per day — we'll build a schedule for the remaining modules.</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                <div style={{ background: "#10101e", border: "1px solid #1e1e32", borderRadius: 8, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: fs.sm, color: "#9898c0" }}>Minutes per day:</span>
                  {[15, 30, 45, 60, 90].map(v => (
                    <button key={v} onClick={() => setStudyMins(v)} aria-pressed={studyMins === v}
                      style={{ background: studyMins === v ? course.color : "#1a1a2e", border: "none", borderRadius: 5, padding: "5px 12px", cursor: "pointer", color: studyMins === v ? course.accent : "#9898c0", fontSize: fs.sm, fontWeight: studyMins === v ? 600 : 400, transition: "all 0.15s" }}>{v}m</button>
                  ))}
                </div>
                <button onClick={generateStudyPlan}
                  style={{ background: course.color, border: "none", borderRadius: 8, padding: "10px 20px", cursor: "pointer", color: course.accent, fontSize: 13, fontWeight: 600 }}>Generate Plan →</button>
              </div>
              {studyPlan && (
                <div>
                  <div style={{ fontSize: fs.sm, color: "#9898b8", marginBottom: 14, fontFamily: "'DM Mono'" }}>{studyPlan.length} days to complete remaining modules at {studyMins}min/day</div>
                  {studyPlan.map(day => (
                    <div key={day.day} style={{ background: "#10101e", border: "1px solid #1a1a2e", borderRadius: 8, marginBottom: 12, overflow: "hidden" }}>
                      <div style={{ background: day.themeColor ? `${day.themeColor}14` : "#14142a", borderBottom: `1px solid ${day.themeColor ? day.themeColor + "30" : "#1a1a2e"}`, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <span style={{ fontSize: fs.sm, color: "#e0e0ee", fontWeight: 600 }}>Day {day.day}</span>
                          {day.themeEmoji && <span style={{ fontSize: fs.sm, color: day.themeColor || "#9898b8", marginLeft: 8 }}>{day.themeEmoji} {day.theme}</span>}
                        </div>
                        <span style={{ fontSize: fs.badge, color: "#9898b8", fontFamily: "'DM Mono'" }}>{day.total} min</span>
                      </div>
                      {day.spark && (
                        <div className="spark-card" style={{ margin: "8px 12px 4px", background: "#0c0c1e", borderRadius: 6, padding: "8px 12px" }}>
                          <span style={{ fontSize: fs.badge, color: "#7EC8C8" }}>⚡ </span>
                          <span style={{ fontSize: fs.badge, color: "#9898c0" }}>{day.spark}</span>
                        </div>
                      )}
                      {day.modules.map((m, i) => (
                        <div key={i} onClick={() => { setActiveCourse(m.ci); setActiveModule(m.mi); resetModule(); setActiveTab("content"); }}
                          style={{ padding: "9px 14px", borderTop: "1px solid #1a1a2e", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, background: m.isReview ? "#1a0f0a" : "transparent" }}>
                          <span style={{ color: m.color, fontSize: fs.sm }}>{m.isReview ? "🔁" : m.icon}</span>
                          <div style={{ flex: 1 }}>
                            <span style={{ fontSize: fs.sm, color: m.isReview ? "#FF8C69" : "#c0c0d8" }}>{m.title}</span>
                            <span style={{ fontSize: fs.badge, color: "#9898b8", marginLeft: 8 }}>{m.track}</span>
                          </div>
                          <span style={{ fontSize: fs.badge, color: "#9898b8", fontFamily: "'DM Mono'" }}>{m.mins}m</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── MAIN CONTENT TAB ── */}
          {activeTab === "content" && (
            <>
              {/* Module header */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                  <span style={{ padding: "2px 9px", borderRadius: 20, fontSize: fs.badge, fontFamily: "'DM Mono'", background: typeColors[module.type]?.bg || "#1e1e2e", color: typeColors[module.type]?.text || "#a9b1d6", border: `1px solid ${typeColors[module.type]?.text || "#a9b1d6"}30` }}>{module.type}</span>
                  <span style={{ fontSize: fs.badge, color: "#8888a8", fontFamily: "'DM Mono'" }}>{module.duration}</span>
                  {isCompleted && <span style={{ fontSize: fs.badge, color: course.color, fontFamily: "'DM Mono'" }}>✓ Completed</span>}
                  {hasGmatConnection && <span style={{ fontSize: fs.badge, color: "#F4D06F", background: "#F4D06F12", border: "1px solid #F4D06F30", borderRadius: 10, padding: "2px 7px", fontFamily: "'DM Mono'" }}>∑ GMAT</span>}
                  {quizQuestions.length > 0 && <span style={{ fontSize: fs.badge, color: "#82C9A0", background: "#82C9A012", border: "1px solid #82C9A030", borderRadius: 10, padding: "2px 7px", fontFamily: "'DM Mono'" }}>✦ Quiz</span>}
                  {hasDevTip && <span style={{ fontSize: fs.badge, color: "#FF8C69", background: "#FF8C6912", border: "1px solid #FF8C6930", borderRadius: 10, padding: "2px 7px", fontFamily: "'DM Mono'" }}>⚙ Senior Dev</span>}
                  {/* Bookmark & Note actions */}
                  <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
                    <button onClick={() => { setShowNotes(!showNotes); setNoteInput(currentNote); }} aria-pressed={showNotes}
                      style={{ background: currentNote ? "#82C9A012" : "transparent", border: `1px solid ${currentNote ? "#82C9A040" : "#2a2a3e"}`, borderRadius: 6, padding: "3px 9px", cursor: "pointer", color: currentNote ? "#82C9A0" : "#9090c0", fontSize: fs.badge }}>
                      {currentNote ? "✎ Note" : "+ Note"}
                    </button>
                    <button onClick={toggleBookmark} aria-pressed={isBookmarked}
                      style={{ background: isBookmarked ? "#F4D06F12" : "transparent", border: `1px solid ${isBookmarked ? "#F4D06F40" : "#2a2a3e"}`, borderRadius: 6, padding: "3px 9px", cursor: "pointer", color: isBookmarked ? "#F4D06F" : "#9090c0", fontSize: fs.badge }}>
                      {isBookmarked ? "🔖 Saved" : "🔖 Save"}
                    </button>
                  </div>
                </div>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: fs.title, fontWeight: 700, color: "#f0f0ff", lineHeight: 1.2, marginBottom: 5, letterSpacing: "-0.5px" }}>{module.title}</h1>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ color: course.color, fontSize: fs.sm }}>{course.icon}</span>
                  <span style={{ fontSize: fs.sm, color: "#9898b8" }}>{course.title}</span>
                  <span style={{ color: "#555577" }}>·</span>
                  <span style={{ fontSize: fs.sm, color: "#9898b8" }}>{course.tagline}</span>
                </div>
              </div>

              {/* Notes panel */}
              {showNotes && (
                <div style={{ background: "#0e1a0e", border: "1px solid #82C9A030", borderRadius: 8, padding: "14px 16px", marginBottom: 20 }}>
                  <div style={{ fontSize: fs.sm, color: "#82C9A0", marginBottom: 8, fontWeight: 600 }}>✎ Module Note</div>
                  <textarea value={noteInput} onChange={e => setNoteInput(e.target.value)} placeholder="Jot down thoughts, questions, or connections to your own work..."
                    style={{ width: "100%", background: "#08100a", border: "1px solid #2a3a2a", borderRadius: 6, padding: "10px 12px", color: "#c0d8c0", fontSize: fs.base, lineHeight: 1.75, minHeight: 80, fontFamily: "'DM Sans', sans-serif" }} />
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <button onClick={saveNote} style={{ background: "#82C9A0", border: "none", borderRadius: 6, padding: "6px 14px", cursor: "pointer", color: "#0A1F14", fontSize: fs.sm, fontWeight: 600 }}>Save</button>
                    <button onClick={() => setShowNotes(false)} style={{ background: "transparent", border: "1px solid #2a3a2a", borderRadius: 6, padding: "6px 14px", cursor: "pointer", color: "#6a8a6a", fontSize: fs.sm }}>Cancel</button>
                    {currentNote && <button onClick={() => { setNotes(prev => { const n = {...prev}; delete n[moduleKey]; return n; }); setNoteInput(""); setShowNotes(false); }} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#8a4a4a", fontSize: 12, marginLeft: "auto" }}>Delete note</button>}
                  </div>
                </div>
              )}

              {/* Show existing note (read-only) */}
              {currentNote && !showNotes && (
                <div onClick={() => { setShowNotes(true); setNoteInput(currentNote); }} style={{ background: "#0e1a0e", border: "1px solid #82C9A020", borderRadius: 8, padding: "11px 14px", marginBottom: 20, cursor: "pointer" }}>
                  <div style={{ fontSize: fs.badge, color: "#82C9A060", marginBottom: 4, fontFamily: "'DM Mono'" }}>YOUR NOTE</div>
                  <p style={{ fontSize: fs.base, color: "#80a880", lineHeight: 1.75 }}>{currentNote}</p>
                </div>
              )}

              {/* Summary */}
              <div style={{ background: "#10101e", border: "1px solid #1e1e32", borderRadius: 10, padding: "16px 20px", marginBottom: 20, borderLeft: `3px solid ${course.color}` }}>
                <p style={{ fontSize: fs.base, color: "#c8c8e0", lineHeight: 1.75 }}>{module.content.summary}</p>
              </div>

              {/* Key Points */}
              <div style={{ marginBottom: 20 }}>
                <h2 style={{ fontSize: fs.h2, color: "#8888a8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12, fontFamily: "'DM Mono'" }}>Key Points</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {module.content.points.map((point, pi) => {
                    const parts = point.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
                    return (
                      <div key={pi} className="point-item" style={{ animationDelay: `${pi * 50}ms`, background: "#10101e", border: "1px solid #1a1a2e", borderRadius: 7, padding: "11px 14px", display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <span style={{ color: course.color, fontSize: fs.base, marginTop: 1, flexShrink: 0 }}>→</span>
                        <span style={{ fontSize: fs.base, color: "#c8c8e0", lineHeight: 1.75 }}>
                          {parts.map((part, i) => {
                            if (part.startsWith("**") && part.endsWith("**")) return <strong key={i} style={{ color: "#e0e0ee", fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
                            const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
                            if (linkMatch) return <a key={i} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" style={{ color: course.color, textDecoration: "underline", textDecorationStyle: "dotted" }}>{linkMatch[1]}</a>;
                            return part;
                          })}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Code */}
              {module.content.code && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <h2 style={{ fontSize: fs.h2, color: "#8888a8", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'DM Mono'" }}>Example</h2>
                    <button onClick={() => setShowCode(!showCode)} aria-expanded={showCode} style={{ background: "transparent", border: `1px solid #1e1e32`, borderRadius: 5, color: "#9090c0", fontSize: fs.badge, padding: "3px 9px", cursor: "pointer", fontFamily: "'DM Mono'" }}>{showCode ? "Hide" : "Show"}</button>
                  </div>
                  {showCode && <div style={{ background: "#08080f", border: "1px solid #1e1e32", borderRadius: 8, padding: "14px 18px", fontFamily: "'DM Mono'", fontSize: fs.code, color: "#a9ffa9", lineHeight: 1.7, whiteSpace: "pre-wrap", overflowX: "auto" }}>{module.content.code}</div>}
                </div>
              )}

              {/* GMAT Connection */}
              {hasGmatConnection && (
                <div style={{ marginBottom: 20 }}>
                  <button className="gmat-toggle" onClick={() => setShowGmat(!showGmat)} style={{ width: "100%", background: showGmat ? "#1a1508" : "#F4D06F0a", border: "1px solid #F4D06F35", borderRadius: showGmat ? "8px 8px 0 0" : 8, padding: "11px 16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all 0.2s" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <span style={{ fontSize: 16, color: "#F4D06F" }}>∑</span>
                      <div style={{ textAlign: "left" }}>
                        <div style={{ fontSize: fs.sm, color: "#F4D06F", fontWeight: 600 }}>GMAT Connection</div>
                        <div style={{ fontSize: fs.badge, color: "#a09050", marginTop: 1 }}>{module.content.gmatConnection.skill}</div>
                      </div>
                    </div>
                    <span style={{ color: "#F4D06F88", fontSize: 10 }}>{showGmat ? "▲" : "▼"}</span>
                  </button>
                  {showGmat && (
                    <div className="gmat-box" style={{ background: "#0f0c02", border: "1px solid #F4D06F25", borderTop: "none", borderRadius: "0 0 8px 8px", padding: "16px 18px" }}>
                      <p style={{ fontSize: fs.base, color: "#c0b070", lineHeight: 1.75, marginBottom: 12 }}>{module.content.gmatConnection.insight}</p>
                      <div style={{ background: "#F4D06F08", border: "1px solid #F4D06F20", borderRadius: 7, padding: "11px 13px" }}>
                        <div style={{ fontSize: fs.badge, color: "#a09050", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 5, fontFamily: "'DM Mono'" }}>Real-world example</div>
                        <p style={{ fontSize: fs.sm, color: "#a09050", lineHeight: 1.75 }}>{module.content.gmatConnection.example}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Senior Dev Tip */}
              {hasDevTip && (
                <div style={{ marginBottom: 20 }}>
                  <button className="dev-toggle" onClick={() => setShowDevTip(!showDevTip)} style={{ width: "100%", background: showDevTip ? "#1a0f08" : "#FF8C690a", border: "1px solid #FF8C6935", borderRadius: showDevTip ? "8px 8px 0 0" : 8, padding: "11px 16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all 0.2s" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <span style={{ fontSize: 16 }}>⚙</span>
                      <div style={{ textAlign: "left" }}>
                        <div style={{ fontSize: fs.sm, color: "#FF8C69", fontWeight: 600 }}>Senior Dev Best Practice</div>
                        <div style={{ fontSize: fs.badge, color: "#a07050", marginTop: 1 }}>{module.content.devTip.label}</div>
                      </div>
                    </div>
                    <span style={{ color: "#FF8C6988", fontSize: 10 }}>{showDevTip ? "▲" : "▼"}</span>
                  </button>
                  {showDevTip && (
                    <div className="dev-box" style={{ background: "#100a04", border: "1px solid #FF8C6925", borderTop: "none", borderRadius: "0 0 8px 8px", padding: "16px 18px" }}>
                      <p style={{ fontSize: fs.base, color: "#c08060", lineHeight: 1.75, marginBottom: 12 }}>{module.content.devTip.insight}</p>
                      {module.content.devTip.antipattern && (
                        <div style={{ background: "#2a0a0408", border: "1px solid #FF8C6920", borderRadius: 7, padding: "11px 13px" }}>
                          <div style={{ fontSize: fs.badge, color: "#a07050", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 5, fontFamily: "'DM Mono'" }}>⚠ Anti-pattern to avoid</div>
                          <p style={{ fontSize: fs.sm, color: "#a06040", lineHeight: 1.75 }}>{module.content.devTip.antipattern}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Pro Tip */}
              <div style={{ background: `${course.color}0c`, border: `1px solid ${course.color}25`, borderRadius: 8, padding: "12px 16px", marginBottom: 24, display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: 14, flexShrink: 0 }}>💡</span>
                <p style={{ fontSize: fs.base, color: "#c0c0d8", lineHeight: 1.75 }}>
                  <strong style={{ color: course.color }}>Pro tip: </strong>{module.content.tip}
                </p>
              </div>

              {/* Dive Deeper */}
              {module.content.diveDeeper && module.content.diveDeeper.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <h2 style={{ fontSize: fs.h2, color: "#8888a8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10, fontFamily: "'DM Mono'" }}>Dive Deeper</h2>
                  {module.content.diveDeeper.map((link, i) => (
                    <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="dive-link"
                      style={{ display: "flex", alignItems: "center", gap: 10, background: "#10101e", border: "1px solid #1a1a2e", borderRadius: 7, padding: "10px 14px", marginBottom: 6, textDecoration: "none", color: "#c8c8e0", transition: "background 0.15s" }}>
                      <span style={{ fontSize: 18, flexShrink: 0 }}>{link.type === "video" ? "🎬" : link.type === "docs" ? "📖" : link.type === "tool" ? "🔧" : "📄"}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: fs.sm, color: course.color, fontWeight: 500 }}>{link.title}</div>
                        <div style={{ fontSize: fs.badge, color: "#9898b8", marginTop: 3 }}>{link.note}</div>
                      </div>
                      <span style={{ fontSize: fs.badge, color: "#555577" }}>↗</span>
                    </a>
                  ))}
                </div>
              )}

              {/* Quiz */}
              {quizQuestions.length > 0 && (
                <div style={{ marginBottom: 28 }}>
                  {!quizState.active ? (
                    <button onClick={() => setQuizState({ active: true, index: 0, selected: null, correct: null })} style={{ background: "#82C9A012", border: "1px solid #82C9A030", borderRadius: 8, padding: "11px 18px", cursor: "pointer", color: "#82C9A0", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                      ✦ Take the quiz · {quizQuestions.length} question{quizQuestions.length > 1 ? "s" : ""}
                    </button>
                  ) : (
                    <div className="quiz-panel" style={{ background: "#0e0e18", border: "1px solid #2a2a3e", borderRadius: 10, padding: "18px 20px" }}>
                      <div style={{ fontSize: fs.badge, color: "#8888a8", fontFamily: "'DM Mono'", marginBottom: 10 }}>Question {quizState.index + 1} of {quizQuestions.length}</div>
                      <p style={{ fontSize: fs.base, color: "#d0d0e8", lineHeight: 1.75, marginBottom: 14, fontWeight: 500 }}>{currentQ.q}</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                        {currentQ.options.map((opt, oi) => {
                          const isSelected = quizState.selected === oi;
                          const isCorrect = oi === currentQ.answer;
                          const revealed = quizState.selected !== null;
                          let bg = "#12121e", border = "#2a2a3e", color = "#9090b0";
                          if (revealed && isCorrect) { bg = "#0d1f0d"; border = "#4a9a4a"; color = "#82C9A0"; }
                          else if (revealed && isSelected && !isCorrect) { bg = "#1f0d0d"; border = "#9a4a4a"; color = "#e07070"; }
                          else if (isSelected) { bg = "#16162a"; border = course.color; color = "#e0e0ee"; }
                          return (
                            <button key={oi} className={quizState.selected === null ? "quiz-opt" : ""} onClick={() => selectAnswer(oi)}
                              style={{ background: bg, border: `1px solid ${border}`, borderRadius: 7, padding: "10px 14px", cursor: quizState.selected === null ? "pointer" : "default", textAlign: "left", color, fontSize: fs.base, lineHeight: 1.75, transition: "all 0.15s", display: "flex", alignItems: "center", gap: 10 }}>
                              <span style={{ width: 18, height: 18, borderRadius: "50%", border: `1.5px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, flexShrink: 0, color }}>
                                {revealed && isCorrect ? "✓" : revealed && isSelected ? "✗" : String.fromCharCode(65 + oi)}
                              </span>
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                      {quizState.selected !== null && (
                        <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: fs.sm, color: quizState.correct ? "#82C9A0" : "#e07070" }}>
                            {quizState.correct ? "✓ Correct!" : "✗ Not quite — see the correct answer above."}
                          </span>
                          {quizState.index + 1 < quizQuestions.length
                            ? <button onClick={nextQuizQuestion} style={{ background: course.color, border: "none", borderRadius: 6, padding: "7px 16px", cursor: "pointer", fontSize: 12, color: course.accent, fontWeight: 600 }}>Next →</button>
                            : <button onClick={() => setQuizState(s => ({ ...s, active: false }))} style={{ background: "#1a2e1a", border: "1px solid #4a9a4a", borderRadius: 6, padding: "7px 16px", cursor: "pointer", fontSize: 12, color: "#82C9A0", fontWeight: 600 }}>Done ✓</button>
                          }
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Exercise */}
              {module.content.exercise && (
                <div style={{ marginBottom: 28 }}>
                  {module.content.exercise.type === "try-this" && (
                    <div style={{ background: `${course.color}10`, border: `2px solid ${course.color}35`, borderRadius: 10, padding: "16px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                        <span style={{ fontSize: 20 }}>🔨</span>
                        <span style={{ fontSize: fs.sm, color: course.color, fontWeight: 600 }}>Try This Now</span>
                        {module.content.exercise.timeEstimate && <span style={{ fontSize: fs.badge, color: "#9898b8" }}>· {module.content.exercise.timeEstimate}</span>}
                      </div>
                      <p style={{ fontSize: fs.base, color: "#c8c8e0", lineHeight: 1.75 }}>{module.content.exercise.prompt}</p>
                    </div>
                  )}
                  {module.content.exercise.type === "checklist" && (
                    <div style={{ background: `${course.color}0c`, border: `2px solid ${course.color}30`, borderRadius: 10, padding: "16px 20px" }}>
                      <div style={{ fontSize: fs.sm, color: course.color, fontWeight: 600, marginBottom: 12 }}>✅ Apply It — Checklist</div>
                      {module.content.exercise.steps && module.content.exercise.steps.map((step, si) => {
                        const ck = `${moduleKey}-ex-${si}`;
                        const checked = !!exerciseChecked[ck];
                        return (
                          <label key={si} className="exercise-check" style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", cursor: "pointer", borderBottom: si < module.content.exercise.steps.length - 1 ? "1px solid #1a1a2e" : "none" }}>
                            <input type="checkbox" checked={checked}
                              onChange={() => setExerciseChecked(prev => ({ ...prev, [ck]: !prev[ck] }))}
                              style={{ marginTop: 4, accentColor: course.color, width: 18, height: 18, flexShrink: 0 }} />
                            <span style={{ fontSize: fs.base, color: checked ? "#666688" : "#c8c8e0", textDecoration: checked ? "line-through" : "none", lineHeight: 1.75 }}>{step}</span>
                          </label>
                        );
                      })}
                      {module.content.exercise.steps && module.content.exercise.steps.every((_, si) => exerciseChecked[`${moduleKey}-ex-${si}`]) && (
                        <div style={{ marginTop: 12, padding: "8px 14px", background: "#0d1f0d", border: "1px solid #4a9a4a", borderRadius: 7, color: "#82C9A0", fontSize: fs.sm, fontWeight: 600 }}>
                          All steps complete — great work!
                        </div>
                      )}
                    </div>
                  )}
                  {module.content.exercise.type === "reflect" && (
                    <div style={{ background: "#10101e", border: "1px solid #2a2a3e", borderRadius: 10, padding: "16px 20px" }}>
                      <div style={{ fontSize: fs.sm, color: "#C792EA", fontWeight: 600, marginBottom: 10 }}>🪞 Reflect</div>
                      <p style={{ fontSize: fs.base, color: "#c8c8e0", lineHeight: 1.75, marginBottom: 12 }}>{module.content.exercise.prompt}</p>
                      <textarea placeholder="Write your thoughts here..."
                        style={{ width: "100%", minHeight: 90, background: "#08080f", border: "1px solid #2a2a3e", borderRadius: 6, padding: "10px 12px", color: "#c8c8e0", fontSize: fs.base, lineHeight: 1.75, fontFamily: "'DM Sans'" }} />
                    </div>
                  )}
                </div>
              )}

              {/* Nav */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button className="nav-btn" onClick={() => { if (activeModule > 0) setActiveModule(activeModule - 1); else if (activeCourse > 0) { setActiveCourse(activeCourse - 1); setActiveModule(curriculum[activeCourse - 1].modules.length - 1); } resetModule(); }} style={{ background: "#10101e", border: "1px solid #1e1e32", borderRadius: 7, color: "#9090c0", padding: "8px 16px", cursor: "pointer", fontSize: fs.sm, transition: "background 0.15s" }}>← Previous</button>
                <button className="complete-btn" onClick={markComplete} style={{ background: isCompleted ? "#1a2e1a" : course.color, border: "none", borderRadius: 7, color: isCompleted ? "#9ece6a" : course.accent, padding: "8px 20px", cursor: "pointer", fontSize: fs.sm, fontWeight: 600, transition: "filter 0.15s" }}>{isCompleted ? "✓ Completed" : "Mark Complete →"}</button>
              </div>
            </>
          )}
        </main>

        {/* Right panel */}
        <aside aria-label="Course outline and progress" style={{ width: 188, background: "#0e0e1a", borderLeft: "1px solid #1e1e32", padding: "20px 14px", display: "flex", flexDirection: "column", overflowY: "auto", flexShrink: 0 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: fs.badge, color: "#8888a8", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>All Tracks</div>
            {curriculum.map((c, ci) => (
              <div key={c.id} style={{ marginBottom: 18 }}>
                <div style={{ fontSize: fs.badge, color: c.color, fontWeight: 600, marginBottom: 5, display: "flex", gap: 5, alignItems: "center" }}>
                  <span>{c.icon}</span><span>{c.title}</span>
                </div>
                {c.modules.map((m, mi) => {
                  const key = `${ci}-${mi}`;
                  const done = completedModules.has(key);
                  const active = ci === activeCourse && mi === activeModule;
                  return (
                    <div key={mi} className="outline-item" onClick={() => { setActiveCourse(ci); setActiveModule(mi); resetModule(); setActiveTab("content"); }}
                      aria-current={active ? "true" : undefined}
                      style={{ fontSize: fs.badge, color: active ? "#e0e0ee" : done ? "#7070a0" : "#8888a8", padding: "3px 0 3px 7px", borderLeft: `1px solid ${active ? c.color : done ? "#2a2a4a" : "#1a1a2e"}`, cursor: "pointer", marginBottom: 2, lineHeight: 1.5, textDecoration: done && !active ? "line-through" : "none", transition: "color 0.1s" }}>{m.title}</div>
                  );
                })}
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid #1a1a2e", paddingTop: 14, marginTop: 8 }}>
            <div style={{ fontSize: fs.badge, color: "#8888a8", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Overall Progress</div>
            <div style={{ fontSize: 22, fontFamily: "'Playfair Display', serif", color: course.color, fontWeight: 700 }}>{progressPct}%</div>
            <div style={{ fontSize: fs.badge, color: "#9898b8" }}>{completedModules.size} of {totalModules} modules</div>
            <div style={{ marginTop: 6, width: "100%", height: 3, background: "#1a1a2e", borderRadius: 2 }} role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100} aria-label="Overall progress">
              <div style={{ width: `${progressPct}%`, height: "100%", background: course.color, borderRadius: 2, transition: "width 0.4s" }} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
