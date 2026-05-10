const B = '\x1b[1m';
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
        { name: 'create', desc: 'Create or update Claude Code settings' },
        { name: 'create --opencode', desc: 'Create or update OpenCode settings' },
        { name: 'list', desc: 'Display all saved configs in a table' },
        { name: 'show <name>', desc: 'Display Claude Code and OpenCode settings' },
        { name: 'delete <name>', desc: 'Remove Claude Code settings' },
        { name: 'delete <name> --opencode', desc: 'Remove OpenCode settings' },
        { name: '<name> [flags]', desc: 'Launch claude with the named config' },
        { name: '<name> --opencode [flags]', desc: 'Update global OpenCode config and launch opencode' },
        { name: 'help', desc: 'Show this help message' },
      ];
      const nameW = Math.max(4, ...cmds.map(c => c.name.length));

      console.log();
      console.log(`${B}cce${RESET} — Switch between Claude Code and OpenCode configurations`);
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
      console.log(`${B}OPENCODE${RESET}`);
      console.log(`  ${CYAN}--opencode${RESET} selects OpenCode for create, delete, and direct launch.`);
      console.log(`  ${CYAN}list${RESET} and ${CYAN}show${RESET} include both Claude Code and OpenCode settings.`);
      console.log(`  OpenCode launch only updates ${GRAY}~/.config/opencode/opencode.json${RESET}.`);
      console.log();
      console.log(`${B}PASS-THROUGH FLAGS${RESET}`);
      console.log(`  Extra flags are forwarded to the selected CLI:`);
      console.log(`  ${GRAY}cce glm --name demo --model glm-5.0${RESET}`);
      console.log(`  ${GRAY}cce glm --opencode --model glm-5.1${RESET}`);
      console.log();
      console.log(`${B}EXAMPLES${RESET}`);
      console.log(`  ${GRAY}cce create${RESET}                     Create Claude Code settings`);
      console.log(`  ${GRAY}cce create --opencode${RESET}          Create OpenCode settings`);
      console.log(`  ${GRAY}cce list${RESET}                       Show all configs`);
      console.log(`  ${GRAY}cce show work${RESET}                  Show both sides for "work"`);
      console.log(`  ${GRAY}cce delete work${RESET}                Delete Claude Code settings`);
      console.log(`  ${GRAY}cce delete work --opencode${RESET}     Delete OpenCode settings`);
      console.log(`  ${GRAY}cce glm${RESET}                        Launch claude with "glm"`);
      console.log(`  ${GRAY}cce glm --opencode${RESET}             Launch opencode with "glm"`);
      console.log();
    });
}
