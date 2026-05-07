import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';

export const CONFIG_DIR = path.join(os.homedir(), '.cce');
export const CONFIG_FILE = path.join(CONFIG_DIR, 'configs.json');

export function maskKey(key) {
  if (!key || key.length <= 12) return '****';
  return key.slice(0, 4) + '...' + key.slice(-4);
}

export function ensureConfigDir() {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
  fs.chmodSync(CONFIG_DIR, 0o700);
}
