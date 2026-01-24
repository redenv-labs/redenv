# Redenv CLI

A command-line interface for the Redenv Secret Management System.

**For a detailed overview of the project's architecture, security model, and philosophy, please see the main [README.md](https://github.com/PRASSamin/redenv/blob/main/README.md) at the root of this repository.**

---

## Installation

To install the Redenv CLI globally on your system, use your preferred package manager.

```bash
# With npm
npm install -g @redenv/cli

# With pnpm
pnpm add -g @redenv/cli

# With yarn
yarn global add @redenv/cli

# With bun
bun add -g @redenv/cli
```

## Quick Start

Follow these steps to get started with your first project.

### 1. Setup Redenv

First, you need to connect the CLI to your Upstash Redis database.

Run the setup command:

```bash
redenv setup
```

You will be prompted to enter your Redis URL and Token.

### 2. Register a New Project

Navigate to your local project directory and register it with Redenv. This will create a new, encrypted project.

```bash
redenv register my-first-project
```

You will be prompted to create a strong **Master Password** for this project. Do not lose this password, as it cannot be recovered.

### 3. Add a Secret

Add your first secret to the `development` environment (the default).

```bash
redenv add DATABASE_URL "postgresql://user:pass@host:port/db"
```

You will be prompted for your Master Password to authorize this action. You can then choose to save the unlocked key to your OS keychain for a passwordless workflow in the future.

### 4. View a Secret

You can now view your secret at any time.

```bash
redenv view DATABASE_URL
```

## Configuration

Redenv supports modern, dynamic configuration files (`redenv.config.ts`, `redenv.config.js`, etc.), giving you full control over your project setup. This approach allows for scripted configuration and, most importantly, the ability to **extend the CLI**.

When creating a new project, Redenv will automatically generate a `redenv.config.ts` file for you.

```typescript
import { defineConfig } from "@redenv/core";

export default defineConfig({
  name: "my-project",
  environment: "development",
});
```

## Extending Redenv (Plugins)

Redenv is built to be extensible. We believe that a tool becomes truly powerful when the community can mold it to their needs. The plugin architecture allows **anyone** to create extensions that add new commands, integrations, or workflows directly into the Redenv CLI.

### Using Plugins

To use a plugin, simply install it and add it to your configuration file. This allows you to instantly enrich your CLI with new features.

```typescript
import { defineConfig } from "@redenv/core";
import { studioPlugin } from "@redenv/studio";

export default defineConfig({
  name: "my-project",
  plugins: [studioPlugin],
});
```

## Secret References

Redenv supports recursive variable referencing, allowing you to reduce duplication in your configuration.

Use the `${VAR_NAME}` syntax to reference other secrets within the same environment.

```bash
# Example
redenv add BASE_URL "https://api.example.com"
redenv add API_ENDPOINT "${BASE_URL}/v1"
```

When you view or export `API_ENDPOINT`, it will automatically resolve to `https://api.example.com/v1`.

- **Recursion:** References can be nested (A -> B -> C).
- **Escaping:** Use `\${VAR}` to treat it as a literal string.
- **Validation:** The CLI validates references when adding or editing secrets.

### Building Plugins

We encourage you to build and share your own plugins! Whether it's a specific deployment workflow, a linter for secret values, or an integration with a third-party service, you can make Redenv more feature-rich for everyone.

Plugins are simple to write using the `RedenvPlugin` interface from `@redenv/core`. If you build something useful, consider publishing it to npm with the keyword `redenv-plugin`.

## Commands

Redenv offers a full suite of commands for managing your secrets. For detailed options on any command, run `redenv <command> --help`.

Any installed plugins will also appear in the help menu and can be run just like native commands (e.g., `redenv <plugin-command>`).

#### Interactive Shell

- `shell`: Launches an interactive REPL (Read-Eval-Print Loop) for a project environment, allowing you to run multiple commands without re-authenticating or re-specifying project/environment.

#### Core Commands

- `add`: Add a new secret (supports references).
- `edit`: Edit an existing secret (pre-filled with current value).
- `view`: View a secret's value (shows both raw and resolved values).
- `list`: List all secrets (shows resolved values in a tree view).
- `remove`: Remove secrets.

#### Project Management

- `register`
- `drop`
- `switch`

#### Advanced Workflows

- `import`
- `export`: Export secrets to `.env` or JSON (supports `--raw` to skip expansion).
- `clone`
- `diff`
- `sync`

#### Auditing & History

- `history`
  - `history view [key]`
  - `history limit [value]`
- `rollback <key>`

#### Security & Safety

- `change-password`
- `backup`
- `restore`
- `doctor`
- `logout`

#### Application Access

- `token`
  - `token create`
  - `token list`
  - `token revoke`
