import * as p from '@clack/prompts';
import { listConfigs } from '../config.js';

export function registerList(program) {
  program
    .command('list')
    .description('Show all configs')
    .action(() => {
      const configs = listConfigs();

      if (configs.length === 0) {
        p.log.info("No configs found. Run 'cce init' to create one.");
        return;
      }

      // Calculate column widths
      const nameW = Math.max(4, ...configs.map(c => c.name.length));
      const endpointW = Math.max(8, ...configs.map(c => c.endpoint.length));
      const modelW = Math.max(13, ...configs.map(c => c.defaultModel.length));

      const header = `  ${'NAME'.padEnd(nameW)}  ${'ENDPOINT'.padEnd(endpointW)}  ${'DEFAULT MODEL'.padEnd(modelW)}`;
      const sep = `  ${'-'.repeat(nameW)}  ${'-'.repeat(endpointW)}  ${'-'.repeat(modelW)}`;
      const rows = configs.map(c =>
        `  ${c.name.padEnd(nameW)}  ${c.endpoint.padEnd(endpointW)}  ${c.defaultModel}`
      );

      console.log('\n' + header);
      console.log(sep);
      rows.forEach(r => console.log(r));
      console.log();
    });
}
