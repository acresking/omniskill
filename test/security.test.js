import test from 'node:test';
import assert from 'node:assert/strict';
import { safeResolvePath, sanitizeSkillName, sanitizeObject } from '../src/core/security.js';

test('safeResolvePath prevents directory traversal attacks', () => {
  const baseDir = 'C:\\safe\\base';

  // Safe path
  const safe = safeResolvePath(baseDir, 'subfolder/file.txt');
  assert.ok(safe.startsWith(baseDir));

  // Traversal attack
  assert.throws(() => {
    safeResolvePath(baseDir, '../../windows/system32/cmd.exe');
  }, /Path traversal attempt detected/);

  // Null byte injection attack
  assert.throws(() => {
    safeResolvePath(baseDir, 'file.txt\0.exe');
  }, /Null bytes detected/);
});

test('sanitizeSkillName strips invalid OS characters', () => {
  const dirty = 'My Skill: <Dangerous> / "Special" * ? | Name';
  const clean = sanitizeSkillName(dirty);
  assert.equal(clean, 'my-skill-dangerous-special-name');
});

test('sanitizeObject strips prototype pollution keys', () => {
  const payload = JSON.parse('{"name": "test", "__proto__": {"admin": true}}');
  const clean = sanitizeObject(payload);
  assert.equal(clean.name, 'test');
  assert.equal(Object.prototype.admin, undefined);
});
