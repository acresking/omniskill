/**
 * OmniSkill - xAI Grok Skill Parser
 */
import { createEmptySkill, toDisplayName } from '../types/index.js';

export function parseGrokSkill(content, options = {}) {
  if (typeof content === 'string' && content.trim().startsWith('{')) {
    try {
      const data = JSON.parse(content);
      const name = data.name || options.fallbackName || 'grok-skill';
      const skill = createEmptySkill(name);
      skill.metadata.sourcePlatform = 'grok';
      skill.metadata.displayName = data.name || toDisplayName(name);
      skill.metadata.description = data.description || '';
      skill.instructions.systemPrompt = data.system_prompt || data.prompt || '';

      if (Array.isArray(data.tools)) {
        skill.tools = data.tools.map(t => ({
          name: t.name,
          description: t.description || '',
          parameters: t.parameters || { type: 'object', properties: {} }
        }));
      }
      return skill;
    } catch {}
  }

  const name = options.fallbackName || 'grok-skill';
  const skill = createEmptySkill(name);
  skill.metadata.sourcePlatform = 'grok';
  skill.metadata.displayName = toDisplayName(name);
  skill.instructions.systemPrompt = String(content).trim();
  return skill;
}
