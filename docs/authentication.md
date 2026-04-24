# Authentication — Clerk

## Regola fondamentale

**Clerk è l'unico sistema di autenticazione consentito.** Non installare né usare NextAuth, Auth.js, JWT manuale, sessioni custom o qualsiasi altro metodo di autenticazione. Ogni esigenza di auth deve essere soddisfatta tramite `@clerk/nextjs`.

---

## Configurazione ambiente

Le seguenti variabili devono essere presenti in `.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

Non hard-codare mai questi valori nel codice sorgente.

---

## ClerkProvider

`ClerkProvider` deve avvolgere l'intera applicazione in `app/layout.tsx`. Non spostarlo, non duplicarlo, non rimuoverlo.

```tsx
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

---

## Middleware (`proxy.ts`)

La protezione delle route è centralizzata in `proxy.ts` tramite `clerkMiddleware()`.

Regole:
- `/dashboard` e tutte le sue sotto-route sono **protette** — richiedono autenticazione.
- Le route pubbliche (es. `[slug]` redirect, homepage, sign-in, sign-up) devono essere esplicitamente dichiarate pubbliche nel matcher.
- Se un utente non autenticato accede a `/dashboard`, Clerk lo reindirizza automaticamente alla homepage.

Esempio di configurazione:

```ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)", "/:slug"]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)", "/(api|trpc)(.*)"],
};
```

---

## Redirect: homepage → /dashboard (utente autenticato)

Se un utente autenticato visita la homepage (`/`), deve essere reindirizzato a `/dashboard`.

Implementare questo controllo in `app/page.tsx` (Server Component):

```tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const { userId } = await auth();
  if (userId) {
    redirect("/dashboard");
  }
  // render homepage per utenti non autenticati...
}
```

---

## Pagina /dashboard — protetta

`app/dashboard/page.tsx` (e `app/dashboard/layout.tsx`) sono route protette.

- La protezione primaria è garantita dal middleware in `proxy.ts`.
- Come difesa aggiuntiva, verificare l'autenticazione anche nel layout o nella pagina:

```tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }
  return <>{children}</>;
}
```

---

## Login e registrazione — Modale obbligatoria

Login e registrazione devono **sempre** aprirsi come finestra modale (modal), mai come navigazione a pagina intera.

Usa i componenti `<SignInButton>` e `<SignUpButton>` di Clerk con `mode="modal"`:

```tsx
import { SignInButton, SignUpButton } from "@clerk/nextjs";

<SignInButton mode="modal">
  <button>Accedi</button>
</SignInButton>

<SignUpButton mode="modal">
  <button>Registrati</button>
</SignUpButton>
```

> **Non** creare pagine dedicate `app/(auth)/sign-in/` o `app/(auth)/sign-up/` per l'interfaccia di autenticazione — la modale è il pattern richiesto. Le variabili `NEXT_PUBLIC_CLERK_SIGN_IN_URL` / `NEXT_PUBLIC_CLERK_SIGN_UP_URL` rimangono necessarie per i redirect interni di Clerk.

---

## UI condizionale (signed-in / signed-out)

Per mostrare/nascondere elementi in base allo stato di autenticazione, usa i componenti Clerk:

```tsx
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

<SignedIn>
  <UserButton />
</SignedIn>

<SignedOut>
  <SignInButton mode="modal"><button>Accedi</button></SignInButton>
</SignedOut>
```

---

## Recupero utente corrente (Server Components / Actions)

```ts
import { auth, currentUser } from "@clerk/nextjs/server";

// Solo userId (leggero)
const { userId } = await auth();

// Oggetto utente completo (richiesta a Clerk API)
const user = await currentUser();
```

Non usare mai `auth()` o `currentUser()` all'interno di Client Components — spostare la logica nel Server Component genitore e passare i dati come props.
