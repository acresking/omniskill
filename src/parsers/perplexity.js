/**
 * OmniSkill - Perplexity AI Parser
 */
import { createEmptySkill, toDisplayName } from '../types/index.js';

export function parsePerplexitySkill(content, options = {}) {
  // If JSON format (Sonar API config)
  if (typeof content === 'string' && content.trim().startsWith('{')) {
    try {
      const data = JSON.parse(content);
      const name = options.fallbackName || 'perplexity-skill';
      const skill = createEmptySkill(name);
      skill.metadata.sourcePlatform = 'perplexity';
      skill.metadata.displayName = toDisplayName(name);

      const sysMsg = (data.messages || []).find(m => m.role === 'system');
      skill.instructions.systemPrompt = sysMsg ? sysMsg.content : (data.system_prompt || '');
      return skill;
    } catch {}
  }

  // Markdown format (Collection prompt)
  const name = options.fallbackName || 'perplexity-collection-skill';
  const skill = createEmptySkill(name);
  skill.metadata.sourcePlatform = 'perplexity';
  skill.metadata.displayName = toDisplayName(name);
  skill.instructions.systemPrompt = String(content).trim();
  return skill;
}
