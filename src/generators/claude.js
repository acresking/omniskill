/**
 * OmniSkill - Claude Code Skill Generator
 */
import { injectFrontmatter } from '../yaml.js';

export function generateClaudeSkill(skill) {
  const frontmatter = {
    name: skill.metadata.name,
    description: skill.metadata.description || `Skill: ${skill.metadata.displayName}`
  };

  if (skill.metadata.version) {
    frontmatter.version = skill.metadata.version;
  }

  if (skill.tools && skill.tools.length > 0) {
    frontmatter.tools = skill.tools.map(t => ({
      name: t.name,
      description: t.description,
      parameters: t.parameters
    }));
  }

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

  if (skill.instructions.conversationStarters && skill.instructions.conversationStarters.length > 0) {
    body += `## Quick Start & Examples\n\n`;
    for (const s of skill.instructions.conversationStarters) {
      body += `- "${s}"\n`;
    }
    body += `\n`;
  }

  const skillMd = injectFrontmatter(frontmatter, body);

  const files = [
    {
      path: 'SKILL.md',
      content: skillMd,
      description: 'Claude Code Skill Manifest and Instructions'
    }
  ];

  // Include resources
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
    platform: 'claude',
    mainFile: 'SKILL.md',
    content: skillMd,
    files
  };
}
