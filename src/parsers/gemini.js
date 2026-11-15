/**
 * OmniSkill - Google Antigravity & Gemini Skill Parser
 */
import { extractFrontmatter } from '../yaml.js';
import { createEmptySkill, toDisplayName } from '../types/index.js';

export function parseGeminiSkill(contentOrJson, options = {}) {
  // If it's a JSON string (e.g. gemini-extension.json)
  if (typeof contentOrJson === 'string' && contentOrJson.trim().startsWith('{')) {
    try {
      const data = JSON.parse(contentOrJson);
      const name = data.name || options.fallbackName || 'gemini-skill';
      const skill = createEmptySkill(name);
      skill.metadata.sourcePlatform = 'gemini';
      skill.metadata.displayName = data.display_name || toDisplayName(name);
      skill.metadata.description = data.description || '';
      skill.metadata.version = data.version || '1.0.0';
      skill.instructions.systemPrompt = data.system_instruction || data.instruction || '';

      if (Array.isArray(data.tools)) {
        skill.tools = data.tools.map(t => ({
          name: t.name,
          description: t.description || '',
          parameters: t.parameters || t.parameters_schema || { type: 'object', properties: {} }
        }));
      }
      return skill;
    } catch {
      // Fallback to frontmatter parser
    }
  }

  // Parse as Antigravity SKILL.md
  const { attributes, body } = extractFrontmatter(contentOrJson);
  const name = attributes.name || options.fallbackName || 'gemini-skill';
  const skill = createEmptySkill(name);
  skill.metadata.sourcePlatform = 'gemini';
  skill.metadata.displayName = attributes.displayName || toDisplayName(name);
  skill.metadata.description = attributes.description || '';
  skill.metadata.version = String(attributes.version || '1.0.0');
  skill.instructions.systemPrompt = body;

  if (Array.isArray(attributes.tools)) {
    skill.tools = attributes.tools;
  }

  return skill;
}
