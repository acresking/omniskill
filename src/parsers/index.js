/**
 * OmniSkill - Master Parser & Auto-Detector
 */
import fs from 'node:fs';
import path from 'node:path';
import { parseClaudeSkill } from './claude.js';
import { parseGeminiSkill } from './gemini.js';
import { parseOpenAISkill } from './openai.js';
import { parseGrokSkill } from './grok.js';
import { parseMuseSkill } from './muse.js';
import { parseCursorSkill } from './cursor.js';
import { normalizeSkill } from '../types/index.js';

export function detectFormat(content, filename = '') {
  const lowerName = filename.toLowerCase();

  if (lowerName.endsWith('gemini-extension.json') || lowerName.includes('gemini')) {
    return 'gemini';
  }
  if (lowerName.endsWith('.cursorrules') || lowerName.endsWith('.windsurfrules') || lowerName.endsWith('.mdc')) {
    return 'cursor';
  }
  if (lowerName === 'modelfile' || lowerName.endsWith('.modelfile')) {
    return 'muse';
  }
  if (lowerName.includes('grok')) {
    return 'grok';
  }
  if (lowerName.includes('gpt') || lowerName.includes('openapi') || lowerName.includes('assistant')) {
    return 'openai';
  }

  // Content inspection
  if (typeof content === 'string') {
    const trimmed = content.trim();

    // Check JSON
    if (trimmed.startsWith('{')) {
      try {
        const json = JSON.parse(trimmed);
        if (json.openapi || json.swagger) return 'openai';
        if (json.system_instruction) return 'gemini';
        if (json.tools && json.meta) return 'muse';
        if (json.instructions || (json.tools && json.tools[0]?.type === 'function')) return 'openai';
      } catch {}
    }

    // Check Modelfile
    if (/^FROM\s+\w+/m.test(trimmed) && /SYSTEM\s+("""|")/m.test(trimmed)) {
      return 'muse';
    }

    // Check Antigravity / Claude SKILL.md
    if (trimmed.startsWith('---')) {
      // Default SKILL.md is predominantly Claude Code or Antigravity
      if (trimmed.includes('Antigravity') || trimmed.includes('agy')) {
        return 'gemini';
      }
      return 'claude';
    }
  }

  return 'claude'; // default to Claude if unclear
}

export function parseSkill(source, options = {}) {
  let content = '';
  let filename = options.filename || '';
  let format = options.from || '';

  // Check if source is a file path
  if (typeof source === 'string' && (fs.existsSync(source) || source.includes(path.sep) || source.endsWith('.md') || source.endsWith('.json'))) {
    try {
      const stat = fs.statSync(source);
      if (stat.isDirectory()) {
        return parseSkillDirectory(source, options);
      }
      content = fs.readFileSync(source, 'utf-8');
      filename = path.basename(source);
    } catch {
      // Treat source as raw content
      content = source;
    }
  } else {
    content = String(source);
  }

  if (!format || format === 'auto') {
    format = detectFormat(content, filename);
  }

  let rawSkill;
  switch (format) {
    case 'claude':
      rawSkill = parseClaudeSkill(content, { ...options, fallbackName: getFallbackName(filename) });
      break;
    case 'gemini':
      rawSkill = parseGeminiSkill(content, { ...options, fallbackName: getFallbackName(filename) });
      break;
    case 'openai':
    case 'gpt':
      rawSkill = parseOpenAISkill(content, { ...options, fallbackName: getFallbackName(filename) });
      break;
    case 'grok':
      rawSkill = parseGrokSkill(content, { ...options, fallbackName: getFallbackName(filename) });
      break;
    case 'muse':
    case 'openwebui':
    case 'ollama':
      rawSkill = parseMuseSkill(content, { ...options, fallbackName: getFallbackName(filename) });
      break;
    case 'cursor':
    case 'windsurf':
      rawSkill = parseCursorSkill(content, { ...options, fallbackName: getFallbackName(filename) });
      break;
    default:
      rawSkill = parseClaudeSkill(content, { ...options, fallbackName: getFallbackName(filename) });
  }

  const skill = normalizeSkill(rawSkill);
  return skill;
}

function parseSkillDirectory(dirPath, options = {}) {
  const dirName = path.basename(path.resolve(dirPath));
  const fallbackName = dirName;

  // Look for SKILL.md
  const skillMdPath = path.join(dirPath, 'SKILL.md');
  if (fs.existsSync(skillMdPath)) {
    const content = fs.readFileSync(skillMdPath, 'utf-8');
    const skill = parseClaudeSkill(content, { ...options, fallbackName });

    // Look for subfolders references/, scripts/, resources/
    for (const sub of ['references', 'scripts', 'resources']) {
      const subDir = path.join(dirPath, sub);
      if (fs.existsSync(subDir)) {
        const files = fs.readdirSync(subDir);
        for (const f of files) {
          const filePath = path.join(subDir, f);
          if (fs.statSync(filePath).isFile()) {
            skill.resources.push({
              path: `${sub}/${f}`,
              content: fs.readFileSync(filePath, 'utf-8'),
              type: sub === 'scripts' ? 'script' : 'reference'
            });
          }
        }
      }
    }
    return normalizeSkill(skill);
  }

  // Look for gemini-extension.json
  const geminiJson = path.join(dirPath, 'gemini-extension.json');
  if (fs.existsSync(geminiJson)) {
    const content = fs.readFileSync(geminiJson, 'utf-8');
    return normalizeSkill(parseGeminiSkill(content, { ...options, fallbackName }));
  }

  throw new Error(`Directory ${dirPath} does not contain a recognized skill manifest (e.g. SKILL.md).`);
}

function getFallbackName(filename) {
  if (!filename) return 'unnamed-skill';
  return path.basename(filename, path.extname(filename)).toLowerCase();
}
