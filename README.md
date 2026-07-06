# Chief Fashion Boutique

E-commerce storefront for **Chief Fashion House** — African-inspired bespoke tailoring, based at 102 Helen Joseph Street, Johannesburg CBD, South Africa.

## Stack

- [Vite](https://vitejs.dev/) + React 18 + TypeScript
- Tailwind CSS + [shadcn/ui](https://ui.shadcn.com/)
- [Supabase](https://supabase.com/) — products, orders, auth, contact messages (schema in `supabase/migrations/`)
- [Ozow](https://ozow.com/) — instant EFT payments (ZAR)
- Zustand (cart state) + TanStack Query (data fetching)

## Business rules baked into the site

- Delivery nationwide by **The Courier Guy**: R100 flat, free for orders ≥ R1500
- Production lead times: standard dresses 5–7 working days, Umbaco 7–10
- Returns within 15 days for exchange or store credit only (no cash refunds)
- Policy pages: `/shipping`, `/refund-policy`, `/terms`, `/privacy-policy`, `/faq`, `/size-guide`

## Getting started

```sh
npm install
cp .env.example .env   # then fill in real values
npm run dev            # http://localhost:8080
```

## Scripts

| Command         | Purpose                       |
| --------------- | ----------------------------- |
| `npm run dev`   | Dev server (port 8080)        |
| `npm run build` | Production build to `dist/`   |
| `npm run lint`  | ESLint                        |

## Environment

See [.env.example](.env.example). `VITE_OZOW_IS_TEST` must be set to `false` for live payments (test mode charges R0.01).

## Known security TODOs (before production)

1. **Ozow hash is generated client-side** — `VITE_OZOW_SECRET_KEY` ships in the JS bundle. Move hash generation to a Supabase Edge Function and remove the secret from the frontend env.
2. **No Ozow `NotifyUrl` webhook** — orders remain `pending` and payment success is only inferred from the browser redirect. The same edge function should verify payment notifications server-side and mark orders `paid`.
