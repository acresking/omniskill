/**
 * OmniSkill - xAI Grok Skill Generator
 */

export function generateGrokSkill(skill) {
  let prompt = `# Identity: Grok - ${skill.metadata.displayName}\n\n`;
  prompt += `You are Grok operating with specialized capability: ${skill.metadata.displayName}.\n`;
  prompt += `${skill.metadata.description}\n\n`;
  prompt += `## Directives\n${skill.instructions.systemPrompt}\n\n`;

  if (skill.instructions.guidelines && skill.instructions.guidelines.length > 0) {
    prompt += `## Execution Principles\n`;
    for (const g of skill.instructions.guidelines) {
      prompt += `- ${g}\n`;
    }
    prompt += `\n`;
  }

  const grokTools = {
    name: skill.metadata.name,
    description: skill.metadata.description,
    tools: (skill.tools || []).map(t => ({
      type: 'function',
      function: {
        name: t.name,
        description: t.description,
        parameters: t.parameters || { type: 'object', properties: {} }
      }
    }))
  };

  const files = [
    {
      path: 'system_prompt.md',
      content: prompt.trim(),
      description: 'xAI Grok System Prompt'
    },
    {
      path: 'grok_tools.json',
      content: JSON.stringify(grokTools, null, 2),
      description: 'xAI Grok Tool Calling Definition'
    }
  ];

  return {
    platform: 'grok',
    mainFile: 'system_prompt.md',
    content: prompt.trim(),
    files
  };
}
