# cce

Switch between multiple Claude Code configurations from the CLI.

Manage named configs with different endpoints, API keys, and models — then launch `claude` with the right environment in one command.

## Install

```bash
npm install -g @dattranx/cce
```

Or for local development:

```bash
git clone <repo-url> cce && cd cce
npm install
npm link
```

Requires Node.js >= 18 and Claude Code CLI installed.

## Quick Start

```bash
# Create a config
cce create
cce create glm

# Launch claude with that config
cce glm

# Add OpenCode settings for the same provider name
cce create --opencode

# Launch opencode with that config
cce glm --opencode

# Pass CLI flags through 
cce glm --dangerously-skip-permissions
cce glm --opencode --model glm-5.1

# Shorthands flags
cce glm -sp 
```

## Commands

### `cce create [name]`

Create or update a config. If `[name]` is provided, the name prompt is skipped. Interactive prompts for:

- **Name** — e.g. `claude`, `glm`
- **Endpoint URL** — e.g. `https://api.anthropic.com`
- **API Key** — hidden input
- **Models** — comma or space separated list
- **Default Model** — select from the list

Re-running `cce create` with an existing name updates that provider's Claude Code settings.

Use `cce create --opencode` to create or update OpenCode settings under the same provider name. `cce list` and `cce show <name>` display both sides together.

### `cce <name> [flags]`

Launch `claude` with the named config's Claude Code settings. All unknown flags pass through to `claude`.

```bash
cce glm
cce glm --name project-a --model glm-5.1
```

### `cce <name> --opencode [flags]`

Back up `~/.config/opencode/opencode.json` to `~/.config/opencode/opencode-backup.json`, update only top-level `provider` and `model`, then launch `opencode`. Project OpenCode config files are not read or written.

```bash
cce glm --opencode
cce glm --opencode --model glm-5.1
```

### `cce list`

Display all configs in a table:

```
  NAME    CLAUDE CODE MODEL  OPENCODE MODEL
  ------  -----------------  --------------
  glm     glm-5.0            glm-5.1
  claude  claude-opus-4-6    -
```

### `cce show <name>`

Display a config's Claude Code and OpenCode details (API keys masked):

```
  Config: work
  Claude Code:
    Endpoint:      https://api.anthropic.com
    API Key:       sk-a...xxxx
    Models:        claude-sonnet-4-6, claude-opus-4-6
    Default Model: claude-sonnet-4-6
  OpenCode:
    Endpoint:      https://api.z.ai/api/anthropic
    API Key:       sk-z...xxxx
    Models:        glm-5.1
    Default Model: glm-5.1
```

### `cce delete <name>`

Remove Claude Code settings. Prompts for confirmation. Use `cce delete <name> --opencode` to remove OpenCode settings. The provider entry is removed after both sides are deleted.

### `cce help`

Show a nicely formatted overview of all commands and flags:

```
cce — Switch between multiple Claude Code configurations

USAGE
  cce <command> [options]

COMMANDS
  create           Create or update a config interactively
  list             Display all saved configs in a table
  show <name>      Display details for a specific config
  delete <name>    Remove a config (asks for confirmation)
  <name> [flags]   Launch claude with the named config
  help             Show this help message

GLOBAL FLAGS
  --version  Show version number
  --help     Show help for a specific command

PASS-THROUGH FLAGS
  When running cce <name>, any extra flags are forwarded to claude:
  cce glm --chat --model glm-5.0

EXAMPLES
  cce create [name]   Create a new config
  cce list            Show all configs
  cce show work       Show details of "work" config
  cce delete work     Delete "work" config
  cce glm             Launch claude with "glm" config
  cce glm --model glm5.1      Launch claude with "glm" config + pass --model
```

## Config Storage

Configs are stored at `~/.cce/configs.json` with restrictive permissions:

- Directory: `~/.cce/` (mode `0o700`)
- File: `configs.json` (mode `0o600`)

Config schema:

```json
{
  "configs": [
    {
      "name": "glm",
      "claude": {
        "endpoint": "https://api.anthropic.com",
        "apiKey": "sk-ant-...",
        "models": ["claude-sonnet-4-6", "claude-opus-4-6"],
        "defaultModel": "claude-sonnet-4-6"
      },
      "opencode": {
        "endpoint": "https://api.z.ai/api/anthropic",
        "apiKey": "sk-z-...",
        "models": ["glm-5.1"],
        "defaultModel": "glm-5.1"
      }
    }
  ]
}
```

## How It Works

When you run `cce <name>`, the tool:

1. Loads Claude Code settings from `~/.cce/configs.json`
2. Sets environment variables: `ANTHROPIC_BASE_URL`, `ANTHROPIC_AUTH_TOKEN`, `ANTHROPIC_MODEL`
3. Spawns `claude` with your flags and the injected environment
4. Forwards claude's exit code

When you run `cce <name> --opencode`, the tool:

1. Loads OpenCode settings from `~/.cce/configs.json`
2. Backs up `~/.config/opencode/opencode.json` to `~/.config/opencode/opencode-backup.json` if it exists
3. Updates only top-level `provider` and `model` in `~/.config/opencode/opencode.json`
4. Spawns `opencode` with your remaining flags

## Environment Variables

| Variable | Source | Purpose |
|----------|--------|---------|
| `ANTHROPIC_BASE_URL` | `config.endpoint` | API endpoint |
| `ANTHROPIC_AUTH_TOKEN` | `config.apiKey` | Authentication |
| `ANTHROPIC_MODEL` | `config.defaultModel` | Default model |

## License

MIT
