import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

const home = fs.mkdtempSync(path.join(os.tmpdir(), 'cce-opencode-test-'));
process.env.HOME = home;

const { OPENCODE_CONFIG_FILE, OPENCODE_BACKUP_FILE, writeOpenCodeGlobalConfig } = await import('../src/opencode-global-config.js');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

test('writes global OpenCode config and preserves unrelated settings', () => {
  fs.mkdirSync(path.dirname(OPENCODE_CONFIG_FILE), { recursive: true });
  const existing = {
    theme: 'dark',
    provider: {
      old: { name: 'old' },
    },
    model: 'old/model',
  };
  fs.writeFileSync(OPENCODE_CONFIG_FILE, JSON.stringify(existing, null, 2));

  writeOpenCodeGlobalConfig({
    name: 'glm',
    endpoint: 'https://api.example.com',
    apiKey: 'secret',
    models: ['glm-5.1', 'glm-5.2'],
    defaultModel: 'glm-5.1',
  });

  assert.deepEqual(readJson(OPENCODE_BACKUP_FILE), existing);

  const next = readJson(OPENCODE_CONFIG_FILE);
  assert.equal(next.theme, 'dark');
  assert.equal(next.model, 'glm/glm-5.1');
  assert.deepEqual(next.provider.old, { name: 'old' });
  assert.equal(next.provider.glm.npm, '@ai-sdk/openai-compatible');
  assert.equal(next.provider.glm.options.baseURL, 'https://api.example.com');
  assert.equal(next.provider.glm.options.apiKey, 'secret');
  assert.deepEqual(Object.keys(next.provider.glm.models), ['glm-5.1', 'glm-5.2']);
});
