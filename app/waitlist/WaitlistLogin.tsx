"use client";

import { useState } from "react";

export default function WaitlistLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/waitlist/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        setError(payload?.error ?? "Invalid password");
        setLoading(false);
        return;
      }

      // reload to let server render the protected page
      window.location.reload();
    } catch (err) {
      setError("Network error");
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 520, margin: "2rem auto" }}>
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
          style={{ padding: "0.6rem 1rem", cursor: "pointer" }}
        >
          {loading ? "Checking…" : "Unlock waitlist"}
        </button>
      </form>
    </div>
  );
}
