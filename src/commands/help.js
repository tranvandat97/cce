const B = '\x1b[1m';
const DIM = '\x1b[2m';
const CYAN = '\x1b[36m';
const GRAY = '\x1b[90m';
const RESET = '\x1b[0m';

function pad(text, width) {
  return String(text).padEnd(width);
}

export function registerHelp(program) {
  program
    .command('help')
    .description('Show help for all commands')
    .action(() => {
      const cmds = [
        { name: 'create', desc: 'Create or update a config interactively' },
        { name: 'list', desc: 'Display all saved configs in a table' },
        { name: 'show <name>', desc: 'Display details for a specific config' },
        { name: 'delete <name>', desc: 'Remove a config (asks for confirmation)' },
        { name: '<name> [flags]', desc: 'Launch claude with the named config' },
        { name: 'help', desc: 'Show this help message' },
      ];
      const nameW = Math.max(4, ...cmds.map(c => c.name.length));

      console.log();
      console.log(`${B}cce${RESET} — Switch between multiple Claude Code configurations`);
      console.log();
      console.log(`${B}USAGE${RESET}`);
      console.log(`  cce <command> [options]`);
      console.log();
      console.log(`${B}COMMANDS${RESET}`);
      for (const c of cmds) {
        console.log(`  ${CYAN}${pad(c.name, nameW)}${RESET}  ${c.desc}`);
      }
      console.log();
      console.log(`${B}GLOBAL FLAGS${RESET}`);
      console.log(`  ${GRAY}--version${RESET}  Show version number`);
      console.log(`  ${GRAY}--help${RESET}     Show help for a specific command`);
      console.log();
      console.log(`${B}PASS-THROUGH FLAGS${RESET}`);
      console.log(`  When running ${CYAN}cce <name>${RESET}, any extra flags are forwarded to claude:`);
      console.log(`  ${GRAY}cce glm --chat --model glm-5.0${RESET}`);
      console.log();
      console.log(`${B}EXAMPLES${RESET}`);
      console.log(`  ${GRAY}cce create${RESET}          Create a new config`);
      console.log(`  ${GRAY}cce list${RESET}            Show all configs`);
      console.log(`  ${GRAY}cce show work${RESET}       Show details of "work" config`);
      console.log(`  ${GRAY}cce delete work${RESET}     Delete "work" config`);
      console.log(`  ${GRAY}cce glm${RESET}             Launch claude with "glm" config`);
      console.log(`  ${GRAY}cce glm --chat${RESET}      Launch claude with "glm" config + pass --chat`);
      console.log();
    });
}
