/**
 * OmniSkill - Universal Skill Specification & Intermediate Representation (IR)
 */

export function createEmptySkill(name = 'unnamed-skill') {
  return {
    metadata: {
      name,
      displayName: toDisplayName(name),
      version: '1.0.0',
      description: '',
      author: 'OmniSkill Exporter',
      license: 'MIT',
      tags: [],
      sourcePlatform: 'generic',
      exportedAt: new Date().toISOString()
    },
    instructions: {
      systemPrompt: '',
      guidelines: [],
      examples: [],
      conversationStarters: []
    },
    tools: [],
    resources: [],
    commands: [],
    mcpServers: {}
  };
}

export function toDisplayName(name) {
  if (!name) return 'Untitled Skill';
  return name
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

export function validateSkill(skill) {
  const errors = [];
  const warnings = [];

  if (!skill) {
    errors.push('Skill object is null or undefined.');
    return { valid: false, errors, warnings };
  }

  if (!skill.metadata || typeof skill.metadata !== 'object') {
    errors.push('Missing metadata object.');
  } else {
    if (!skill.metadata.name || typeof skill.metadata.name !== 'string') {
      errors.push('metadata.name is required and must be a string.');
    }
    if (!skill.metadata.description) {
      warnings.push('metadata.description is missing or empty.');
    }
  }

  if (!skill.instructions || typeof skill.instructions !== 'object') {
    errors.push('Missing instructions object.');
  } else if (!skill.instructions.systemPrompt || skill.instructions.systemPrompt.trim() === '') {
    warnings.push('instructions.systemPrompt is empty.');
  }

  if (skill.tools && !Array.isArray(skill.tools)) {
    errors.push('tools must be an array.');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

export function normalizeSkill(raw) {
  const empty = createEmptySkill(raw?.metadata?.name || 'converted-skill');
  return {
    metadata: {
      ...empty.metadata,
      ...(raw?.metadata || {})
    },
    instructions: {
      ...empty.instructions,
      ...(raw?.instructions || {})
    },
    tools: Array.isArray(raw?.tools) ? raw.tools : [],
    resources: Array.isArray(raw?.resources) ? raw.resources : [],
    commands: Array.isArray(raw?.commands) ? raw.commands : [],
    mcpServers: raw?.mcpServers || {}
  };
}
