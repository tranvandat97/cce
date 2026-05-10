import assert from 'node:assert/strict';
import test from 'node:test';
import { registerCreate } from '../src/commands/create.js';

function createProgram() {
  const command = {
    description() { return this; },
    option() { return this; },
    action(fn) { this.actionFn = fn; return this; },
  };

  return {
    command(pattern) {
      command.pattern = pattern;
      return command;
    },
    commandConfig: command,
  };
}

test('create command accepts optional profile name argument', () => {
  const program = createProgram();

  registerCreate(program);

  assert.equal(program.commandConfig.pattern, 'create [name]');
  assert.equal(program.commandConfig.actionFn.length, 2);
});
