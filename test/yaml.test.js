import test from 'node:test';
import assert from 'node:assert/strict';
import { parseYaml, stringifyYaml, extractFrontmatter, injectFrontmatter } from '../src/yaml.js';

test('parseYaml parses basic keys, numbers, booleans', () => {
  const yaml = `
name: test-skill
version: 1.2.3
enabled: true
priority: 10
`;
  const result = parseYaml(yaml);
  assert.equal(result.name, 'test-skill');
  assert.equal(result.version, '1.2.3');
  assert.equal(result.enabled, true);
  assert.equal(result.priority, 10);
});

test('extractFrontmatter splits YAML frontmatter and markdown body', () => {
  const md = `---
name: claude-skill
description: "A Claude skill"
---
# Main Header
This is the instruction body.
`;
  const { attributes, body } = extractFrontmatter(md);
  assert.equal(attributes.name, 'claude-skill');
  assert.equal(attributes.description, 'A Claude skill');
  assert.ok(body.includes('# Main Header'));
  assert.ok(body.includes('This is the instruction body.'));
});

test('injectFrontmatter formats valid frontmatter block', () => {
  const out = injectFrontmatter({ name: 'gemini-skill', version: '2.0.0' }, '# Hello');
  assert.ok(out.startsWith('---'));
  assert.ok(out.includes('name: gemini-skill'));
  assert.ok(out.includes('# Hello'));
});
