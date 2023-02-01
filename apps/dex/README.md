# Dex

Sifchain dex/margin app

## Getting started

- Create a `.env` file under [`<root>/apps/dex`](/apps/dex/) with the environment variables as seen in [`.env.example`](.env.example)

- run the application: `pnpm dev`

## Deployment

This application is deployed through [`vercel`](https://vercel.com) upon commits being pushed to key branches:

- `main` - integration branch, all feature branches are created from `main` and merged back to `main`. This will start a deployment to https://sifchain-dex.vercel.app

- `env/margin-staging` - merging `main` into `env/margin-staging` will start a deployment to https://sifchain-margin-staging.vercel.app

- `env/margin-production` - merging `main` into `env/margin-staging` will start a deployment to https://sifchain-margin.vercel.app
