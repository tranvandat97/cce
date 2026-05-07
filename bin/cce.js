#!/usr/bin/env node
import { Command } from 'commander';
import { registerInit } from '../src/commands/init.js';
import { registerList } from '../src/commands/list.js';
import { registerShow } from '../src/commands/show.js';
import { registerDelete } from '../src/commands/delete.js';
import { registerRun } from '../src/commands/run.js';

const program = new Command();

program
  .name('cce')
  .description('Switch between multiple Claude Code configurations')
  .version('0.1.0')
  .allowUnknownOption(true);

registerInit(program);
registerList(program);
registerShow(program);
registerDelete(program);
registerRun(program);

program.parse();
