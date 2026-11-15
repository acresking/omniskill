/**
 * OmniSkill - Chinese AI Models Generator
 *
 * Generates configurations for leading Chinese LLMs:
 * - DeepSeek (DeepSeek-R1 Reasoning & DeepSeek-V3)
 * - Alibaba Qwen (Qwen 2.5, Qwen-Coder & Qwen-Agent)
 * - Moonshot Kimi (Long-context analysis)
 * - Zhipu GLM (GLM-4 Function Calling)
 */

export function generateChineseModelsSkill(skill) {
  // 1. DeepSeek R1 & V3 Format
  let deepseekPrompt = `# Role: ${skill.metadata.displayName}\n\n`;
  deepseekPrompt += `## Description\n${skill.metadata.description}\n\n`;
  deepseekPrompt += `## Core Reasoning Directives\n`;
  deepseekPrompt += `When solving complex tasks, systematically break down the problem into verification steps.\n`;
  deepseekPrompt += `Validate intermediate conclusions before presenting the final answer.\n\n`;
  deepseekPrompt += `## Domain Instructions\n${skill.instructions.systemPrompt}\n\n`;

  if (skill.instructions.guidelines && skill.instructions.guidelines.length > 0) {
    deepseekPrompt += `## Execution Rules\n`;
    for (const g of skill.instructions.guidelines) {
      deepseekPrompt += `- ${g}\n`;
    }
  }

  const deepseekApiConfig = {
    model: 'deepseek-reasoner',
    messages: [
      {
        role: 'system',
        content: deepseekPrompt.trim()
      }
    ],
    temperature: 0.6,
    max_tokens: 8192
  };

  // 2. Alibaba Qwen (Qwen 2.5 & DashScope) Format
  const qwenTools = (skill.tools || []).map(t => ({
    type: 'function',
    function: {
      name: t.name,
      description: t.description,
      parameters: t.parameters || { type: 'object', properties: {} }
    }
  }));

  const qwenAgentManifest = {
    name: skill.metadata.name,
    display_name: skill.metadata.displayName,
    description: skill.metadata.description,
    instructions: skill.instructions.systemPrompt,
    tools: qwenTools,
    model: 'qwen-max-latest'
  };

  // 3. Moonshot Kimi Format
  let kimiPrompt = `# Role: ${skill.metadata.displayName} (Kimi Assistant)\n\n`;
  kimiPrompt += `You are an expert operating with extensive context and analytical precision.\n`;
  kimiPrompt += `${skill.metadata.description}\n\n`;
  kimiPrompt += `${skill.instructions.systemPrompt}\n`;

  const files = [
    {
      path: 'deepseek/system_prompt.md',
      content: deepseekPrompt.trim(),
      description: 'DeepSeek R1 / V3 Reasoning System Prompt'
    },
    {
      path: 'deepseek/deepseek_api.json',
      content: JSON.stringify(deepseekApiConfig, null, 2),
      description: 'DeepSeek API Chat/Reasoner Configuration'
    },
    {
      path: 'qwen/qwen_agent.json',
      content: JSON.stringify(qwenAgentManifest, null, 2),
      description: 'Alibaba Qwen-Agent & DashScope Tool Manifest'
    },
    {
      path: 'qwen/system_prompt.md',
      content: `# Qwen: ${skill.metadata.displayName}\n\n${skill.instructions.systemPrompt}`.trim(),
      description: 'Qwen 2.5 & Qwen-Coder System Prompt'
    },
    {
      path: 'kimi/kimi_system_prompt.md',
      content: kimiPrompt.trim(),
      description: 'Moonshot Kimi Long-Context System Directives'
    }
  ];

  return {
    platform: 'chinese_models',
    mainFile: 'deepseek/system_prompt.md',
    content: deepseekPrompt.trim(),
    files
  };
}
