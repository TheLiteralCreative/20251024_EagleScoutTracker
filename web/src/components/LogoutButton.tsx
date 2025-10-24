'use client';

import { useTransition } from "react";
import { useRouter } from "next/navigation";

export function LogoutButton({ variant = "default" }: { variant?: "default" | "ghost" }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await fetch("/api/logout", { method: "POST" });
      router.replace("/login");
      router.refresh();
    });
  };

  const baseClasses =
    "inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] transition";

  const variantClasses =
    variant === "ghost"
      ? "border-slate-700/70 bg-transparent text-slate-300 hover:border-slate-500 hover:bg-slate-800/40"
      : "border-rose-500/40 bg-rose-500/10 text-rose-200 hover:border-rose-400 hover:bg-rose-500/20";

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isPending}
      className={`${baseClasses} ${variantClasses} disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-slate-900/40 disabled:text-slate-500`}
    >
      {isPending ? "Signing out..." : "Sign out"}
    </button>
  );
}
