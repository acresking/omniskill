/**
 * OmniSkill - Official Model Context Protocol (MCP) Server
 *
 * Allows any MCP-compatible AI Assistant (Claude Desktop, Claude Code,
 * Cursor, Antigravity, Windsurf, OpenWebUI) to invoke OmniSkill directly.
 */
import readline from 'node:readline';
import { convertSkill } from '../core/converter.js';
import { inspectSkill } from '../core/inspector.js';
import { SUPPORTED_TARGETS } from '../generators/index.js';

export function startMcpServer() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  function sendResponse(id, result) {
    const response = {
      jsonrpc: '2.0',
      id,
      result
    };
    process.stdout.write(JSON.stringify(response) + '\n');
  }

  function sendError(id, code, message) {
    const response = {
      jsonrpc: '2.0',
      id,
      error: { code, message }
    };
    process.stdout.write(JSON.stringify(response) + '\n');
  }

  rl.on('line', (line) => {
    line = line.trim();
    if (!line) return;

    let message;
    try {
      message = JSON.parse(line);
    } catch (e) {
      process.stderr.write(`[OmniSkill MCP] Failed to parse JSON-RPC: ${e.message}\n`);
      return;
    }

    const { id, method, params } = message;

    switch (method) {
      case 'initialize': {
        sendResponse(id, {
          protocolVersion: '2024-11-05',
          serverInfo: {
            name: 'omniskill-mcp',
            version: '1.0.0'
          },
          capabilities: {
            tools: {}
          }
        });
        break;
      }

      case 'notifications/initialized': {
        // No-op for initialized notification
        break;
      }

      case 'tools/list': {
        sendResponse(id, {
          tools: [
            {
              name: 'convert_skill',
              description: 'Converts an AI skill (Claude Code, Gemini, OpenAI Custom GPT, Grok, Muse) to any target format or bundle.',
              inputSchema: {
                type: 'object',
                properties: {
                  source: {
                    type: 'string',
                    description: 'Path to skill file/directory, or raw skill content string.'
                  },
                  to: {
                    type: 'string',
                    description: `Target platform: ${SUPPORTED_TARGETS.join(', ')} (default: all)`
                  },
                  from: {
                    type: 'string',
                    description: 'Source platform (optional, auto-detected if omitted).'
                  },
                  outDir: {
                    type: 'string',
                    description: 'Optional output directory path to write the converted files.'
                  }
                },
                required: ['source']
              }
            },
            {
              name: 'inspect_skill',
              description: 'Inspects and analyzes any AI skill: token estimation, tools declared, and cross-platform compatibility score (0-100%).',
              inputSchema: {
                type: 'object',
                properties: {
                  source: {
                    type: 'string',
                    description: 'Path to skill file/directory, or raw skill content string.'
                  },
                  from: {
                    type: 'string',
                    description: 'Source platform format (optional).'
                  }
                },
                required: ['source']
              }
            },
            {
              name: 'bundle_skill',
              description: 'Generates a complete Universal Multi-Platform Bundle containing ready-to-run configurations for Claude, Gemini, OpenAI, Grok, Muse, and Cursor simultaneously.',
              inputSchema: {
                type: 'object',
                properties: {
                  source: {
                    type: 'string',
                    description: 'Path to skill file or directory.'
                  },
                  outDir: {
                    type: 'string',
                    description: 'Target directory to save the universal bundle.'
                  }
                },
                required: ['source', 'outDir']
              }
            }
          ]
        });
        break;
      }

      case 'tools/call': {
        const { name, arguments: args } = params;

        try {
          if (name === 'convert_skill') {
            const { skill, result, writtenFiles } = convertSkill(args.source, {
              to: args.to || 'all',
              from: args.from,
              outDir: args.outDir
            });

            sendResponse(id, {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify({
                    success: true,
                    skillName: skill.metadata.name,
                    displayName: skill.metadata.displayName,
                    target: result.platform,
                    filesGenerated: result.files.map(f => f.path),
                    writtenFiles,
                    primaryContentPreview: result.content?.slice(0, 500)
                  }, null, 2)
                }
              ]
            });
          } else if (name === 'inspect_skill') {
            const report = inspectSkill(args.source, { from: args.from });
            sendResponse(id, {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(report, null, 2)
                }
              ]
            });
          } else if (name === 'bundle_skill') {
            const { skill, writtenFiles } = convertSkill(args.source, {
              to: 'all',
              outDir: args.outDir
            });

            sendResponse(id, {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify({
                    success: true,
                    skillName: skill.metadata.name,
                    outDir: args.outDir,
                    totalFilesGenerated: writtenFiles.length,
                    writtenFiles
                  }, null, 2)
                }
              ]
            });
          } else {
            sendError(id, -32601, `Unknown tool: ${name}`);
          }
        } catch (err) {
          sendResponse(id, {
            isError: true,
            content: [
              {
                type: 'text',
                text: `OmniSkill error: ${err.message}`
              }
            ]
          });
        }
        break;
      }

      default: {
        if (id !== undefined) {
          sendError(id, -32601, `Method not found: ${method}`);
        }
        break;
      }
    }
  });

  process.stderr.write('[OmniSkill MCP] Server started and listening on stdio.\n');
}
