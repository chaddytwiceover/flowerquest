import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-moss text-cream">
      <img
        src="/game/title-hero.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-50"
      />
      <div className="absolute inset-0 bg-moss/70" />
      <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-[430px] flex-col justify-center px-6 py-10">
        <p className="font-display text-sm tracking-[0.2em] text-gold uppercase">Monnie's Flower Quest</p>
        <h1 className="mt-2 font-display text-4xl font-semibold">Sign in</h1>
        <p className="mt-3 text-cream/80">
          Save your garden progress on this device. You can also play as a guest.
        </p>
        <div className="mt-8 space-y-3">
          {authEnabled ? (
            GROK_PROVIDERS.map((p) => (
              <button
                key={p.providerId}
                type="button"
                onClick={() => signIn(p.providerId, { callbackURL: "/" })}
                className="w-full rounded-full bg-cream px-5 py-3.5 text-base font-bold text-ink shadow-[0_8px_0_#3a271c] active:translate-y-0.5 active:shadow-[0_4px_0_#3a271c]"
              >
                Continue with {p.label}
              </button>
            ))
          ) : (
            <p className="text-sm text-cream/70">Sign-in is disabled.</p>
          )}
        </div>
        <Link
          to="/"
          className="mt-8 text-center text-sm font-bold text-gold underline-offset-4 hover:underline"
        >
          Back to the garden
        </Link>
      </div>
    </main>
  );
}
