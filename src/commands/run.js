import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import * as p from '@clack/prompts';
import { loadConfig } from '../config.js';
import { writeOpenCodeGlobalConfig } from '../opencode-global-config.js';

const CLAUDE_SETTINGS_PATH = path.join(os.homedir(), '.claude', 'settings.json');

const SHORTHANDS = {
  '-sp': '--dangerously-skip-permissions',
};

function readClaudeSettings() {
  try {
    const raw = fs.readFileSync(CLAUDE_SETTINGS_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return { env: {} };
  }
}

function spawnCli(command, args, notFoundMessage) {
  const child = spawn(command, args, {
    stdio: 'inherit',
    env: process.env,
  });

  child.on('error', (err) => {
    if (err.code === 'ENOENT') {
      p.log.error(notFoundMessage);
    } else {
      p.log.error(`Failed to spawn ${command}: ${err.message}`);
    }
    process.exit(1);
  });

  child.on('exit', (code) => {
    process.exit(code ?? 0);
  });
}

export function registerRun(program) {
  program
    .allowUnknownOption(true)
    .argument('[args...]')
    .action(async () => {
      const rawArgs = process.argv.slice(2);
      if (rawArgs.length === 0) {
        program.help();
        return;
      }

      const name = rawArgs[0];
      const useOpenCode = rawArgs.includes('--opencode');
      const passthroughArgs = rawArgs
        .slice(1)
        .filter(arg => arg !== '--opencode')
        .map(arg => SHORTHANDS[arg] || arg);

      let config;
      try {
        config = loadConfig(name, { side: useOpenCode ? 'opencode' : 'claude' });
      } catch (err) {
        p.log.error(err.message);
        process.exit(1);
      }

      if (useOpenCode) {
        try {
          writeOpenCodeGlobalConfig(config);
        } catch (err) {
          p.log.error(err.message);
          process.exit(1);
        }
        spawnCli('opencode', passthroughArgs, "'opencode' not found in PATH. Install OpenCode first.");
        return;
      }

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
      const claudeArgs = ['--settings', JSON.stringify(mergedSettings), ...passthroughArgs];
      spawnCli('claude', claudeArgs, "'claude' not found in PATH. Install Claude Code first: https://docs.anthropic.com/en/docs/claude-code");
    });
}
