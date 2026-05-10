import fs from 'node:fs';
import { CONFIG_FILE, ensureConfigDir } from './utils.js';

const SIDES = new Set(['claude', 'opencode']);

function normalizeConfig(config) {
  const normalized = { name: config.name };

  if (config.claude) normalized.claude = config.claude;
  if (config.opencode) normalized.opencode = config.opencode;

  if (!normalized.claude && (config.endpoint || config.apiKey || config.models || config.defaultModel)) {
    normalized.claude = {
      endpoint: config.endpoint,
      apiKey: config.apiKey,
      models: config.models || [],
      defaultModel: config.defaultModel,
    };
  }

  return normalized;
}

function normalizeData(data) {
  return {
    configs: (data.configs || []).map(normalizeConfig),
  };
}

function assertSide(side) {
  if (!SIDES.has(side)) throw new Error(`Unknown config side "${side}".`);
}

export function readAll() {
  try {
    const raw = fs.readFileSync(CONFIG_FILE, 'utf-8');
    return normalizeData(JSON.parse(raw));
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
  fs.writeFileSync(fd, JSON.stringify(normalizeData(data), null, 2) + '\n');
  fs.closeSync(fd);
}

export function saveConfig(config, { side = 'claude' } = {}) {
  assertSide(side);
  const data = readAll();
  const idx = data.configs.findIndex(c => c.name === config.name);
  const nextSide = {
    endpoint: config.endpoint,
    apiKey: config.apiKey,
    models: config.models,
    defaultModel: config.defaultModel,
  };

  if (idx >= 0) {
    data.configs[idx] = {
      ...data.configs[idx],
      name: config.name,
      [side]: nextSide,
    };
  } else {
    data.configs.push({ name: config.name, [side]: nextSide });
  }

  writeAll(data);
}

export function loadConfig(name, { side = 'claude' } = {}) {
  assertSide(side);
  const data = readAll();
  const config = data.configs.find(c => c.name === name);
  if (!config) throw new Error(`Config "${name}" not found. Run 'cce help' to see available commands.`);
  if (!config[side]) throw new Error(`${side === 'opencode' ? 'OpenCode' : 'Claude Code'} config "${name}" not found.`);
  return { name: config.name, ...config[side] };
}

export function loadProvider(name) {
  const data = readAll();
  const config = data.configs.find(c => c.name === name);
  if (!config) throw new Error(`Config "${name}" not found. Run 'cce help' to see available commands.`);
  return config;
}

export function listConfigs() {
  return readAll().configs.sort((a, b) => a.name.localeCompare(b.name));
}

export function deleteConfig(name, { opencode = false } = {}) {
  const side = opencode ? 'opencode' : 'claude';
  const data = readAll();
  const idx = data.configs.findIndex(c => c.name === name);
  if (idx < 0 || !data.configs[idx][side]) {
    throw new Error(`${opencode ? 'OpenCode' : 'Claude Code'} config "${name}" not found.`);
  }

  const next = { ...data.configs[idx] };
  delete next[side];
  data.configs = next.claude || next.opencode
    ? data.configs.map((config, configIdx) => (configIdx === idx ? next : config))
    : data.configs.filter((_, configIdx) => configIdx !== idx);
  writeAll(data);
}

export function configExists(name, { side } = {}) {
  const config = readAll().configs.find(c => c.name === name);
  if (!config) return false;
  return side ? Boolean(config[side]) : true;
}
