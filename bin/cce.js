#!/usr/bin/env node
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Command } from 'commander';
import { registerCreate } from '../src/commands/create.js';
import { registerList } from '../src/commands/list.js';
import { registerShow } from '../src/commands/show.js';
import { registerDelete } from '../src/commands/delete.js';
import { registerEdit } from '../src/commands/edit.js';
import { registerRun } from '../src/commands/run.js';
import { registerHelp } from '../src/commands/help.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf-8'));

const program = new Command();

program
  .name('cce')
  .description('Switch between multiple Claude Code configurations')
  .version(pkg.version)
  .allowUnknownOption(true);

registerCreate(program);
registerList(program);
registerShow(program);
registerDelete(program);
registerEdit(program);
registerRun(program);
registerHelp(program);

program.parse();
