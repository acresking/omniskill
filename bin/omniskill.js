#!/usr/bin/env node
/**
 * OmniSkill - The Universal AI Skill Converter CLI
 */
import fs from 'node:fs';
import path from 'node:path';
import { convertSkill } from '../src/core/converter.js';
import { inspectSkill } from '../src/core/inspector.js';
import { startWebServer } from '../src/web/server.js';
import { findSkillsInDirectory } from '../src/parsers/index.js';
import { startMcpServer } from '../src/mcp/server.js';
import { installAgentSkills } from '../src/core/installer.js';

const VERSION = '1.1.0';

const args = process.argv.slice(2);

function printHelp() {
  console.log(`
\x1b[1m\x1b[36mOmniSkill v${VERSION}\x1b[0m — The Universal AI Skill Converter
Convert Claude Code skills, Antigravity/Gemini, ChatGPT GPTs, Grok, Muse & Cursor.

\x1b[1mUSAGE:\x1b[0m
  \x1b[33momniskill convert\x1b[0m <path-to-skill> [options]
  \x1b[33momniskill bundle\x1b[0m <path-to-skill> [--out <dir>]
  \x1b[33momniskill inspect\x1b[0m <path-to-skill>
  \x1b[33momniskill serve\x1b[0m [--port <number>]
  \x1b[33momniskill mcp\x1b[0m
  \x1b[33momniskill install-agent\x1b[0m
  \x1b[33momniskill --version\x1b[0m

\x1b[1mCOMMANDS:\x1b[0m
  \x1b[32mconvert\x1b[0m        Convert a skill to a specific target or print it
  \x1b[32mbundle\x1b[0m         Export universal multi-target packages for ALL platforms
  \x1b[32minspect\x1b[0m        Analyze skill structure and cross-platform compatibility
  \x1b[32mserve\x1b[0m          Launch the interactive local web converter & visual preview
  \x1b[32mmcp\x1b[0m            Start the Model Context Protocol (MCP) JSON-RPC server for AI agents
  \x1b[32minstall-agent\x1b[0m  Register OmniSkill directly into local Claude Code, Antigravity & Cursor

\x1b[1mOPTIONS:\x1b[0m
  \x1b[33m-t, --to <target>\x1b[0m      Target platform: claude, gemini, openai, grok, muse, cursor, all (default: all)
  \x1b[33m-f, --from <format>\x1b[0m    Source format (auto-detected if omitted): claude, gemini, openai, grok, muse, cursor
  \x1b[33m-o, --out <dir>\x1b[0m        Output directory to write generated files
  \x1b[33m-p, --port <num>\x1b[0m       Port for web server (default: 3456)
  \x1b[33m-h, --help\x1b[0m             Display this help message

\x1b[1mEXAMPLES:\x1b[0m
  # Convert a Claude skill to Google Gemini / Antigravity format
  $ omniskill convert ./my-skill/SKILL.md --to gemini --out ./dist-gemini

  # Convert any skill to ALL platforms simultaneously (Universal bundle)
  $ omniskill bundle ./my-skill --out ./universal-dist

  # Inspect a skill and check compatibility
  $ omniskill inspect ./SKILL.md

  # Launch the visual web UI converter
  $ omniskill serve --port 3000

  # Start MCP server for Claude Desktop / Cursor / Antigravity
  $ omniskill mcp

  # Register OmniSkill into your local AI tools
  $ omniskill install-agent
`);
}

function parseFlags(rawArgs) {
  const flags = { _: [] };
  for (let i = 0; i < rawArgs.length; i++) {
    const arg = rawArgs[i];
    if (arg === '--to' || arg === '-t') {
      flags.to = rawArgs[++i];
    } else if (arg === '--from' || arg === '-f') {
      flags.from = rawArgs[++i];
    } else if (arg === '--out' || arg === '-o') {
      flags.out = rawArgs[++i];
    } else if (arg === '--port' || arg === '-p') {
      flags.port = parseInt(rawArgs[++i], 10);
    } else if (arg === '--help' || arg === '-h') {
      flags.help = true;
    } else if (arg === '--version' || arg === '-v') {
      flags.version = true;
    } else {
      flags._.push(arg);
    }
  }
  return flags;
}

