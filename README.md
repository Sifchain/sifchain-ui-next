
<p align="center">
    <a href="https://dex.sifchain.finance" target="_blank" rel="noopener noreferrer">
        <img src="https://raw.githubusercontent.com/Sifchain/.github/main/assets/Sifchain%20Logo.svg"/>
    </a>
</p>
<p align="center">
⚡️ <b>T H E &nbsp;&nbsp; O M N I C H A I N &nbsp;&nbsp; J A V A S C R I P T &nbsp;&nbsp;  L I B R A R Y</b> ⚡️
</p>
<p align="center">
  <b>FRONTEND 🤝 TRADING BOTS 🤝 ARBITRAGE</b>
</p>
<hr>

## ✨ Links

### 📖 [Documentation](/apps/docs/)

_Learn how to use Sifchain.js._

### 🖼 [Dex](/apps/dex/)

_Sifchain's User Interface_

## Development

This monorepo is powered by [pnpm](https://pnpm.io/) and [turborepo](https://turborepo.org/docs)

| script                 | description                                           |
| ---------------------- | ----------------------------------------------------- |
| `pnpm dev`             | Run the dex app in development mode                   |
| `pnpm build`           | Build a deployable app to the `apps/dex/.next` folder |
| `pnpm test`            | Run unit and integration tests                        |
| `pnpm e2e`             | Run end to end tests against code built in `apps/dex` |
| `pnpm storybook`       | Launch storybook                                      |
| `pnpm build-storybook` | Build storybook to the `storybook-static` folder      |

Running a command with the `--help` flag will display a help message explaining what the command does.

## Deployment

See [here](/apps/dex/README.md)

## Testing against environments

Attaching a query string var `_env` will set cookies to point your build to any environment you want:

| url                                  | env      |
| ------------------------------------ | -------- |
| http://localhost:3000?\_env=mainnet  | MAINNET  |
| http://localhost:3000?\_env=testnet  | TESTNET  |
| http://localhost:3000?\_env=devnet   | DEVNET   |
| http://localhost:3000?\_env=localnet | LOCALNET |
