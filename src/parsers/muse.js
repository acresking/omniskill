/**
 * OmniSkill - Muse & OpenWebUI / Ollama Parser
 */
import { createEmptySkill, toDisplayName } from '../types/index.js';

export function parseMuseSkill(content, options = {}) {
  // If JSON format (OpenWebUI tool export)
  if (typeof content === 'string' && content.trim().startsWith('{')) {
    try {
      const data = JSON.parse(content);
      const name = data.id || data.name || options.fallbackName || 'muse-skill';
      const skill = createEmptySkill(name.toLowerCase().replace(/\s+/g, '-'));
      skill.metadata.sourcePlatform = 'muse';
      skill.metadata.displayName = data.name || toDisplayName(name);
      skill.metadata.description = data.meta?.description || data.description || '';
      skill.instructions.systemPrompt = data.meta?.manifest?.system_prompt || data.content || '';

      if (data.meta?.tools && Array.isArray(data.meta.tools)) {
        skill.tools = data.meta.tools;
      }
      return skill;
    } catch {}
  }

  // Modelfile format: SYSTEM """...""" or SYSTEM "..."
  if (typeof content === 'string' && /SYSTEM\s+("""|")/i.test(content)) {
    const match = content.match(/SYSTEM\s+(?:"""([\s\S]*?)"""|"([\s\S]*?)")/i);
    const systemPrompt = match ? (match[1] || match[2]).trim() : content.trim();

    const name = options.fallbackName || 'muse-model-skill';
    const skill = createEmptySkill(name);
    skill.metadata.sourcePlatform = 'muse';
    skill.metadata.displayName = toDisplayName(name);
    skill.instructions.systemPrompt = systemPrompt;
    return skill;
  }

  // Fallback plain text
  const name = options.fallbackName || 'muse-skill';
  const skill = createEmptySkill(name);
  skill.metadata.sourcePlatform = 'muse';
  skill.instructions.systemPrompt = String(content).trim();
  return skill;
}
