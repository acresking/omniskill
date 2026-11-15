/**
 * OmniSkill - Cursor & Windsurf Generator
 */
import { injectFrontmatter } from '../yaml.js';

export function generateCursorSkill(skill) {
  let content = `# Rule: ${skill.metadata.displayName}\n\n`;
  content += `${skill.metadata.description}\n\n`;
  content += `${skill.instructions.systemPrompt}\n\n`;

  if (skill.instructions.guidelines && skill.instructions.guidelines.length > 0) {
    content += `## Rules & Guidelines\n`;
    for (const g of skill.instructions.guidelines) {
      content += `- ${g}\n`;
    }
  }

  // Modern Cursor .mdc format
  const mdcFrontmatter = {
    description: skill.metadata.description,
    globs: skill.metadata.tags && skill.metadata.tags.length > 0 ? skill.metadata.tags : ['*']
  };
  const mdcContent = injectFrontmatter(mdcFrontmatter, content);

  const files = [
    {
      path: '.cursorrules',
      content: content.trim(),
      description: 'Cursor IDE Legacy Rule Configuration'
    },
    {
      path: `.cursor/rules/${skill.metadata.name}.mdc`,
      content: mdcContent,
      description: 'Modern Cursor AI Rule (.mdc format)'
    }
  ];

  return {
    platform: 'cursor',
    mainFile: '.cursorrules',
    content: content.trim(),
    files
  };
}
