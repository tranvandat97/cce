import * as p from '@clack/prompts';
import { loadConfig, saveConfig } from '../config.js';

export function registerEdit(program) {
  program
    .command('edit <name>')
    .description('Edit an existing config')
    .action(async (name) => {
      try {
        const config = loadConfig(name);
        const endpoint = await p.text({
          message: 'Endpoint URL',
          initialValue: config.endpoint,
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

        saveConfig({
          ...config,
          endpoint: endpoint.trim().replace(/\/+$/, ''),
          apiKey: apiKey.trim(),
        });

        p.log.success(`Config "${config.name}" updated`);
      } catch (err) {
        p.log.error(err.message);
        process.exit(1);
      }
    });
}
