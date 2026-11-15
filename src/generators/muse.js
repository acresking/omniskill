/**
 * OmniSkill - Muse & OpenWebUI / Ollama Generator
 */

export function generateMuseSkill(skill) {
  // Modelfile format for Ollama / Local LLMs / Muse
  let modelfile = `FROM llama3.3\n\n`;
  modelfile += `PARAMETER temperature 0.7\n`;
  modelfile += `PARAMETER top_p 0.9\n\n`;

  let cleanPrompt = skill.instructions.systemPrompt.replace(/"""/g, '\\"\\"\\"');
  modelfile += `SYSTEM """${cleanPrompt}"""\n`;

  // Python Tool Stub for OpenWebUI
  let pythonTools = `"""
title: ${skill.metadata.displayName}
author: ${skill.metadata.author || 'OmniSkill'}
description: ${skill.metadata.description}
version: ${skill.metadata.version || '1.0.0'}
"""

from pydantic import BaseModel, Field
from typing import Optional, Dict, Any

class Tools:
    def __init__(self):
        pass
`;

  for (const t of (skill.tools || [])) {
    const fnName = t.name.replace(/[^a-zA-Z0-9_]/g, '_');
    pythonTools += `\n    async def ${fnName}(self, query: str = Field(..., description="${t.description}")) -> str:
        """
        ${t.description}
        :param query: Input argument
        :return: Result string
        """
        # Implementation for ${t.name}
        return f"Executed ${t.name} with {query}"
`;
  }

  // OpenWebUI export JSON format
  const openwebuiExport = {
    id: skill.metadata.name,
    name: skill.metadata.displayName,
    meta: {
      description: skill.metadata.description,
      manifest: {
        title: skill.metadata.displayName,
        version: skill.metadata.version || '1.0.0',
        system_prompt: skill.instructions.systemPrompt
      },
      tools: skill.tools || []
    },
    content: pythonTools
  };

  const files = [
    {
      path: 'Modelfile',
      content: modelfile.trim(),
      description: 'Ollama & Muse Modelfile'
    },
    {
      path: 'tools.py',
      content: pythonTools.trim(),
      description: 'OpenWebUI Python Tool Implementation'
    },
    {
      path: 'openwebui_export.json',
      content: JSON.stringify(openwebuiExport, null, 2),
      description: 'OpenWebUI Importable JSON Spec'
    }
  ];

  return {
    platform: 'muse',
    mainFile: 'Modelfile',
    content: modelfile.trim(),
    files
  };
}
