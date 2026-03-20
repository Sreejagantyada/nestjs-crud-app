"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { fetchProfile, updateProfile } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";

export default function ProfilePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace("/login");
      return;
    }

    void loadProfile();
  }, [router]);

  async function loadProfile() {
    setLoading(true);
    setError("");

    try {
      const profile = await fetchProfile();
      setEmail(profile.email ?? "");
      setFirstName(profile.firstName ?? "");
      setLastName(profile.lastName ?? "");
      setPhone(profile.phone ?? "");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to load profile",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const profile = await updateProfile({ firstName, lastName, phone });
      setEmail(profile.email ?? "");
      setFirstName(profile.firstName ?? "");
      setLastName(profile.lastName ?? "");
      setPhone(profile.phone ?? "");
      setMessage("Profile updated successfully.");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to update profile",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell>
      <main className="min-h-screen px-8 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <h1 className="text-4xl font-semibold tracking-tight">Profile Settings</h1>
            <p className="mt-3 text-xl text-[var(--muted)]">
              Manage your account information
            </p>
          </div>

          <div className="space-y-8">
            <section className="rounded-[2rem] bg-white p-8 shadow-[0_24px_60px_rgba(51,45,122,0.08)]">
              <div className="mb-8 flex items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#dbeafe] text-3xl text-[#2563eb]">
                  👤
                </div>
                <div>
                  <h2 className="text-3xl font-semibold tracking-tight">Personal Information</h2>
                  <p className="mt-1 text-lg text-[var(--muted)]">
                    Update your personal details
                  </p>
                </div>
              </div>

              {error ? (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              ) : null}

              {message ? (
                <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {message}
                </div>
              ) : null}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label className="mb-2 block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="h-12 w-full rounded-xl border border-[var(--border-soft)] bg-[rgba(237,241,247,0.38)] px-4 text-[var(--muted)] outline-none"
                  />
                  <p className="mt-2 text-sm text-[var(--muted)]">Email cannot be changed</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium">First Name</span>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(event) => setFirstName(event.target.value)}
                      className="h-12 w-full rounded-xl border border-[#a8b5ff] bg-white px-4 outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[rgba(51,45,122,0.08)]"
                      placeholder="John"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium">Last Name</span>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(event) => setLastName(event.target.value)}
                      className="h-12 w-full rounded-xl border border-[#a8b5ff] bg-white px-4 outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[rgba(51,45,122,0.08)]"
                      placeholder="Doe"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Phone Number</span>
                  <input
                    type="text"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className="h-12 w-full rounded-xl border border-[#a8b5ff] bg-white px-4 outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[rgba(51,45,122,0.08)]"
                    placeholder="+1 (555) 123-4567"
                  />
                </label>

                <button
                  type="submit"
                  disabled={saving || loading}
                  className="h-12 rounded-xl bg-[var(--primary)] px-6 text-base font-semibold text-white shadow-[0_14px_30px_rgba(51,45,122,0.22)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {saving ? "Saving..." : "Edit Profile"}
                </button>
              </form>
            </section>

            <section className="rounded-[2rem] bg-white p-8 shadow-[0_24px_60px_rgba(51,45,122,0.08)]">
              <h2 className="text-3xl font-semibold tracking-tight">Account Actions</h2>
              <p className="mt-2 text-lg text-[var(--muted)]">
                Manage your account settings
              </p>

              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem("accessToken");
                  router.replace("/login");
                }}
                className="mt-6 rounded-xl bg-[#e11d48] px-6 py-3 text-base font-semibold text-white shadow-[0_14px_30px_rgba(225,29,72,0.18)] transition hover:opacity-95"
              >
                Logout
              </button>
            </section>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
