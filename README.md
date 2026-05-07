# cce

Switch between multiple Claude Code configurations from the CLI.

Manage named configs with different endpoints, API keys, and models — then launch `claude` with the right environment in one command.

## Install

```bash
npm install -g cce
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
cce init

# Launch claude with that config
cce glm

# Pass any claude flags through
cce glm --chat --model glm-5.0
```

## Commands

### `cce init`

Create or update a config. Interactive prompts for:

- **Name** — e.g. `claude`, `glm`
- **Endpoint URL** — e.g. `https://api.anthropic.com`
- **API Key** — hidden input
- **Models** — comma or space separated list
- **Default Model** — select from the list

Re-running `cce init` with an existing name updates that config.

### `cce <name> [flags]`

Launch `claude` with the named config's environment variables. All unknown flags pass through to `claude`.

```bash
cce glm
cce glm --chat
```

### `cce list`

Display all configs in a table:

```
  NAME     ENDPOINT                         DEFAULT MODEL
  ------   ---------------------------      --------------
  glm        https://api.z.ai/api/anthropic   glm-5.0
  claude     https://api.anthropic.com        claude-opus-4-6
```

### `cce show <name>`

Display a config's details (API key masked):

```
  Config: work
    Endpoint:      https://api.anthropic.com
    API Key:       sk-a...xxxx
    Models:        claude-sonnet-4-6, claude-opus-4-6
    Default Model: claude-sonnet-4-6
```

### `cce delete <name>`

Remove a config. Prompts for confirmation.

## Config Storage

Configs are stored at `~/.cce/configs.json` with restrictive permissions:

- Directory: `~/.cce/` (mode `0o700`)
- File: `configs.json` (mode `0o600`)

Config schema:

```json
{
  "configs": [
    {
      "name": "claude",
      "endpoint": "https://api.anthropic.com",
      "apiKey": "sk-ant-...",
      "models": ["claude-sonnet-4-6", "claude-opus-4-6"],
      "defaultModel": "claude-sonnet-4-6"
    }
  ]
}
```

## How It Works

When you run `cce <name>`, the tool:

1. Loads the config from `~/.cce/configs.json`
2. Sets environment variables: `ANTHROPIC_BASE_URL`, `ANTHROPIC_AUTH_TOKEN`, `ANTHROPIC_MODEL`
3. Spawns `claude` with your flags and the injected environment
4. Forwards claude's exit code

## Environment Variables

| Variable | Source | Purpose |
|----------|--------|---------|
| `ANTHROPIC_BASE_URL` | `config.endpoint` | API endpoint |
| `ANTHROPIC_AUTH_TOKEN` | `config.apiKey` | Authentication |
| `ANTHROPIC_MODEL` | `config.defaultModel` | Default model |

## License

MIT
