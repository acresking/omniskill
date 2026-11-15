/**
 * OmniSkill - Claude Code Skill Generator (Upgraded Reverse Transpiler)
 *
 * Generates production-grade Claude Code skills with proper triggering descriptions,
 * YAML frontmatter, execution scripts for CLI invocation, and clean LF formatting.
 */
import { injectFrontmatter } from '../yaml.js';
import { sanitizeSkillName } from '../core/security.js';

export function generateClaudeSkill(skill) {
  const safeName = sanitizeSkillName(skill.metadata.name);

  // Claude Code skill matcher relies heavily on the description to decide when to activate
  let desc = skill.metadata.description || `${skill.metadata.displayName} agent capability.`;
  if (!desc.toLowerCase().includes('use when') && !desc.toLowerCase().includes('activate when')) {
    desc += ` Use when the user asks for assistance with ${skill.metadata.displayName.toLowerCase()}.`;
  }

  const frontmatter = {
    name: safeName,
    description: desc.trim()
  };

  if (skill.metadata.version) {
    frontmatter.version = String(skill.metadata.version);
  }

  if (skill.tools && skill.tools.length > 0) {
    frontmatter.tools = skill.tools.map(t => ({
      name: t.name,
      description: t.description || `Tool: ${t.name}`,
      parameters: t.parameters || { type: 'object', properties: {} }
    }));
  }

  // Construct structured body following Claude Code best practices
  let body = `# ${skill.metadata.displayName}\n\n`;

  if (skill.instructions.systemPrompt) {
    body += `${skill.instructions.systemPrompt.trim()}\n\n`;
  }

  if (skill.instructions.guidelines && skill.instructions.guidelines.length > 0) {
    body += `## Operational Guidelines\n\n`;
    for (const g of skill.instructions.guidelines) {
      body += `- ${g}\n`;
    }
    body += `\n`;
  }

  // If tools were converted from OpenAPI / Gemini / Qwen, document their CLI invocation
  const files = [];

  if (skill.tools && skill.tools.length > 0) {
    body += `## Available Tools & CLI Scripts\n\n`;
    body += `This skill exposes ${skill.tools.length} tool(s). You can invoke the helper scripts in \`scripts/\` directly:\n\n`;

    for (const t of skill.tools) {
      const toolFile = `scripts/${t.name}.sh`;
      body += `- **\`${t.name}\`**: ${t.description || 'Executes ' + t.name}\n`;
      body += `  \`\`\`bash\n  bash "\${CLAUDE_SKILL_DIR}/${toolFile}" [arguments]\n  \`\`\`\n`;

      // Generate executable CLI helper script for each tool
      let scriptContent = `#!/usr/bin/env bash\n# Claude Code tool runner for ${t.name}\n`;
      scriptContent += `set -euo pipefail\n\n`;
      scriptContent += `echo "[${safeName}] Running ${t.name} with parameters: \$@"\n`;

      if (t.implementation?.type === 'http' && t.implementation.endpoint) {
        const ep = t.implementation.endpoint;
        scriptContent += `curl -s -X ${ep.method || 'POST'} "${ep.url}" \\\n  -H "Content-Type: application/json" \\\n  -d "\$1"\n`;
      } else {
        scriptContent += `# Add custom execution logic for ${t.name} here\n`;
      }

      files.push({
        path: toolFile,
        content: scriptContent.replace(/\r\n/g, '\n'),
        description: `CLI Tool Script for ${t.name}`
      });
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

  // Normalize line endings to standard LF
  const skillMd = injectFrontmatter(frontmatter, body).replace(/\r\n/g, '\n');

  files.unshift({
    path: 'SKILL.md',
    content: skillMd,
    description: 'Claude Code Skill Manifest and Instructions'
  });

  // Include any extra resources
  if (skill.resources && skill.resources.length > 0) {
    for (const res of skill.resources) {
      files.push({
        path: res.path.replace(/\\/g, '/'),
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
