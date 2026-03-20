"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { login } from "@/lib/api";
import { getAccessToken, setAccessToken } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEmail("");
    setPassword("");
    setError("");

    if (getAccessToken()) {
      router.replace("/tasks");
    }
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await login({ email, password });
      setAccessToken(response.accessToken);
      router.replace("/tasks");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Login failed",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl rounded-[2rem] bg-white px-8 py-10 shadow-[0_24px_60px_rgba(51,45,122,0.12)] sm:px-10">
        <div className="mb-10">
          <h1 className="text-4xl font-semibold tracking-tight">Login</h1>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit} autoComplete="off">
          <label className="block">
            <span className="mb-3 block text-lg font-medium text-[var(--foreground)]">Email</span>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="off"
              className="h-14 w-full rounded-xl border border-[#a8b5ff] bg-white px-4 text-base outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[rgba(51,45,122,0.08)]"
              required
            />
          </label>

          <label className="block">
            <span className="mb-3 block text-lg font-medium text-[var(--foreground)]">Password</span>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              className="h-14 w-full rounded-xl border border-[#a8b5ff] bg-white px-4 text-base outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[rgba(51,45,122,0.08)]"
              required
            />
          </label>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="h-14 w-full rounded-xl bg-[var(--primary)] text-base font-semibold text-white shadow-[0_14px_30px_rgba(51,45,122,0.22)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-12 text-center text-lg text-[var(--foreground)]">
          Need to create an account?{" "}
          <Link href="/signup" className="font-medium text-[#4c5cff] hover:text-[var(--primary)]">
            Create Account
          </Link>
        </p>
      </div>
    </main>
  );
}
