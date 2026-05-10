import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

const home = fs.mkdtempSync(path.join(os.tmpdir(), 'cce-config-test-'));
process.env.HOME = home;

const { readAll, saveConfig, loadConfig, deleteConfig, listConfigs } = await import('../src/config.js');
const configFile = path.join(home, '.cce', 'configs.json');

function resetConfig(data) {
  fs.rmSync(path.join(home, '.cce'), { recursive: true, force: true });
  if (data) {
    fs.mkdirSync(path.dirname(configFile), { recursive: true });
    fs.writeFileSync(configFile, JSON.stringify(data, null, 2));
  }
}

test('normalizes legacy Claude config records', () => {
  resetConfig({
    configs: [{
      name: 'glm',
      endpoint: 'https://api.example.com',
      apiKey: 'secret',
      models: ['m1'],
      defaultModel: 'm1',
    }],
  });

  assert.deepEqual(readAll().configs, [{
    name: 'glm',
    claude: {
      endpoint: 'https://api.example.com',
      apiKey: 'secret',
      models: ['m1'],
      defaultModel: 'm1',
    },
  }]);
});

test('saves Claude Code and OpenCode settings under one provider', () => {
  resetConfig();

  saveConfig({ name: 'glm', endpoint: 'https://claude.example.com', apiKey: 'ck', models: ['c1'], defaultModel: 'c1' });
  saveConfig({ name: 'glm', endpoint: 'https://open.example.com', apiKey: 'ok', models: ['o1'], defaultModel: 'o1' }, { side: 'opencode' });

  assert.equal(listConfigs().length, 1);
  assert.equal(loadConfig('glm').endpoint, 'https://claude.example.com');
  assert.equal(loadConfig('glm', { side: 'opencode' }).endpoint, 'https://open.example.com');
});

test('deletes only the selected provider side', () => {
  resetConfig();
  saveConfig({ name: 'glm', endpoint: 'https://claude.example.com', apiKey: 'ck', models: ['c1'], defaultModel: 'c1' });
  saveConfig({ name: 'glm', endpoint: 'https://open.example.com', apiKey: 'ok', models: ['o1'], defaultModel: 'o1' }, { side: 'opencode' });

  deleteConfig('glm');
  assert.throws(() => loadConfig('glm'), /Claude Code config/);
  assert.equal(loadConfig('glm', { side: 'opencode' }).defaultModel, 'o1');

  deleteConfig('glm', { opencode: true });
  assert.deepEqual(listConfigs(), []);
});
