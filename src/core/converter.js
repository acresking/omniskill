/**
 * OmniSkill - Universal Conversion Pipeline
 */
import fs from 'node:fs';
import path from 'node:path';
import { parseSkill } from '../parsers/index.js';
import { generateSkill } from '../generators/index.js';
import { validateSkill } from '../types/index.js';

export function convertSkill(source, options = {}) {
  const from = options.from || 'auto';
  const to = options.to || 'all';

  // 1. Parse source into Universal IR
  const skill = parseSkill(source, { from, filename: options.filename });

  // 2. Validate skill
  const validation = validateSkill(skill);

  // 3. Generate output for target platform
  const result = generateSkill(skill, to);

  // 4. Optionally write to output directory
  let writtenFiles = [];
  if (options.outDir) {
    const baseDir = path.resolve(options.outDir);
    fs.mkdirSync(baseDir, { recursive: true });

    for (const file of result.files) {
      const fullPath = path.join(baseDir, file.path);
      const parentDir = path.dirname(fullPath);
      fs.mkdirSync(parentDir, { recursive: true });
      fs.writeFileSync(fullPath, file.content, 'utf-8');
      writtenFiles.push(fullPath);
    }
  }

  return {
    skill,
    validation,
    result,
    writtenFiles
  };
}
