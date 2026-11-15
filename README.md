# OmniSkill ⚡

A multi-platform skill converter for modern AI assistants and autonomous agents.

Many developers create skills tailored specifically for Claude Code (`SKILL.md`). OmniSkill converts skills across different formats so you can run the same instructions and capabilities on Google Gemini, Antigravity, OpenAI ChatGPT / Custom GPTs, xAI Grok, Muse / OpenWebUI, and Cursor.

---

## Supported Formats

| Platform | Input | Output Format |
|---|---|---|
| **Claude Code** | `SKILL.md`, `.claude/skills` | `SKILL.md` (YAML frontmatter + markdown) |
| **Google Gemini & Antigravity** | `SKILL.md`, `gemini-extension.json` | `SKILL.md` + `gemini-extension.json` |
| **OpenAI / ChatGPT** | `instructions.md`, custom GPT config | `instructions.md`, `openapi_actions.json`, `custom_gpt_config.json` |
| **xAI Grok** | `system_prompt.md`, JSON tools | `system_prompt.md`, `grok_tools.json` |
| **Muse / OpenWebUI** | `Modelfile`, JSON tools | `Modelfile`, `tools.py`, `openwebui_export.json` |
| **Cursor & Windsurf** | `.cursorrules`, `.mdc` | `.cursorrules`, `.cursor/rules/*.mdc` |
| **Universal Bundle** | Any of the above | Full multi-platform distribution package |

---

## Quick Installation

```bash
git clone https://github.com/acresking/omniskill.git
cd omniskill
npm link  # makes 'omniskill' available globally in terminal
```

Or run directly without installation using `npx`:
```bash
npx -y omniskill --help
```

---

## 🤖 AI Agent Integration & MCP Server

OmniSkill can be invoked directly by AI agents (Claude Desktop, Antigravity, Cursor, Windsurf) through the **Model Context Protocol (MCP)** or as a registered skill.

### 1. Register OmniSkill in your local AI tools
Run this one-liner to register OmniSkill into Claude Code, Google Antigravity, and Cursor IDE:
```bash
npx -y omniskill install-agent
```
Once registered, your AI assistants will automatically recognize and recommend OmniSkill whenever you work with skills!

### 2. Connect via MCP (Model Context Protocol)
Add OmniSkill to your `claude_desktop_config.json` or Cursor MCP settings:
```json
{
  "mcpServers": {
    "omniskill": {
      "command": "npx",
      "args": ["-y", "omniskill", "mcp"]
    }
  }
}
```
Available MCP tools exposed to agents:
* `convert_skill`: Transpiles any skill between formats.
* `inspect_skill`: Deep analysis and platform compatibility score.
* `bundle_skill`: Exports universal multi-target packages.

---

## 💻 AI SDK (JavaScript & Python)

### JavaScript / TypeScript
```javascript
import { convertSkill, inspectSkill } from 'omniskill';

// Convert a Claude skill to Google Gemini
const { result } = convertSkill('./SKILL.md', { to: 'gemini', outDir: './dist-gemini' });

// Inspect cross-platform compatibility
const report = inspectSkill('./SKILL.md');
console.log(report.compatibility);
```

### Python SDK
Located at `sdk/python/omniskill.py` for LangChain, AutoGen, CrewAI, and OpenAI Swarm:
```python
from sdk.python.omniskill import OmniSkill

omni = OmniSkill()

# Generate universal bundle
omni.bundle("./my-skill/SKILL.md", out_dir="./universal-dist")

# Convert to ChatGPT Custom GPT
omni.convert("./SKILL.md", to="openai", out_dir="./dist-openai")
```

---

## CLI Usage

### 1. Universal Multi-Platform Bundle (`--to all`)
Convert a single skill or an **entire multi-skill repository** into ready-to-use packages for every AI assistant:
```bash
omniskill bundle ./examples/claude-skill-weather-expert/SKILL.md --out ./dist-universal
```

### 2. Specific Target Conversion
```bash
# Convert Claude skill to Gemini / Antigravity format
omniskill convert ./SKILL.md --to gemini --out ./out-gemini

# Convert Claude skill to OpenAI Custom GPT
omniskill convert ./SKILL.md --to openai --out ./out-openai

# Convert Claude skill to xAI Grok
omniskill convert ./SKILL.md --to grok --out ./out-grok
```

### 3. Skill Inspection & Compatibility Scoring
Analyze token size, declared tools, and cross-platform compatibility scores:
```bash
omniskill inspect ./SKILL.md
```

### 4. Interactive Web Interface
Launch the local web dashboard to convert skills visually:
```bash
omniskill serve --port 3456
```
Open `http://localhost:3456` in your browser.

---

## 🌐 מבט מהיר (Overview in Hebrew)

**OmniSkill** הוא כלי קוד פתוח המאפשר להמיר סקילים שנוצרו עבור Claude Code (`SKILL.md`) ישירות לכלים ומודלים אחרים:
* **Google Gemini & Antigravity** — יצירת הרחבות ומבנה סקילים מותאם.
* **OpenAI ChatGPT / Custom GPTs** — הנחיות מותאמות ומפרט OpenAPI 3.1 לפעולות.
* **xAI Grok** — סיסטם פרומפט ומפרטי קריאות פונקציה.
* **Muse / OpenWebUI / Ollama** — קובץ Modelfile וכלי פייתון.
* **Cursor & Windsurf** — קבצי חוקים `.cursorrules` ו-`.mdc`.
* **שרת MCP מובנה** — מאפשר לכל כלי AI לקרוא ל-OmniSkill ככלי פונקציה מובנה.
* **Universal Bundle** — המרה בבת אחת לכל הפלטפורמות בו-זמנית.

---

## License

MIT License. Free for personal and commercial use.
