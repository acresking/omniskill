/**
 * OmniSkill - Universal Multi-Platform Bundle Generator
 */
import { generateClaudeSkill } from './claude.js';
import { generateGeminiSkill } from './gemini.js';
import { generateOpenAISkill } from './openai.js';
import { generateGrokSkill } from './grok.js';
import { generateMuseSkill } from './muse.js';
import { generateCursorSkill } from './cursor.js';
import { generatePerplexitySkill } from './perplexity.js';
import { generateOllamaSkill } from './ollama.js';
import { generateLMStudioSkill } from './lmstudio.js';
import { generateChineseModelsSkill } from './chinese.js';

export function generateUniversalBundle(skill) {
  const claude = generateClaudeSkill(skill);
  const gemini = generateGeminiSkill(skill);
  const openai = generateOpenAISkill(skill);
  const grok = generateGrokSkill(skill);
  const muse = generateMuseSkill(skill);
  const cursor = generateCursorSkill(skill);
  const perplexity = generatePerplexitySkill(skill);
  const ollama = generateOllamaSkill(skill);
  const lmstudio = generateLMStudioSkill(skill);
  const chinese = generateChineseModelsSkill(skill);

  const manifest = {
    generator: 'OmniSkill',
    version: '1.2.0',
    skill: {
      name: skill.metadata.name,
      displayName: skill.metadata.displayName,
      version: skill.metadata.version,
      description: skill.metadata.description,
      sourcePlatform: skill.metadata.sourcePlatform,
      toolCount: skill.tools?.length || 0
    },
    supportedTargets: [
      'claude',
      'gemini',
      'openai',
      'grok',
      'perplexity',
      'ollama',
      'lmstudio',
      'chinese_models',
      'deepseek',
      'qwen',
      'kimi',
      'muse',
      'cursor'
    ],
    generatedAt: new Date().toISOString()
  };

  const readme = `# ${skill.metadata.displayName} (Universal AI Skill Package)

> Generated with [OmniSkill](https://github.com/acresking/omniskill) — The Universal Cross-Platform AI Skill Engine.

${skill.metadata.description}

## Quick Platform Setup Guide

### 🟣 1. Claude Code
Copy \`claude/SKILL.md\` into your project's \`.claude/skills/${skill.metadata.name}/SKILL.md\`:
\`\`\`bash
cp -r claude/SKILL.md .claude/skills/${skill.metadata.name}/
\`\`\`

### 🔵 2. Google Gemini & Antigravity
- **Antigravity**: Place \`gemini/SKILL.md\` in your workspace or \`~/.gemini/antigravity/skills/${skill.metadata.name}/\`.
- **Gemini CLI**: Import \`gemini/gemini-extension.json\`.

### 🟢 3. OpenAI ChatGPT / Custom GPTs
- Open [ChatGPT GPT Builder](https://chatgpt.com/gpts/editor).
- Paste the content of \`openai/instructions.md\` into **Instructions**.
- If using actions, import \`openai/openapi_actions.json\` under **Actions**.

### ⚫ 4. xAI Grok
- Paste \`grok/system_prompt.md\` into Grok system directives or API parameters.
- Provide \`grok/grok_tools.json\` in your API tool declaration.

### 🔮 5. Perplexity AI
- In Perplexity, create a **Collection** or custom search profile and paste \`perplexity/perplexity_collection.md\`.
- For API usage, see \`perplexity/sonar_api_config.json\`.

### 🇨🇳 6. Chinese Models (DeepSeek, Qwen & Kimi)
- **DeepSeek (R1 & V3)**: See \`chinese/deepseek/system_prompt.md\` (optimized for DeepSeek reasoning and thinking mode) and \`deepseek_api.json\`.
- **Alibaba Qwen (2.5 & Qwen-Coder)**: See \`chinese/qwen/system_prompt.md\` and \`chinese/qwen/qwen_agent.json\`.
- **Moonshot Kimi**: See \`chinese/kimi/kimi_system_prompt.md\` for high-context tasks.

### 🖥️ 7. Local Models (Ollama)
Run the automated setup script to build the model in Ollama:
\`\`\`bash
# Linux/macOS:
bash ollama/setup.sh

# Windows:
ollama\\setup.bat
\`\`\`
Or manually: \`ollama create ${skill.metadata.name} -f ollama/Modelfile\`

### 🎛️ 8. LM Studio & Jan.ai (Offline GUI)
- Import \`lmstudio/lmstudio_preset.json\` into LM Studio System Prompt Presets, or paste \`lmstudio/system_prompt.txt\` into Jan.ai / Text-Gen-WebUI.

### 🟠 9. Muse & OpenWebUI
- Import \`muse/openwebui_export.json\` or paste \`muse/tools.py\` into OpenWebUI Tools.

### 🔷 10. Cursor & Windsurf
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
    { prefix: 'perplexity', out: perplexity },
    { prefix: 'chinese', out: chinese },
    { prefix: 'ollama', out: ollama },
    { prefix: 'lmstudio', out: lmstudio },
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