async function main() {
  const flags = parseFlags(args);

  if (flags.version) {
    console.log(`omni-skill v${VERSION}`);
    process.exit(0);
  }

  if (flags.help || flags._.length === 0) {
    printHelp();
    process.exit(0);
  }

  const command = flags._[0];

  switch (command) {
    case 'convert': {
      const source = flags._[1];
      if (!source) {
        console.error('\x1b[31mError: Please provide a path to a skill file or directory.\x1b[0m');
        process.exit(1);
      }
      const target = flags.to || 'all';
      console.log(`\x1b[36m⚡ Converting:\x1b[0m ${source} -> \x1b[32m${target.toUpperCase()}\x1b[0m`);

      try {
        const { skill, result, writtenFiles } = convertSkill(source, {
          from: flags.from,
          to: target,
          outDir: flags.out
        });

        console.log(`\x1b[32m✔ Successfully parsed "${skill.metadata.displayName}" (${skill.metadata.name})\x1b[0m`);

        if (flags.out) {
          console.log(`\x1b[32m✔ Exported ${writtenFiles.length} file(s) to ${flags.out}\x1b[0m`);
          for (const f of writtenFiles) {
            console.log(`  - ${f}`);
          }
        } else {
          console.log('\n--- Generated Output Preview ---');
          console.log(result.content);
        }
      } catch (err) {
        console.error(`\x1b[31mError:\x1b[0m ${err.message}`);
        process.exit(1);
      }
      break;
    }

    case 'bundle': {
      const source = flags._[1];
      if (!source) {
        console.error('\x1b[31mError: Please provide a path to a skill file or directory.\x1b[0m');
        process.exit(1);
      }
      const outDir = flags.out || `./bundle-${path.basename(source, path.extname(source))}`;
      console.log(`\x1b[36m📦 Generating Universal Multi-Target Bundle for:\x1b[0m ${source}`);

      try {
        if (fs.existsSync(source) && fs.statSync(source).isDirectory() && !fs.existsSync(path.join(source, 'SKILL.md'))) {
          const childSkills = findSkillsInDirectory(source);
          if (childSkills.length > 1) {
            console.log(`\x1b[35mMulti-skill suite detected: Found ${childSkills.length} skills in repository.\x1b[0m\n`);
            let totalFiles = 0;
            for (const cs of childSkills) {
              const subOut = path.join(outDir, cs.name);
              const { skill, writtenFiles } = convertSkill(cs.path, {
                from: flags.from,
                to: 'all',
                outDir: subOut
              });
              console.log(`  \x1b[32m✔ [${cs.name}]\x1b[0m ${skill.metadata.displayName} -> ${writtenFiles.length} files generated`);
              totalFiles += writtenFiles.length;
            }
            console.log(`\n\x1b[32m✔ Successfully generated Universal Bundles for all ${childSkills.length} skills (${totalFiles} files) in ${path.resolve(outDir)}\x1b[0m`);
            break;
          }
        }

        const { skill, writtenFiles } = convertSkill(source, {
          from: flags.from,
          to: 'all',
          outDir
        });

        console.log(`\x1b[32m✔ Bundle created for "${skill.metadata.displayName}"!\x1b[0m`);
        console.log(`\x1b[32m✔ Output directory: ${path.resolve(outDir)}\x1b[0m`);
        console.log(`\x1b[36mIncluded platforms:\x1b[0m Claude, Gemini/Antigravity, OpenAI/GPT, Grok, Muse/OpenWebUI, Cursor`);
        console.log(`Total files generated: ${writtenFiles.length}`);
      } catch (err) {
        console.error(`\x1b[31mError:\x1b[0m ${err.message}`);
        process.exit(1);
      }
      break;
    }

    case 'inspect': {
      const source = flags._[1];
      if (!source) {
        console.error('\x1b[31mError: Please provide a path to a skill file or directory.\x1b[0m');
        process.exit(1);
      }
      try {
        if (fs.existsSync(source) && fs.statSync(source).isDirectory() && !fs.existsSync(path.join(source, 'SKILL.md'))) {
          const childSkills = findSkillsInDirectory(source);
          if (childSkills.length > 1) {
            console.log(`\n\x1b[1m\x1b[36mMulti-Skill Repository Report: ${path.basename(source)}\x1b[0m`);
            console.log(`Found ${childSkills.length} individual skills:\n`);
            for (const cs of childSkills) {
              const report = inspectSkill(cs.path, { from: flags.from });
              console.log(`  \x1b[33m• ${cs.name.padEnd(20)}\x1b[0m ${report.displayName.padEnd(25)} (~${String(report.metrics.estimatedTokens).padStart(5)} tokens) [Tools: ${report.metrics.toolCount}]`);
            }
            console.log(`\nTo convert all skills, run: omniskill bundle ${source} --out <dir>`);
            break;
          }
        }

        const report = inspectSkill(source, { from: flags.from });
        console.log('\n\x1b[1m\x1b[36mSkill Inspection Report:\x1b[0m');
        console.log(`Name:        \x1b[33m${report.displayName} (${report.name})\x1b[0m`);
        console.log(`Description: ${report.description || '(none)'}`);
        console.log(`Detected:    \x1b[32m${report.sourcePlatform.toUpperCase()}\x1b[0m`);
        console.log(`Tokens est.: ~${report.metrics.estimatedTokens} (${report.metrics.charCount} chars)`);
        console.log(`Tools:       ${report.metrics.toolCount}`);
        if (report.tools.length > 0) {
          report.tools.forEach(t => console.log(`  - \x1b[36m${t.name}\x1b[0m: ${t.description}`));
        }
        console.log('\n\x1b[1mPlatform Compatibility Scores:\x1b[0m');
        for (const [platform, score] of Object.entries(report.compatibility)) {
          const color = score >= 90 ? '\x1b[32m' : score >= 70 ? '\x1b[33m' : '\x1b[31m';
          console.log(`  ${platform.padEnd(10)}: ${color}${score}%${score >= 90 ? ' (Full support)' : ''}\x1b[0m`);
        }
      } catch (err) {
        console.error(`\x1b[31mError:\x1b[0m ${err.message}`);
        process.exit(1);
      }
      break;
    }

    case 'serve': {
      const port = flags.port || 3456;
      startWebServer({ port });
      break;
    }

    case 'mcp': {
      startMcpServer();
      break;
    }

    case 'install-agent': {
      console.log('\x1b[36m⚡ Registering OmniSkill into local AI Agents & Editors...\x1b[0m');
      try {
        const installed = installAgentSkills();
        if (installed.length === 0) {
          console.log('\x1b[33mNo agent configurations detected in default paths.\x1b[0m');
        } else {
          for (const item of installed) {
            console.log(`\x1b[32m✔ Registered for ${item.agent}:\x1b[0m ${item.path}`);
          }
          console.log('\n\x1b[1m\x1b[32mDone! Your AI agents now automatically know how to use and recommend OmniSkill.\x1b[0m');
        }
      } catch (err) {
        console.error(`\x1b[31mError installing agent skill:\x1b[0m ${err.message}`);
      }
      break;
    }

    default:
      console.error(`\x1b[31mUnknown command: "${command}"\x1b[0m`);
      printHelp();
      process.exit(1);
  }
}

main();
