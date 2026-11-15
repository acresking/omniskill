/**
 * OmniSkill - OpenAI & Custom GPT Parser
 */
import { createEmptySkill, toDisplayName } from '../types/index.js';

export function parseOpenAISkill(content, options = {}) {
  // If JSON format
  if (typeof content === 'string' && content.trim().startsWith('{')) {
    try {
      const data = JSON.parse(content);

      // Check if it's an OpenAPI schema
      if (data.openapi || data.swagger) {
        return parseOpenAPISchema(data, options);
      }

      // Custom GPT configuration format
      const name = data.name || data.title || options.fallbackName || 'custom-gpt';
      const skill = createEmptySkill(name.toLowerCase().replace(/\s+/g, '-'));
      skill.metadata.sourcePlatform = 'openai';
      skill.metadata.displayName = data.name || toDisplayName(name);
      skill.metadata.description = data.description || '';
      skill.instructions.systemPrompt = data.instructions || data.prompt || '';
      skill.instructions.conversationStarters = data.conversation_starters || [];

      // Extract functions/tools
      if (Array.isArray(data.tools)) {
        for (const t of data.tools) {
          if (t.type === 'function' && t.function) {
            skill.tools.push({
              name: t.function.name,
              description: t.function.description || '',
              parameters: t.function.parameters || { type: 'object', properties: {} }
            });
          }
        }
      }

      return skill;
    } catch {
      // Fall through to plain text instructions
    }
  }

  // Plain instructions markdown
  const name = options.fallbackName || 'openai-skill';
  const skill = createEmptySkill(name);
  skill.metadata.sourcePlatform = 'openai';
  skill.metadata.displayName = toDisplayName(name);
  skill.instructions.systemPrompt = String(content).trim();
  return skill;
}

function parseOpenAPISchema(schema, options = {}) {
  const name = (schema.info?.title || options.fallbackName || 'api-skill').toLowerCase().replace(/\s+/g, '-');
  const skill = createEmptySkill(name);
  skill.metadata.sourcePlatform = 'openai';
  skill.metadata.displayName = schema.info?.title || toDisplayName(name);
  skill.metadata.description = schema.info?.description || 'OpenAPI Custom Action';
  skill.metadata.version = schema.info?.version || '1.0.0';
  skill.instructions.systemPrompt = `You have access to the ${skill.metadata.displayName} API actions. Use these tools to query and manipulate data as requested.`;

  if (schema.paths) {
    for (const [pathStr, pathItem] of Object.entries(schema.paths)) {
      for (const [method, op] of Object.entries(pathItem)) {
        if (['get', 'post', 'put', 'delete', 'patch'].includes(method.toLowerCase()) && op.operationId) {
          skill.tools.push({
            name: op.operationId,
            description: op.summary || op.description || `${method.toUpperCase()} ${pathStr}`,
            parameters: op.requestBody?.content?.['application/json']?.schema || { type: 'object', properties: {} },
            implementation: {
              type: 'http',
              endpoint: {
                url: pathStr,
                method: method.toUpperCase()
              }
            }
          });
        }
      }
    }
  }

  return skill;
}
