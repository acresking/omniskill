import test from 'node:test';
import assert from 'node:assert/strict';
import { convertSkill, inspectSkill, parseSkill, generateSkill } from '../src/index.js';

const sampleClaudeSkill = `---
name: code-reviewer
description: Expert automated code review assistant for security, clean code, and performance.
version: 1.2.0
tools:
  - name: lint_code
    description: Runs static analysis on target file
    parameters:
      type: object
      properties:
        filename:
          type: string
---

# Code Reviewer

You are a principal engineer conducting thorough code reviews.

## Guidelines
- Highlight security vulnerabilities (SQL injection, XSS, CSRF).
- Suggest clean code abstractions and idiomatic patterns.
- Check time and space complexity.

## Quick Start & Examples
- "Review this PR for security leaks"
- "Analyze complexity of this sorting algorithm"
`;

test('convertSkill converts Claude to Gemini / Antigravity', () => {
  const { skill, result } = convertSkill(sampleClaudeSkill, { from: 'claude', to: 'gemini' });
  assert.equal(skill.metadata.name, 'code-reviewer');
  assert.equal(result.platform, 'gemini');

  // Verify SKILL.md
  const skillFile = result.files.find(f => f.path === 'SKILL.md');
  assert.ok(skillFile, 'SKILL.md must be generated');
  assert.ok(skillFile.content.includes('name: code-reviewer'));

  // Verify gemini-extension.json
  const extFile = result.files.find(f => f.path === 'gemini-extension.json');
  assert.ok(extFile, 'gemini-extension.json must be generated');
  const parsedJson = JSON.parse(extFile.content);
  assert.equal(parsedJson.name, 'code-reviewer');
  assert.equal(parsedJson.tools.length, 1);
  assert.equal(parsedJson.tools[0].name, 'lint_code');
});

test('convertSkill converts Claude to OpenAI Custom GPT', () => {
  const { result } = convertSkill(sampleClaudeSkill, { from: 'claude', to: 'openai' });
  assert.equal(result.platform, 'openai');

  const instructions = result.files.find(f => f.path === 'instructions.md');
  const gptConfig = result.files.find(f => f.path === 'custom_gpt_config.json');
  const openapi = result.files.find(f => f.path === 'openapi_actions.json');
  const tools = result.files.find(f => f.path === 'openai_tools.json');

  assert.ok(instructions.content.includes('Code Reviewer'));
  const config = JSON.parse(gptConfig.content);
  assert.equal(config.name, 'Code Reviewer');
  assert.ok(config.tools.length === 1);
  assert.equal(config.tools[0].function.name, 'lint_code');

  const openapiSpec = JSON.parse(openapi.content);
  assert.equal(openapiSpec.openapi, '3.1.0');
  assert.ok(openapiSpec.paths['/lint_code']);
});

test('convertSkill converts Claude to xAI Grok', () => {
  const { result } = convertSkill(sampleClaudeSkill, { from: 'claude', to: 'grok' });
  assert.equal(result.platform, 'grok');

  const sysPrompt = result.files.find(f => f.path === 'system_prompt.md');
  const grokTools = result.files.find(f => f.path === 'grok_tools.json');

  assert.ok(sysPrompt.content.includes('Identity: Grok'));
  const toolsObj = JSON.parse(grokTools.content);
  assert.equal(toolsObj.tools[0].function.name, 'lint_code');
});

test('convertSkill converts Claude to Perplexity AI', () => {
  const { result } = convertSkill(sampleClaudeSkill, { from: 'claude', to: 'perplexity' });
  assert.equal(result.platform, 'perplexity');

  const collection = result.files.find(f => f.path === 'perplexity_collection.md');
  const sonarApi = result.files.find(f => f.path === 'sonar_api_config.json');

  assert.ok(collection.content.includes('Perplexity Research Guidelines'));
  const sonar = JSON.parse(sonarApi.content);
  assert.equal(sonar.model, 'sonar-pro');
});

