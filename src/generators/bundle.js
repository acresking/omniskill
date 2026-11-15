/**
 * OmniSkill - Universal Multi-Platform Bundle Generator
 */
import { generateClaudeSkill } from './claude.js';
import { generateGeminiSkill } from './gemini.js';
import { generateOpenAISkill } from './openai.js';
import { generateGrokSkill } from './grok.js';
import { generateMuseSkill } from './muse.js';
import { generateCursorSkill } from './cursor.js';

export function generateUniversalBundle(skill) {
  const claude = generateClaudeSkill(skill);
  const gemini = generateGeminiSkill(skill);
  const openai = generateOpenAISkill(skill);
  const grok = generateGrokSkill(skill);
  const muse = generateMuseSkill(skill);
  const cursor = generateCursorSkill(skill);

  const manifest = {
    generator: 'OmniSkill',
    version: '1.0.0',
    skill: {
      name: skill.metadata.name,
      displayName: skill.metadata.displayName,
      version: skill.metadata.version,
      description: skill.metadata.description,
      sourcePlatform: skill.metadata.sourcePlatform,
      toolCount: skill.tools?.length || 0
    },
    supportedTargets: ['claude', 'gemini', 'openai', 'grok', 'muse', 'cursor'],
    generatedAt: new Date().toISOString()
  };

  const readme = `# ${skill.metadata.displayName} (Universal AI Skill Package)

> Generated with [OmniSkill](https://github.com/simantovmeir84/omniskill) — The Universal AI Skill Converter.

${skill.metadata.description}

## Quick Installation Guide

### 🟣 1. Claude Code
Copy the contents of \`claude/SKILL.md\` into your project's \`.claude/skills/${skill.metadata.name}/SKILL.md\` or run:
\`\`\`bash
cp -r claude/SKILL.md .claude/skills/${skill.metadata.name}/
\`\`\`

### 🔵 2. Google Gemini & Antigravity
- **Antigravity**: Place \`gemini/SKILL.md\` in your workspace or \`~/.gemini/antigravity/skills/${skill.metadata.name}/\`.
- **Gemini CLI**: Import \`gemini/gemini-extension.json\`.

### 🟢 3. OpenAI ChatGPT / Custom GPTs
- Open [ChatGPT GPT Builder](https://chatgpt.com/gpts/editor).
- Paste the content of \`openai/instructions.md\` into the **Instructions** field.
- If using actions, import \`openai/openapi_actions.json\` under **Actions**.

### ⚫ 4. xAI Grok
- Paste \`grok/system_prompt.md\` into Grok system directives or API parameters.
- Provide \`grok/grok_tools.json\` in your API tool declaration.

### 🟠 5. Muse & OpenWebUI / Ollama
- **Ollama / Muse**: Run \`ollama create ${skill.metadata.name} -f muse/Modelfile\`.
- **OpenWebUI**: Import \`muse/openwebui_export.json\` or paste \`muse/tools.py\` into Tools.

### 🔷 6. Cursor & Windsurf
- Copy \`cursor/.cursorrules\` to your project root or \`cursor/.cursor/rules/${skill.metadata.name}.mdc\`.

---
*Created automatically by OmniSkill — Write once, run on any AI.*
`;

  const files = [
    {
      path: 'README.md',
      content: readme,
      description: 'Multi-platform installation instructions'
    },
    {
      path: 'omni-manifest.json',
      content: JSON.stringify(manifest, null, 2),
      description: 'OmniSkill package manifest'
    }
  ];

  // Prefix platform files
  const platformOutputs = [
    { prefix: 'claude', out: claude },
    { prefix: 'gemini', out: gemini },
    { prefix: 'openai', out: openai },
    { prefix: 'grok', out: grok },
    { prefix: 'muse', out: muse },
    { prefix: 'cursor', out: cursor }
  ];

  for (const { prefix, out } of platformOutputs) {
    for (const f of out.files) {
      files.push({
        path: `${prefix}/${f.path}`,
        content: f.content,
        description: `[${prefix.toUpperCase()}] ${f.description}`
      });
    }
  }

  return {
    platform: 'all',
    mainFile: 'README.md',
    content: readme,
    manifest,
    files
  };
}
