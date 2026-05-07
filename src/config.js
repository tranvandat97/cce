import fs from 'node:fs';
import { CONFIG_FILE, ensureConfigDir } from './utils.js';

export function readAll() {
  try {
    const raw = fs.readFileSync(CONFIG_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') return { configs: [] };
    if (err instanceof SyntaxError) {
      throw new Error(`Config file is corrupted: ${CONFIG_FILE}. Fix or delete it.`);
    }
    throw err;
  }
}

export function writeAll(data) {
  ensureConfigDir();
  const fd = fs.openSync(CONFIG_FILE, 'w', 0o600);
  fs.writeFileSync(fd, JSON.stringify(data, null, 2) + '\n');
  fs.closeSync(fd);
}

export function saveConfig(config) {
  const data = readAll();
  const idx = data.configs.findIndex(c => c.name === config.name);
  if (idx >= 0) {
    data.configs[idx] = config;
  } else {
    data.configs.push(config);
  }
  writeAll(data);
}

export function loadConfig(name) {
  const data = readAll();
  const config = data.configs.find(c => c.name === name);
  if (!config) throw new Error(`Config "${name}" not found. Run 'cce list' to see available configs.`);
  return config;
}

export function listConfigs() {
  return readAll().configs.sort((a, b) => a.name.localeCompare(b.name));
}

export function deleteConfig(name) {
  const data = readAll();
  const before = data.configs.length;
  data.configs = data.configs.filter(c => c.name !== name);
  if (data.configs.length === before) {
    throw new Error(`Config "${name}" not found.`);
  }
  writeAll(data);
}

export function configExists(name) {
  return readAll().configs.some(c => c.name === name);
}
