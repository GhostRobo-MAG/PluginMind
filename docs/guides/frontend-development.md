# 🎨 Frontend Development Guide

PluginMind’s frontend is built with **Next.js 14 (App Router)**, **TypeScript**, and **NextAuth**. This guide helps you extend it without breaking the secure proxy flow.

---

## 🧱 Project Layout

```text
frontend/
├── src/
│   ├── app/
│   │   ├── (landing)/page.tsx         # Marketing landing page
│   │   ├── layout.tsx                 # Root layout
│   │   ├── api/proxy/[...path]/route.ts  # Secure proxy to FastAPI
│   │   └── auth/                      # Sign-in/out routes
│   ├── auth.ts                        # NextAuth configuration
│   ├── components/                    # UI primitives & sections
│   ├── hooks/                         # Custom React hooks
│   ├── services/                      # Client-side helpers
│   └── data/                          # Static content for landing
└── package.json
```

---

## 🔐 NextAuth Configuration (`src/auth.ts`)

- Google provider only (GitHub scaffolding is present but optional).
- Secure mode controlled via `NEXT_PUBLIC_SECURE_TOKENS`.
- JWT callback stores Google tokens **server-side**.
- Session callback exposes `session.hasToken` when secure mode is enabled.

```ts
export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 3600 },
  providers: [ GoogleProvider({ clientId, clientSecret, ... }) ],
  callbacks: {
    async jwt({ token, account }) { /* store provider tokens server-side */ },
    async session({ session, token }) {
      if (process.env.NEXT_PUBLIC_SECURE_TOKENS === 'true') {
        session.hasToken = !!token.googleIdToken
      } else {
        session.googleIdToken = token.googleIdToken
      }
      return session
    }
  }
}
```

---

## 🛰️ Proxy Route (`app/api/proxy/[...path]/route.ts`)

- Runs on the Node.js runtime.
- Injects `id_token` when forwarding `POST /auth/google`.
- Forwards cookies and selected headers to the FastAPI backend.
- Retries against `BACKEND_ALT_URL` if the primary backend is unreachable.

Key snippet:
```ts
if (path === 'auth/google') {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  const body = JSON.stringify({ ...(originalBody ?? {}), id_token: token.googleIdToken })
  // forward to backend without adding Authorization header
}
```

When calling API routes from the frontend, use the proxy:
```ts
await fetch('/api/proxy/process', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ user_input: text, analysis_type: 'document' })
})
```

---

## 🪝 Useful Hooks & Services

| File | Purpose |
|------|---------|
| `hooks/useAuth.ts` | Wraps NextAuth session and the `hasToken` flag. |
| `services/api.service.ts` | Centralised fetch helper that hits the proxy with credentials included. |
| `services/ai.service.ts` | Frontend helper for calling `/process` and `/services`. |

When building new pages, import these utilities instead of rolling custom fetch logic.

---

## 🧪 Frontend Testing Tips

- Use [Playwright](https://playwright.dev/) (already listed in devDependencies) for E2E flows.
- For unit tests, `react-testing-library` works well with the existing component pattern.
- Mock `next-auth/react` in tests to simulate authenticated states.

Example Playwright stub:
```ts
import { test, expect } from '@playwright/test'

test('process flow', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Sign in with Google' }).click()
  // Mock Google flow or inject Cookie
  await page.goto('/dashboard')
  await page.getByLabel('Your prompt').fill('Summarise this article')
  await page.getByRole('button', { name: 'Analyze' }).click()
  await expect(page.getByText('Analysis Complete')).toBeVisible()
})
```

---

## 🎨 Styling

- Tailwind CSS + shadcn/ui components power the design system.
- `components/ui/` holds low-level components (buttons, cards, etc.).
- Shared iconography lives in `components/icons.tsx`.

Remember to run `pnpm lint` and `pnpm typecheck` before committing UI changes.

---

## 🧭 Tips for Extending the App

1. **Reuse the proxy** – Never call the backend directly from `fetch` in the browser.
2. **Keep tokens server-only** – If you must expose more session detail, do it inside the proxy route.
3. **Handle 401s gracefully** – Redirect users to `/auth/signin` when the backend responds with `AUTHENTICATION_FAILED`.
4. **Surface metadata** – The `/services` endpoint returns registry metadata you can display in the UI.

Happy frontend hacking! 🎉
