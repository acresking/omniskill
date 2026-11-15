/**
 * OmniSkill - Claude Code Skill Parser
 */
import { extractFrontmatter } from '../yaml.js';
import { createEmptySkill, toDisplayName } from '../types/index.js';

export function parseClaudeSkill(content, options = {}) {
  const { attributes, body } = extractFrontmatter(content);
  const name = attributes.name || options.fallbackName || 'claude-skill';

  const skill = createEmptySkill(name);
  skill.metadata.sourcePlatform = 'claude';
  skill.metadata.displayName = attributes.displayName || toDisplayName(name);
  skill.metadata.description = attributes.description || '';
  skill.metadata.version = String(attributes.version || '1.0.0');
  skill.metadata.author = attributes.author || 'Claude Skill Author';
  if (Array.isArray(attributes.tags)) {
    skill.metadata.tags = attributes.tags;
  }

  // Parse tools if declared in frontmatter
  if (Array.isArray(attributes.tools)) {
    skill.tools = attributes.tools.map(t => ({
      name: t.name || 'unnamed_tool',
      description: t.description || '',
      parameters: t.parameters || { type: 'object', properties: {} },
      implementation: t.implementation || (t.command ? { type: 'bash', command: t.command } : undefined)
    }));
  }

  // Extract examples and starters from body if structured
  const { cleanedBody, examples, starters, guidelines } = extractStructureFromBody(body);
  skill.instructions.systemPrompt = cleanedBody;
  skill.instructions.examples = examples;
  skill.instructions.conversationStarters = starters;
  skill.instructions.guidelines = guidelines;

  return skill;
}

function extractStructureFromBody(body) {
  const examples = [];
  const starters = [];
  const guidelines = [];

  // Look for conversation starters / quick prompts
  const starterMatch = body.match(/##\s*(?:Quick Start|Examples|Sample Prompts|Starters)\s*\n([\s\S]*?)(?=\n##|\n---|$)/i);
  if (starterMatch) {
    const lines = starterMatch[1].split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const item = trimmed.slice(2).replace(/^["']|["']$/g, '').trim();
        if (item.length > 3 && item.length < 150) {
          starters.push(item);
        }
      }
    }
  }

  // Look for guidelines / rules
  const guidelinesMatch = body.match(/##\s*(?:Guidelines|Rules|Instructions|Best Practices)\s*\n([\s\S]*?)(?=\n##|\n---|$)/i);
  if (guidelinesMatch) {
    const lines = guidelinesMatch[1].split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        guidelines.push(trimmed.slice(2).trim());
      }
    }
  }

  return {
    cleanedBody: body.trim(),
    examples,
    starters: starters.slice(0, 5),
    guidelines
  };
}
