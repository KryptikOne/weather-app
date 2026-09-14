import { UnlockForm } from "@/components/auth/UnlockForm";

export default function UnlockPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col justify-center px-6">
      <p className="text-sm text-muted-foreground">Enter the passcode to continue.</p>
      <div className="mt-6">
        <UnlockForm />
      </div>
    </main>
  );
}
