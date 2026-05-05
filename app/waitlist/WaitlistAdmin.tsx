"use client";

import { useState } from "react";
import WaitlistViewer from "./WaitlistViewer";

type Entry = { id: number; name: string; email: string; createdAt: string };

export default function WaitlistAdmin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState<Entry[] | null>(null);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError("");
    setLoading(true);

    try {
      const auth = await fetch("/api/waitlist/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!auth.ok) {
        const payload = await auth.json().catch(() => ({}));
        setError(payload?.error ?? "Invalid password");
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/waitlist`);
      const data = await res.json();

      if (!res.ok || !Array.isArray(data)) {
        setError(data?.error ?? "Failed to load entries");
        setLoading(false);
        return;
      }

      setEntries(data as Entry[]);
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  if (entries) {
    return (
      <div style={{ padding: "2rem", maxWidth: 1000, margin: "0 auto" }}>
        <h1 style={{ marginBottom: "1rem" }}>Waitlist entries</h1>
        <WaitlistViewer initialEntries={entries} />
        <div style={{ marginTop: 12 }}>
          <button
            onClick={() => {
              setEntries(null);
              setPassword("");
            }}
            style={{ padding: "0.5rem 0.8rem" }}
          >
            Lock and require password again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: 520, margin: "0 auto" }}>
      <h2 style={{ marginTop: 0 }}>Enter admin password</h2>
      <form onSubmit={submit}>
        <label style={{ display: "block", marginBottom: 8 }}>
          <span style={{ display: "block", fontSize: 12, color: "#556" }}>
            Password
          </span>
          <input
            autoFocus
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "0.6rem 0.75rem", marginTop: 6 }}
          />
        </label>

        {error ? (
          <div style={{ color: "#b54608", marginBottom: 8 }}>{error}</div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          style={{ padding: "0.6rem 1rem" }}
        >
          {loading ? "Checking…" : "Unlock waitlist"}
        </button>
      </form>
    </div>
  );
}
