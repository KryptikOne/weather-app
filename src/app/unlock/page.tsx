import { UnlockForm } from "@/components/auth/UnlockForm";

export default function UnlockPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col justify-center px-6">
      <h1 className="text-2xl font-black">Weather</h1>
      <p className="mt-1 text-sm text-muted-foreground">Enter the PIN to continue.</p>
      <div className="mt-6">
        <UnlockForm />
      </div>
    </main>
  );
}
