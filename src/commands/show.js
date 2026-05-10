import * as p from '@clack/prompts';
import { loadProvider } from '../config.js';
import { maskKey } from '../utils.js';

function printSection(label, config) {
  if (!config) {
    console.log(`  ${label}: not configured`);
    return;
  }

  console.log(`  ${label}:`);
  console.log(`    Endpoint:      ${config.endpoint}`);
  console.log(`    API Key:       ${maskKey(config.apiKey)}`);
  console.log(`    Models:        ${config.models.join(', ')}`);
  console.log(`    Default Model: ${config.defaultModel}`);
}

export function registerShow(program) {
  program
    .command('show <name>')
    .description('Display config details')
    .action((name) => {
      try {
        const config = loadProvider(name);
        console.log();
        p.log.step(`Config: ${config.name}`);
        printSection('Claude Code', config.claude);
        printSection('OpenCode', config.opencode);
        console.log();
      } catch (err) {
        p.log.error(err.message);
        process.exit(1);
      }
    });
}
