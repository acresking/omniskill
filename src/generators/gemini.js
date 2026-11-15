/**
 * OmniSkill - Google Antigravity & Gemini Skill Generator
 */
import { injectFrontmatter } from '../yaml.js';

export function generateGeminiSkill(skill) {
  // Antigravity SKILL.md format
  const frontmatter = {
    name: skill.metadata.name,
    description: skill.metadata.description || `Antigravity Skill: ${skill.metadata.displayName}`
  };

  let body = `# ${skill.metadata.displayName}\n\n`;
  if (skill.instructions.systemPrompt) {
    body += `${skill.instructions.systemPrompt}\n\n`;
  }

  if (skill.instructions.guidelines && skill.instructions.guidelines.length > 0) {
    body += `## Guidelines\n\n`;
    for (const g of skill.instructions.guidelines) {
      body += `- ${g}\n`;
    }
    body += `\n`;
  }

  const skillMd = injectFrontmatter(frontmatter, body);

  // Gemini Extension Manifest format
  const extensionManifest = {
    name: skill.metadata.name,
    display_name: skill.metadata.displayName,
    version: skill.metadata.version || '1.0.0',
    description: skill.metadata.description,
    system_instruction: skill.instructions.systemPrompt,
    tools: (skill.tools || []).map(t => ({
      name: t.name,
      description: t.description,
      parameters: t.parameters
    }))
  };

  const files = [
    {
      path: 'SKILL.md',
      content: skillMd,
      description: 'Google Antigravity Skill Definition'
    },
    {
      path: 'gemini-extension.json',
      content: JSON.stringify(extensionManifest, null, 2),
      description: 'Gemini CLI & Extension Manifest'
    }
  ];

  if (skill.resources && skill.resources.length > 0) {
    for (const res of skill.resources) {
      files.push({
        path: res.path,
        content: res.content,
        description: `Resource: ${res.path}`
      });
    }
  }

  return {
    platform: 'gemini',
    mainFile: 'SKILL.md',
    content: skillMd,
    files
  };
}
