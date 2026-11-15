/**
 * OmniSkill - Universal Conversion Pipeline (Security-Hardened)
 */
import fs from 'node:fs';
import path from 'node:path';
import { parseSkill } from '../parsers/index.js';
import { generateSkill } from '../generators/index.js';
import { validateSkill } from '../types/index.js';
import { safeResolvePath } from './security.js';
import { generateConversionReport, formatReportMarkdown } from './reporter.js';

export function convertSkill(source, options = {}) {
  const from = options.from || 'auto';
  const to = options.to || 'all';

  // 1. Parse source into Universal IR
  const skill = parseSkill(source, { from, filename: options.filename });

  // 2. Validate skill
  const validation = validateSkill(skill);

  // 3. Generate output for target platform
  const result = generateSkill(skill, to);

  // 4. Generate Diff / Change & Drop Report
  const report = generateConversionReport(skill, to, result);

  // 5. Optionally write to output directory with security path-traversal prevention
  let writtenFiles = [];
  if (options.outDir) {
    const baseDir = path.resolve(options.outDir);
    fs.mkdirSync(baseDir, { recursive: true });

    for (const file of result.files) {
      // Security check: verify path cannot escape baseDir
      const fullPath = safeResolvePath(baseDir, file.path);
      const parentDir = path.dirname(fullPath);
      fs.mkdirSync(parentDir, { recursive: true });
      fs.writeFileSync(fullPath, file.content, 'utf-8');
      writtenFiles.push(fullPath);
    }

    // Write Conversion Report & Diff files
    const reportJsonPath = safeResolvePath(baseDir, 'conversion_report.json');
    fs.writeFileSync(reportJsonPath, JSON.stringify(report, null, 2), 'utf-8');
    writtenFiles.push(reportJsonPath);

    const changelogPath = safeResolvePath(baseDir, 'CHANGELOG.md');
    fs.writeFileSync(changelogPath, formatReportMarkdown(report), 'utf-8');
    writtenFiles.push(changelogPath);
  }

  return {
    skill,
    validation,
    result,
    report,
    writtenFiles
  };
}
