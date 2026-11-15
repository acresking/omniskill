"""
OmniSkill Python SDK
--------------------
Allows Python applications, LangChain tools, CrewAI agents, and AutoGen
to programmatically convert and inspect AI skills across Claude, Gemini,
OpenAI Custom GPTs, xAI Grok, Muse, and Cursor.
"""

import subprocess
import json
import shutil
from typing import Optional, Dict, Any, List

class OmniSkill:
    def __init__(self, cli_path: Optional[str] = None):
        if cli_path:
            self.cli_path = cli_path
        else:
            self.cli_path = shutil.which("omniskill") or "npx -y omniskill"

    def _run_cli(self, args: List[str]) -> str:
        cmd = self.cli_path.split() + args
        proc = subprocess.run(cmd, capture_output=True, text=True, check=True)
        return proc.stdout

    def inspect(self, source: str, from_format: Optional[str] = None) -> Dict[str, Any]:
        """Inspects an AI skill and returns token count, tools, and cross-platform scores."""
        args = ["inspect", source]
        if from_format:
            args.extend(["--from", from_format])
        out = self._run_cli(args)
        return {"raw_output": out}

    def convert(self, source: str, to: str = "all", out_dir: Optional[str] = None, from_format: Optional[str] = None) -> str:
        """Converts a skill to a target platform or universal bundle."""
        args = ["convert", source, "--to", to]
        if from_format:
            args.extend(["--from", from_format])
        if out_dir:
            args.extend(["--out", out_dir])
        return self._run_cli(args)

    def bundle(self, source: str, out_dir: str) -> str:
        """Exports a universal multi-target bundle for all supported AI models."""
        return self._run_cli(["bundle", source, "--out", out_dir])
