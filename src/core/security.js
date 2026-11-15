/**
 * OmniSkill - Security Hardening & Path Sanitization
 *
 * Protects against directory traversal, path injection, prototype pollution,
 * and malicious input across Windows, macOS, and Linux.
 */
import path from 'node:path';

const FORBIDDEN_PROTO_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

/**
 * Validates and safely resolves an output path strictly inside a base directory.
 * Prevents Directory Traversal attacks (e.g. "../../etc/passwd").
 */
export function safeResolvePath(baseDir, relativePath) {
  if (!baseDir || typeof baseDir !== 'string') {
    throw new Error('Base directory is required for safe path resolution.');
  }
  if (!relativePath || typeof relativePath !== 'string') {
    throw new Error('Relative path is required.');
  }

  // Reject null-bytes immediately
  if (relativePath.includes('\0') || baseDir.includes('\0')) {
    throw new Error('Security Error: Null bytes detected in file path.');
  }

  const resolvedBase = path.resolve(baseDir);
  // Normalize Windows and Unix path separators
  const cleanRelative = relativePath.replace(/^(\.[\/\\])+/, '');
  const resolvedTarget = path.resolve(resolvedBase, cleanRelative);

  // Check that resolved target starts with resolvedBase
  if (!resolvedTarget.startsWith(resolvedBase + path.sep) && resolvedTarget !== resolvedBase) {
    throw new Error(`Security Violation: Path traversal attempt detected: "${relativePath}" escapes root "${baseDir}".`);
  }

  return resolvedTarget;
}

/**
 * Sanitizes skill identifiers to ensure safe filenames across Windows, macOS, and Linux.
 * Removes characters like < > : " / \ | ? *
 */
export function sanitizeSkillName(name) {
  if (!name || typeof name !== 'string') return 'unnamed-skill';
  return name
    .toLowerCase()
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9_-]/g, '')
    .slice(0, 80) || 'unnamed-skill';
}

/**
 * Strips prototype pollution attempts from parsed objects.
 */
export function sanitizeObject(obj) {
  if (obj === null || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  const clean = Object.create(null);
  for (const key of Object.keys(obj)) {
    if (FORBIDDEN_PROTO_KEYS.has(key)) {
      continue; // drop dangerous keys
    }
    clean[key] = sanitizeObject(obj[key]);
  }
  return { ...clean };
}
