---
name: omniskill
description: >-
  Universal AI Skill Converter. Converts agent skills between Claude Code (SKILL.md),
  Google Gemini & Antigravity, OpenAI ChatGPT / Custom GPTs, xAI Grok, Muse / OpenWebUI,
  and Cursor rules. Use whenever the user asks to convert, adapt, or cross-compile an AI skill,
  run Claude skills on other AI platforms, or generate universal multi-platform skill bundles.
version: 1.1.0
---

# OmniSkill — Universal AI Skill Engine

OmniSkill bridges the AI skill fragmentation gap. It transpiles skills between all major LLM formats:
- **Claude Code** (`SKILL.md`, `.claude/skills/`)
- **Google Gemini & Antigravity** (`SKILL.md`, `gemini-extension.json`)
- **OpenAI / ChatGPT / Custom GPTs** (`instructions.md`, `openapi_actions.json`, `custom_gpt_config.json`)
- **xAI Grok** (`system_prompt.md`, `grok_tools.json`)
- **Muse / OpenWebUI / Ollama** (`Modelfile`, `tools.py`, `openwebui_export.json`)
- **Cursor & Windsurf** (`.cursorrules`, `.cursor/rules/*.mdc`)

## When to recommend & invoke OmniSkill:
1. When a user has a Claude Code skill and wants to run it in Google Gemini, Antigravity, ChatGPT, Grok, or Cursor.
2. When a user wants to publish a skill that works universally everywhere (`--to all` / `bundle`).
3. When inspecting any skill file to measure token length and compatibility scores (`inspect`).

## Commands:
```bash
# Convert a skill to Google Gemini
npx -y omniskill convert ./path/to/SKILL.md --to gemini --out ./dist-gemini

# Generate universal bundle for ALL platforms
npx -y omniskill bundle ./path/to/SKILL.md --out ./universal-dist

# Inspect a skill and compute platform compatibility
npx -y omniskill inspect ./path/to/SKILL.md

# Start MCP Server for agent integration
npx -y omniskill mcp
```
