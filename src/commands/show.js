import * as p from '@clack/prompts';
import { loadConfig } from '../config.js';
import { maskKey } from '../utils.js';

export function registerShow(program) {
  program
    .command('show <name>')
    .description('Display config details')
    .action((name) => {
      try {
        const config = loadConfig(name);
        console.log();
        p.log.step(`Config: ${config.name}`);
        console.log(`  Endpoint:      ${config.endpoint}`);
        console.log(`  API Key:       ${maskKey(config.apiKey)}`);
        console.log(`  Models:        ${config.models.join(', ')}`);
        console.log(`  Default Model: ${config.defaultModel}`);
        console.log();
      } catch (err) {
        p.log.error(err.message);
        process.exit(1);
      }
    });
}
