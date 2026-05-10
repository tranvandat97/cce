import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export const OPENCODE_CONFIG_FILE = path.join(os.homedir(), '.config', 'opencode', 'opencode.json');
export const OPENCODE_BACKUP_FILE = path.join(os.homedir(), '.config', 'opencode', 'opencode-backup.json');

function readJsonIfExists(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (err) {
    if (err.code === 'ENOENT') return {};
    if (err instanceof SyntaxError) throw new Error(`OpenCode config is corrupted: ${filePath}. Fix or delete it.`);
    throw err;
  }
}

export function writeOpenCodeGlobalConfig(config) {
  fs.mkdirSync(path.dirname(OPENCODE_CONFIG_FILE), { recursive: true, mode: 0o700 });

  if (fs.existsSync(OPENCODE_CONFIG_FILE)) {
    fs.copyFileSync(OPENCODE_CONFIG_FILE, OPENCODE_BACKUP_FILE);
    fs.chmodSync(OPENCODE_BACKUP_FILE, 0o600);
  }

  const current = readJsonIfExists(OPENCODE_CONFIG_FILE);
  const next = {
    ...current,
    provider: {
      ...(current.provider || {}),
      [config.name]: {
        npm: '@ai-sdk/openai-compatible',
        name: config.name,
        options: {
          baseURL: config.endpoint,
          apiKey: config.apiKey,
        },
        models: Object.fromEntries(config.models.map(model => [model, {}])),
      },
    },
    model: `${config.name}/${config.defaultModel}`,
  };

  const fd = fs.openSync(OPENCODE_CONFIG_FILE, 'w', 0o600);
  fs.writeFileSync(fd, JSON.stringify(next, null, 2) + '\n');
  fs.closeSync(fd);
}
