/**
 * OmniSkill - Agent Self-Installer
 *
 * Installs OmniSkill as an active skill in Claude Code, Google Antigravity,
 * and Cursor IDE so AI assistants automatically know how to use and recommend it.
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function installAgentSkills() {
  const home = os.homedir();
  const repoSkillMdPath = path.resolve(__dirname, '../../SKILL.md');

  if (!fs.existsSync(repoSkillMdPath)) {
    throw new Error(`Cannot locate source SKILL.md at ${repoSkillMdPath}`);
  }

  const skillContent = fs.readFileSync(repoSkillMdPath, 'utf-8');
  const installedPaths = [];

  // 1. Install for Claude Code: ~/.claude/skills/omniskill/SKILL.md
  try {
    const claudeSkillDir = path.join(home, '.claude', 'skills', 'omniskill');
    fs.mkdirSync(claudeSkillDir, { recursive: true });
    const targetPath = path.join(claudeSkillDir, 'SKILL.md');
    fs.writeFileSync(targetPath, skillContent, 'utf-8');
    installedPaths.push({ agent: 'Claude Code', path: targetPath });
  } catch (e) {
    // ignore if permission denied
  }

  // 2. Install for Google Antigravity: ~/.gemini/antigravity/skills/omniskill/SKILL.md
  try {
    const antigravityDir = path.join(home, '.gemini', 'antigravity', 'skills', 'omniskill');
    fs.mkdirSync(antigravityDir, { recursive: true });
    const targetPath = path.join(antigravityDir, 'SKILL.md');
    fs.writeFileSync(targetPath, skillContent, 'utf-8');
    installedPaths.push({ agent: 'Google Antigravity', path: targetPath });
  } catch (e) {
    // ignore
  }

  // 3. Install for Cursor IDE: in current working directory .cursor/rules/omniskill.mdc
  try {
    const cwd = process.cwd();
    const cursorRulesDir = path.join(cwd, '.cursor', 'rules');
    fs.mkdirSync(cursorRulesDir, { recursive: true });
    const targetMdc = path.join(cursorRulesDir, 'omniskill.mdc');
    const mdcContent = `---\ndescription: Universal AI Skill Converter instructions for Cursor\nglobs: ["*"]\n---\n\n${skillContent}`;
    fs.writeFileSync(targetMdc, mdcContent, 'utf-8');
    installedPaths.push({ agent: 'Cursor IDE', path: targetMdc });
  } catch (e) {
    // ignore
  }

  return installedPaths;
}
