/**
 * OmniSkill - LM Studio & Local AI Generator
 *
 * Generates preset configurations for LM Studio, Jan.ai,
 * LocalAI, and offline LLM interfaces.
 */

export function generateLMStudioSkill(skill) {
  let prompt = `# Identity: ${skill.metadata.displayName}\n\n`;
  prompt += `${skill.metadata.description}\n\n`;
  prompt += `## Instructions\n${skill.instructions.systemPrompt}\n\n`;

  if (skill.instructions.guidelines && skill.instructions.guidelines.length > 0) {
    prompt += `## Guidelines\n`;
    for (const g of skill.instructions.guidelines) {
      prompt += `- ${g}\n`;
    }
  }

  // LM Studio Preset format
  const preset = {
    name: skill.metadata.displayName,
    load_params: {
      n_ctx: 8192
    },
    inference_params: {
      temperature: 0.7,
      top_p: 0.9,
      repeat_penalty: 1.1
    },
    text_prompt: {
      system_prompt: prompt.trim()
    }
  };

  const files = [
    {
      path: 'lmstudio_preset.json',
      content: JSON.stringify(preset, null, 2),
      description: 'LM Studio System Prompt Preset (JSON)'
    },
    {
      path: 'system_prompt.txt',
      content: prompt.trim(),
      description: 'Raw System Prompt for Jan.ai / LocalAI / WebUI'
    }
  ];

  return {
    platform: 'lmstudio',
    mainFile: 'lmstudio_preset.json',
    content: JSON.stringify(preset, null, 2),
    files
  };
}
