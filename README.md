# OmniSkill ⚡

A multi-platform skill converter for modern AI assistants.

Many developers create skills tailored specifically for Claude Code (`SKILL.md`). OmniSkill converts skills across different formats so you can run the same instructions and capabilities on Google Gemini, Antigravity, OpenAI ChatGPT / Custom GPTs, xAI Grok, Muse / OpenWebUI, and Cursor.

---

## Supported Formats

| Platform | Input | Output Format |
|---|---|---|
| **Claude Code** | `SKILL.md`, `.claude/skills` | `SKILL.md` (YAML frontmatter + markdown) |
| **Google Gemini / Antigravity** | `SKILL.md`, `gemini-extension.json` | `SKILL.md` + `gemini-extension.json` |
| **OpenAI / ChatGPT** | `instructions.md`, custom GPT config | `instructions.md`, `openapi_actions.json`, `custom_gpt_config.json` |
| **xAI Grok** | `system_prompt.md`, JSON tools | `system_prompt.md`, `grok_tools.json` |
| **Muse / OpenWebUI** | `Modelfile`, JSON tools | `Modelfile`, `tools.py`, `openwebui_export.json` |
| **Cursor / Windsurf** | `.cursorrules`, `.mdc` | `.cursorrules`, `.cursor/rules/*.mdc` |
| **Universal Bundle** | Any of the above | Full multi-platform distribution package |

---

## Getting Started

### Installation
```bash
git clone https://github.com/acresking/omniskill.git
cd omniskill
npm link  # makes 'omniskill' available globally in terminal
```

Zero external dependencies: runs natively on Node.js 18+.

---

## CLI Usage

### 1. Universal Multi-Platform Bundle (`--to all`)
Convert any skill into ready-to-use packages for every AI assistant simultaneously:
```bash
node bin/omniskill.js bundle ./examples/claude-skill-weather-expert/SKILL.md --out ./dist-universal
```

### 2. Specific Target Conversion
```bash
# Convert Claude skill to Gemini / Antigravity format
node bin/omniskill.js convert ./SKILL.md --to gemini --out ./out-gemini

# Convert Claude skill to OpenAI Custom GPT
node bin/omniskill.js convert ./SKILL.md --to openai --out ./out-openai

# Convert Claude skill to xAI Grok
node bin/omniskill.js convert ./SKILL.md --to grok --out ./out-grok
```

### 3. Skill Inspection & Compatibility Scoring
Analyze token size, declared tools, and cross-platform compatibility scores:
```bash
node bin/omniskill.js inspect ./SKILL.md
```

### 4. Interactive Web Interface
Launch the local web dashboard to convert skills visually:
```bash
node bin/omniskill.js serve --port 3456
```
Open `http://localhost:3456` in your browser.

---

## Running Tests

OmniSkill uses Node's native test runner (`node:test`):
```bash
npm test
```

---

## Project Structure

```
omniskill/
├── bin/
│   └── omniskill.js         # Command line executable
├── src/
│   ├── index.js             # Library entrypoint
│   ├── yaml.js              # Built-in zero-dependency YAML & frontmatter parser
│   ├── types/               # Universal Skill Intermediate Representation (IR)
│   ├── parsers/             # Adapters for Claude, Gemini, OpenAI, Grok, Muse, Cursor
│   ├── generators/          # Formatters for each target AI platform
│   ├── core/                # Conversion and inspection engine
│   └── web/                 # Local web dashboard and static assets
├── test/                    # End-to-end and unit tests
└── examples/                # Ready-to-convert sample skills
```

---

## 🌐 מבט מהיר (Overview in Hebrew)

**OmniSkill** הוא כלי קוד פתוח המאפשר להמיר סקילים שנוצרו עבור Claude Code (`SKILL.md`) ישירות לכלים ומודלים אחרים:
* **Google Gemini & Antigravity** — יצירת הרחבות ומבנה סקילים מותאם.
* **OpenAI ChatGPT / Custom GPTs** — הנחיות מותאמות ומפרט OpenAPI 3.1 לפעולות.
* **xAI Grok** — סיסטם פרומפט ומפרטי קריאות פונקציה.
* **Muse / OpenWebUI / Ollama** — קובץ Modelfile וכלי פייתון.
* **Cursor & Windsurf** — קבצי חוקים `.cursorrules` ו-`.mdc`.
* **Universal Bundle** — המרה בבת אחת לכל הפלטפורמות בו-זמנית.

---

## License

MIT License. Free for personal and commercial use.
