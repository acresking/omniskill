/**
 * OmniSkill - Generator Registry
 */
import { generateClaudeSkill } from './claude.js';
import { generateGeminiSkill } from './gemini.js';
import { generateOpenAISkill } from './openai.js';
import { generateGrokSkill } from './grok.js';
import { generateMuseSkill } from './muse.js';
import { generateCursorSkill } from './cursor.js';
import { generateUniversalBundle } from './bundle.js';

export const SUPPORTED_TARGETS = [
  'claude',
  'gemini',
  'openai',
  'gpt',
  'grok',
  'muse',
  'openwebui',
  'cursor',
  'windsurf',
  'all',
  'bundle'
];

export function generateSkill(skill, target = 'claude') {
  const normTarget = String(target).toLowerCase();

  switch (normTarget) {
    case 'claude':
      return generateClaudeSkill(skill);
    case 'gemini':
    case 'antigravity':
      return generateGeminiSkill(skill);
    case 'openai':
    case 'gpt':
    case 'chatgpt':
      return generateOpenAISkill(skill);
    case 'grok':
    case 'xai':
      return generateGrokSkill(skill);
    case 'muse':
    case 'openwebui':
    case 'ollama':
      return generateMuseSkill(skill);
    case 'cursor':
    case 'windsurf':
      return generateCursorSkill(skill);
    case 'all':
    case 'bundle':
    case 'universal':
      return generateUniversalBundle(skill);
    default:
      throw new Error(`Unsupported target platform: "${target}". Supported: ${SUPPORTED_TARGETS.join(', ')}`);
  }
}
