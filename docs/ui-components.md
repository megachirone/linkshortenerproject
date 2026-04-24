# UI Components — shadcn/ui

## Regola fondamentale

**shadcn/ui è l'unica libreria di componenti UI consentita.** Non creare mai componenti UI custom da zero con HTML grezzo + classi Tailwind. Se un componente shadcn/ui soddisfa la necessità, deve essere usato. Se il componente non è ancora installato, installarlo con:

```bash
npx shadcn add <component-name>
```

Non copiare manualmente il codice dei componenti — usare sempre il comando `npx shadcn add`.

---

## Configurazione

Il file `components.json` nella root del progetto contiene la configurazione di shadcn/ui:

- **Style:** `radix-nova`
- **Base colour:** `neutral`
- **Path componenti:** `components/ui/`
- **CSS variables:** definite in `app/globals.css`

---

## Componenti installati

I file generati si trovano in `components/ui/` e **non devono mai essere modificati manualmente**.

| Componente | File | Comando di installazione |
|---|---|---|
| Button | `components/ui/button.tsx` | `npx shadcn add button` |

> Aggiornare questa tabella ogni volta che si installa un nuovo componente.

---

## Come aggiungere un nuovo componente

1. Verificare se il componente esiste nel catalogo shadcn/ui: [https://ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components)
2. Installarlo con il comando CLI:
   ```bash
   npx shadcn add <component-name>
   ```
3. Importarlo dall'alias `@/components/ui/`:
   ```tsx
   import { Button } from "@/components/ui/button";
   ```
4. Aggiornare la tabella "Componenti installati" in questo file.

---

## Come personalizzare un componente

Non modificare mai i file in `components/ui/` direttamente. Per personalizzare un componente:

1. Creare un nuovo file wrapper in `components/` (non in `components/ui/`):
   ```tsx
   // components/primary-button.tsx
   import { Button } from "@/components/ui/button";
   import { cn } from "@/lib/utils";

   type Props = React.ComponentProps<typeof Button>;

   export function PrimaryButton({ className, ...props }: Props) {
     return <Button className={cn("w-full", className)} {...props} />;
   }
   ```
2. Usare il wrapper invece del componente base dove necessario.

---

## Componenti per i principali scenari del progetto

### Form di creazione short link

Componenti necessari:
- `npx shadcn add input` — campo URL lungo
- `npx shadcn add button` — pulsante di submit
- `npx shadcn add form` — gestione form con validazione (usa `react-hook-form` + `zod`)
- `npx shadcn add label` — etichette dei campi

### Dashboard — lista link

Componenti necessari:
- `npx shadcn add table` — tabella dei link
- `npx shadcn add badge` — statistiche click, stato link
- `npx shadcn add button` — azioni (copia, elimina)
- `npx shadcn add dialog` — conferma eliminazione
- `npx shadcn add toast` — feedback operazioni (oppure `sonner`)

### Header / navigazione

Componenti necessari:
- `npx shadcn add button` — bottoni sign-in / sign-up (wrappano i componenti Clerk)
- `npx shadcn add separator` — divisori visivi

### Feedback e notifiche

Componenti necessari:
- `npx shadcn add sonner` — notifiche toast (preferito a `toast` per semplicità)
- `npx shadcn add alert` — messaggi di errore inline

---

## Utilizzo con Clerk

I pulsanti Clerk (`SignInButton`, `SignUpButton`) devono sempre usare un componente shadcn/ui come figlio, **mai** un `<button>` HTML grezzo:

```tsx
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

<SignInButton mode="modal">
  <Button variant="outline">Accedi</Button>
</SignInButton>

<SignUpButton mode="modal">
  <Button>Registrati</Button>
</SignUpButton>
```

---

## Varianti disponibili — Button

Il componente `Button` supporta le seguenti varianti (definite con CVA in `components/ui/button.tsx`):

| Prop `variant` | Uso consigliato |
|---|---|
| `default` | Azione primaria (CTA principale) |
| `secondary` | Azione secondaria |
| `outline` | Azioni meno enfatiche, es. "Accedi" nell'header |
| `ghost` | Azioni contestuali, es. icone nella tabella |
| `destructive` | Azioni distruttive, es. "Elimina link" |
| `link` | Link testuali inline |

Dimensioni disponibili tramite prop `size`: `default`, `sm`, `lg`, `icon`.

---

## Regole di stile

- Usare sempre `cn()` da `@/lib/utils` per comporre classi Tailwind sui componenti.
- Non usare la prop `style` per il layout — usare le utility Tailwind.
- Non sovrascrivere mai le CSS variable dei token shadcn — estendere in `app/globals.css` se necessario.
- Le icone nei componenti usano esclusivamente `lucide-react`:
  ```tsx
  import { Copy, Trash2, Link } from "lucide-react";
  ```
