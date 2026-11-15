/**
 * OmniSkill - Ollama Local Models Generator
 *
 * Generates Modelfiles and setup scripts for running skills locally
 * on Llama 3.3, DeepSeek R1/V3, Qwen 2.5, Mistral, and Gemma.
 */

export function generateOllamaSkill(skill) {
  let cleanPrompt = (skill.instructions.systemPrompt || '').replace(/"""/g, '\\"\\"\\"');
  const modelName = skill.metadata.name.toLowerCase().replace(/[^a-z0-9_-]/g, '-');

  let modelfile = `# Ollama Modelfile for ${skill.metadata.displayName}\n`;
  modelfile += `# Base model can be swapped with llama3.3, deepseek-r1, qwen2.5, mistral, etc.\n`;
  modelfile += `FROM llama3.3:latest\n\n`;
  modelfile += `PARAMETER temperature 0.7\n`;
  modelfile += `PARAMETER top_p 0.9\n`;
  modelfile += `PARAMETER stop "<|eot_id|>"\n`;
  modelfile += `PARAMETER stop "<|end_of_text|>"\n\n`;
  modelfile += `SYSTEM """# ${skill.metadata.displayName}\n${skill.metadata.description}\n\n${cleanPrompt}"""\n`;

  const setupSh = `#!/usr/bin/env bash\n# Build and run ${modelName} in Ollama\nollama create ${modelName} -f Modelfile\necho "Model '${modelName}' created successfully!"\necho "Run it with: ollama run ${modelName}"\n`;
  const setupBat = `@echo off\nREM Build and run ${modelName} in Ollama\nollama create ${modelName} -f Modelfile\necho Model '${modelName}' created successfully!\necho Run it with: ollama run ${modelName}\n`;

  const files = [
    {
      path: 'Modelfile',
      content: modelfile.trim(),
      description: 'Ollama Custom Modelfile (Llama 3.3 / DeepSeek / Qwen)'
    },
    {
      path: 'setup.sh',
      content: setupSh.trim(),
      description: 'Linux / macOS one-click Ollama build script'
    },
    {
      path: 'setup.bat',
      content: setupBat.trim(),
      description: 'Windows one-click Ollama build script'
    }
  ];

  return {
    platform: 'ollama',
    mainFile: 'Modelfile',
    content: modelfile.trim(),
    files
  };
}
