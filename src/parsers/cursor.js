/**
 * OmniSkill - Cursor & Windsurf Rules Parser
 */
import { extractFrontmatter } from '../yaml.js';
import { createEmptySkill, toDisplayName } from '../types/index.js';

export function parseCursorSkill(content, options = {}) {
  const { attributes, body } = extractFrontmatter(content);
  const name = attributes.name || options.fallbackName || 'cursor-rule-skill';

  const skill = createEmptySkill(name);
  skill.metadata.sourcePlatform = 'cursor';
  skill.metadata.displayName = attributes.displayName || toDisplayName(name);
  skill.metadata.description = attributes.description || 'Cursor AI Rule';
  skill.instructions.systemPrompt = body.trim() || String(content).trim();

  if (attributes.globs) {
    skill.metadata.tags = Array.isArray(attributes.globs) ? attributes.globs : [String(attributes.globs)];
  }

  return skill;
}
