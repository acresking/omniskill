/**
 * OmniSkill - Generator Registry
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
import { generateUniversalBundle } from './bundle.js';

export const SUPPORTED_TARGETS = [
  'claude',
  'gemini',
  'openai',
  'gpt',
  'grok',
  'perplexity',
  'chinese',
  'deepseek',
  'qwen',
  'kimi',
  'local',
  'ollama',
  'lmstudio',
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
    case 'perplexity':
    case 'sonar':
      return generatePerplexitySkill(skill);
    case 'chinese':
    case 'deepseek':
    case 'qwen':
    case 'kimi':
      return generateChineseModelsSkill(skill);
    case 'local':
    case 'ollama':
      return generateOllamaSkill(skill);
    case 'lmstudio':
    case 'jan':
      return generateLMStudioSkill(skill);
    case 'muse':
    case 'openwebui':
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
