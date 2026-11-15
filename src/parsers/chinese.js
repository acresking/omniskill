/**
 * OmniSkill - Chinese LLMs Parser (DeepSeek & Qwen)
 */
import { createEmptySkill, toDisplayName } from '../types/index.js';

export function parseChineseSkill(content, options = {}) {
  // If JSON format
  if (typeof content === 'string' && content.trim().startsWith('{')) {
    try {
      const data = JSON.parse(content);
      const name = data.name || options.fallbackName || 'chinese-model-skill';
      const skill = createEmptySkill(name);
      skill.metadata.sourcePlatform = 'chinese';
      skill.metadata.displayName = data.display_name || toDisplayName(name);
      skill.metadata.description = data.description || '';

      // Qwen-Agent format
      if (data.instructions) {
        skill.instructions.systemPrompt = data.instructions;
      }

      // DeepSeek API format
      if (Array.isArray(data.messages)) {
        const sysMsg = data.messages.find(m => m.role === 'system');
        if (sysMsg) skill.instructions.systemPrompt = sysMsg.content;
      }

      // Extract tools
      if (Array.isArray(data.tools)) {
        for (const t of data.tools) {
          if (t.type === 'function' && t.function) {
            skill.tools.push({
              name: t.function.name,
              description: t.function.description || '',
              parameters: t.function.parameters || { type: 'object', properties: {} }
            });
          }
        }
      }
      return skill;
    } catch {}
  }

  // Plain markdown
  const name = options.fallbackName || 'deepseek-skill';
  const skill = createEmptySkill(name);
  skill.metadata.sourcePlatform = 'chinese';
  skill.metadata.displayName = toDisplayName(name);
  skill.instructions.systemPrompt = String(content).trim();
  return skill;
}
