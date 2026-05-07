import * as p from '@clack/prompts';
import { deleteConfig } from '../config.js';

export function registerDelete(program) {
  program
    .command('delete <name>')
    .description('Remove a config')
    .action(async (name) => {
      try {
        const confirmed = await p.confirm({
          message: `Delete config "${name}"?`,
          initialValue: false,
        });
        if (p.isCancel(confirmed) || !confirmed) {
          p.log.info('Cancelled');
          return;
        }

        deleteConfig(name);
        p.log.success(`Config "${name}" deleted`);
      } catch (err) {
        p.log.error(err.message);
        process.exit(1);
      }
    });
}
