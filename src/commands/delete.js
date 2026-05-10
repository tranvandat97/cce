import * as p from '@clack/prompts';
import { deleteConfig } from '../config.js';

export function registerDelete(program) {
  program
    .command('delete <name>')
    .description('Remove a config')
    .option('--opencode', 'Delete OpenCode settings')
    .action(async (name, options) => {
      const label = options.opencode ? 'OpenCode' : 'Claude Code';

      try {
        const confirmed = await p.confirm({
          message: `Delete ${label} config "${name}"?`,
          initialValue: false,
        });
        if (p.isCancel(confirmed) || !confirmed) {
          p.log.info('Cancelled');
          return;
        }

        deleteConfig(name, { opencode: options.opencode });
        p.log.success(`${label} config "${name}" deleted`);
      } catch (err) {
        p.log.error(err.message);
        process.exit(1);
      }
    });
}
