<div align="center">

# ⚡ OmniSkill

### *The Universal Cross-Platform AI Skill Engine*

Transpile AI agent skills across **Claude Code**, **Google Gemini & Antigravity**, **OpenAI ChatGPT / Custom GPTs**, **xAI Grok**, **Perplexity AI**, **DeepSeek (R1/V3)**, **Alibaba Qwen**, **Local Models (Ollama & LM Studio)**, and **Cursor** — bidirectionally, securely, and with zero external dependencies.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node: >=18.0.0](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![Version](https://img.shields.io/badge/Version-1.3.0-purple.svg)](https://github.com/acresking/omniskill)
[![CI Multi-OS](https://img.shields.io/badge/CI-Ubuntu%20%7C%20Windows%20%7C%20macOS-success.svg)](https://github.com/acresking/omniskill/actions)
[![MCP Enabled](https://img.shields.io/badge/Protocol-MCP%20Enabled-orange.svg)](https://modelcontextprotocol.io/)
[![Security: Hardened](https://img.shields.io/badge/Security-Path%20Hardened-red.svg)](src/core/security.js)
[![Author: acresking](https://img.shields.io/badge/Author-acresking-black?logo=github)](https://github.com/acresking)

[Key Features](#-key-features) •
[Supported Ecosystems](#-supported-ecosystems) •
[Quick Start](#-quick-start) •
[MCP Server](#-mcp-server-for-ai-agents) •
[Security & Audit](#-security-hardening--audit-reports) •
[AI SDK](#-ai-sdk-javascript--python) •
[Hebrew Overview](#-מבט-מהיר-בעברית)

</div>

---

## 💡 The Problem OmniSkill Solves

The AI open-source community is writing thousands of powerful agent skills tailored strictly for **Claude Code** (`SKILL.md`). However, developers using **Google Gemini, OpenAI ChatGPT, xAI Grok, Perplexity, DeepSeek, Cursor, or local offline models (Ollama/LM Studio)** cannot run them natively without tedious manual translation.

**OmniSkill** is the universal transpiler for AI skills. Write or find a skill once, and convert it instantly into optimized formats for any AI platform — or generate a complete **Universal Bundle** that runs everywhere.

---

## 🌟 Key Features

* 🔄 **Bi-Directional Cross-Transpiling:** Convert from any platform to any platform, including full reverse-conversion back into Claude Code (`SKILL.md`).
* 📦 **One-Click Universal Bundle:** Exports ready-to-run configurations for all 10+ AI ecosystems simultaneously (`--to all`).
* 📁 **Multi-Skill Suite Auto-Discovery:** Scans and converts entire multi-skill plugin repositories in bulk (e.g. trading suites, agent packs).
* 🛡️ **Security-Hardened Pipeline:** Built-in Path Traversal protection, safe path resolution, filename sanitization, and prototype pollution guards.
* 📋 **Audit & Diff Reporting:** Every conversion outputs `conversion_report.json` and `CHANGELOG.md` detailing all transformations and adapted/dropped capabilities.
* 🔌 **Native MCP Server:** Exposes JSON-RPC tools to AI agents (`Claude Desktop`, `Cursor`, `Antigravity`, `Windsurf`).
* 🤖 **Agent Self-Registration:** Registers OmniSkill into local Claude Code, Antigravity, and Cursor environments with one command (`npx omniskill install-agent`).
* 🖥️ **Interactive Web Studio:** Local visual dashboard with live multi-file viewer, copy buttons, and compatibility radar.
* ⚡ **Zero External Dependencies:** Built with pure modern Node.js ES Modules and an embedded YAML/frontmatter engine.
* 💻 **True Cross-Platform:** Verified and tested across **Windows, macOS, and Linux**.

---

## 🚀 Architecture

```
                      ┌─────────────────────────────────┐
                      │    Input AI Skill / Repository  │
                      │ (Claude, Gemini, OpenAPI, etc.) │
                      └────────────────┬────────────────┘
                                       │
                                       ▼
                      ┌─────────────────────────────────┐
                      │     OmniSkill Core IR & AST     │
                      │ • Sanitized Metadata & Bounds   │
                      │ • System Directives & Prompts   │
                      │ • Normalized Tool Declarations  │
                      │ • Audit & Diff Engine           │
                      └────────────────┬────────────────┘
                                       │
         ┌────────────┬───────────┬────┴──────┬───────────┬────────────┐
         ▼            ▼           ▼           ▼           ▼            ▼
    🟣 Claude    🔵 Gemini   🟢 OpenAI   ⚫ Grok     🔮 Perplexity  🇨🇳 DeepSeek
      Code        Antigravity  ChatGPT      xAI       Collections    & Qwen
         │            │           │           │           │            │
         └────────────┴───────────┼───────────┴───────────┴────────────┘
                                  ▼
                     🖥️ Ollama / LM Studio (Local)
                     🔷 Cursor / Windsurf Rules
```

---

## 📊 Supported Ecosystems

| Platform | Input Formats | Generated Output Files |
|---|---|---|
| **🟣 Claude Code** | `SKILL.md`, `.claude/skills/` | Standard `SKILL.md` + executable CLI scripts in `scripts/*.sh` |
| **🔵 Google Gemini & Antigravity** | `SKILL.md`, `gemini-extension.json` | `SKILL.md` + full `gemini-extension.json` tool manifest |
| **🟢 OpenAI / ChatGPT** | `instructions.md`, custom GPT config | `instructions.md`, `openapi_actions.json`, `custom_gpt_config.json` |
| **⚫ xAI Grok** | `system_prompt.md`, tool schema | Tailored `system_prompt.md` + `grok_tools.json` |
| **🔮 Perplexity AI** | Collection prompt / Sonar payload | `perplexity_collection.md` (citation-grounded) + `sonar_api_config.json` |
| **🇨🇳 DeepSeek & Chinese LLMs** | Prompt / JSON API formats | `deepseek/system_prompt.md` (R1 reasoning / V3), `qwen_agent.json`, `kimi_system_prompt.md` |
| **🖥️ Local Models (Ollama)** | `Modelfile`, JSON tools | Custom `Modelfile` (Llama 3.3/DeepSeek/Qwen) + `setup.sh`/`setup.bat` |
| **🎛️ LM Studio & Jan.ai** | System prompt presets | `lmstudio_preset.json` + `system_prompt.txt` |
| **🟠 Muse & OpenWebUI** | `Modelfile`, JSON tools | `Modelfile`, `tools.py` (Pydantic stub), `openwebui_export.json` |
| **🔷 Cursor & Windsurf** | `.cursorrules`, `.mdc` | Project `.cursorrules` + modern `.cursor/rules/*.mdc` |
| **📦 Universal Bundle** | *Any of the above* | Complete 10-target distribution package with unified `README.md` |

---

## ⚡ Quick Start

Run instantly with `npx` (no installation required):
```bash
npx -y omniskill --help
```

Or install globally:
```bash
git clone https://github.com/acresking/omniskill.git
cd omniskill
npm link
```

---

## 🛠️ CLI Usage Guide

### 1. Universal Multi-Platform Bundle (`bundle`)
Transpile any skill or **entire multi-skill repository** into ready-to-run configurations for every platform:
```bash
omniskill bundle ./path/to/SKILL.md --out ./dist-universal
```

### 2. Specific Target Conversion (`convert`)
```bash
# Convert any skill back to Claude Code (with CLI scripts)
omniskill convert ./custom_gpt.json --to claude --out ./dist-claude

# Convert to Google Gemini / Antigravity
omniskill convert ./SKILL.md --to gemini --out ./dist-gemini

# Convert to OpenAI ChatGPT Custom GPT
omniskill convert ./SKILL.md --to openai --out ./dist-openai

# Convert to Perplexity AI
omniskill convert ./SKILL.md --to perplexity --out ./dist-perplexity

# Convert to DeepSeek R1 & Alibaba Qwen
omniskill convert ./SKILL.md --to chinese --out ./dist-chinese

# Convert to Local Models (Ollama)
omniskill convert ./SKILL.md --to ollama --out ./dist-ollama
```

### 3. Inspect & Compatibility Score (`inspect`)
Analyze token size, declared tools, and cross-platform compatibility scores:
```bash
omniskill inspect ./SKILL.md
```

### 4. Interactive Web Studio (`serve`)
Launch the built-in browser-based conversion studio:
```bash
omniskill serve --port 3456
```
Open **`http://localhost:3456`** in your browser.

---

## 🛡️ Security Hardening & Audit Reports

OmniSkill includes strict security validation:
* **Path Traversal Protection (`safeResolvePath`):** Ensures no output path can escape the designated output directory (`../../` attacks are blocked).
* **Filename Sanitization:** Automatically cleans forbidden OS characters (`< > : " / \ | ? *`) across Windows, macOS, and Linux.
* **Prototype Pollution Prevention:** Strips `__proto__` and `constructor` injections from incoming JSON/YAML.
* **Conversion Audit:** Every output directory contains `conversion_report.json` and `CHANGELOG.md` detailing:
  - 🔄 Transformations applied to prompts and schemas.
  - ⚠️ Features adapted or dropped for specific platforms.
  - 🛡️ Verification checklist of security integrity.

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

### Automatic Local Agent Registration
Register OmniSkill into your local Claude Code, Antigravity, and Cursor environments:
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
console.log(report.compatibility);

// Transpile to Google Gemini with audit report
const { result, report: diff } = convertSkill('./SKILL.md', { to: 'gemini', outDir: './out' });
console.log(diff.transformations);
```

### Python SDK
Located at `sdk/python/omniskill.py`:
```python
from sdk.python.omniskill import OmniSkill

omni = OmniSkill()

# Generate universal bundle
omni.bundle("./SKILL.md", out_dir="./universal-dist")

# Convert to ChatGPT Custom GPT
omni.convert("./SKILL.md", to="openai", out_dir="./dist-openai")
```

---

## 🌐 מבט מהיר בעברית

> [!NOTE]
> **OmniSkill** פותח במטרה לשבור את נעילת הסקילים של Claude Code ולאפשר לכל משתמש, חוקר ומפתח להריץ כל סקיל בכל מודל וכלי AI קיים — בענן, מקומית ובמודלים בינלאומיים.

* **תאימות מקיפה ל-10+ אקוסיסטמים:** תמיכה ב-Claude Code, Google Gemini, OpenAI GPTs, xAI Grok, **Perplexity AI**, **המודלים הסיניים (DeepSeek R1/V3, Alibaba Qwen, Moonshot Kimi)**, **מודלים מקומיים (Ollama, LM Studio, Jan.ai)** ו-Cursor.
* **המרה הפוכה מושלמת לקלוד:** תרגום אוטומטי של פעולות OpenAPI וכלים לסקרפטי Bash מבצעיים בתיקיית `scripts/` עם תיוג הפעלה מותאם.
* **דוח שינויים ונפילות (Diff & Drop Report):** בכל המרה נוצרים קבצי `conversion_report.json` ו-`CHANGELOG.md` שמפרטים בדיוק מה הותאם ומה השתנה.
* **אבטחה מוקשחת (Security Hardened):** חסימה מלאה של מתקפות Path Traversal, זיהום פרוטוטייפ וסינון שמות קבצים לכל מערכות ההפעלה.
* **שרת MCP ורישום עצמי לסוכנים:** מאפשר לכלי AI להשתמש ב-OmniSkill ככלי פונקציה מובנה.
* **ממשק ווב עשיר:** שרת מקומי עם מציג קבצים חי ודוח ביקורת ויזואלי.
* **אפס תלויות:** קוד Node.js טהור ללא ספריות צד-שלישי כבדות. תואם Windows, Linux ו-macOS.

---

## 👤 Author & Credits

Created and maintained by **[acresking](https://github.com/acresking)**.

* **GitHub:** [https://github.com/acresking](https://github.com/acresking)
* **Project Repository:** [https://github.com/acresking/omniskill](https://github.com/acresking/omniskill)

Contributions, issues, and feature requests are welcome! Feel free to open a PR or give a ⭐️ if you find this project useful.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
Free for personal, academic, and commercial use.
