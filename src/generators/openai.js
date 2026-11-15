/**
 * OmniSkill - OpenAI & Custom GPT Generator
 */

export function generateOpenAISkill(skill) {
  // Format instructions tailored for GPT-4o / ChatGPT Custom GPT
  let instructions = `# Role: ${skill.metadata.displayName}\n\n`;
  instructions += `${skill.metadata.description}\n\n`;
  instructions += `## Core Instructions\n${skill.instructions.systemPrompt}\n\n`;

  if (skill.instructions.guidelines && skill.instructions.guidelines.length > 0) {
    instructions += `## Behavioral Guidelines\n`;
    for (const g of skill.instructions.guidelines) {
      instructions += `- ${g}\n`;
    }
    instructions += `\n`;
  }

  // Conversation starters
  const starters = skill.instructions.conversationStarters || [
    `How can I use ${skill.metadata.displayName}?`,
    `Explain the capabilities of this skill.`,
    `Run a sample task.`
  ];

  // OpenAI Function Calling format
  const functions = (skill.tools || []).map(t => ({
    type: 'function',
    function: {
      name: t.name,
      description: t.description,
      parameters: t.parameters || { type: 'object', properties: {} }
    }
  }));

  // OpenAPI Actions 3.1 Spec for GPT Actions
  const openapiActions = {
    openapi: '3.1.0',
    info: {
      title: skill.metadata.displayName,
      description: skill.metadata.description,
      version: skill.metadata.version || '1.0.0'
    },
    servers: [
      {
        url: 'https://api.example.com',
        description: 'Target API Server (configure in Custom GPT action settings)'
      }
    ],
    paths: {}
  };

  for (const t of (skill.tools || [])) {
    const pathKey = `/${t.name}`;
    openapiActions.paths[pathKey] = {
      post: {
        operationId: t.name,
        summary: t.description || `Execute ${t.name}`,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: t.parameters || { type: 'object', properties: {} }
            }
          }
        },
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    result: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    };
  }

  const customGptConfig = {
    name: skill.metadata.displayName,
    description: skill.metadata.description,
    instructions: instructions.trim(),
    conversation_starters: starters,
    capabilities: {
      code_interpreter: true,
      web_search: true,
      dalle_image_generation: false
    },
    tools: functions
  };

  const files = [
    {
      path: 'instructions.md',
      content: instructions.trim(),
      description: 'ChatGPT Custom GPT System Instructions'
    },
    {
      path: 'custom_gpt_config.json',
      content: JSON.stringify(customGptConfig, null, 2),
      description: 'Custom GPT Complete Setup Configuration'
    },
    {
      path: 'openapi_actions.json',
      content: JSON.stringify(openapiActions, null, 2),
      description: 'OpenAPI 3.1 Actions Specification for Custom GPT'
    },
    {
      path: 'openai_tools.json',
      content: JSON.stringify(functions, null, 2),
      description: 'OpenAI Assistants & Chat Completions Tool Call Schema'
    }
  ];

  return {
    platform: 'openai',
    mainFile: 'instructions.md',
    content: instructions.trim(),
    files
  };
}
