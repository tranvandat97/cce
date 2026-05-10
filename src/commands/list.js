import * as p from '@clack/prompts';
import { listConfigs } from '../config.js';

function modelFor(config, side) {
  return config[side]?.defaultModel || '-';
}

export function registerList(program) {
  program
    .command('list')
    .description('Show all configs')
    .action(() => {
      const configs = listConfigs();

      if (configs.length === 0) {
        p.log.info("No configs found. Run 'cce create' to create one.");
        return;
      }

      const nameW = Math.max(4, ...configs.map(c => c.name.length));
      const claudeW = Math.max(17, ...configs.map(c => modelFor(c, 'claude').length));
      const opencodeW = Math.max(14, ...configs.map(c => modelFor(c, 'opencode').length));

      const header = `  ${'NAME'.padEnd(nameW)}  ${'CLAUDE CODE MODEL'.padEnd(claudeW)}  ${'OPENCODE MODEL'.padEnd(opencodeW)}`;
      const sep = `  ${'-'.repeat(nameW)}  ${'-'.repeat(claudeW)}  ${'-'.repeat(opencodeW)}`;
      const rows = configs.map(c =>
        `  ${c.name.padEnd(nameW)}  ${modelFor(c, 'claude').padEnd(claudeW)}  ${modelFor(c, 'opencode')}`
      );

      console.log('\n' + header);
      console.log(sep);
      rows.forEach(r => console.log(r));
      console.log();
    });
}
