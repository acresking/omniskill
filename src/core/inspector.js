/**
 * OmniSkill - Skill Inspector & Compatibility Analyzer
 */
import { parseSkill } from '../parsers/index.js';
import { validateSkill } from '../types/index.js';

export function inspectSkill(source, options = {}) {
  const skill = parseSkill(source, options);
  const validation = validateSkill(skill);

  const textLength = (skill.instructions.systemPrompt || '').length;
  const estimatedTokens = Math.ceil(textLength / 4);
  const toolCount = skill.tools?.length || 0;
  const resourceCount = skill.resources?.length || 0;

  // Compute platform compatibility score (0-100)
  const compatibility = {
    claude: calculateScore({ textLength, toolCount, target: 'claude' }),
    gemini: calculateScore({ textLength, toolCount, target: 'gemini' }),
    openai: calculateScore({ textLength, toolCount, target: 'openai' }),
    grok: calculateScore({ textLength, toolCount, target: 'grok' }),
    muse: calculateScore({ textLength, toolCount, target: 'muse' }),
    cursor: calculateScore({ textLength, toolCount, target: 'cursor' })
  };

  return {
    name: skill.metadata.name,
    displayName: skill.metadata.displayName,
    version: skill.metadata.version,
    description: skill.metadata.description,
    sourcePlatform: skill.metadata.sourcePlatform,
    metrics: {
      charCount: textLength,
      estimatedTokens,
      toolCount,
      resourceCount,
      guidelineCount: skill.instructions.guidelines?.length || 0,
      starterCount: skill.instructions.conversationStarters?.length || 0
    },
    tools: (skill.tools || []).map(t => ({ name: t.name, description: t.description })),
    compatibility,
    validation
  };
}

function calculateScore({ textLength, toolCount, target }) {
  let score = 100;
  if (textLength < 20) score -= 30;
  if (textLength > 100000) score -= 20;

  if (target === 'cursor' && toolCount > 0) {
    score -= 20; // Cursor rules don't natively expose function calling tools
  }
  if (target === 'muse' && toolCount > 5) {
    score -= 10;
  }
  return Math.max(10, Math.min(100, score));
}
