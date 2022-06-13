<p style="text-align: center;">
    <a href="https://dex.sifchain.finance" target="_blank" rel="noopener noreferrer">
        <img src="https://raw.githubusercontent.com/Sifchain/.github/main/assets/Sifchain%20Logo.svg"/>
    </a>
</p>
<p style="text-align: center;">
⚡️ <b>T H E &nbsp;&nbsp; O M N I C H A I N &nbsp;&nbsp; J A V A S C R I P T &nbsp;&nbsp;  L I B R A R Y</b> ⚡️
</p>
<p style="text-align: center;">
  <b>FRONTEND 🤝 TRADING BOTS 🤝 ARBITRAGE</b>
</p>
<hr>

## ✨ Links

### 📖 [Documentation](/apps/docs/)

_Learn how to use Sifchain.js._

### 🖼 [Dex](/apps/dex/)

_Sifchain's User Interface_

## Development

| script                   | description                                                                                 |
| ------------------------ | ------------------------------------------------------------------------------------------- |
| `pnpm dev`               | Run the dex app in development mode                                                         |
| `pnpm build`             | Build a deployable app to the `apps/dex/.next` folder                                       |
| `pnpm test`              | Run unit and integration tests                                                              |
| `pnpm test --tag [tag]`  | Run unit and integration tests against a particular tag (develop/master/sifnode commit etc) |
| `pnpm stack`             | Run backing services based on the latest sifnode release                                    |
| `pnpm lint`              | Lint the code                                                                               |
| `pnpm lint --quick`      | Quick lint staged code (mainly used in our pre-commit hook)                                 |
| `pnpm e2e`               | Run end to end tests against code built in `app/dist`                                       |
| `pnpm e2e --debug`       | Run end to end tests in debug mode against the `dev` server. (Good for writing tests)       |
| `pnpm e2e --tag [tag]`   | Run end to end tests against a particular tag (develop/master/sifnode commit etc)           |
| `pnpm storybook`         | Launch storybook                                                                            |
| `pnpm storybook --build` | Build storybook to the `storybook-static` folder                                            |

Running a command with the `--help` flag will display a help message explaining what the command does.

## Deployment

See ./app/README.md.

## Testing against environments

Attaching a query string var `_env` will set cookies to point your build to any environment you want:

| url                                  | env                    |
| ------------------------------------ | ---------------------- |
| http://localhost:8080?\_env=mainnet  | MAINNET                |
| http://localhost:8080?\_env=testnet  | TESTNET                |
| http://localhost:8080?\_env=devnet   | DEVNET                 |
| http://localhost:8080?\_env=localnet | LOCALNET               |
| http://localhost:8080?\_env=\_       | DEFAULT (Based on url) |

We recommend using bookmarklets:

| name     | location                                                               |
| -------- | ---------------------------------------------------------------------- |
| CLEAR    | `javascript:(() => {l=location;l.href=l.pathname+'?_env=_'})()`        |
| MAINNET  | `javascript:(() => {l=location;l.href=l.pathname+'?_env=mainnet'})()`  |
| TESTNET  | `javascript:(() => {l=location;l.href=l.pathname+'?_env=testnet'})()`  |
| DEVNET   | `javascript:(() => {l=location;l.href=l.pathname+'?_env=devnet'})()`   |
| LOCALNET | `javascript:(() => {l=location;l.href=l.pathname+'?_env=localnet'})()` |
