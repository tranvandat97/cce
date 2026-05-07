import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import * as p from '@clack/prompts';
import { loadConfig } from '../config.js';

const CLAUDE_SETTINGS_PATH = path.join(os.homedir(), '.claude', 'settings.json');

function readClaudeSettings() {
  try {
    const raw = fs.readFileSync(CLAUDE_SETTINGS_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return { env: {} };
  }
}

export function registerRun(program) {
  program
    .argument('[name]', 'Config name to activate')
    .allowUnknownOption(true)
    .action(async (name) => {
      if (!name) {
        program.help();
        return;
      }

      const config = loadConfig(name);
      const baseSettings = readClaudeSettings();

      const mergedSettings = {
        ...baseSettings,
        env: {
          ...(baseSettings.env || {}),
          ANTHROPIC_BASE_URL: config.endpoint,
          ANTHROPIC_AUTH_TOKEN: config.apiKey,
          ANTHROPIC_MODEL: config.defaultModel,
        },
      };

      const rawArgs = process.argv.slice(2);
      const claudeArgs = ['--settings', JSON.stringify(mergedSettings), ...rawArgs.slice(1)];

      const child = spawn('claude', claudeArgs, {
        stdio: 'inherit',
        env: process.env,
      });

      child.on('error', (err) => {
        if (err.code === 'ENOENT') {
          p.log.error("'claude' not found in PATH. Install Claude Code first: https://docs.anthropic.com/en/docs/claude-code");
        } else {
          p.log.error(`Failed to spawn claude: ${err.message}`);
        }
        process.exit(1);
      });

      child.on('exit', (code) => {
        process.exit(code ?? 0);
      });
    });
}
