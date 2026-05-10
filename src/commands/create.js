import * as p from '@clack/prompts';
import { saveConfig, configExists } from '../config.js';

export function registerCreate(program) {
  program
    .command('create [name]')
    .description('Create or update a config')
    .option('--opencode', 'Create or update OpenCode settings')
    .action(async (providedName, options) => {
      const s = p.spinner();

      const name = providedName || await p.text({
        message: 'Config name',
        placeholder: 'e.g, claude, glm',
        validate: v => (!v || !v.trim() ? 'Name is required' : undefined),
      });
      if (p.isCancel(name)) { p.cancel('Cancelled'); return; }

      const endpoint = await p.text({
        message: 'Endpoint URL',
        placeholder: 'https://api.anthropic.com',
        validate: v => {
          if (!v || !v.trim()) return 'Endpoint is required';
          try { new URL(v.trim()); } catch { return 'Must be a valid URL'; }
          return undefined;
        },
      });
      if (p.isCancel(endpoint)) { p.cancel('Cancelled'); return; }

      const apiKey = await p.password({
        message: 'API Key',
        validate: v => (!v || !v.trim() ? 'API Key is required' : undefined),
      });
      if (p.isCancel(apiKey)) { p.cancel('Cancelled'); return; }

      const modelsInput = await p.text({
        message: 'Models (comma or space separated)',
        placeholder: 'claude-sonnet-4-6, claude-opus-4-6',
        validate: v => (!v || !v.trim() ? 'At least one model is required' : undefined),
      });
      if (p.isCancel(modelsInput)) { p.cancel('Cancelled'); return; }

      const models = modelsInput.split(/[,\s]+/).map(m => m.trim()).filter(Boolean);
      if (models.length === 0) {
        p.log.error('No valid models provided');
        return;
      }

      const defaultModel = await p.select({
        message: 'Default model',
        options: models.map(m => ({ value: m, label: m })),
      });
      if (p.isCancel(defaultModel)) { p.cancel('Cancelled'); return; }

      const config = {
        name: name.trim(),
        endpoint: endpoint.trim().replace(/\/+$/, ''),
        apiKey: apiKey.trim(),
        models,
        defaultModel,
      };

      const side = options.opencode ? 'opencode' : 'claude';
      const label = options.opencode ? 'OpenCode' : 'Claude Code';
      const existed = configExists(config.name, { side });
      saveConfig(config, { side });

      s.start(existed ? `Updating ${label} config...` : `Saving ${label} config...`);
      s.stop(existed ? `${label} config "${config.name}" updated` : `${label} config "${config.name}" created`);
    });
}
