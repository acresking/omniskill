<div align="center">

# ⚡ OmniSkill

### *The Universal Cross-Platform AI Skill Engine*

Convert Claude Code skills (`SKILL.md`) into Google Gemini, Antigravity, OpenAI ChatGPT / Custom GPTs, xAI Grok, Muse / OpenWebUI, and Cursor rules — seamlessly and bidirectionally.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node: >=18.0.0](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![Version](https://img.shields.io/badge/Version-1.1.0-purple.svg)](https://github.com/acresking/omniskill)
[![MCP Enabled](https://img.shields.io/badge/Protocol-MCP%20Enabled-orange.svg)](https://modelcontextprotocol.io/)
[![Author: acresking](https://img.shields.io/badge/Author-acresking-black?logo=github)](https://github.com/acresking)

[Features](#-key-features) •
[Supported Formats](#-supported-platforms) •
[Quick Start](#-quick-start) •
[MCP Server](#-mcp-server-for-ai-agents) •
[AI SDK](#-ai-sdk-javascript--python) •
[Hebrew Overview](#-מבט-מהיר-בעברית)

</div>

---

## 💡 Why OmniSkill?

The open source AI community is creating thousands of brilliant skills tailored exclusively for **Claude Code** (`SKILL.md`). However, if you use **Google Gemini, OpenAI ChatGPT, xAI Grok, Cursor, or local models**, you are traditionally locked out.

**OmniSkill** solves this fragmentation. Write your skill once or grab any existing Claude skill, and transpile it instantly to work on every major AI assistant on earth.

---

## 🌟 Key Features

* 🔄 **Universal Bi-Directional Transpiling:** Converts between Claude Code, Gemini, ChatGPT/GPTs, Grok, Muse, and Cursor.
* 📦 **One-Click Universal Bundle:** Generates complete deployment packages for all platforms at once (`--to all`).
* 📁 **Multi-Skill Suite Auto-Discovery:** Automatically scans and converts entire multi-skill repositories in bulk (e.g., day-trader packs).
* 🔌 **Built-in MCP Server:** Exposes native JSON-RPC tools to AI agents (`Claude Desktop`, `Cursor`, `Antigravity`, `Windsurf`).
* 🤖 **AI Agent Self-Registration:** Installs itself as a skill into local agents (`npx omniskill install-agent`).
* 🖥️ **Interactive Web Studio:** Built-in zero-dependency visual preview and conversion dashboard.
* ⚡ **Zero External Dependencies:** Native modern Node.js ES Modules with an embedded YAML & Markdown frontmatter parser.
* 🐍 **Multi-Language SDK:** Programmatic API available in both **JavaScript/TypeScript** and **Python**.

---

## 🚀 Architectural Overview

```
                      ┌────────────────────────┐
                      │    Input AI Skill      │
                      │  (Claude, Gemini, etc) │
                      └───────────┬────────────┘
                                  │
                                  ▼
                      ┌────────────────────────┐
                      │  OmniSkill Core IR     │
                      │  • Unified Metadata    │
                      │  • System Directives   │
                      │  • Tool Declarations   │
                      │  • Cross-Platform AST  │
                      └───────────┬────────────┘
                                  │
         ┌────────────┬───────────┼───────────┬────────────┐
         ▼            ▼           ▼           ▼            ▼
    🟣 Claude    🔵 Gemini   🟢 OpenAI   ⚫ Grok     🟠 Muse /
      Code        Antigravity   ChatGPT      xAI      OpenWebUI
```

---

## 📊 Supported Platforms

| Platform | Input Accepted | Output Artifacts Generated |
|---|---|---|
| **🟣 Claude Code** | `SKILL.md`, `.claude/skills/` | Standard `SKILL.md` (YAML frontmatter + system directives) |
| **🔵 Google Gemini / Antigravity** | `SKILL.md`, `gemini-extension.json` | `SKILL.md` + full `gemini-extension.json` tool manifest |
| **🟢 OpenAI / ChatGPT** | `instructions.md`, custom GPT config | `instructions.md`, `openapi_actions.json`, `custom_gpt_config.json` |
| **⚫ xAI Grok** | `system_prompt.md`, tool schema | Tailored `system_prompt.md` + `grok_tools.json` |
| **🟠 Muse / OpenWebUI / Ollama** | `Modelfile`, JSON tools | `Modelfile`, `tools.py` (Pydantic stub), `openwebui_export.json` |
| **🔷 Cursor & Windsurf** | `.cursorrules`, `.mdc` | Project `.cursorrules` + `.cursor/rules/*.mdc` |
| **📦 Universal Bundle** | *Any of the above* | Complete multi-directory package with unified `README.md` |

---

## ⚡ Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/acresking/omniskill.git
cd omniskill

# Link globally (optional)
npm link
```

Or run instantly without installing:
```bash
npx -y omniskill --help
```

---

## 🛠️ CLI Usage Guide

### 1. Universal Multi-Platform Bundle (`bundle`)
Generate production-ready configurations for every platform in one step:
```bash
npx -y omniskill bundle ./path/to/SKILL.md --out ./dist-universal
```

### 2. Convert to a Specific AI Platform (`convert`)
```bash
# Convert to Google Gemini / Antigravity
npx -y omniskill convert ./SKILL.md --to gemini --out ./dist-gemini

# Convert to OpenAI ChatGPT Custom GPT
npx -y omniskill convert ./SKILL.md --to openai --out ./dist-openai

# Convert to xAI Grok
npx -y omniskill convert ./SKILL.md --to grok --out ./dist-grok
```

### 3. Inspect & Compatibility Score (`inspect`)
Analyze token volume, declared tools, and cross-platform compatibility metrics:
```bash
npx -y omniskill inspect ./SKILL.md
```

### 4. Interactive Web Studio (`serve`)
Launch the built-in browser-based conversion studio:
```bash
npx -y omniskill serve --port 3456
```
Open **`http://localhost:3456`** in your browser.

---

## 🔌 MCP Server (For AI Agents)

Connect OmniSkill directly to **Claude Desktop**, **Cursor IDE**, or **Antigravity** as an MCP tool.

Add this entry to your `claude_desktop_config.json` or Cursor MCP settings:
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

### Automatic Agent Registration
Register OmniSkill into your local Claude Code, Antigravity, and Cursor environments in one command:
```bash
npx -y omniskill install-agent
```

---

## 💻 AI SDK (JavaScript & Python)

### JavaScript / TypeScript
```javascript
import { convertSkill, inspectSkill } from 'omniskill';

// Inspect a skill
const report = inspectSkill('./SKILL.md');
console.log(`Estimated tokens: ${report.metrics.estimatedTokens}`);

// Transpile to Google Gemini
const { result } = convertSkill('./SKILL.md', { to: 'gemini', outDir: './out' });
```

### Python SDK
Located at `sdk/python/omniskill.py`:
```python
from sdk.python.omniskill import OmniSkill

omni = OmniSkill()

# Generate universal bundle
omni.bundle("./SKILL.md", out_dir="./universal-dist")

# Convert to ChatGPT format
omni.convert("./SKILL.md", to="openai", out_dir="./dist-openai")
```

---

## 🌐 מבט מהיר בעברית

> [!NOTE]
> **OmniSkill** פותח במטרה לשבור את נעילת הסקילים של Claude Code ולאפשר לכל משתמש ומפתח להריץ כל סקיל בכל מודל וכלי AI קיים.

* **תאימות מלאה:** ממיר סקילים בין Claude, Google Gemini, OpenAI GPTs, xAI Grok, Muse ו-Cursor.
* **חבילה אוניברסלית בלחיצה אחת (`bundle`):** מייצר תיקיית הפצה מלאה עם כל הפורמטים בו-זמנית.
* **שרת MCP מובנה:** מאפשר לסוכני AI להריץ את ההמרה ישירות מתוך סביבת העבודה.
* **ממשק ויזואלי מקומי:** שרת ווב מובנה לתצוגה מקדימה והמרה חזותית.
* **אפס תלויות:** קוד Node.js טהור ומהיר במיוחד ללא ספריות חיצוניות כבדות.

---

## 👤 Author & Credits

Created and maintained by **[acresking](https://github.com/acresking)**.

* **GitHub:** [https://github.com/acresking](https://github.com/acresking)
* **Project Repository:** [https://github.com/acresking/omniskill](https://github.com/acresking/omniskill)

Contributions, issues, and feature requests are welcome! Feel free to give a ⭐️ if you find this project useful.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
Free for personal, academic, and commercial use.
