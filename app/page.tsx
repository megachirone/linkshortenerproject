import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const { userId } = await auth();
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navbar */}
      <header className="w-full border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔗</span>
          <span className="font-bold text-xl tracking-tight">LinkShort</span>
        </div>
        <nav className="flex items-center gap-3">
          <Link href="/sign-in">
            <Button variant="ghost" size="sm">Accedi</Button>
          </Link>
          <Link href="/sign-up">
            <Button size="sm">Inizia Gratis</Button>
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24 gap-6">
        <span className="inline-block rounded-full border border-border bg-muted px-4 py-1 text-sm text-muted-foreground">
          🚀 Semplice, veloce e gratuito
        </span>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight max-w-3xl leading-tight">
          Accorcia i tuoi link,<br />
          <span className="text-muted-foreground">amplifica la tua portata</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl">
          LinkShort ti permette di trasformare URL lunghi in link brevi e memorabili, con analisi dei clic in tempo reale e gestione centralizzata.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <Link href="/sign-up">
            <Button size="lg" className="px-8 py-5 text-base">Inizia Gratis</Button>
          </Link>
          <Link href="/sign-in">
            <Button variant="outline" size="lg" className="px-8 py-5 text-base">Accedi al Dashboard</Button>
          </Link>
        </div>
      </section>

      {/* Demo URL shortener visual */}
      <section className="flex justify-center px-6 pb-16">
        <div className="w-full max-w-2xl rounded-xl border border-border bg-card shadow-sm p-6 flex flex-col gap-4">
          <p className="text-sm text-muted-foreground font-medium">Esempio di link accorciato</p>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex-1 truncate text-sm bg-muted rounded-lg px-4 py-2 text-muted-foreground font-mono">
              https://www.esempio.com/articolo/come-usare-un-link-shortener-nel-2026
            </span>
            <span className="text-muted-foreground">→</span>
            <span className="text-sm bg-primary text-primary-foreground rounded-lg px-4 py-2 font-mono font-semibold">
              lnk.sh/ab3x9
            </span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 bg-muted/40">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Tutto ciò di cui hai bisogno</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl border border-border bg-card p-6 flex flex-col gap-3 hover:shadow-md transition-shadow">
                <span className="text-3xl">{f.icon}</span>
                <h3 className="font-semibold text-lg">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col gap-1">
              <span className="text-4xl font-bold">{s.value}</span>
              <span className="text-sm text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 flex flex-col items-center gap-6 text-center bg-muted/40 border-t border-border">
        <h2 className="text-3xl font-bold max-w-xl">Pronto a semplificare i tuoi link?</h2>
        <p className="text-muted-foreground max-w-md">Registrati gratuitamente e inizia a creare link brevi in pochi secondi. Nessuna carta di credito richiesta.</p>
        <Link href="/sign-up">
          <Button size="lg" className="px-10 py-5 text-base">Crea il tuo account gratuito</Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} LinkShort. Tutti i diritti riservati.
      </footer>
    </div>
  );
}

const features = [
  {
    icon: "✂️",
    title: "Link Accorciati",
    description: "Trasforma URL lunghi e complessi in link brevi, puliti e facili da condividere ovunque.",
  },
  {
    icon: "📊",
    title: "Analisi dei Clic",
    description: "Monitora in tempo reale quante volte viene cliccato ogni link, da dove e quando.",
  },
  {
    icon: "🗂️",
    title: "Dashboard Centralizzata",
    description: "Gestisci tutti i tuoi link da un'unica interfaccia intuitiva e ben organizzata.",
  },
  {
    icon: "🔒",
    title: "Sicuro e Affidabile",
    description: "Autenticazione sicura con Clerk e dati protetti. I tuoi link sono sempre al sicuro.",
  },
  {
    icon: "⚡",
    title: "Redirect Istantaneo",
    description: "I redirect avvengono in millisecondi grazie all'infrastruttura ottimizzata di Next.js.",
  },
  {
    icon: "🌐",
    title: "Funziona Ovunque",
    description: "Condividi i tuoi link su email, social media, messaggi o qualsiasi altro canale.",
  },
];

const stats = [
  { value: "10K+", label: "Link creati" },
  { value: "500K+", label: "Redirect gestiti" },
  { value: "99.9%", label: "Uptime garantito" },
  { value: "< 50ms", label: "Tempo di risposta" },
];