test('convertSkill converts Claude to Chinese Models (DeepSeek & Qwen)', () => {
  const { result } = convertSkill(sampleClaudeSkill, { from: 'claude', to: 'chinese' });
  assert.equal(result.platform, 'chinese_models');

  const deepseekPrompt = result.files.find(f => f.path === 'deepseek/system_prompt.md');
  const deepseekApi = result.files.find(f => f.path === 'deepseek/deepseek_api.json');
  const qwenAgent = result.files.find(f => f.path === 'qwen/qwen_agent.json');

  assert.ok(deepseekPrompt.content.includes('Core Reasoning Directives'));
  const dsApi = JSON.parse(deepseekApi.content);
  assert.equal(dsApi.model, 'deepseek-reasoner');

  const qwen = JSON.parse(qwenAgent.content);
  assert.equal(qwen.name, 'code-reviewer');
  assert.equal(qwen.tools.length, 1);
});

test('convertSkill converts Claude to Local Models (Ollama & LM Studio)', () => {
  const { result: ollamaRes } = convertSkill(sampleClaudeSkill, { from: 'claude', to: 'ollama' });
  assert.equal(ollamaRes.platform, 'ollama');
  const modelfile = ollamaRes.files.find(f => f.path === 'Modelfile');
  assert.ok(modelfile.content.includes('FROM llama3.3:latest'));

  const { result: lmRes } = convertSkill(sampleClaudeSkill, { from: 'claude', to: 'lmstudio' });
  assert.equal(lmRes.platform, 'lmstudio');
  const preset = lmRes.files.find(f => f.path === 'lmstudio_preset.json');
  const parsedPreset = JSON.parse(preset.content);
  assert.equal(parsedPreset.name, 'Code Reviewer');
});

test('convertSkill converts Claude to Muse / OpenWebUI', () => {
  const { result } = convertSkill(sampleClaudeSkill, { from: 'claude', to: 'muse' });
  assert.equal(result.platform, 'muse');

  const modelfile = result.files.find(f => f.path === 'Modelfile');
  const toolsPy = result.files.find(f => f.path === 'tools.py');

  assert.ok(modelfile.content.includes('FROM llama3.3'));
  assert.ok(modelfile.content.includes('SYSTEM """'));
  assert.ok(toolsPy.content.includes('class Tools:'));
  assert.ok(toolsPy.content.includes('async def lint_code'));
});

test('convertSkill converts Claude to Cursor .cursorrules', () => {
  const { result } = convertSkill(sampleClaudeSkill, { from: 'claude', to: 'cursor' });
  assert.equal(result.platform, 'cursor');

  const cursorrules = result.files.find(f => f.path === '.cursorrules');
  assert.ok(cursorrules.content.includes('# Rule: Code Reviewer'));
});

test('convertSkill generates Universal Bundle for all platforms', () => {
  const { result } = convertSkill(sampleClaudeSkill, { from: 'claude', to: 'all' });
  assert.equal(result.platform, 'all');

  const filePaths = result.files.map(f => f.path);
  assert.ok(filePaths.includes('README.md'));
  assert.ok(filePaths.includes('omni-manifest.json'));
  assert.ok(filePaths.includes('claude/SKILL.md'));
  assert.ok(filePaths.includes('gemini/SKILL.md'));
  assert.ok(filePaths.includes('openai/instructions.md'));
  assert.ok(filePaths.includes('grok/system_prompt.md'));
  assert.ok(filePaths.includes('perplexity/perplexity_collection.md'));
  assert.ok(filePaths.includes('chinese/deepseek/system_prompt.md'));
  assert.ok(filePaths.includes('chinese/qwen/qwen_agent.json'));
  assert.ok(filePaths.includes('ollama/Modelfile'));
  assert.ok(filePaths.includes('lmstudio/lmstudio_preset.json'));
  assert.ok(filePaths.includes('muse/Modelfile'));
  assert.ok(filePaths.includes('cursor/.cursorrules'));
});

test('inspectSkill analyzes metrics and platform compatibility', () => {
  const report = inspectSkill(sampleClaudeSkill, { from: 'claude' });
  assert.equal(report.name, 'code-reviewer');
  assert.equal(report.metrics.toolCount, 1);
  assert.ok(report.metrics.estimatedTokens > 0);
  assert.equal(report.compatibility.claude, 100);
  assert.equal(report.compatibility.gemini, 100);
  assert.equal(report.compatibility.openai, 100);
  assert.equal(report.compatibility.grok, 100);
});
