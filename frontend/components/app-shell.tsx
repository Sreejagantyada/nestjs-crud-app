"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearAccessToken, getAccessToken } from "@/lib/auth";

const navLinks = [
  { href: "/tasks", label: "Tasks" },
  { href: "/profile", label: "Profile" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthenticated = Boolean(getAccessToken());

  function handleLogout() {
    clearAccessToken();
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--border-soft)] bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/tasks" className="text-[2rem] font-medium tracking-tight">
            Task Manager
          </Link>

          <nav className="flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-6 py-3 text-sm font-medium transition ${
                  pathname === link.href
                    ? "bg-[rgba(237,241,247,0.9)] text-[var(--foreground)]"
                    : "text-[var(--foreground)] hover:bg-[rgba(237,241,247,0.55)]"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-[var(--border-soft)] bg-white px-4 py-3 text-sm font-medium text-[var(--foreground)] transition hover:bg-[rgba(237,241,247,0.55)]"
              >
                Logout
              </button>
            ) : null}
          </nav>
        </div>
      </header>

      {children}
    </div>
  );
}
