# AllWrapt

Secret Santa for family and friends — draw names, keep matches private, share personal reveal links (and optionally email them with Resend).

## Stack

- Cloudflare Pages (static UI in `public/`)
- Pages Functions (`functions/`) for the API
- Cloudflare KV (`EVENTS`) for event storage
- Resend for optional email delivery

## Local-only folder

`_local/` is for plans and design boards on this machine only. It is gitignored and outside `public/`, so it is never committed or deployed.

## Setup

1. **Install**

   ```bash
   npm install
   ```

2. **KV namespace**

   ```bash
   npx wrangler kv namespace create EVENTS
   npx wrangler kv namespace create EVENTS --preview
   ```

   Put the returned ids into `wrangler.toml` (`id` and `preview_id`).

3. **Resend (optional until you want email)**

   - Create an API key in Resend
   - Copy `.dev.vars.example` → `.dev.vars` and fill `RESEND_API_KEY` / `RESEND_FROM`
   - For production: set the same values as Pages secrets

   Until Resend is configured, Copy link / WhatsApp / mailto still work.

4. **Dev server**

   ```bash
   npm run dev
   ```

5. **Deploy**

   - Push to GitHub and connect the repo to Cloudflare Pages, **or**
   - `npm run deploy` (after Wrangler login)

   Bind the `EVENTS` KV namespace in the Pages project settings, and set secrets:

   - `RESEND_API_KEY`
   - `RESEND_FROM`

6. **Custom domain**

   Optional — attach whenever you have one. Until then, use the `*.pages.dev` URL. Do not hardcode a domain in the app.

## How it works

1. Anyone hits **Start a draw** → gets a secret `/manage/?e=…&t=…` link (bookmark it; it is the password).
2. Add people (optional emails), exclusion rules, budget/note.
3. **Draw names** once (no re-draw in this version).
4. Share each person’s `/reveal/?t=…` link, or email everyone who has an address.
5. Recipients tap to reveal who they are buying for.

Assignments live in KV. Reveal URLs are random tokens — the match is never encoded in the link itself.

## Before first push

Confirm `_local/` does not appear in `git status`.
