# Northline

A library of tasks you can run again. The shared library is the `library/` folder in this repo. Deploy it on Cloudflare Workers without a database.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/jakehenak/northline)

## Deploy

```bash
npm install
npx wrangler login
npm run deploy
npx wrangler secret put GITHUB_TOKEN
npx wrangler secret put XAI_API_KEY
```

`GITHUB_TOKEN` needs contents read and write on this repo. `XAI_API_KEY` is the Grok key. ChatGPT and other OpenAI-compatible providers use a key the visitor types in the browser.

Forks should change `GITHUB_REPOSITORY` in [wrangler.jsonc](wrangler.jsonc) before publishing tasks. The worker reads `library/*.json` from that repo, and Publish commits a new file there. Drafts stay in the browser until then. Templates in `library/` are not overwritten.

Local secrets for `wrangler dev` go in `.dev.vars` (see `.dev.vars.example`). Do not commit that file.

## What a task is

A task names what it can do, what it supports, what it needs, a trigger (`manual` or `input`), inputs, outputs, an error step, and a script. Clock and webhook triggers can be written down, but this desk does not arm them.

Checked skills run as headless nodes and pass notes forward.

Providers:

- **Grok** uses `XAI_API_KEY` on the worker. It can search the web, read X, and run code.
- **ChatGPT** uses an OpenAI key that stays in the browser.
- **Compatible** is any public HTTPS server that speaks OpenAI chat completions.

## Run locally

```bash
npm install
npm run dev
```

`npm run typecheck` checks types. Do not commit API keys.
