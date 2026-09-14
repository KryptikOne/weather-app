"use client";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";

export function UnlockForm() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!pin || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      if (res.status === 204) {
        router.replace("/");
        return;
      }
      setPin("");
      setError(res.status === 500 ? "This deployment has no PIN configured." : "That's not it.");
    } catch {
      setError("Couldn't reach the server. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <label htmlFor="pin" className="text-xs font-extrabold uppercase tracking-[0.15em] text-muted-foreground">PIN</label>
      <input
        id="pin"
        type="password"
        inputMode="numeric"
        autoComplete="current-password"
        autoFocus
        value={pin}
        onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
        className="h-12 rounded-full bg-secondary px-5 text-lg font-bold tracking-[0.3em] outline-none focus:ring-2 focus:ring-ring"
      />
      <Button type="submit" disabled={busy || !pin} className="h-12 rounded-full text-base font-bold">
        {busy ? "Checking" : "Unlock"}
      </Button>
      {error && <p role="alert" className="text-sm font-semibold text-destructive">{error}</p>}
    </form>
  );
}
